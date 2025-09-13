export const FAQS = Object.freeze([
    {
      question: "What statistical tests are supported?",
      answer: "We support t-tests (independent and paired), ANOVA, chi-square tests, correlation analysis, and regression analysis. The AI automatically suggests the most appropriate test based on your research question and data."
    },
    {
      question: "What file formats can I upload?",
      answer: "Currently, we support CSV files. Make sure your data has column headers and is properly formatted with no missing values in critical columns."
    },
    {
      question: "How do I interpret the p-value?",
      answer: "The p-value represents the probability of observing your results (or more extreme) if there's no real effect. A p-value less than your significance level (typically 0.05) suggests statistical significance."
    },
    {
      question: "What's the difference between statistical and practical significance?",
      answer: "Statistical significance means your results are unlikely due to chance. Practical significance considers whether the effect size is meaningful in real-world terms. Always consider both!"
    },
    {
      question: "Can I trust the AI's test recommendations?",
      answer: "Our AI provides good starting suggestions based on common patterns, but you should verify the assumptions are met for your specific data and research context."
    }
  ]);

export const TEST_TYPES = Object.freeze([
    {
      name: "Independent t-test",
      description: "Compare means between two independent groups",
      example: "Comparing test scores between treatment and control groups"
    },
    {
      name: "Paired t-test",
      description: "Compare means from the same subjects at different times",
      example: "Before and after measurements on the same participants"
    },
    {
      name: "One-way ANOVA",
      description: "Compare means across multiple groups",
      example: "Comparing effectiveness of three different treatments"
    },
    {
      name: "Chi-square test",
      description: "Test relationships between categorical variables",
      example: "Testing if gender is related to product preference"
    },
    {
      name: "Pearson Correlation",
      description: "Measure linear relationship between two continuous variables",
      example: "Relationship between study hours and exam scores"
    }
  ]);

export const DISCLAIMERS = Object.freeze([
    "This tool provides automated statistical analysis but cannot replace statistical expertise for complex research.",
    "Always verify that your data meets the assumptions of the chosen statistical test.",
    "Statistical significance does not guarantee practical or clinical significance.",
    "Consider consulting with a professional statistician for critical research decisions.",
    "This tool is for educational and exploratory purposes. Validate results independently for publication or important decisions.",
])