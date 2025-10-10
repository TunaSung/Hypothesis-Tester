import { useAuth } from "../../components/Context/authContext";
import HistoryCard from "./components/HistoryCard";

function History() {
  const { history } = useAuth();

  return (
    <div className="bg-sky-100/40 min-h-screen">
      <div className="container-mid py-8">
        {/* Start Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Analysis History
          </h1>
          <p className="text-slate-600">
            View and access your previous statistical analyses
          </p>
        </header>
        {/* End Header */}

        {/* Start history */}
        {history.length === 0 ? (
          <main className="flex flex-col justify-center items-center gap-4 font-semibold">
            <p className="text-5xl">📊</p>
            <h2 className="text-2xl">No analyses yet</h2>
            <p className="text-slate-400 text-sm">
              Start by creating your first statistical analysis
            </p>
          </main>
        ) : (
          <main className="w-full grid grid-cols-4 gap-3">
            {history.map((h) => (
              <HistoryCard
                key={h.dataset.filename}
                fileName={h.dataset.filename}
                method={h.method}
                input={h.input}
                result={h.result}
                aiSummary={h.aiSummary}
                date={h.createdAt}
              />
            ))}
          </main>
        )}
        {/* End history */}
      </div>
    </div>
  );
}

export default History;
