import type { RequestHandler } from "express";
import { unlink } from "fs/promises";
import { Dataset } from "../models/Association.js";
import { readCSV, getColumns } from "../services/csv.service.js";

export const uploadDataset: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id!;

    if (!req.file) throw { status: 400, message: "缺少 CSV 檔案" };
    const file = req.file;
    const rows = await readCSV(file.path);
    const columns = getColumns(rows);
    const existed = await Dataset.findOne({
      where: { userId, filename: file.originalname },
    });

    // 有重複檔名的話先覆蓋掉
    if (existed) {
      const oldPath = existed.path;

      existed.columns = JSON.stringify(columns);
      existed.nRows = rows.length;
      existed.path = file.path;
      await existed.save();

      if (oldPath && oldPath !== file.path) {
        await unlink(oldPath).catch(() => {});
      }

      return res.status(200).json({
        id: existed.id,
        filename: existed.filename,
        columns,
        nRows: existed.nRows,
      });
    }

    // 新建
    const ds = await Dataset.create({
      userId,
      filename: file.originalname,
      path: file.path,
      columns: JSON.stringify(columns),
      nRows: rows.length,
    });

    return res.status(201).json({
      id: ds.id,
      filename: ds.filename,
      columns,
      nRows: ds.nRows,
    });
  } catch (e) {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (file) await unlink(file.path).catch(() => {});
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
      nRows: ds.nRows,
    });
  } catch (e) {
    next(e);
  }
};
