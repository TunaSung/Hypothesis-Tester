import { useState, useRef } from "react";

function Analyze({  }) {
  const [question, setQuestion] = useState("");
  const [selectedDataset, setSelectedDataset] = useState("");
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [significanceLevel, setSignificanceLevel] = useState(0.05);
  const [testDirection, setTestDirection] = useState("two-tail");
  const [suggestedTest, setSuggestedTest] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="container-mid py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Analysis Workspace</h1>
        <p className="text-slate-600">Upload your data and describe your research question to get started</p>
      </header>

      <main className="grid lg:grid-cols-3 gap-8">
        {/* Data Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Data Upload</h2>
            
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">Upload CSV File</h3>
              <p className="text-slate-500 mb-4">Drag and drop your data file or click to browse</p>
              <input
                // ref={fileInputRef}
                type="file"
                accept=".csv"
                // onChange={handleFileUpload}
                className="hidden"
              />
              <button
                // onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose File
              </button>
            </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Dataset
                </label>
                <select
                  value={selectedDataset}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a dataset...</option>
                  {/* {datasets.map((dataset) => (
                    <option key={dataset._id} value={dataset.name}>
                      {dataset.name} ({dataset.rowCount} rows)
                    </option>
                  ))} */}
                </select>
              </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Research Question</h2>
            <textarea
              value={question}
              // onChange={(e) => handleQuestionChange(e.target.value)}
              placeholder="Describe your research question in plain English. For example: 'Is there a significant difference in test scores between the treatment and control groups?'"
              className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>


            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Variable Selection</h2>
              <div className="grid grid-cols-2 gap-3">
                {/* {selectedDatasetObj.columns.map((column) => (
                  <label key={column} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedVariables.includes(column)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedVariables([...selectedVariables, column]);
                        } else {
                          setSelectedVariables(selectedVariables.filter(v => v !== column));
                        }
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{column}</span>
                  </label>
                ))} */}
              </div>
            </div>
        </div>

        {/* Analysis Configuration */}
        <div className="space-y-6">
          {suggestedTest && (
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">🎯 Suggested Test</h3>
              <p className="text-blue-700 font-medium">{suggestedTest}</p>
              <p className="text-blue-600 text-sm mt-2">
                Based on your research question, this statistical test appears most appropriate.
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Analysis Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Significance Level (α)
                </label>
                <select
                  value={significanceLevel}
                  onChange={(e) => setSignificanceLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={0.01}>0.01 (99% confidence)</option>
                  <option value={0.05}>0.05 (95% confidence)</option>
                  <option value={0.10}>0.10 (90% confidence)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Test Direction
                </label>
                <select
                  value={testDirection}
                  onChange={(e) => setTestDirection(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="two-tail">Two-tailed</option>
                  <option value="left-tail">Left-tailed</option>
                  <option value="right-tail">Right-tailed</option>
                </select>
              </div>
            </div>
          </div>

          <button
            // onClick={handleRunAnalysis}
            disabled={isAnalyzing || !question || !selectedDataset || selectedVariables.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Running Analysis...</span>
              </div>
            ) : (
              "Run Analysis"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Analyze