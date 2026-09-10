export interface Question {
  id: string
  question: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
}

export interface QuizScore {
  correct: number
  total: number
  percent: number
}

/** Fisher-Yates shuffle, does not mutate the input array. */
function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Returns `count` unique questions from `bank` in shuffled order.
 * If `count` >= bank.length, returns the whole bank shuffled.
 */
export function sampleQuestions(bank: Question[], count: number): Question[] {
  const shuffled = shuffle(bank)
  return shuffled.slice(0, Math.min(count, bank.length))
}

/**
 * Scores a completed (or partial) quiz. `answers` maps question id ->
 * the index of the option the user selected. Unanswered questions
 * (missing from the map) count as incorrect.
 */
export function scoreQuiz(questions: Question[], answers: Map<string, number>): QuizScore {
  const total = questions.length
  const correct = questions.filter((q) => answers.get(q.id) === q.correctIndex).length
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100)
  return { correct, total, percent }
}

export function isPassing(percent: number, passThreshold: number): boolean {
  return percent >= passThreshold
}
