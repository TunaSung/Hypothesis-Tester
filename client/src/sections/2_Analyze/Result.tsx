function Result() {
  return (
    <div className="container-mid py-8">
      {/* Start Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Analysis Result
        </h1>
        <p className="text-slate-600">is there a siginificant diffirent</p>
      </header>
      {/* End Header */}

      <section className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"></div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"></div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"></div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            📝 Plain Language Explanation
          </h3>
          <p className="text-blue-700 leading-relaxed">results.explanation</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            📊 Data Visualization
          </h3>
          <div className="h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-slate-600">
                Interactive chart would appear here
              </p>
              <p className="text-sm text-slate-500">
                Box plot, histogram, or scatter plot based on test type
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Analysis Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Test Type:</span>
              <span className="font-medium text-slate-700">
                analysis.testType
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dataset:</span>
              <span className="font-medium text-slate-700">
                analysis.datasetName
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Variables:</span>
              <span className="font-medium text-slate-700">
                analysis.variables.length
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Significance Level:</span>
              <span className="font-medium text-slate-700">
                analysis.significanceLevel
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Test Direction:</span>
              <span className="font-medium text-slate-700 capitalize">
                analysis.testDirection
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Export Results
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <span>📄</span>
              <span>Download as Markdown</span>
            </button>
            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <span>🖼️</span>
              <span>Save Chart as PNG</span>
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>Export Full Report</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            ⚠️ Important Notes
          </h3>
          <ul className="text-amber-700 text-sm space-y-1">
            <li>• Results assume data meets test assumptions</li>
            <li>• Statistical significance ≠ practical significance</li>
            <li>• Consider effect size and confidence intervals</li>
            <li>• Consult a statistician for complex analyses</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Result;
