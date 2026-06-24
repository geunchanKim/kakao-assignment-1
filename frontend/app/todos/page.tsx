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
    search?: string;
  }>;
};

const filterTabs: {
  label: string;
  value: TodoFilter;
}[] = [
  {
    label: "전체",
    value: "all",
  },
  {
    label: "진행 중",
    value: "active",
  },
  {
    label: "완료",
    value: "completed",
  },
];

/**
 * URL의 filter 값을 앱에서 사용하는 필터 값으로 변환합니다.
 */
function getSelectedFilter(filter?: string): TodoFilter {
  if (filter === "active" || filter === "completed") {
    return filter;
  }

  return "all";
}

/**
 * URL의 search 값을 검색어로 변환합니다.
 */
function getSearchKeyword(search?: string) {
  if (!search) {
    return "";
  }

  return search.trim();
}

/**
 * 필터 탭 클릭 시 이동할 URL을 생성합니다.
 * 현재 검색어가 있으면 검색어를 유지한 채 필터만 변경합니다.
 */
function createFilterHref(filter: TodoFilter, searchKeyword: string) {
  const params = new URLSearchParams();

  if (filter !== "all") {
    params.set("filter", filter);
  }

  if (searchKeyword) {
    params.set("search", searchKeyword);
  }

  const queryString = params.toString();

  return queryString ? `/todos?${queryString}` : "/todos";
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
 * 현재 필터와 검색어에 맞는 빈 목록 안내 문구를 반환합니다.
 */
function getEmptyMessage(filter: TodoFilter, searchKeyword: string) {
  if (searchKeyword) {
    return {
      title: "검색 결과가 없어요.",
      description: `"${searchKeyword}"에 해당하는 Todo를 찾지 못했습니다.`,
    };
  }

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
  const searchKeyword = getSearchKeyword(resolvedSearchParams?.search);

  // URL의 filter, search 값을 FastAPI 서버로 전달합니다.
  // 실제 필터링과 검색은 클라이언트가 아니라 FastAPI 서버에서 처리됩니다.
  const todos: Todo[] = await getTodosAction(selectedFilter, searchKeyword);

  const emptyMessage = getEmptyMessage(selectedFilter, searchKeyword);

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
              URL 필터와 검색을 사용해 Todo를 관리해보세요.
            </p>
          </div>

          <Link
            href="/todos/new"
            className="shrink-0 rounded-xl bg-[#672be0] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            새 Todo
          </Link>
        </div>

        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <nav className="grid grid-cols-3 gap-2" aria-label="Todo 필터">
            {filterTabs.map((tab) => {
              const isActive = selectedFilter === tab.value;
              const href = createFilterHref(tab.value, searchKeyword);

              return (
                <Link
                  key={tab.value}
                  href={href}
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

        <form
          action="/todos"
          method="get"
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          {selectedFilter !== "all" && (
            <input type="hidden" name="filter" value={selectedFilter} />
          )}

          <label
            htmlFor="search"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Todo 검색
          </label>

          <div className="flex gap-2">
            <input
              id="search"
              name="search"
              type="search"
              defaultValue={searchKeyword}
              placeholder="제목 또는 설명으로 검색해보세요."
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#672be0] focus:ring-4 focus:ring-[#672be0]/10"
            />

            <button
              type="submit"
              className="rounded-xl bg-[#672be0] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              검색
            </button>

            {searchKeyword && (
              <Link
                href={createFilterHref(selectedFilter, "")}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                초기화
              </Link>
            )}
          </div>
        </form>

        {(selectedFilter !== "all" || searchKeyword) && (
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>현재 조건:</span>

            <span className="rounded-full bg-[#672be0]/10 px-3 py-1 font-semibold text-[#672be0]">
              {selectedFilter === "all"
                ? "전체"
                : selectedFilter === "active"
                  ? "진행 중"
                  : "완료"}
            </span>

            {searchKeyword && (
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
                검색어: {searchKeyword}
              </span>
            )}
          </div>
        )}

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