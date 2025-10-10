type QuestionBoxProps = {
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  onSuggest: () => void;
  disabled: boolean;
};

export function QuestionBox({
  question,
  setQuestion,
  onSuggest,
  disabled,
}: QuestionBoxProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Research Question
      </h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g., Is there a significant difference in test scores between treatment and control groups?"
        className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
      />
      <div className="mt-3">
        <button
          onClick={onSuggest}
          disabled={disabled}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          Get AI Suggestion
        </button>
      </div>
    </div>
  );
}
