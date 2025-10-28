// pages/History.tsx
import { useEffect, useState } from "react";
import HistoryCard from "./components/HistoryCard";
import FilterPill from "./components/FilterPill";
import { listAnalysesByKeyset } from "../../service/analyze.service";
import type {
  AnalysisHistoryItem,
  PageInfo,
  KnownMethod,
} from "../../types/Analyze";

const METHOD_LABEL: Record<KnownMethod, string> = {
  independent_t: "Independent t-test",
  paired_t: "Paired t-test",
  anova: "One-way ANOVA",
  correlation: "Pearson correlation",
};

const ALL_METHODS: KnownMethod[] = [
  "independent_t",
  "paired_t",
  "anova",
  "correlation",
];

export default function History() {
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    limit: 12,
    hasPrevPage: false,
    hasNextPage: false,
    startCursor: null,
    endCursor: null,
    total: 0,
  });
  const [cursor, setCursor] = useState<{ after?: string; before?: string }>({});
  const [active, setActive] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const methodFilter = active === "all" ? undefined : active;
  const pageSize = 12;
  const stats = pageInfo.methodStats ?? {}; // 後端回的全域統計（忽略 method 篩選）
  const allCount = pageInfo.total ?? items.length;

  useEffect(() => {
    setCursor({});
  }, [methodFilter]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await listAnalysesByKeyset({
          method: methodFilter,
          limit: pageSize,
          ...cursor,
        });
        if (!cancelled) {
          setItems(data.items);
          setPageInfo(data.pageInfo);
        }
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [methodFilter, pageSize, cursor]);

  return (
    <div className="bg-sky-100/40 min-h-screen">
      <div className="container-mid py-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Analysis History
          </h1>
          <p className="text-slate-600">
            View and access your previous statistical analyses
          </p>
        </header>

        {/* Filters */}
        <section className="mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <FilterPill
                active={active === "all"}
                onClick={() => setActive("all")}
                label="All"
                count={allCount}
              />
              {ALL_METHODS.map((m) => (
                <FilterPill
                  key={m}
                  active={active === m}
                  onClick={() => setActive(m)}
                  label={METHOD_LABEL[m] ?? m}
                  count={stats[m] ?? 0}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Pager */}
        <div className="flex items-center gap-2 mb-3">
          <button
            disabled={!pageInfo.hasPrevPage || loading}
            onClick={() =>
              setCursor({ before: pageInfo.startCursor ?? undefined })
            }
            className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50  disabled:cursor-no-drop"
          >
            Prev
          </button>
          <button
            disabled={!pageInfo.hasNextPage || loading}
            onClick={() =>
              setCursor({ after: pageInfo.endCursor ?? undefined })
            }
            className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-no-drop"
          >
            Next
          </button>
          {loading && <span className="text-slate-500 text-sm">Loading…</span>}
          {err && <span className="text-red-600 text-sm">{err}</span>}
        </div>

        {/* List */}
        {items.length === 0 ? (
          <main className="flex flex-col justify-center items-center gap-4 font-semibold py-16">
            <p className="text-5xl">📊</p>
            <h2 className="text-2xl">
              {active === "all"
                ? "No analyses yet"
                : "No analyses for this method"}
            </h2>
            <p className="text-slate-400 text-sm">
              {active === "all"
                ? "Start by creating your first statistical analysis"
                : "Try another method filter or run a new analysis"}
            </p>
          </main>
        ) : (
          <main className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((h) => (
              <HistoryCard
                key={h.id}
                fileName={h.dataset?.filename ?? "Untitled"}
                method={h.method}
                input={h.input}
                result={h.result}
                aiSummary={h.aiSummary}
                date={h.createdAt}
              />
            ))}
          </main>
        )}

        {/* Footer Pager */}
        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            disabled={!pageInfo.hasPrevPage || loading}
            onClick={() =>
              setCursor({ before: pageInfo.startCursor ?? undefined })
            }
            className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-no-drop"
          >
            Prev
          </button>
          <button
            disabled={!pageInfo.hasNextPage || loading}
            onClick={() =>
              setCursor({ after: pageInfo.endCursor ?? undefined })
            }
            className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-no-drop"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
