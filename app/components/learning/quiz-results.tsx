'use client'

import type { Question, QuizScore } from '@/lib/learning/quiz-engine'

const LETTERS = ['A', 'B', 'C', 'D']

interface QuizResultsProps {
  questions: Question[]
  answers: Map<string, number>
  score: QuizScore
  passed: boolean
  passThreshold: number
  onRetake: () => void
}

export default function QuizResults({
  questions,
  answers,
  score,
  passed,
  passThreshold,
  onRetake,
}: QuizResultsProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-border bg-card p-8 text-center mb-8">
        <div className="text-5xl font-bold mb-2">
          {score.correct} / {score.total}
        </div>
        <div className="text-muted-foreground mb-4">{score.percent}% correct</div>
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
            passed
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
              : 'bg-red-500/10 text-red-500 border border-red-500/30'
          }`}
        >
          {passed ? 'PASS' : 'FAIL'} (needs {passThreshold}%)
        </span>
        <div className="mt-6">
          <button
            type="button"
            onClick={onRetake}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
          >
            Retake Quiz
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-4">Review</h3>
      <div className="space-y-4">
        {questions.map((q, i) => {
          const selected = answers.get(q.id)
          const isCorrect = selected === q.correctIndex
          return (
            <div key={q.id} className="rounded-xl border border-border bg-card p-5">
              <div className="text-xs font-mono text-muted-foreground mb-2">Question {i + 1}</div>
              <p className="font-medium mb-3">{q.question}</p>
              <p className="text-sm mb-1">
                <span className="text-muted-foreground">Your answer: </span>
                <span className={isCorrect ? 'text-emerald-500' : 'text-red-500'}>
                  {selected !== undefined ? `${LETTERS[selected]}. ${q.options[selected]}` : 'Not answered'}
                </span>
              </p>
              {!isCorrect && (
                <p className="text-sm mb-3">
                  <span className="text-muted-foreground">Correct answer: </span>
                  <span className="text-emerald-500">
                    {LETTERS[q.correctIndex]}. {q.options[q.correctIndex]}
                  </span>
                </p>
              )}
              <div className="bg-background border-l-4 border-l-primary rounded-lg p-3 mt-2">
                <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
