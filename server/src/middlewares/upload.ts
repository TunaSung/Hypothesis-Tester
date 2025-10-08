import multer from "multer";
import { mkdirSync } from "fs";

mkdirSync("uploads", { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads"),
  filename: (_req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

export const upload = multer({ storage });
