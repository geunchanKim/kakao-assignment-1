"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

/**
 * FormData에서 문자열 값을 안전하게 꺼내고 앞뒤 공백을 제거합니다.
 */
function getFormTextValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

/**
 * Todo 생성 Server Action입니다.
 * form에서 입력받은 데이터를 FastAPI의 POST /todos API로 전달합니다.
 */
export async function createTodoAction(formData: FormData) {
  const title = getFormTextValue(formData, "title");
  const description = getFormTextValue(formData, "description");

  if (!title) {
    throw new Error("Todo 제목을 입력해주세요.");
  }

  await axios.post(`${BACKEND_API_BASE_URL}/todos`, {
    title,
    description: description || null,
  });

  revalidatePath("/todos");
  redirect("/todos");
}

/**
 * Todo 수정 Server Action입니다.
 * todoId에 해당하는 Todo를 FastAPI의 PUT /todos/{id} API로 수정합니다.
 */
export async function updateTodoAction(todoId: number, formData: FormData) {
  const title = getFormTextValue(formData, "title");
  const description = getFormTextValue(formData, "description");
  const isCompleted = formData.get("isCompleted") === "on";

  if (!title) {
    throw new Error("Todo 제목을 입력해주세요.");
  }

  await axios.put(`${BACKEND_API_BASE_URL}/todos/${todoId}`, {
    title,
    description: description || null,
    is_completed: isCompleted,
  });

  revalidatePath("/todos");
  redirect("/todos");
}

/**
 * Todo 완료 상태를 변경하는 Server Action입니다.
 * 목록 페이지에서 완료/되돌리기 버튼을 눌렀을 때 사용합니다.
 */
export async function toggleTodoCompletedAction(
  todoId: number,
  currentCompletedState: boolean,
) {
  await axios.put(`${BACKEND_API_BASE_URL}/todos/${todoId}`, {
    is_completed: !currentCompletedState,
  });

  revalidatePath("/todos");
}

/**
 * Todo 삭제 Server Action입니다.
 * hidden input으로 전달받은 todoId를 사용해 FastAPI의 DELETE /todos/{id} API를 호출합니다.
 */
export async function deleteTodoAction(formData: FormData) {
  const todoId = getFormTextValue(formData, "todoId");

  if (!todoId) {
    throw new Error("삭제할 Todo ID가 없습니다.");
  }

  await axios.delete(`${BACKEND_API_BASE_URL}/todos/${todoId}`);

  revalidatePath("/todos");
}