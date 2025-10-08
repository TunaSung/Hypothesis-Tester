export const FEATURES = Object.freeze([
  {
    key: "auto-test",
    title: "AI Test Suggestion",
    description:
      "Upload a CSV and describe your question—AI recommends a suitable statistical test with a short rationale.",
    icon: "🎯",
  },
  {
    key: "readable-summary",
    title: "Readable AI Summaries",
    description:
      "Plain-language explanations of results with p-values, confidence intervals, and effect sizes.",
    icon: "💬",
  },
  {
    key: "assumption-aware",
    title: "Assumption Awareness",
    description:
      "Basic checks (e.g., sample size hints, Levene’s test for equal variances) help you interpret results responsibly.",
    icon: "🧪",
  },
  {
    key: "csv-to-result",
    title: "CSV → Result, Fast",
    description:
      "Simple CSV upload, stored metadata, and one-click runs for independent/paired t-test, one-way ANOVA, and correlation.",
    icon: "⚡",
  },
]);

export const STEPS = Object.freeze([
  {
    step: 1,
    key: "upload",
    gradient: "from-blue-300 to-blue-700",
    title: "Upload Your Data",
    description: "Upload a CSV file with your research data",
  },
  {
    step: 2,
    key: "question",
    gradient: "from-teal-300 to-teal-700",
    title: "Ask Your Question",
    description: "Describe your research question in natural language",
  },
  {
    step: 3,
    key: "results",
    gradient: "from-purple-300 to-purple-700",
    title: "Get Results",
    description: "Receive statistical analysis with clear explanations",
  },
]);
