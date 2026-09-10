'use client'

import { Check, X } from 'lucide-react'
import type { Question } from '@/lib/learning/quiz-engine'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedIndex: number | null
  submitted: boolean
  onSelect: (index: number) => void
}

const LETTERS = ['A', 'B', 'C', 'D']

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedIndex,
  submitted,
  onSelect,
}: QuestionCardProps) {
  const isCorrectSelection = selectedIndex === question.correctIndex

  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
        Question {questionNumber} of {totalQuestions}
      </div>
      <h2 className="text-lg font-semibold leading-relaxed mb-7">{question.question}</h2>

      <div className="space-y-2.5 mb-2">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index
          const isCorrectOption = index === question.correctIndex

          let stateClasses = 'border-border hover:border-primary/40 hover:bg-primary/5'
          if (submitted) {
            if (isCorrectOption) {
              stateClasses = 'border-emerald-500/60 bg-emerald-500/10'
            } else if (isSelected) {
              stateClasses = 'border-red-500/60 bg-red-500/10'
            } else {
              stateClasses = 'border-border opacity-40'
            }
          } else if (isSelected) {
            stateClasses = 'border-primary bg-primary/10'
          }

          return (
            <button
              key={index}
              type="button"
              disabled={submitted}
              onClick={() => onSelect(index)}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-colors ${stateClasses}`}
            >
              <span
                className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                  submitted && isCorrectOption
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : submitted && isSelected
                      ? 'bg-red-500 border-red-500 text-white'
                      : isSelected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-secondary border-border text-muted-foreground'
                }`}
              >
                {LETTERS[index]}
              </span>
              <span className="text-sm">{option}</span>
              {submitted && isCorrectOption && <Check className="w-4 h-4 text-emerald-500 ml-auto flex-shrink-0" />}
              {submitted && isSelected && !isCorrectOption && <X className="w-4 h-4 text-red-500 ml-auto flex-shrink-0" />}
            </button>
          )
        })}
      </div>

      {submitted && (
        <>
          <div
            className={`flex items-center gap-2 p-3 rounded-lg font-semibold text-sm mt-5 mb-4 ${
              isCorrectSelection
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500'
                : 'bg-red-500/10 border border-red-500/30 text-red-500'
            }`}
          >
            {isCorrectSelection
              ? '✓ Correct!'
              : `✗ Incorrect — the correct answer is ${LETTERS[question.correctIndex]}`}
          </div>
          <div className="bg-background border border-border border-l-4 border-l-primary rounded-lg p-4">
            <div className="text-xs font-mono uppercase tracking-wider text-primary font-bold mb-2">
              Explanation
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
          </div>
        </>
      )}
    </div>
  )
}
