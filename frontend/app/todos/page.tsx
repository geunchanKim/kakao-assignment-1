import axios from "axios";
import Link from "next/link";

import {
  deleteTodoAction,
  toggleTodoCompletedAction,
} from "../actions";

type Todo = {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

/**
 * Todo 목록을 백엔드 FastAPI 서버에서 가져옵니다.
 * 이 함수는 Server Component 안에서 실행되므로 브라우저가 아니라 서버에서 호출됩니다.
 */
async function getTodos(): Promise<Todo[]> {
  const response = await axios.get<Todo[]>(`${BACKEND_API_BASE_URL}/todos`);

  return response.data;
}

/**
 * 날짜 문자열을 화면에 보기 좋은 한국어 형식으로 변환합니다.
 */
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function TodoListPage() {
  const todos = await getTodos();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#672be0]">
              Productivity Todo
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              오늘의 할 일
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              해야 할 일을 정리하고 완료 상태를 관리해보세요.
            </p>
          </div>

          <Link
            href="/todos/new"
            className="rounded-xl bg-[#672be0] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            새 Todo
          </Link>
        </div>

        {todos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-800">
              아직 등록된 Todo가 없어요.
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              첫 번째 할 일을 추가해보세요.
            </p>
            <Link
              href="/todos/new"
              className="mt-6 inline-flex rounded-xl bg-[#672be0] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Todo 생성하기
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {todos.map((todo) => {
              const toggleTodoWithId = toggleTodoCompletedAction.bind(
                null,
                todo.id,
                todo.is_completed,
              );

              return (
                <li
                  key={todo.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            todo.is_completed
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-[#672be0]/10 text-[#672be0]"
                          }`}
                        >
                          {todo.is_completed ? "완료" : "진행 중"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatDate(todo.created_at)}
                        </span>
                      </div>

                      <h2
                        className={`text-lg font-bold ${
                          todo.is_completed
                            ? "text-slate-400 line-through"
                            : "text-slate-900"
                        }`}
                      >
                        {todo.title}
                      </h2>

                      {todo.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {todo.description}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <form action={toggleTodoWithId}>
                        <button
                          type="submit"
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                          {todo.is_completed ? "되돌리기" : "완료"}
                        </button>
                      </form>

                      <Link
                        href={`/todos/${todo.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        수정
                      </Link>

                      <form action={deleteTodoAction}>
                        <input type="hidden" name="todoId" value={todo.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-red-100 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}