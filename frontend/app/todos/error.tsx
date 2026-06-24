"use client";

type TodosErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function TodosErrorPage({ error, reset }: TodosErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
          ⚠️
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          문제가 발생했어요
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Todo 데이터를 불러오거나 처리하는 중 오류가 발생했습니다.
          잠시 후 다시 시도해주세요.
        </p>

        <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-400">
          {error.message}
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 w-full rounded-xl bg-[#672be0] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          다시 시도하기
        </button>
      </section>
    </main>
  );
}