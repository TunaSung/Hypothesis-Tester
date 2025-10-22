type UploadCardProps = {
  isUploading: boolean;
  onPick: () => void;
  onFile: React.ChangeEventHandler<HTMLInputElement>;
  datasetId: number | null;
  datasetName: string;
  columns: string[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export function UploadCard({
  isUploading,
  onPick,
  onFile,
  datasetId,
  datasetName,
  columns,
  fileInputRef,
}: UploadCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Data Upload</h2>
      <div className={`border-2 border-slate-300 ${datasetId ? "border-solid" : "border-dashed"} rounded-xl p-8 text-center hover:border-blue-400 transition-colors`}>
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          Upload CSV File
        </h3>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={onFile}
          className="hidden"
        />
        <button
          onClick={onPick}
          className="bg-blue-400 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={isUploading}
        >
          {!datasetId ? (isUploading ? "Uploading..." : "Choose File") : "Reselect"}
        </button>
        {datasetId && (
          <div className="mt-4 text-sm text-slate-600">
            Uploaded: <span className="font-medium">{datasetName}</span> (ID:{" "}
            {datasetId})
          </div>
        )}
      </div>

      {columns.length > 0 && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Columns in dataset
          </label>
          <div className="flex flex-wrap gap-2">
            {columns.map((c) => (
              <span
                key={c}
                className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
