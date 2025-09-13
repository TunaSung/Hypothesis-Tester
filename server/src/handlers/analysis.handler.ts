import type { RequestHandler } from "express";
import { Dataset, Analysis } from "../models/Association.js";
import { readCSV } from "../services/csv.service.js";
import { suggestMethod, explainResult } from "../services/ai.service.js";
import { independentT, pairedT, anovaOneWay, correlation } from "../services/stat.service.js";

export const suggest: RequestHandler = async (req, res, next) => {
  try {
    const { datasetId, question } = req.body;
    const ds = await Dataset.findByPk(datasetId);
    if (!ds) throw { status: 404, message: "Dataset not found" };
    const columns = JSON.parse(ds.columns);
    const suggestion = await suggestMethod({ columns, question });
    res.json(suggestion);
  } catch (e) { next(e); }
};

export const runAnalysis: RequestHandler = async (req, res, next) => {
  try {
    const { datasetId, method, args } = req.body as {
      datasetId: number;
      method: "independent_t" | "paired_t" | "anova" | "correlation";
      args: Record<string, any>;
    };

    const ds = await Dataset.findByPk(datasetId);
    if (!ds) throw { status: 404, message: "Dataset not found" };

    const rows = await readCSV(ds.path);
    let result: any;
    switch (method) {
      case "independent_t":
        result = independentT(rows, { groupKey: args.groupKey, valueKey: args.valueKey });
        break;
      case "paired_t":
        result = pairedT(rows, { subjectKey: args.subjectKey, preKey: args.preKey, postKey: args.postKey });
        break;
      case "anova":
        result = anovaOneWay(rows, { groupKey: args.groupKey, valueKey: args.valueKey });
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
      aiSummary
    });

    res.json({ id: rec.id, method, args, result, aiSummary });
  } catch (e) {
    next(e);
  }
};
