import Link from "next/link";

import { createTodoAction } from "../../actions";

export default function NewTodoPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href="/todos"
            className="text-sm font-semibold text-[#672be0] transition hover:opacity-80"
          >
            ← 목록으로 돌아가기
          </Link>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            새 Todo 생성
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            새롭게 해야 할 일을 간단하게 기록해보세요.
          </p>
        </div>

        <form
          action={createTodoAction}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                제목
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={100}
                placeholder="예: Next.js 과제 마무리하기"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#672be0] focus:ring-4 focus:ring-[#672be0]/10"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                설명
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                maxLength={500}
                placeholder="필요한 내용을 자유롭게 적어주세요."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#672be0] focus:ring-4 focus:ring-[#672be0]/10"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Link
              href="/todos"
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              취소
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-[#672be0] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              생성하기
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}