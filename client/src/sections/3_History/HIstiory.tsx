import { useEffect, useMemo, useRef, useState } from "react";
import HistoryCard from "./components/HistoryCard";
import FilterPill from "./components/FilterPill";
import Pager from "./components/Pager";
import { listAnalysesByKeyset } from "../../service/analyze.service";
import type {
  AnalysisHistoryItem,
  PageInfo,
  KnownMethod,
} from "../../types/Analyze";

/** ---- Constants ---- */
const PAGE_SIZE = 12;

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

/** ---- Types ---- */
type Cursor = { after?: string; before?: string };

function History() {
  /** ---- State ---- */
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    limit: PAGE_SIZE,
    hasPrevPage: false,
    hasNextPage: false,
    startCursor: null,
    endCursor: null,
    total: 0,
  });
  const [cursor, setCursor] = useState<Cursor>({});
  const [activeTab, setActiveTab] = useState<"all" | KnownMethod>("all");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  /** ---- Derived values (memoized) ---- */
  // 將 "all" 轉為 undefined，代表不加 method 篩選
  const methodFilter = useMemo<KnownMethod | undefined>(
    () => (activeTab === "all" ? undefined : activeTab),
    [activeTab]
  );

  // 穩定化 cursor 依賴，避免相同內容但不同引用導致重刷
  const cursorKey = useMemo(() => {
    if (cursor.after) return `a:${cursor.after}`;
    if (cursor.before) return `b:${cursor.before}`;
    return "root";
  }, [cursor.after, cursor.before]);

  // 數量統計
  const stats = pageInfo.methodStats ?? {};
  const allCount = pageInfo.total ?? items.length;

  /** ---- Effects ---- */
  // 切換 method filter 時，重置游標到首頁
  useEffect(() => {
    setCursor({});
  }, [methodFilter]);

  // 避免競態：以遞增 requestId 只接受最新請求回寫
  const requestIdRef = useRef(0);

  useEffect(() => {
    const myId = ++requestIdRef.current;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const data = await listAnalysesByKeyset({
          method: methodFilter,
          limit: PAGE_SIZE,
          ...cursor,
        });

        // 只在尚未取消且仍是最新請求時更新 state
        if (!cancelled && requestIdRef.current === myId) {
          setItems(data.items);
          setPageInfo(data.pageInfo);
        }
      } catch (e: any) {
        if (!cancelled && requestIdRef.current === myId) {
          setErr(e?.message ?? "Unknown error");
        }
      } finally {
        if (!cancelled && requestIdRef.current === myId) {
          setLoading(false);
        }
      }
    })();

    // 依賴變更或卸載時，標記取消
    return () => {
      cancelled = true;
    };
  }, [methodFilter, cursorKey]);

  /** ---- Render ---- */
  return (
    <div className="bg-sky-100/40 min-h-screen">
      <main className="container-mid py-8" role="main" aria-labelledby="history-title">
        {/* Start Header */}
        <header className="mb-6 sm:mb-8" >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Analysis History
          </h1>
          <p className="text-slate-600">
            View and access your previous statistical analyses
          </p>
        </header>
        {/* End Header */}

        {/* Start Filters */}
        <section className="mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <FilterPill
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                label="All"
                count={allCount}
              />
              {ALL_METHODS.map((m) => (
                <FilterPill
                  key={m}
                  active={activeTab === m}
                  onClick={() => setActiveTab(m)}
                  label={METHOD_LABEL[m] ?? m}
                  count={stats[m] ?? 0}
                />
              ))}
            </div>
          </div>
        </section>
        {/* End Filters */}

        {/* Start Pager (Top) */}
        <Pager
          className="flex items-center justify-start gap-2 mb-3"
          pageInfo={pageInfo}
          loading={loading}
          setCursor={setCursor}
          isFooter={false}
          err={err}
        />
        {/* End Pager (Top) */}

        {/* Start List */}
        {items.length === 0 ? (
          <div className="flex flex-col justify-center items-center gap-4 font-semibold py-16">
            <p aria-hidden="true" className="text-5xl">📊</p>
            <h2 className="text-2xl">
              {activeTab === "all" ? "No analyses yet" : "No analyses for this method"}
            </h2>
            <p className="text-slate-400 text-sm">
              {activeTab === "all"
                ? "Start by creating your first statistical analysis"
                : "Try another method filter or run a new analysis"}
            </p>
          </div>
        ) : (
          <section role="list" className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
          </section>
        )}
        {/* End List */}

        {/* Start Pager (Footer) */}
        <Pager
          className="flex items-center justify-end gap-2 mt-6"
          pageInfo={pageInfo}
          loading={loading}
          setCursor={setCursor}
          isFooter={true}
          err={err}
        />
        {/* End Pager (Footer) */}
      </main>
    </div>
  );
}

export default History;
