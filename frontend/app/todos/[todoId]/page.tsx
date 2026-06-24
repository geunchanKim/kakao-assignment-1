import axios from "axios";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateTodoAction } from "../../actions";

type Todo = {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

type TodoEditPageProps = {
  params: Promise<{
    todoId: string;
  }>;
};

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

/**
 * 현재 백엔드 API 목록에는 GET /todos/{id}가 없기 때문에,
 * 전체 Todo 목록을 가져온 뒤 todoId에 해당하는 Todo를 찾습니다.
 */
async function getTodoById(todoId: number): Promise<Todo | undefined> {
  const response = await axios.get<Todo[]>(`${BACKEND_API_BASE_URL}/todos`);

  return response.data.find((todo) => todo.id === todoId);
}

export default async function TodoEditPage({ params }: TodoEditPageProps) {
  const { todoId } = await params;
  const numericTodoId = Number(todoId);

  if (Number.isNaN(numericTodoId)) {
    notFound();
  }

  const todo = await getTodoById(numericTodoId);

  if (!todo) {
    notFound();
  }

  const updateTodoWithId = updateTodoAction.bind(null, todo.id);

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
            Todo 수정
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            선택한 Todo의 내용을 수정하거나 완료 상태를 변경해보세요.
          </p>
        </div>

        <form
          action={updateTodoWithId}
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
                defaultValue={todo.title}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#672be0] focus:ring-4 focus:ring-[#672be0]/10"
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
                defaultValue={todo.description ?? ""}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#672be0] focus:ring-4 focus:ring-[#672be0]/10"
              />
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                name="isCompleted"
                defaultChecked={todo.is_completed}
                className="h-4 w-4 accent-[#672be0]"
              />
              <span className="text-sm font-medium text-slate-700">
                완료된 Todo로 표시하기
              </span>
            </label>
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
              수정하기
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}