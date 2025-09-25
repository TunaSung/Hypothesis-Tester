import FAQItem from "./components/FAQItem";
import TestItem from "./components/TestItem";
import { FAQS, TEST_TYPES, DISCLAIMERS } from "./datas/Docs.data";

function Docs() {
  return (
    <div className="container-mid py-8">

      {/* Start Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Documentation
        </h1>
        <p className="text-slate-600">
          Learn how to use the AI Hypothesis Tester effectively
        </p>
      </header>
      {/* End Header */}

      {/* Start Getting Started */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Getting Started
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              1. Prepare Your Data
            </h3>
            <p className="text-slate-600 mb-2">Ensure your CSV file has:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
              <li>Clear column headers</li>
              <li>No missing values in key variables</li>
              <li>Proper data types (numbers for quantitative data)</li>
              <li>Consistent formatting</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              2. Formulate Your Question
            </h3>
            <p className="text-slate-600">
              Write your research question clearly. Good examples:
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mt-2">
              <p className="text-slate-700 italic">
                "Is there a significant difference in sales between the new and
                old website design?"
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              3. Review and Run
            </h3>
            <p className="text-slate-600">
              Check the AI's test suggestion, select your variables, and
              configure your analysis settings before running.
            </p>
          </div>
        </div>
      </section>
      {/*　End Getting Started */}

      {/* Start Supported Tests */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Supported Statistical Tests
        </h2>
        <ul role="list" className="space-y-4">
          {TEST_TYPES.map((test) => (
            <TestItem key={test.name} test={test} />
          ))}
        </ul>
      </section>
      {/* End Supported Tests */}

      {/* Start FAQ */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <FAQItem key={f.question} faq={f} />
          ))}
        </div>
      </section>
      {/* End FAQ */}

      {/* Start Disclaimers */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
        <h2 className="text-2xl font-bold text-amber-800 mb-4">
          ⚠️ Important Disclaimers
        </h2>
        <ul className="space-y-3 text-amber-700 list-disc list-inside">
          {DISCLAIMERS.map((d, i) => (
            <li key={`disclaimer-${i}`}>
                {d}
            </li>
          ))}
        </ul>
      </section>
      {/* End Disclaimers */}
    
    </div>
  );
}

export default Docs;
