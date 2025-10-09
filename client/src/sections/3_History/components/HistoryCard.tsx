import { memo, useState } from "react";
import Result from "../../../components/Layout/Result";
import { formatDate, formatValue } from "../../../utils/format";

type KnownMethod = "correlation" | "anova" | "independent_t" | "paired_t";

type HistoryCardProps = {
  fileName: string;
  method: KnownMethod | string;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
  aiSummary: string;
  date: string;
  maxFields?: number;
};

const methodStyleMap: Record<string, string> = {
  anova: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  correlation: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  independent_t: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  paired_t: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  default: "bg-slate-50 text-slate-700 ring-1 ring-slate-200",
};

function HistoryCard({
  fileName,
  method,
  input,
  result,
  aiSummary,
  date,
  maxFields = 3,
}: HistoryCardProps) {
  const keys = Object.keys(input);
  const shownKeys = keys.slice(0, maxFields);
  const hiddenCount = Math.max(0, keys.length - shownKeys.length);
  const [isOpen, setIsOpen] = useState(false);

  const badgeClass =
    methodStyleMap[method as KnownMethod] ?? methodStyleMap.default;
  const formatMethod = String(method).replaceAll("_", " ");

  const isClose = () => {
    setIsOpen(false);
  };
  return (
    <article
      className="w-full max-w-xl border border-slate-200 shadow-sm rounded-2xl p-4 bg-white hover:shadow-md transition-shadow"
      aria-label="History item"
    >
      {/* Header */}
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className="text-base font-semibold text-slate-800 truncate"
            title={fileName}
          >
            📄 {fileName}
          </h3>
          <time className="text-sm text-slate-500">{formatDate(date)}</time>
        </div>
        <span
          className={
            "px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap " +
            badgeClass
          }
          title={String(method)}
          aria-label={`method: ${method}`}
        >
          {formatMethod}
        </span>
      </header>

      {/* Input preview */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {shownKeys.map((k) => (
          <div key={k} className="min-w-0">
            <dt className="text-xs text-slate-500">{k}</dt>
            <dd
              className="text-sm text-slate-800 break-words"
              title={formatValue((input as any)[k])}
            >
              {formatValue((input as any)[k])}
            </dd>
          </div>
        ))}
        {hiddenCount > 0 && (
          <div className="text-sm text-slate-500">+{hiddenCount} more…</div>
        )}
      </dl>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 hover:bg-slate-50 active:bg-slate-100"
        >
          View Results
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/30">
          <div className="relative">
            <button
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border shadow flex items-center justify-center"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <Result
              fileName={fileName}
              method={method}
              input={input}
              result={result}
              aiSummary={aiSummary}
              date={formatDate(date)}
              isClose={isClose}
            />
          </div>
        </div>
      )}
    </article>
  );
}

export default memo(HistoryCard);
