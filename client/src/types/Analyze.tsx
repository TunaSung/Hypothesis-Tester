export type Method =
  | ""
  | "independent_t"
  | "paired_t"
  | "anova"
  | "correlation";

export type SuggestResp = {
  message: string;
  suggestion: SuggestionTest;
};

export type SuggestionTest = {
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

export interface AnalysisHistoryItem {
  id: number;
  datasetId: number;
  userId: number;
  method: KnownMethod | string;
  input: Record<string, any>; // 後端已直接回傳字串
  result: Record<string, any>; // 後端已直接回傳字串（列表展示可選擇不渲染）
  aiSummary: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  dataset?: { filename?: string }; // include Dataset.filename
}

/** 游標分頁資訊 */
export interface PageInfo {
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null; // 上一頁 -> before=startCursor
  endCursor: string | null; // 下一頁 -> after=endCursor
  total: number | null;
  methodStats?: Record<string, number>;
}

/** 分頁回應泛型 */
export type Paginated<T> = {
  message?: string;
  items: T[];
  pageInfo: PageInfo;
};

/** 查詢參數（前端用） */
export type HistoryFilters = {
  datasetId?: number;
  method?: KnownMethod | string;
  limit?: number;
};
export type KeysetCursors = {
  after?: string;
  before?: string;
};
