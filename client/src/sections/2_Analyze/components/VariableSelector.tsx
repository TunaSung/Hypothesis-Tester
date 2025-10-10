import { FieldSelect } from "./FieldSelect";
import type { Method } from "../../../types/Analyze";

type VariableSelectorProps = {
  method: Method;
  columns: string[];
  groupKey: string;
  setGroupKey: React.Dispatch<React.SetStateAction<string>>;
  valueKey: string;
  setValueKey: React.Dispatch<React.SetStateAction<string>>;
  preKey: string;
  setPreKey: React.Dispatch<React.SetStateAction<string>>;
  postKey: string;
  setPostKey: React.Dispatch<React.SetStateAction<string>>;
  xKey: string;
  setXKey: React.Dispatch<React.SetStateAction<string>>;
  yKey: string;
  setYKey: React.Dispatch<React.SetStateAction<string>>;
};

export function VariableSelector({
  method,
  columns,
  groupKey,
  setGroupKey,
  valueKey,
  setValueKey,
  preKey,
  setPreKey,
  postKey,
  setPostKey,
  xKey,
  setXKey,
  yKey,
  setYKey,
}: VariableSelectorProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Variable Selection
      </h2>

      {method === "" && (
        <p className="text-slate-500">Choose a method first.</p>
      )}

      {method === "independent_t" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldSelect
            label="Group Key"
            value={groupKey}
            onChange={setGroupKey}
            options={columns}
          />
          <FieldSelect
            label="Value Key"
            value={valueKey}
            onChange={setValueKey}
            options={columns}
          />
        </div>
      )}

      {method === "paired_t" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldSelect
            label="Pre Key"
            value={preKey}
            onChange={setPreKey}
            options={columns}
          />
          <FieldSelect
            label="Post Key"
            value={postKey}
            onChange={setPostKey}
            options={columns}
          />
        </div>
      )}

      {method === "anova" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldSelect
            label="Group Key"
            value={groupKey}
            onChange={setGroupKey}
            options={columns}
          />
          <FieldSelect
            label="Value Key"
            value={valueKey}
            onChange={setValueKey}
            options={columns}
          />
        </div>
      )}

      {method === "correlation" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldSelect
            label="X Key"
            value={xKey}
            onChange={setXKey}
            options={columns}
          />
          <FieldSelect
            label="Y Key"
            value={yKey}
            onChange={setYKey}
            options={columns}
          />
        </div>
      )}
    </div>
  );
}
