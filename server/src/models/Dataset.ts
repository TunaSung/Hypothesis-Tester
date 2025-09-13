import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sqlize } from "../config/db.js";

export class Dataset extends Model<InferAttributes<Dataset>, InferCreationAttributes<Dataset>> {
  declare id?: number;
  declare filename: string;      // 原始檔名
  declare path: string;          // 伺服器存放路徑
  declare columns: string;       // JSON: 欄位名稱
  declare nRows: number;         // 資料列數
}

Dataset.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  filename: { type: DataTypes.STRING, allowNull: false },
  path: { type: DataTypes.STRING, allowNull: false },
  columns: { type: DataTypes.TEXT, allowNull: false },
  nRows: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
}, { sequelize: sqlize, modelName:"dataset", tableName: "datasets" });
