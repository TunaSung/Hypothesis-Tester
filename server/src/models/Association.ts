import { Analysis } from "./Analysis.js";
import { Dataset } from "./Dataset.js";

Dataset.hasMany(Analysis, { foreignKey: "datasetId" });
Analysis.belongsTo(Dataset, { foreignKey: "datasetId" });

export { Analysis, Dataset }