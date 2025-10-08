export const get = (obj: unknown, path: string) =>
    String(path)
        .split(".")
        .reduce<any>(
            (acc, k) => (acc && typeof acc === "object" ? acc[k] : undefined),
            obj
        )

export const asNum = (v: unknown): number | undefined =>
    typeof v === "number" ? v : undefined

export const fmt3 = (n?: number) =>
    typeof n === "number" && Number.isFinite(n) ? n.toFixed(3) : "—"

export const fmtCI = (lo?: number, hi?: number) =>
    typeof lo === "number" && typeof hi === "number"
        ? `[${fmt3(lo)}, ${fmt3(hi)}]`
        : "—"

export const fmtP = (p?: number) => {
    if (typeof p !== "number" || !Number.isFinite(p)) return "—"
    return p < 0.001 ? "p < 0.001" : `p = ${p.toFixed(3)}`
}

export const classifyP = (p?: number, alpha = 0.05) =>
    typeof p === "number" && Number.isFinite(p)
        ? p <= alpha
            ? `Significant`
            : `Not significant`
        : "—"

export const formatDate = (iso: string) => {
    try {
        return new Intl.DateTimeFormat("zh-TW").format(new Date(iso))
    } catch {
        return iso
    }
}

export const formatValue = (v: unknown) => {
    if (v === null || v === undefined) return "—"
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean")
        return String(v)
    try {
        return JSON.stringify(v)
    } catch {
        return "[Unserializable]"
    }
}