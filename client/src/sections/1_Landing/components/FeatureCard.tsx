import { memo } from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article
      role="group"
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </article>
  );
}

export default memo(FeatureCard);
