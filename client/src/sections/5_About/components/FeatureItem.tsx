import { memo } from "react";

type FeatureItemProps = {
  title: string;
  description: string;
};

type FEATURE = {
  feature: FeatureItemProps;
};
function FeatureItem({ feature }: FEATURE) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">
        {feature.title}
      </h3>
      <p className="text-slate-600">{feature.description}</p>
    </div>
  );
}

export default memo(FeatureItem);
