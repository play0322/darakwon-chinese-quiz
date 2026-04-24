import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveQuizResult, saveUserLogin, type QuizResult } from './db';

// fetch를 mock으로 교체 (실제 Google Sheets 호출 차단)
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
});

// ─────────────────────────────────────────────
// saveQuizResult
// ─────────────────────────────────────────────
describe('saveQuizResult', () => {
  it('fetch를 한 번 호출한다', async () => {
    const result: QuizResult = {
      studentName: '테스트학생',
      lesson: '1',
      mode: 'pinyin',
      score: 8,
      total: 10,
    };
    await saveQuizResult(result);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('POST method와 no-cors 모드로 호출된다', async () => {
    await saveQuizResult({ studentName: '홍길동', lesson: '2', mode: 'meaning', score: 5, total: 5 });
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.method).toBe('POST');
    expect(options.mode).toBe('no-cors');
  });

  it('전송 body에 studentName, lesson, score, total이 포함된다', async () => {
    const result: QuizResult = {
      studentName: '김철수',
      lesson: '3',
      mode: '오답복습',
      score: 3,
      total: 7,
    };
    await saveQuizResult(result);
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.studentName).toBe('김철수');
    expect(body.lesson).toBe('3');
    expect(body.score).toBe(3);
    expect(body.total).toBe(7);
  });

  it('body에 timestamp가 자동으로 포함된다', async () => {
    await saveQuizResult({ studentName: '이영희', lesson: '1', mode: 'pinyin', score: 10, total: 10 });
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.timestamp).toBeTruthy();
    expect(() => new Date(body.timestamp)).not.toThrow();
  });
});

// ─────────────────────────────────────────────
// saveUserLogin
// ─────────────────────────────────────────────
describe('saveUserLogin', () => {
  it('fetch를 한 번 호출한다', async () => {
    await saveUserLogin('박민준');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('body에 type: login과 studentName이 포함된다', async () => {
    await saveUserLogin('박민준');
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.type).toBe('login');
    expect(body.studentName).toBe('박민준');
    expect(body.timestamp).toBeTruthy();
  });
});
