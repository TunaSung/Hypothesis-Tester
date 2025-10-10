/**
 * result裡都是 {obj: { path: value }} 的物件
 * 會以字串 "obj.path" 的樣子傳進
 */
export const get = (obj: unknown, path: string) =>
  String(path)
    .split(".")
    .reduce<any>(
      (acc, k) => (acc && typeof acc === "object" ? acc[k] : undefined),
      obj
    );

const NULL_SYMBOL = "—"

export const asNum = (v: unknown): number | undefined =>
  typeof v === "number" ? v : undefined;

export const fmt3 = (n?: number) =>
  typeof n === "number" && Number.isFinite(n) ? n.toFixed(3) : NULL_SYMBOL;

export const fmtCI = (lo?: number, hi?: number) =>
  typeof lo === "number" && typeof hi === "number"
    ? `[${fmt3(lo)}, ${fmt3(hi)}]`
    : NULL_SYMBOL;

export const fmtP = (p?: number, alpha = 0.05) => {
  if (typeof p !== "number" || !Number.isFinite(p)) return NULL_SYMBOL;
  const fmAlpha = alpha.toFixed(2)
  return p <= alpha ? `p ≦ ${fmAlpha}` : `p > ${fmAlpha}`;
};

export const classifyP = (p?: number, alpha = 0.05) =>
  typeof p === "number" && Number.isFinite(p)
    ? p <= alpha
      ? `Significant`
      : `Not significant`
    : NULL_SYMBOL;

export const formatDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat("zh-TW").format(new Date(iso));
  } catch {
    return iso;
  }
};

export const formatValue = (v: unknown) => {
  if (v === null || v === undefined) return NULL_SYMBOL;
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean")
    return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return "[Unserializable]";
  }
};
