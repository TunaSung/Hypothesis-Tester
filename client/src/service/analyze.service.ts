import api from "./api";
import type {
  Method,
  SuggestResp,
  RunResp,
  UploadResp,
  RunApiRes,
  SuggestionTest,
  AnalysisHistoryItem,
  Paginated,
  HistoryFilters,
  KeysetCursors,
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

export async function listAnalysesByKeyset(
  params: HistoryFilters & KeysetCursors
): Promise<Paginated<AnalysisHistoryItem>> {
  try {
    const query: Record<string, any> = { includeTotal: 1, includeStats: 1 };
    if (params.datasetId != null) query.datasetId = params.datasetId;
    if (params.method) query.method = params.method;
    if (params.limit != null) query.limit = params.limit;
    if (params.after) query.after = params.after;
    if (params.before) query.before = params.before;

    const resp = await api.get("/analysis/history/keyset", {
      params: query,
      headers: { Accept: "application/json" },
      withCredentials: true,
      // 讓 4xx 也能拿到 body 來判斷（不要直接 throw）
      validateStatus: () => true,
    });

    const raw = resp.data;

    // 若後端誤回 HTML（例如被導去登入頁），避免 JSON 解析錯
    if (typeof raw === "string") {
      const preview = raw.slice(0, 200).replace(/\s+/g, " ");
      throw new Error(`Expected JSON but got string: ${preview}`);
    }

    // 正常情況：對齊 getHistory 的解析（把 input/result 轉成物件）
    const items = (raw.items ?? []).map((h: any) => ({
      ...h,
      input: safeParse(h.input),
      result: safeParse(h.result),
    }));

    return {
      ...(raw as Omit<Paginated<AnalysisHistoryItem>, "items">),
      items,
    };
  } catch (error) {
    const msg = getErrorMessage(error, "Fetch analyses (keyset) failed");
    console.error("[LIST_ANALYSES_KEYSET_ERROR]", msg);
    throw new Error(msg);
  }
}
