function History() {
  return (
    <div className="bg-sky-100/40 min-h-screen">
      <div className="container-mid py-8">
        {/* Start Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Analysis History
          </h1>
          <p className="text-slate-600">
            View and access your previous statistical analyses
          </p>
        </header>
        {/* End Header */}

        <main className="flex flex-col justify-center items-center gap-4 font-semibold">
          <p className="text-5xl">📊</p>
          <h2 className="text-2xl">No analyses yet</h2>
          <p className="text-slate-400 text-sm">
            Start by creating your first statistical analysis
          </p>
        </main>
      </div>
    </div>
  );
}

export default History;
