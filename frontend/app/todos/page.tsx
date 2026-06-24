import Link from "next/link";

import {
  deleteTodoAction,
  getTodosAction,
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

type TodoFilter = "all" | "active" | "completed";

type TodoListPageProps = {
  searchParams?: Promise<{
    filter?: string;
  }>;
};

const filterTabs: {
  label: string;
  value: TodoFilter;
  href: string;
}[] = [
  {
    label: "전체",
    value: "all",
    href: "/todos",
  },
  {
    label: "진행 중",
    value: "active",
    href: "/todos?filter=active",
  },
  {
    label: "완료",
    value: "completed",
    href: "/todos?filter=completed",
  },
];

/**
 * URL의 filter 값을 앱에서 사용하는 필터 값으로 변환합니다.
 * 잘못된 filter 값이 들어오면 전체 목록으로 처리합니다.
 */
function getSelectedFilter(filter?: string): TodoFilter {
  if (filter === "active" || filter === "completed") {
    return filter;
  }

  return "all";
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

/**
 * 현재 필터 상태에 맞는 빈 목록 안내 문구를 반환합니다.
 */
function getEmptyMessage(filter: TodoFilter) {
  if (filter === "active") {
    return {
      title: "진행 중인 Todo가 없어요.",
      description: "현재 남아 있는 할 일이 없습니다.",
    };
  }

  if (filter === "completed") {
    return {
      title: "완료된 Todo가 없어요.",
      description: "완료한 할 일이 생기면 이곳에 표시됩니다.",
    };
  }

  return {
    title: "아직 등록된 Todo가 없어요.",
    description: "첫 번째 할 일을 추가해보세요.",
  };
}

export default async function TodoListPage({
  searchParams,
}: TodoListPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedFilter = getSelectedFilter(resolvedSearchParams?.filter);

  // URL 필터 값을 FastAPI 서버로 전달합니다.
  // 실제 필터링은 클라이언트가 아니라 FastAPI에서 처리됩니다.
  const todos: Todo[] = await getTodosAction(selectedFilter);

  const emptyMessage = getEmptyMessage(selectedFilter);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#672be0]">
              Productivity Todo
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              오늘의 할 일
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              URL 필터를 사용해 전체, 진행 중, 완료 Todo를 관리해보세요.
            </p>
          </div>

          <Link
            href="/todos/new"
            className="shrink-0 rounded-xl bg-[#672be0] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            새 Todo
          </Link>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <nav className="grid grid-cols-3 gap-2" aria-label="Todo 필터">
            {filterTabs.map((tab) => {
              const isActive = selectedFilter === tab.value;

              return (
                <Link
                  key={tab.value}
                  href={tab.href}
                  className={`rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#672be0] text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {todos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-800">
              {emptyMessage.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {emptyMessage.description}
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