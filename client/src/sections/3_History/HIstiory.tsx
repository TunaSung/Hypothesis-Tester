import { useMemo, useState } from "react";
import { useAuth } from "../../components/Context/authContext";
import { type KnownMethod } from "../../types/Analyze";
import HistoryCard from "./components/HistoryCard";
import FilterPill from "./components/FilterPill";

const METHOD_LABEL: Record<KnownMethod, string> = {
  independent_t: "Independent t-test",
  paired_t: "Paired t-test",
  anova: "One-way ANOVA",
  correlation: "Pearson correlation",
};

function History() {
  const { history } = useAuth();

  // 取得所有出現過的方法
  const methodsInHistory = useMemo(() => {
    const set = new Set<KnownMethod>();
    history.forEach((h: any) => set.add(h.method as KnownMethod));
    return Array.from(set).sort();
  }, [history]);

  // amount of each method 
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    history.forEach((h: any) => {
      c[h.method] = (c[h.method] ?? 0) + 1;
    });
    return c;
  }, [history]);

  // ("all" | method）
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    if (active === "all") return history;
    return history.filter((h: any) => h.method === active);
  }, [history, active]);

  return (
    <div className="bg-sky-100/40 min-h-screen">
      <div className="container-mid py-8">
        {/* Start Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Analysis History
          </h1>
          <p className="text-slate-600">
            View and access your previous statistical analyses
          </p>
        </header>
        {/* End Header */}

        {/* Start Filter */}
        <section className="mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <FilterPill
                active={active === "all"}
                onClick={() => setActive("all")}
                label="All"
                count={history.length}
              />
              {methodsInHistory.map((m) => (
                <FilterPill
                  key={m}
                  active={active === m}
                  onClick={() => setActive(m)}
                  label={METHOD_LABEL[m] ?? m}
                  count={counts[m] ?? 0}
                />
              ))}
            </div>
          </div>
        </section>
        {/* End Filter */}

        {/* Start History List */}
        {filtered.length === 0 ? (
          <main className="flex flex-col justify-center items-center gap-4 font-semibold py-16">
            <p className="text-5xl">📊</p>
            <h2 className="text-2xl">
              {active === "all" ? "No analyses yet" : "No analyses for this method"}
            </h2>
            <p className="text-slate-400 text-sm">
              {active === "all"
                ? "Start by creating your first statistical analysis"
                : "Try another method filter or run a new analysis"}
            </p>
          </main>
        ) : (
          <main className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((h: any, idx: number) => (
              <HistoryCard
                // filename 可能重複，改用 index 或你的唯一 id（若有）
                key={`${h.dataset?.filename ?? "file"}-${idx}`}
                fileName={h.dataset?.filename}
                method={h.method}
                input={h.input}
                result={h.result}
                aiSummary={h.aiSummary}
                date={h.createdAt}
              />
            ))}
          </main>
        )}
        {/* End History List */}
      </div>
    </div>
  );
}

export default History;
