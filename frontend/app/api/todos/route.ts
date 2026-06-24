import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

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

  return NextResponse.json(
    { message: "알 수 없는 서버 오류가 발생했습니다." },
    { status: 500 },
  );
}

/**
 * GET /api/todos
 * FastAPI의 GET /todos API를 호출해 전체 Todo 목록을 가져옵니다.
 */
export async function GET() {
  try {
    const response = await axios.get(`${BACKEND_API_BASE_URL}/todos`);

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
    const body = await request.json();

    const response = await axios.post(`${BACKEND_API_BASE_URL}/todos`, body);

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
    const todoId = request.nextUrl.searchParams.get("id");

    if (!todoId) {
      return NextResponse.json(
        { message: "수정할 Todo ID가 필요합니다." },
        { status: 400 },
      );
    }

    const body = await request.json();

    const response = await axios.put(
      `${BACKEND_API_BASE_URL}/todos/${todoId}`,
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
    const todoId = request.nextUrl.searchParams.get("id");

    if (!todoId) {
      return NextResponse.json(
        { message: "삭제할 Todo ID가 필요합니다." },
        { status: 400 },
      );
    }

    await axios.delete(`${BACKEND_API_BASE_URL}/todos/${todoId}`);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return createErrorResponse(error);
  }
}