type AnalysisSettingsProps = {
  significanceLevel: number;
  setSignificanceLevel: (v: number) => void;
};

export function AnalysisSettings({
  significanceLevel,
  setSignificanceLevel
}: AnalysisSettingsProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Analysis Settings
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confidence (1 − α)
          </label>
          <select
            value={1 - significanceLevel}
            onChange={(e) => setSignificanceLevel(1 - Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={0.99}>99%</option>
            <option value={0.95}>95%</option>
            <option value={0.9}>90%</option>
          </select>
        </div>
      </div>
    </div>
  );
}
