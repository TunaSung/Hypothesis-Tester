import { memo } from "react";

type FilterPillProps = {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
};

function FilterPill({ active, onClick, label, count }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition",
        active
          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      <span className="font-medium">{label}</span>
      <span
        className={[
          "inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs",
          active ? "bg-white/20" : "bg-slate-100 text-slate-600",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

export default memo(FilterPill);
