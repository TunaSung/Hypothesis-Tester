import type { RequestHandler } from "express";
import { unlink } from "fs/promises";
import { Dataset } from "../models/Association.js";
import { readCSV, getColumns } from "../services/csv.service.js";

export const uploadDataset: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) throw { status: 400, message: "缺少 CSV 檔案" };
    const file = req.file;
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
    const file = (req as any).file as Express.Multer.File | undefined;
    if (file) await unlink(file.path).catch(() => { });
    next(e);
  }
};

export const getDatasetMeta: RequestHandler = async (req, res, next) => {
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
