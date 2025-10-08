import type { SuggestResp } from "../../../types/Analyze";

type MethodChooserProps = {
  selectedMethod: SuggestResp["method"] | "";
  setSelectedMethod: (m: SuggestResp["method"] | "") => void;
  suggestedTest: SuggestResp | null;
};

export function MethodChooser({
  selectedMethod,
  setSelectedMethod,
  suggestedTest,
}: MethodChooserProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Method
        </label>
        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value as any)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose a method...</option>
          <option value="independent_t">Independent t-test</option>
          <option value="paired_t">Paired t-test</option>
          <option value="anova">One-way ANOVA</option>
          <option value="correlation">Pearson correlation</option>
        </select>
        {suggestedTest && (
          <p className="text-xs text-slate-500 mt-1">
            AI suggests:{" "}
            <span className="font-medium">{suggestedTest.method}</span> —{" "}
            {suggestedTest.why}
          </p>
        )}
      </div>
    </div>
  );
}
