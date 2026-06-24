import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

/**
 * 백엔드 API 주소가 설정되어 있는지 확인합니다.
 */
function getBackendApiBaseUrl() {
  if (!BACKEND_API_BASE_URL) {
    throw new Error(
      "BACKEND_API_BASE_URL 환경 변수가 설정되지 않았습니다.",
    );
  }

  return BACKEND_API_BASE_URL;
}

/**
 * Axios 에러를 Next.js API 응답 형태로 변환합니다.
 */
function createErrorResponse(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const message =
      error.response?.data?.detail ??
      error.response?.data?.message ??
      "API 요청 처리 중 오류가 발생했습니다.";

    return NextResponse.json({ message }, { status });
  }

  if (error instanceof Error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { message: "알 수 없는 서버 오류가 발생했습니다." },
    { status: 500 },
  );
}

/**
 * URL의 filter 값을 검사합니다.
 * FastAPI는 active, completed만 필터 값으로 받습니다.
 */
function getValidTodoFilter(request: NextRequest) {
  const filter = request.nextUrl.searchParams.get("filter");

  if (!filter) {
    return undefined;
  }

  if (filter !== "active" && filter !== "completed") {
    throw new Error("filter 값은 active 또는 completed만 사용할 수 있습니다.");
  }

  return filter;
}

/**
 * GET /api/todos
 * GET /api/todos?filter=active
 * GET /api/todos?filter=completed
 *
 * FastAPI의 GET /todos API로 요청을 전달합니다.
 */
export async function GET(request: NextRequest) {
  try {
    const backendApiBaseUrl = getBackendApiBaseUrl();
    const filter = getValidTodoFilter(request);

    const response = await axios.get(`${backendApiBaseUrl}/todos`, {
      params: filter ? { filter } : undefined,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * POST /api/todos
 * FastAPI의 POST /todos API를 호출해 새 Todo를 생성합니다.
 */
export async function POST(request: NextRequest) {
  try {
    const backendApiBaseUrl = getBackendApiBaseUrl();
    const body = await request.json();

    const response = await axios.post(`${backendApiBaseUrl}/todos`, body);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * PUT /api/todos?id=1
 * FastAPI의 PUT /todos/{id} API를 호출해 Todo를 수정합니다.
 */
export async function PUT(request: NextRequest) {
  try {
    const backendApiBaseUrl = getBackendApiBaseUrl();
    const todoId = request.nextUrl.searchParams.get("id");

    if (!todoId) {
      return NextResponse.json(
        { message: "수정할 Todo ID가 필요합니다." },
        { status: 400 },
      );
    }

    const body = await request.json();

    const response = await axios.put(
      `${backendApiBaseUrl}/todos/${todoId}`,
      body,
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * DELETE /api/todos?id=1
 * FastAPI의 DELETE /todos/{id} API를 호출해 Todo를 삭제합니다.
 */
export async function DELETE(request: NextRequest) {
  try {
    const backendApiBaseUrl = getBackendApiBaseUrl();
    const todoId = request.nextUrl.searchParams.get("id");

    if (!todoId) {
      return NextResponse.json(
        { message: "삭제할 Todo ID가 필요합니다." },
        { status: 400 },
      );
    }

    await axios.delete(`${backendApiBaseUrl}/todos/${todoId}`);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return createErrorResponse(error);
  }
}