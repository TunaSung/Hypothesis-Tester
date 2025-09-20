type ResultCardProps = {
  result: any;
  confidence: number;
};

export function ResultCard({ result, confidence }: ResultCardProps) {
  if (!result) return null;
  const ci = result?.ci;
  const eta = result?.ci?.eta2;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Result</h3>
      <div className="text-sm text-slate-700 space-y-2">
        {"statistic" in result && (
          <div>
            <span className="font-medium">t / F:</span>{" "}
            {String(result.statistic ?? result.F)}
          </div>
        )}
        {"df" in result && (
          <div>
            <span className="font-medium">df:</span> {result.df}
          </div>
        )}
        {"p" in result && (
          <div>
            <span className="font-medium">p-value:</span>{" "}
            {result.p?.toFixed ? result.p.toFixed(6) : String(result.p)}
          </div>
        )}

        {result?.effectSize?.cohenD !== undefined && (
          <div>
            <span className="font-medium">Cohen's d:</span>{" "}
            {result.effectSize.cohenD?.toFixed?.(3)}
          </div>
        )}
        {result?.effectSize?.eta2 !== undefined && (
          <div>
            <span className="font-medium">η²:</span>{" "}
            {result.effectSize.eta2?.toFixed?.(3)}
          </div>
        )}
        {result?.r !== undefined && (
          <div>
            <span className="font-medium">r:</span> {result.r?.toFixed?.(3)}
          </div>
        )}

        {ci && !eta && (
          <div>
            <span className="font-medium">
              CI ({Math.round((ci.level ?? confidence) * 100)}%):
            </span>{" "}
            [{ci.lower?.toFixed?.(3)}, {ci.upper?.toFixed?.(3)}]
          </div>
        )}
        {eta && (
          <div>
            <span className="font-medium">
              η² CI ({Math.round((eta.level ?? confidence) * 100)}%):
            </span>{" "}
            [{eta.lower?.toFixed?.(3)}, {eta.upper?.toFixed?.(3)}]
          </div>
        )}

        {result?.assumptions?.levene && (
          <div>
            <span className="font-medium">Levene's test:</span> F=
            {result.assumptions.levene.F?.toFixed?.(3)}, p=
            {result.assumptions.levene.p?.toFixed?.(6)}
          </div>
        )}
      </div>
    </div>
  );
}
