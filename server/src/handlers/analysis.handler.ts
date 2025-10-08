import type { RequestHandler } from "express";
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
} from "../schemas/analysis.schema.js";

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
      .json({ message: "Fetch history success", result: analysisResult });
  } catch (error) {
    next(error);
  }
};

export const getHistory: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const history = await Analysis.findAll({
      where: {
        userId: userId,
      },
      attributes: ["method", "input", "result", "aiSummary", "createdAt"],
      include: {
        model: Dataset,
        where: {
          userId: userId,
        },
        attributes: ["filename"],
        required: true,
      },
      order: [["createdAt", "DESC"]],
    });

    res
      .status(200)
      .json({ message: "Fetch history success", history: history });
  } catch (error) {
    next(error);
  }
};
