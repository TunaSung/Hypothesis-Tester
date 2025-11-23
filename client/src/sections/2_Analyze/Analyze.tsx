import { useMemo, useRef, useState } from "react";
import { AnalysisSettings } from "./components/AnalysisSettings";
import { ErrorAlert } from "./components/ErrorAlert";
import { MethodChooser } from "./components/MethodChooser";
import { QuestionBox } from "./components/QuestionBox";
import { UploadCard } from "./components/UploadCard";
import { VariableSelector } from "./components/VariableSelector";
import Result from "../../components/Layout/Result";
import { useAuth } from "../../components/Context/authContext";

import { uploadCSV, aiSuggest, runTest } from "../../service/analyze.service";
import type { Method, RunResp, SuggestionTest } from "../../types/Analyze";

function Analyze() {
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dataset / Columns
  const [datasetId, setDatasetId] = useState<number | null>(null);
  const [datasetName, setDatasetName] = useState<string>("");
  const [columns, setColumns] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Question / Suggest
  const [question, setQuestion] = useState("");
  const [suggestedTest, setSuggestedTest] = useState<SuggestionTest | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<Method | "">("");

  // Per-method keys
  const [groupKey, setGroupKey] = useState("");
  const [valueKey, setValueKey] = useState("");
  const [preKey, setPreKey] = useState("");
  const [postKey, setPostKey] = useState("");
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");

  // Settings
  const [significanceLevel, setSignificanceLevel] = useState(0.05);

  // Run / Result / Error
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RunResp | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Handlers
  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const data = await uploadCSV(fd);
      setDatasetId(data.id);
      setDatasetName(data.filename);
      setColumns(data.columns ?? []);
      setGroupKey("");
      setValueKey("");
      setPreKey("");
      setPostKey("");
      setXKey("");
      setYKey("");
      setSuggestedTest(null);
      setSelectedMethod("");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSuggest = async () => {
    if (!datasetId || !question.trim()) return;
    setErrorMsg("");
    setSuggestedTest(null);
    try {
      const data = await aiSuggest(datasetId, question);
      setSuggestedTest(data);
      setSelectedMethod(data.method);
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Suggest failed");
    } finally {
      console.log(suggestedTest)
    }
  };

  const readyToRun = useMemo(() => {
    if (!datasetId || !selectedMethod) return false;
    if (selectedMethod === "independent_t") return !!groupKey && !!valueKey;
    if (selectedMethod === "paired_t") return !!preKey && !!postKey;
    if (selectedMethod === "anova") return !!groupKey && !!valueKey;
    if (selectedMethod === "correlation") return !!xKey && !!yKey;
    return false;
  }, [
    datasetId,
    selectedMethod,
    groupKey,
    valueKey,
    preKey,
    postKey,
    xKey,
    yKey,
  ]);

  const handleRunAnalysis = async () => {
    if (!readyToRun || !selectedMethod || !datasetId) return;
    setIsAnalyzing(true);
    setErrorMsg("");
    setResult(null);
    try {
      const args: Record<string, any> = { ciLevel: 1 - significanceLevel };
      switch (selectedMethod) {
        case "independent_t":
          args.groupKey = groupKey;
          args.valueKey = valueKey;
          break;
        case "paired_t":
          args.preKey = preKey;
          args.postKey = postKey;
          break;
        case "anova":
          args.groupKey = groupKey;
          args.valueKey = valueKey;
          break;
        case "correlation":
          args.xKey = xKey;
          args.yKey = yKey;
          break;
      }
      const data = await runTest(datasetId, selectedMethod, args);
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Run failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-sky-100/40">
      <div className="container-mid py-8">
        {/* Start Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Analysis Workspace
          </h1>
          <p className="text-slate-600">
            Upload your data and describe your research question to get started
          </p>
        </header>
        {/* End Header */}

        <main className="grid lg:grid-cols-3 gap-8">
          {/* Start Left */}
          <section className="lg:col-span-2 space-y-6">
            <UploadCard
              isUploading={isUploading}
              onPick={() => fileInputRef.current?.click()}
              onFile={handleFileUpload}
              datasetId={datasetId}
              datasetName={datasetName}
              columns={columns}
              fileInputRef={fileInputRef}
            />

            <QuestionBox
              question={question}
              setQuestion={setQuestion}
              onSuggest={handleSuggest}
              disabled={!datasetId || !question.trim()}
            />

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Variable Selection
              </h2>
              <MethodChooser
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
                suggestedTest={suggestedTest}
              />
              <VariableSelector
                method={selectedMethod}
                columns={columns}
                groupKey={groupKey}
                setGroupKey={setGroupKey}
                valueKey={valueKey}
                setValueKey={setValueKey}
                preKey={preKey}
                setPreKey={setPreKey}
                postKey={postKey}
                setPostKey={setPostKey}
                xKey={xKey}
                setXKey={setXKey}
                yKey={yKey}
                setYKey={setYKey}
              />
            </div>
          </section>
          {/* End Left */}

          {/* Start Right */}
          <section className="space-y-6">
            <ErrorAlert message={errorMsg} />

            <AnalysisSettings
              significanceLevel={significanceLevel}
              setSignificanceLevel={setSignificanceLevel}
            />

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !readyToRun}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Running Analysis...</span>
                </div>
              ) : (
                "Run Analysis"
              )}
            </button>

            {result && (
              <Result
                fileName={datasetName}
                method={result.method}
                input={result.input}
                result={result.result}
                aiSummary={result.aiSummary}
                date={new Date().toISOString()}
                isClose={() => setResult(null)}
              />
            )}
          </section>
          {/* End Right */}
        </main>
      </div>
    </div>
  );
}

export default Analyze;
