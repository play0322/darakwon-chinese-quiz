// 퀴즈 로직 순수 함수 모음 (테스트 가능하도록 분리)

export type VocabularyItem = {
  chinese: string;
  pinyin: string;
  meaning: string;
};

export type QuizMode = 'pinyin' | 'chinese' | 'meaning';

/**
 * 정답 1개 + 오답 3개로 구성된 4지선다 보기를 생성합니다.
 * allData 풀이 정답과 다른 항목에서 무작위로 오답을 선택합니다.
 */
export function generateOptions(
  correctAnswer: string,
  allData: VocabularyItem[],
  type: QuizMode,
): string[] {
  const distractors = Array.from(
    new Set(allData.map((item) => item[type]).filter((val) => val !== correctAnswer))
  )
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return [...distractors, correctAnswer].sort(() => 0.5 - Math.random());
}

/**
 * 현재 퀴즈 모드에서 문제 카드에 표시할 텍스트를 반환합니다.
 * - pinyin 모드: 한자를 보고 병음 고르기 → 한자 표시
 * - chinese 모드: 병음을 보고 한자 고르기 → 병음 표시
 * - meaning 모드: 한자를 보고 뜻 고르기 → 한자 표시
 */
export function getQuestionText(item: VocabularyItem, mode: QuizMode): string {
  switch (mode) {
    case 'pinyin':  return item.chinese;
    case 'chinese': return item.pinyin;
    case 'meaning': return item.chinese;
  }
}

/**
 * 사용자가 선택한 답이 정답인지 확인합니다.
 */
export function checkAnswer(
  selectedOption: string,
  currentItem: VocabularyItem,
  mode: QuizMode,
): boolean {
  return selectedOption === currentItem[mode];
}

/**
 * 정답률(%)을 계산합니다.
 */
export function calcScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}
