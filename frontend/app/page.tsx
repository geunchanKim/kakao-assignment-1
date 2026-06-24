import { redirect } from "next/navigation";

/**
 * 루트 경로(`/`)로 접속하면 Todo 목록 페이지(`/todos`)로 이동합니다.
 *
 * Next.js App Router에서 page.tsx는 기본적으로 Server Component이므로,
 * 서버에서 바로 redirect 처리를 할 수 있습니다.
 */
export default function HomePage() {
  redirect("/todos");
}