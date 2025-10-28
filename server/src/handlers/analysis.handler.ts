import type { RequestHandler } from "express";
import type { ParsedQs } from "qs";
import { Dataset, Analysis } from "../models/Association.js";
import { readCSV } from "../services/csv.service.js";
import { suggestMethod, explainResult } from "../services/ai.service.js";
import {
  independentT,
  pairedT,
  anovaOneWay,
  correlation,
} from "../services/stat.service.js";
import type {
  SuggestBody,
  RunAnalysisBody,
  ListAnalysesByIdKeysetQuery,
} from "../schemas/analysis.schema.js";
import { Op, fn, col } from "sequelize";

/**
 * 建議分析方法
 * 根據資料集欄位 (columns) 與自然語言問題 (question) 呼叫 AI 給出「適合的方法建議」
 */
export const suggest: RequestHandler = async (req, res, next) => {
  try {
    const { datasetId, question } = req.body as SuggestBody;

    const ds = await Dataset.findByPk(datasetId);
    if (!ds)
      throw {
        status: 404,
        code: "DATASET_NOT_FOUND",
        message: "Dataset not found",
      };

    const columns = JSON.parse(ds.columns);

    const suggestion = await suggestMethod({ columns, question });

    return res
      .status(200)
      .json({ message: "Suggestion generated", suggestion });
  } catch (error) {
    next(error);
  }
};

/**
 * Run Analysis
 * 執行統計分析主流程：
 * - 載入 Dataset 並讀取對應 CSV 檔案
 * - 依 method 轉派至相應統計函式（independent_t / paired_t / anova / correlation）
 * - 呼叫 AI 產生結果解釋 (aiSummary)
 * - 落庫 Analysis 紀錄（含 input/result/aiSummary）
 * - 回傳整合結果（result 以已計算的原生物件回傳，input/aiSummary 取自 DB）
 */
export const runAnalysis: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      throw { status: 401, code: "UNAUTHORIZED", message: "請先登入" };

    const { datasetId, method, args } = req.body as RunAnalysisBody;

    const ds = await Dataset.findByPk(datasetId);
    if (!ds)
      throw {
        status: 404,
        code: "DATASET_NOT_FOUND",
        message: "Dataset not found",
      };

    const rows = await readCSV(ds.path);
    let result: any;
    switch (method) {
      case "independent_t":
        result = independentT(rows, {
          groupKey: args.groupKey,
          valueKey: args.valueKey,
        });
        break;
      case "paired_t":
        result = pairedT(rows, { preKey: args.preKey, postKey: args.postKey });
        break;
      case "anova":
        result = anovaOneWay(rows, {
          groupKey: args.groupKey,
          valueKey: args.valueKey,
        });
        break;
      case "correlation":
        result = correlation(rows, { xKey: args.xKey, yKey: args.yKey });
        break;
      default:
        throw { status: 400, message: `Unsupported method: ${method}` };
    }

    const aiSummary = await explainResult({ method, args }, result);
    const rec = await Analysis.create({
      datasetId,
      method,
      input: JSON.stringify(args),
      result: JSON.stringify(result),
      aiSummary,
      userId,
    });

    const analysisResult = {
      id: rec.id,
      method,
      input: rec.input,
      result,
      aiSummary,
    };

    res
      .status(200)
      .json({ message: "Run analysis success", result: analysisResult });
  } catch (error) {
    next(error);
  }
};

/**
 * 簡易 base64url 編解碼工具（用於游標）
 * - enc: 任意值 -> base64url 字串
 * - dec: base64url 字串 -> 原始值
 */
function enc(v: any) {
  return Buffer.from(JSON.stringify(v)).toString("base64url");
}
function dec(s: string) {
  return JSON.parse(Buffer.from(s, "base64url").toString());
}

// Express v4 的 ReqQuery 需 extends ParsedQs；再疊上自定義的查詢型別
type KeysetReqQuery = ParsedQs & ListAnalysesByIdKeysetQuery;

/**
 * 以 Cursor/Keyset Pagination 取得分析紀錄（雙鍵排序：createdAt DESC, id DESC）
 * 支援條件：
 *   - datasetId: 指定資料集
 *   - method: 指定方法 (independent_t/paired_t/anova/correlation)
 *   - limit: 每頁大小（1~100，預設 20）
 *   - after:   從某筆之後開始（往「較舊」方向）=> createdAt < t 或 (createdAt = t 且 id < id)
 *   - before:  從某筆之前開始（往「較新」方向）=> createdAt > t 或 (createdAt = t 且 id > id)
 *   - includeTotal: 是否計算總數
 *   - includeStats: 是否回傳每種 method 的使用次數統計
 * 設計說明：
 *   - 為避免「同一 createdAt 多筆」造成順序不穩，加入 id 當副鍵，確保全序。
 *   - 使用 baseWhere / where 區分「本頁查詢條件」與「hasPrev/hasNext 檢查條件」（避免混進本頁 OR）。
 *   - before 模式：先 ASC 取資料（抓上一頁），再 reverse 回 DESC 顯示，游標仍以 DESC 的首尾計算。
 */
export const listAnalysesByIdKeyset: RequestHandler<
  {},
  any,
  any,
  KeysetReqQuery
> = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      throw { status: 401, code: "UNAUTHORIZED", message: "請先登入" };

    // 解析 query 並 clamp
    const q = req.query;
    const pageSize = Math.min(Math.max(Number(q.limit) || 20, 1), 100);
    const after = q.after || undefined;
    const before = q.before || undefined;
    const datasetId = q.datasetId ? Number(q.datasetId) : undefined;
    const method = q.method || undefined;
    const includeTotal = q.includeTotal === "1";
    const includeStats = q.includeStats === "1";

    // 基礎 where（分析紀錄歸屬 + 篩選）
    const baseWhere: any = { userId };
    if (datasetId) baseWhere.datasetId = datasetId;
    if (method) baseWhere.method = method;

    // 游標條件 + 排序
    const where: any = { ...baseWhere };
    let order: any[] = [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ];

    if (after) {
      const { t, id } = dec(after);
      const at = new Date(t);
      where[Op.or] = [
        { createdAt: { [Op.lt]: at } },
        { createdAt: at, id: { [Op.lt]: id } },
      ];
    } else if (before) {
      const { t, id } = dec(before);
      const at = new Date(t);
      where[Op.or] = [
        { createdAt: { [Op.gt]: at } },
        { createdAt: at, id: { [Op.gt]: id } },
      ];
      // 先 ASC 抓上一頁，再反轉回 DESC 展示
      order = [
        ["createdAt", "ASC"],
        ["id", "ASC"],
      ];
    }

    // 主查詢（n+1）
    let rows = await Analysis.findAll({
      where,
      attributes: [
        "id",
        "datasetId",
        "userId",
        "method",
        "input",
        "result",
        "aiSummary",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Dataset,
          where: { userId },
          attributes: ["filename"],
          required: true,
        },
      ],
      order,
      limit: pageSize + 1,
    });

    // before 模式需反轉（顯示時仍維持 DESC）
    if (before) rows = rows.reverse();
    
    // 後續判斷 是否還有更多資料
    const fetchedMore = rows.length > pageSize;

    // 有更多資料就分割資料，沒有的話就直接拿 rows
    const items = fetchedMore ? rows.slice(0, pageSize) : rows;
    
    // 產生游標
    const start = items[0];
    const end = items[items.length - 1];
    const startCursor = start
      ? enc({ t: start.createdAt.toISOString(), id: start.id! })
      : null;
    const endCursor = end
      ? enc({ t: end.createdAt.toISOString(), id: end.id! })
      : null;

    // hasPrev/hasNext（用 baseWhere，不帶當頁 OR）
    let hasNextPage = false;
    let hasPrevPage = false;

    if (!after && !before) { // 第一次 rander 的首頁
      hasNextPage = fetchedMore;
    } else if (after) {
      hasNextPage = fetchedMore;
      if (start) {
        const newer = await Analysis.findOne({
          where: {
            ...baseWhere,
            [Op.or]: [
              { createdAt: { [Op.gt]: start.createdAt as Date } },
              {
                createdAt: start.createdAt as Date,
                id: { [Op.gt]: start.id! },
              },
            ],
          },
          attributes: ["id"],
          order: [
            ["createdAt", "ASC"],
            ["id", "ASC"],
          ],
        });
        hasPrevPage = !!newer;
      }
    } else if (before) {
      hasPrevPage = fetchedMore;
      if (end) {
        const older = await Analysis.findOne({
          where: {
            ...baseWhere,
            [Op.or]: [
              { createdAt: { [Op.lt]: end.createdAt as Date } },
              { createdAt: end.createdAt as Date, id: { [Op.lt]: end.id! } },
            ],
          },
          attributes: ["id"],
          order: [
            ["createdAt", "DESC"],
            ["id", "DESC"],
          ],
        });
        hasNextPage = !!older;
      }
    }

    // 總數
    let total: number | null = null;
    if (includeTotal) {
      total = await Analysis.count({
        where: baseWhere,
        include: [{ model: Dataset, where: { userId }, required: true }],
        distinct: true,
        col: "id",
      });
    }

    // 各方法數統計
    let methodStats: Record<string, number> | undefined;
    if (includeStats) {
      const baseWhereStats: any = { userId };
      if (datasetId) baseWhereStats.datasetId = datasetId;

      const rowsStats = await Analysis.findAll({
        where: baseWhereStats,
        attributes: ["method", [fn("COUNT", col("id")), "count"]],
        group: ["method"],
        raw: true,
      });

      methodStats = {};
      for (const r of rowsStats as unknown as Array<{
        method: string;
        count: any;
      }>) {
        methodStats[r.method] = Number(r.count) || 0;
      }
    }

    res.status(200).json({
      message: "Fetch history success",
      items, // 每筆含：method, input, result, aiSummary, createdAt, dataset:{ filename }, 以及 id/datasetId/userId
      pageInfo: {
        limit: pageSize,
        hasPrevPage,
        hasNextPage,
        startCursor,
        endCursor,
        total,        // includeTotal='1' 時才有值
        methodStats,  // includeStats='1' 時才有值
      },
    });
  } catch (e) {
    next(e);
  }
};
