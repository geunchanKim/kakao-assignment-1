export default function TodosLoadingPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="mb-3 h-4 w-32 animate-pulse rounded bg-[#672be0]/20" />
          <div className="h-9 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex gap-2">
                <div className="h-6 w-16 animate-pulse rounded-full bg-[#672be0]/10" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
              </div>

              <div className="h-5 w-64 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}