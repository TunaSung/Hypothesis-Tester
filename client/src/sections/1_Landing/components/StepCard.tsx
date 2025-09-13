import { memo } from "react";

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  gradient: string;
}

function StepCard({ step, title, description, gradient }: StepCardProps) {
  return (
    <article role="group" className="text-center">
      <div
        className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}
      >
        {step}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </article>
  );
}

export default memo(StepCard);
