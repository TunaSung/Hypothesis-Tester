import type { RequestHandler, Request, Response, NextFunction } from "express";
import { Dataset } from "../models/Association.js";
import { readCSV, getColumns } from "../services/csv.service.js";

export const uploadDataset: RequestHandler =
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file!;
      if (!file) throw { status: 400, message: "缺少 CSV 檔案" };
      const rows = await readCSV(file.path);
      const columns = getColumns(rows);
      const ds = await Dataset.create({
        filename: file.originalname,
        path: file.path,
        columns: JSON.stringify(columns),
        nRows: rows.length
      });
      res.json({ id: ds.id, filename: ds.filename, columns, nRows: ds.nRows });
    } catch (e) {
      next(e)
    }
  };

export const getDatasetMeta: RequestHandler =
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.query.id);
      const ds = await Dataset.findByPk(id);
      if (!ds) throw { status: 404, message: "Dataset not found" };
      res.json({
        id: ds.id,
        filename: ds.filename,
        columns: JSON.parse(ds.columns),
        nRows: ds.nRows
      });
    } catch (e) {
      next(e)
    }
  };
