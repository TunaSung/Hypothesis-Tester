import { memo } from "react";
import type { PageInfo } from "../../../types/Analyze";

type PagerProps = {
  className: string;
  pageInfo: PageInfo;
  loading: boolean;
  setCursor: React.Dispatch<
    React.SetStateAction<{
      after?: string;
      before?: string;
    }>
  >;
  isFooter: boolean;
  err: string | null;
};

function Pager({
  className,
  pageInfo,
  loading,
  setCursor,
  isFooter,
  err,
}: PagerProps) {
  const { hasPrevPage, hasNextPage, startCursor, endCursor } = pageInfo;

  // a11y：依位置給更精確的 landmark 標籤
  const navLabel = isFooter
    ? "History pagination controls (bottom)"
    : "History pagination controls (top)";

  return (
    <nav
      className={className}
      role="navigation"
      aria-label={navLabel}
      aria-busy={loading}
    >
      {/* Start Prev */}
      <button
        type="button"
        disabled={!hasPrevPage || loading}
        aria-disabled={!hasPrevPage || loading}
        aria-label="Show newer analyses"
        title="Show newer analyses"
        aria-controls="history-results"
        onClick={() => setCursor({ before: startCursor ?? undefined })}
        className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-no-drop"
      >
        Prev
      </button>
      {/* End Prev */}

      {/* Start Next */}
      <button
        type="button"
        disabled={!hasNextPage || loading}
        aria-disabled={!hasNextPage || loading}
        aria-label="Show older analyses"
        title="Show older analyses"
        aria-controls="history-results"
        onClick={() => setCursor({ after: endCursor ?? undefined })}
        className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-no-drop"
      >
        Next
      </button>
      {/* End Next */}

      {/* Start Footer */}
      {isFooter && loading && (
        <>
          <span className="text-slate-500 text-sm" role="status" aria-live="polite">
            Loading…
          </span>
          {err && (
            <span className="text-red-500 text-sm" role="alert">
              {err}
            </span>
          )}
        </>
      )}
      {/* End Footer */}
    </nav>
  );
}

export default memo(Pager);
