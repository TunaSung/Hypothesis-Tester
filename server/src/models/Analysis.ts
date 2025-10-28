import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sqlize } from "../config/db.js";

export class Analysis extends Model<
  InferAttributes<Analysis, { omit: "createdAt" }>,  // 不 omit 的話 就需要加在 init 裡
  InferCreationAttributes<Analysis, { omit: "createdAt"}>
> {
  declare id?: number;
  declare datasetId: number;
  declare userId: number;
  declare method: string; // 'independent_t' | 'paired_t' | 'anova' | 'correlation' | ...
  declare input: string; // JSON: 使用者指定欄位/群組
  declare result: string; // JSON: 檢定結果（統計量、p、ci）
  declare aiSummary: string; // AI 自然語言解釋
  declare createdAt: CreationOptional<Date>;
}

Analysis.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    datasetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "datasets", key: "id" },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    method: { type: DataTypes.STRING, allowNull: false },
    input: { type: DataTypes.TEXT, allowNull: false },
    result: { type: DataTypes.TEXT, allowNull: false },
    aiSummary: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize: sqlize,
    modelName: "analyse",
    tableName: "analyses",
    timestamps: true,
  }
);
