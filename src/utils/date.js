/**
 * Date 객체를 'YYYY-MM-DD' 표준 문자열 포맷으로 변환합니다.
 */
export const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * 전달받은 날짜가 속한 주차의 '월요일' Date 객체를 연산하여 반환합니다.
 */
export const getMondayOfDate = (date) => {
  const target = new Date(date);
  const day = target.getDay(); // 0(일) ~ 6(토)
  const diff = target.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(target.setDate(diff));
};