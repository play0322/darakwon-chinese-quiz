// Google Apps Script URL (구글 시트 연동 엔드포인트)
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbx0yepSATmVnqx_446z0_mnDswdp-WlCLpjwdeg8MvY7BPl8CVn-ZLggqHsnSEkPlte/exec";

export interface QuizResult {
  studentName: string;
  lesson: string;
  mode: string;
  score: number;
  total: number;
  timestamp?: string;
}

/**
 * 퀴즈 결과를 구글 시트에 저장합니다.
 * no-cors 모드로 전송하므로 응답 내용은 확인할 수 없으나 전송 자체는 이루어집니다.
 */
export async function saveQuizResult(result: QuizResult): Promise<void> {
  if (!GAS_URL.startsWith("http")) return;

  const payload: QuizResult = {
    ...result,
    timestamp: new Date().toISOString(),
  };

  await fetch(GAS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * 사용자 로그인 정보를 구글 시트에 저장합니다.
 */
export async function saveUserLogin(studentName: string): Promise<void> {
  if (!GAS_URL.startsWith("http")) return;

  await fetch(GAS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "login",
      studentName,
      timestamp: new Date().toISOString(),
    }),
  });
}
