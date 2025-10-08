export type Method =
  | ""
  | "independent_t"
  | "paired_t"
  | "anova"
  | "correlation";

export type SuggestResp = {
  method: Method;
  why: string;
};

export type RunResp = {
  id: number;
  method: Method;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
  aiSummary: string;
  createdAt?: string;
};

export type RunApiRes = {
  message: string;
  result: RunResp;
};

export type UploadResp = {
  id: number;
  filename: string;
  columns: string[];
  nRows: number;
};

// History
export type KnownMethod =
  | "correlation"
  | "anova"
  | "independent_t"
  | "paired_t";

export type HistoryItemRaw = {
  id: number;
  datasetId: number;
  method: KnownMethod | string;
  input: string;
  result: string;
  aiSummary: string;
  createdAt: string;
  dataset: { filename: string };
};

export type GetHistoryApiRespRaw = {
  message: string;
  history: HistoryItemRaw[];
};

export type HistoryItem = Omit<HistoryItemRaw, "input" | "result"> & {
  input: Record<string, unknown>;
  result: Record<string, unknown>;
};

export type GetHistoryApiResp = {
  message: string;
  history: HistoryItem[];
};
