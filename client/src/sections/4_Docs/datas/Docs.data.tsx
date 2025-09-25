export const FAQS = Object.freeze([
  {
    question: "What statistical tests are currently supported?",
    answer:
      "We currently support independent t-test, paired t-test, one-way ANOVA, and Pearson correlation. Chi-square and regression analysis will be added in future updates. The AI can also suggest the most appropriate test based on your research question."
  },
  {
    question: "What file formats can I upload?",
    answer:
      "At the moment, we only support CSV files. Please ensure your data includes column headers and is properly formatted without missing values in critical columns."
  },
  {
    question: "How do I interpret the p-value?",
    answer:
      "The p-value represents the probability of observing your results (or more extreme ones) under the null hypothesis. A p-value less than your chosen significance level (typically 0.05) suggests statistical significance."
  },
  {
    question: "What is the difference between statistical significance and practical significance?",
    answer:
      "Statistical significance means your result is unlikely to have occurred by chance. Practical significance considers whether the effect size is large enough to matter in real-world applications. Always consider both perspectives."
  },
  {
    question: "Can I rely on the AI's test recommendations?",
    answer:
      "The AI provides initial suggestions based on your dataset and research question, but you should always verify that the assumptions of the statistical test are met for your specific context."
  },
  {
    question: "Can I re-use datasets I've uploaded?",
    answer:
      "Yes. Uploaded datasets are stored with their metadata (filename, columns, number of rows) so you can reuse them without re-uploading."
  }
]);

export const TEST_TYPES = Object.freeze([
  {
    name: "Independent t-test",
    description: "Compare means between two independent groups under equal variance assumption",
    example: "Comparing test scores between treatment and control groups"
  },
  {
    name: "Paired t-test",
    description: "Compare means from the same subjects at two different times or conditions",
    example: "Measuring blood pressure before and after treatment on the same participants"
  },
  {
    name: "One-way ANOVA",
    description: "Compare means across three or more independent groups",
    example: "Comparing effectiveness of three different teaching methods"
  },
  {
    name: "Pearson correlation",
    description: "Measure the linear relationship between two continuous variables",
    example: "Relationship between study hours and exam scores"
  }
]);

export const DISCLAIMERS = Object.freeze([
  "This tool provides automated statistical analysis for educational and exploratory purposes.",
  "Always verify that your data meets the assumptions required for the chosen statistical test.",
  "Statistical significance does not guarantee practical or clinical significance.",
  "AI-generated summaries are intended to support, not replace, expert statistical judgment.",
  "Consider consulting with a professional statistician for critical or high-stakes research decisions.",
  "Validate results independently before using them in publications or professional reports."
]);
