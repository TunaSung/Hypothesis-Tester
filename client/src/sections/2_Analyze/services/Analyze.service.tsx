import api from "../../../service/api";
import { isAxiosError } from "axios";
import type { Method, SuggestResp, RunResp, UploadResp } from "../../../types/Analyze";

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    return (error.response?.data as any)?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return fallback;
}

export async function uploadCSV(formData: FormData): Promise<UploadResp> {
  try {
    const { data } = await api.post<UploadResp>("/api/dataset/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    const msg = getErrorMessage(error, "Upload CSV file failed");
    console.error("[UPLOAD_CSV_ERROR]", msg);
    throw new Error(msg);
  }
}

export async function aiSuggest(datasetId: number, question: string): Promise<SuggestResp> {
  try {
    const { data } = await api.post<SuggestResp>("/api/analysis/suggest", {
      datasetId,
      question,
    });
    return data;
  } catch (error) {
    const msg = getErrorMessage(error, "Can't get AI suggestion");
    console.error("[SUGGEST_ERROR]", msg);
    throw new Error(msg);
  }
}

export async function runTest(
  datasetId: number,
  method: Method,
  args: Record<string, any>
): Promise<RunResp> {
  try {
    const { data } = await api.post<RunResp>("/api/analysis/run", {
      datasetId,
      method,
      args,
    });
    return data;
  } catch (error) {
    const msg = getErrorMessage(error, "Run test error");
    console.error("[RUN_TEST_ERROR]", msg);
    throw new Error(msg);
  }
}