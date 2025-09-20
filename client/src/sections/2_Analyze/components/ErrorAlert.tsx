export function ErrorAlert({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-4">
      ⚠️ {message}
    </div>
  );
}
