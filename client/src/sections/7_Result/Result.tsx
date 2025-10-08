import { memo } from "react";
import type { KnownMethod } from "../../types/Analyze";
import StatCard from "./components/StatCard";
import {
  get,
  asNum,
  fmt3,
  fmtCI,
  fmtP,
  classifyP,
  formatDate,
  formatValue,
} from "./libs/format";
import { classifyEffect } from "./libs/classifyEffect";

type ResultProps = {
  fileName: string;
  method: KnownMethod | string;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
  aiSummary: string;
  date: string;
  maxFields?: number;
  isClose?: () => void;
};

function Result({
  fileName,
  method,
  input,
  result,
  aiSummary,
  date,
  isClose,
}: ResultProps) {
  // alpha：採 input.ciLevel 或 result.ci.level，預設 0.05
  const ciLevel =
    (typeof get(input, "ciLevel") === "number"
      ? (get(input, "ciLevel") as number)
      : undefined) ??
    (typeof get(result, "ci.level") === "number"
      ? (get(result, "ci.level") as number)
      : undefined);

  const alpha =
    typeof ciLevel === "number" ? Math.max(0, Math.min(1, 1 - ciLevel)) : 0.05;

  // 檢定統計量
  const t = asNum(result["t"]);
  const F = asNum(result["F"]);
  const r = asNum(result["r"]);

  const statValue = method === "anova" ? F : method === "correlation" ? t : t;

  // P-value & CI
  const p = asNum(result["p"]);
  const ciL = asNum(get(result, "ci.lower"));
  const ciU = asNum(get(result, "ci.upper"));

  // effectSize
  const d = asNum(get(result, "effectSize.cohenD"));
  const dz = asNum(get(result, "effectSize.cohenDz"));
  const eta2 = asNum(get(result, "effectSize.eta2"));

  let effectVal: number | undefined;
  let effectKind: "d" | "eta2" | "r" = "d";
  if (method === "anova") {
    effectVal = eta2;
    effectKind = "eta2";
  } else if (method === "correlation") {
    effectVal = undefined;
  } else {
    effectVal = typeof d === "number" ? d : dz;
    effectKind = "d";
  }

  // 過濾出現過的 result
  const excludeKeys = new Set([
    "t",
    "F",
    "statistic",
    "r",
    "p",
    "ci",
    "effectSize",
  ]);
  const restEntries = Object.entries(result).filter(
    ([k]) => !excludeKeys.has(k)
  );

  // input keys
  const inputEntries = Object.entries(input);

  return (
    <article className="fixed-mid w-1/3 min-w-[374px] h-2/3 py-5 px-5 bg-white border border-slate-400 rounded-2xl sm:rounded-r-none shadow-sm overflow-auto">
      {/* Start header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          Analysis Result
        </h1>
        <p className="text-slate-500 text-sm">{formatDate(date)}</p>
      </header>
      {/* End header */}

      {/* Start close btn */}
      {isClose && (
        <button
          onClick={isClose}
          aria-label="Close"
          className="absolute top-3 right-3 rounded-full border border-slate-300 bg-white/90 px-2.5 py-1 text-sm hover:bg-slate-50"
        >
          ✕
        </button>
      )}
      {/* End close btn */}

      {/* Start main result */}
      <section className="grid md:grid-cols-2 gap-4 mb-5">
        {method === "correlation" && (
          <StatCard
            title="Correlation (r)"
            value={fmt3(r)}
            sub={typeof r === "number" ? classifyEffect(r, "r") : undefined}
          />
        )}

        <StatCard title="Test Statistic" value={fmt3(statValue)} />
        <StatCard title="P-value" value={fmtP(p)} sub={classifyP(p, alpha)} />
        <StatCard title="Confidence Interval" value={fmtCI(ciL, ciU)} />

        {method !== "correlation" && (
          <StatCard
            title="Effect Size"
            value={
              effectVal === undefined
                ? "—"
                : effectKind === "eta2"
                ? `η² = ${fmt3(effectVal)}`
                : `d = ${fmt3(effectVal)}`
            }
            sub={
              effectVal === undefined
                ? undefined
                : classifyEffect(effectVal, effectKind)
            }
          />
        )}
      </section>
      {/* End main result */}

      {/* Start AI Summary */}
      <section className="mb-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          📝 AI Explanation
        </h3>
        <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap">
          {aiSummary || "—"}
        </p>
      </section>
      {/* End AI Summary */}

      {/* Start others result */}
      <section className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Analysis Details
          </h3>

          {/* 基本資訊 */}
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">File Name</span>
              <span className="font-medium text-slate-800">{fileName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Method</span>
              <span className="font-medium text-slate-800">
                {String(method).replaceAll("_", " ")}
              </span>
            </div>
          </div>

          {/* 輸入鍵值 */}
          <h4 className="text-sm font-semibold text-slate-700 mt-4 mb-2">
            Input Keys
          </h4>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {inputEntries.map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-xs text-slate-500">{k}</dt>
                <dd className="text-sm text-slate-800 break-words">
                  {formatValue(v)}
                </dd>
              </div>
            ))}
            {inputEntries.length === 0 && (
              <p className="text-sm text-slate-500">—</p>
            )}
          </dl>

          {/* start orthers result */}
          <h4 className="text-sm font-semibold text-slate-700 mt-4 mb-2">
            Other Result Fields
          </h4>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {restEntries.map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-xs text-slate-500">{k}</dt>
                <dd className="text-sm text-slate-800 break-words">
                  {formatValue(v)}
                </dd>
              </div>
            ))}
            {restEntries.length === 0 && (
              <p className="text-sm text-slate-500">—</p>
            )}
          </dl>
        </div>
        {/* end orthers result */}

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            ⚠️ Important Notes
          </h3>
          <ul className="text-amber-700 text-sm space-y-1">
            <li>• Results assume data meets test assumptions.</li>
            <li>• Statistical significance ≠ practical significance.</li>
            <li>• Consider effect sizes and confidence intervals.</li>
            <li>• Consult a statistician for complex analyses.</li>
          </ul>
        </div>
      </section>
      {/* End others result */}
    </article>
  );
}

export default memo(Result);
