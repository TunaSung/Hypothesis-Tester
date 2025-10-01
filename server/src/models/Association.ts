import { Analysis } from "./Analysis.js";
import { Dataset } from "./Dataset.js";
import { User } from "./User.js";

Dataset.hasMany(Analysis, { foreignKey: "datasetId" });
Analysis.belongsTo(Dataset, { foreignKey: "datasetId" });

User.hasMany(Dataset, { foreignKey: "userId"})
Dataset.belongsTo(User, { foreignKey: "userId"})

User.hasMany(Analysis, { foreignKey: "userId"})
Analysis.belongsTo(User, { foreignKey: "userId"})

export { Analysis, Dataset, User }