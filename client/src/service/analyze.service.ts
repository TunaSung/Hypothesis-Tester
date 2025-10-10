import api from "./api";
import type {
  Method,
  SuggestResp,
  RunResp,
  UploadResp,
  RunApiRes,
  SuggestionTest,
} from "../types/Analyze";
import type {
  GetHistoryApiResp,
  GetHistoryApiRespRaw,
  HistoryItem,
} from "../types/Analyze";
import { getErrorMessage } from "../utils/service";

export async function uploadCSV(formData: FormData): Promise<UploadResp> {
  try {
    const { data } = await api.post<UploadResp>("/dataset/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    const msg = getErrorMessage(error, "Upload CSV file failed");
    console.error("[UPLOAD_CSV_ERROR]", msg);
    throw new Error(msg);
  }
}

export async function aiSuggest(
  datasetId: number,
  question: string
): Promise<SuggestionTest> {
  try {
    const { data } = await api.post<SuggestResp>("/analysis/suggest", {
      datasetId,
      question,
    });
    return data.suggestion;
  } catch (error) {
    const msg = getErrorMessage(error, "Can't get AI suggestion");
    console.error("[SUGGEST_ERROR]", msg);
    throw new Error(msg);
  }
}

export function safeParse<T = Record<string, unknown>>(v: unknown): T {
  if (v && typeof v === "object") return v as T;
  if (typeof v === "string") {
    try {
      return JSON.parse(v) as T;
    } catch {
      return {} as T;
    }
  }
  return {} as T;
}

export async function runTest(
  datasetId: number,
  method: Method,
  args: Record<string, unknown>
): Promise<RunResp> {
  const res = await api.post<RunApiRes>("/analysis/run", {
    datasetId,
    method,
    args,
  });
  const r = res.data.result;
  return {
    ...r,
    input: safeParse(r.input),
    result: safeParse(r.result),
  };
}

export async function getHistory(): Promise<GetHistoryApiResp> {
  const res = await api.get<GetHistoryApiRespRaw>("/analysis/history");
  const parsed: HistoryItem[] = res.data.history.map((h) => ({
    ...h,
    input: safeParse(h.input),
    result: safeParse(h.result),
  }));
  return { message: res.data.message, history: parsed };
}
