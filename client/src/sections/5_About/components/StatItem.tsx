import { memo } from "react";
type StatItemProps = {
  stat: string;
  title: string;
  color: string;
};

type STAT = {
  stat: StatItemProps;
};
function StatItem({ stat }: STAT) {
  return (
    <div>
      <div className={`text-3xl font-bold mb-2 ${stat.color}`}>{stat.stat}</div>
      <p className="text-slate-600">{stat.title}</p>
    </div>
  );
}

export default memo(StatItem);
