import { describe, it, expect } from 'vitest'
import { sampleQuestions, scoreQuiz, isPassing, type Question } from './quiz-engine'

const bank: Question[] = [
  { id: 'q1', question: 'Q1', options: ['a', 'b', 'c', 'd'], correctIndex: 0, explanation: 'e1' },
  { id: 'q2', question: 'Q2', options: ['a', 'b', 'c', 'd'], correctIndex: 1, explanation: 'e2' },
  { id: 'q3', question: 'Q3', options: ['a', 'b', 'c', 'd'], correctIndex: 2, explanation: 'e3' },
]

describe('sampleQuestions', () => {
  it('returns the full bank shuffled when count >= bank size', () => {
    const result = sampleQuestions(bank, 10)
    expect(result).toHaveLength(3)
    expect(result.map((q) => q.id).sort()).toEqual(['q1', 'q2', 'q3'])
  })

  it('returns exactly `count` unique questions when count < bank size', () => {
    const result = sampleQuestions(bank, 2)
    expect(result).toHaveLength(2)
    const ids = result.map((q) => q.id)
    expect(new Set(ids).size).toBe(2)
    ids.forEach((id) => expect(bank.map((q) => q.id)).toContain(id))
  })
})

describe('scoreQuiz', () => {
  it('counts correct answers by comparing selected index to correctIndex', () => {
    const answers = new Map([
      ['q1', 0], // correct
      ['q2', 0], // wrong (correct is 1)
      ['q3', 2], // correct
    ])
    const result = scoreQuiz(bank, answers)
    expect(result).toEqual({ correct: 2, total: 3, percent: 67 })
  })

  it('treats unanswered questions as incorrect', () => {
    const answers = new Map([['q1', 0]])
    const result = scoreQuiz(bank, answers)
    expect(result).toEqual({ correct: 1, total: 3, percent: 33 })
  })
})

describe('isPassing', () => {
  it('returns true when percent meets the threshold', () => {
    expect(isPassing(75, 75)).toBe(true)
    expect(isPassing(80, 75)).toBe(true)
  })

  it('returns false when percent is below the threshold', () => {
    expect(isPassing(74, 75)).toBe(false)
  })
})
