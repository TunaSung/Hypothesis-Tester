export type Method ="" | "independent_t" | "paired_t" | "anova" | "correlation";

export type SuggestResp = {
  method: Method;
  why: string;
};

export type RunResp = {
  id: number;
  method: Method;
  args: Record<string, any>;
  result: any;
  aiSummary: string;
};

export type UploadResp = {
  id: number;
  filename: string;
  columns: string[];
  nRows: number;
};