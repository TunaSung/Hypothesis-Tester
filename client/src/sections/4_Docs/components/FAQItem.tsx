import { memo } from "react";
type FAQItemProps = {
  question: string;
  answer: string;
};

type FAQ = {
  faq: FAQItemProps;
};

function FAQItem({ faq }: FAQ) {
  return (
    <details className="group rounded-lg border border-slate-200 p-4 open:bg-slate-100 transition-colors duration-150">
      <summary className="flex items-center justify-between font-semibold text-slate-800 cursor-pointer list-none group-open:mb-2 transition-all duration-150">
        <span>{faq.question}</span>
        <span
          className="ml-4 text-slate-400 group-open:rotate-180 transition-transform duration-200"
          aria-hidden
        >
          ▼
        </span>
      </summary>
      <div className="text-slate-600">{faq.answer}</div>
    </details>
  );
}

export default memo(FAQItem);
