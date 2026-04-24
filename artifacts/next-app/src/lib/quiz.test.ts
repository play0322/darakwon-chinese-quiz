import { describe, it, expect } from 'vitest';
import {
  generateOptions,
  getQuestionText,
  checkAnswer,
  calcScore,
  type VocabularyItem,
  type QuizMode,
} from './quiz';

const SAMPLE_VOCAB: VocabularyItem[] = [
  { chinese: '你好', pinyin: 'nǐ hǎo', meaning: '안녕하세요' },
  { chinese: '谢谢', pinyin: 'xièxiè', meaning: '감사합니다' },
  { chinese: '再见', pinyin: 'zàijiàn', meaning: '안녕히 계세요' },
  { chinese: '对不起', pinyin: 'duìbuqǐ', meaning: '미안합니다' },
  { chinese: '没关系', pinyin: 'méiguānxi', meaning: '괜찮습니다' },
];

// ─────────────────────────────────────────────
// generateOptions
// ─────────────────────────────────────────────
describe('generateOptions', () => {
  it('항상 4개의 보기를 반환한다', () => {
    const options = generateOptions('nǐ hǎo', SAMPLE_VOCAB, 'pinyin');
    expect(options).toHaveLength(4);
  });

  it('정답이 반드시 보기에 포함된다', () => {
    const correct = 'nǐ hǎo';
    const options = generateOptions(correct, SAMPLE_VOCAB, 'pinyin');
    expect(options).toContain(correct);
  });

  it('보기에 중복이 없다', () => {
    const options = generateOptions('nǐ hǎo', SAMPLE_VOCAB, 'pinyin');
    expect(new Set(options).size).toBe(options.length);
  });

  it('meaning 모드에서도 정답이 포함된다', () => {
    const correct = '안녕하세요';
    const options = generateOptions(correct, SAMPLE_VOCAB, 'meaning');
    expect(options).toContain(correct);
    expect(options).toHaveLength(4);
  });

  it('chinese 모드에서도 정답이 포함된다', () => {
    const correct = '你好';
    const options = generateOptions(correct, SAMPLE_VOCAB, 'chinese');
    expect(options).toContain(correct);
    expect(options).toHaveLength(4);
  });
});

// ─────────────────────────────────────────────
// getQuestionText
// ─────────────────────────────────────────────
describe('getQuestionText', () => {
  const item: VocabularyItem = { chinese: '你好', pinyin: 'nǐ hǎo', meaning: '안녕하세요' };

  it('pinyin 모드에서 한자(chinese)를 반환한다', () => {
    expect(getQuestionText(item, 'pinyin')).toBe('你好');
  });

  it('chinese 모드에서 병음(pinyin)을 반환한다', () => {
    expect(getQuestionText(item, 'chinese')).toBe('nǐ hǎo');
  });

  it('meaning 모드에서 한자(chinese)를 반환한다', () => {
    expect(getQuestionText(item, 'meaning')).toBe('你好');
  });
});

// ─────────────────────────────────────────────
// checkAnswer
// ─────────────────────────────────────────────
describe('checkAnswer', () => {
  const item: VocabularyItem = { chinese: '谢谢', pinyin: 'xièxiè', meaning: '감사합니다' };

  it('정답 선택 시 true를 반환한다', () => {
    expect(checkAnswer('xièxiè', item, 'pinyin')).toBe(true);
    expect(checkAnswer('谢谢', item, 'chinese')).toBe(true);
    expect(checkAnswer('감사합니다', item, 'meaning')).toBe(true);
  });

  it('오답 선택 시 false를 반환한다', () => {
    expect(checkAnswer('nǐ hǎo', item, 'pinyin')).toBe(false);
    expect(checkAnswer('你好', item, 'chinese')).toBe(false);
    expect(checkAnswer('안녕하세요', item, 'meaning')).toBe(false);
  });
});

// ─────────────────────────────────────────────
// calcScore
// ─────────────────────────────────────────────
describe('calcScore', () => {
  it('10문제 중 8개 정답 → 80%', () => {
    expect(calcScore(8, 10)).toBe(80);
  });

  it('전부 정답 → 100%', () => {
    expect(calcScore(5, 5)).toBe(100);
  });

  it('전부 오답 → 0%', () => {
    expect(calcScore(0, 10)).toBe(0);
  });

  it('total이 0일 때 0%를 반환한다 (ZeroDivisionError 방지)', () => {
    expect(calcScore(0, 0)).toBe(0);
  });

  it('소수점 반올림이 올바르다 (1/3 → 33%)', () => {
    expect(calcScore(1, 3)).toBe(33);
  });
});
