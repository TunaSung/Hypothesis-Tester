import { memo } from "react";

type TestItemProps = {
  name: string;
  description: string;
  example: string;
};

type TEST = {
  test: TestItemProps;
};
function TestItem({ test }: TEST) {
  return (
    <li className="border-l-4 border-blue-500 pl-4">
      <h3 className="font-semibold text-slate-800">{test.name}</h3>
      <p className="text-slate-600 text-sm mb-1">{test.description}</p>
      <p className="text-slate-500 text-sm italic">Example: {test.example}</p>
    </li>
  );
}

export default memo(TestItem);
