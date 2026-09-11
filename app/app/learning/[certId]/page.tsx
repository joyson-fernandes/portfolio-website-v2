'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, notFound } from 'next/navigation'
import { getCertById } from '@/data/learning/certs'
import { CGOA_QUESTIONS } from '@/data/learning/cgoa-questions'
import { CAPA_QUESTIONS } from '@/data/learning/capa-questions'
import { sampleQuestions, scoreQuiz, isPassing, type Question } from '@/lib/learning/quiz-engine'
import QuestionCard from '@/components/learning/question-card'
import QuizResults from '@/components/learning/quiz-results'
import Navigation from '@/components/layout/navigation'
import Footer from '@/components/sections/footer'

const QUESTION_BANKS: Record<string, Question[]> = {
  cgoa: CGOA_QUESTIONS,
  capa: CAPA_QUESTIONS,
}

function useQuizSession(bank: Question[], count: number) {
  const [questions] = useState<Question[]>(() => sampleQuestions(bank, count))
  const [answers, setAnswers] = useState<Map<string, number>>(new Map())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [finished, setFinished] = useState(false)

  const current = questions[currentIndex]
  const selectedIndex = answers.get(current?.id) ?? null

  function select(index: number) {
    if (submitted) return
    setAnswers((prev) => new Map(prev).set(current.id, index))
  }

  function submit() {
    if (selectedIndex === null) return
    setSubmitted(true)
  }

  function next() {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true)
      return
    }
    setCurrentIndex((i) => i + 1)
    setSubmitted(false)
  }

  function retake() {
    setAnswers(new Map())
    setCurrentIndex(0)
    setSubmitted(false)
    setFinished(false)
  }

  return { questions, answers, current, currentIndex, selectedIndex, submitted, finished, select, submit, next, retake }
}

export default function QuizPage() {
  const params = useParams<{ certId: string }>()
  const cert = getCertById(params.certId)
  const bank = QUESTION_BANKS[params.certId]

  if (!cert || !cert.available || !bank) {
    notFound()
  }

  const session = useQuizSession(bank, cert.questionCount)
  const score = useMemo(
    () => scoreQuiz(session.questions, session.answers),
    [session.questions, session.answers, session.finished],
  )
  const passed = isPassing(score.percent, cert.passThreshold)

  const reported = useRef(false)
  useEffect(() => {
    if (!session.finished) {
      reported.current = false // allow the next retake's completion to report again
      return
    }
    if (reported.current) return
    reported.current = true
    fetch('/api/learning/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certId: cert.id, passed }),
    }).catch(() => {
      // Metrics reporting is best-effort — a failure here shouldn't affect the quiz UX.
    })
  }, [session.finished, cert.id, passed])

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {session.finished ? (
          <QuizResults
            questions={session.questions}
            answers={session.answers}
            score={score}
            passed={passed}
            passThreshold={cert.passThreshold}
            onRetake={session.retake}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-3 text-sm font-mono">
              <span>{cert.shortName} Simulator</span>
            </div>
            <div className="h-1 bg-secondary rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${((session.currentIndex + 1) / session.questions.length) * 100}%` }}
              />
            </div>
            <QuestionCard
              question={session.current}
              questionNumber={session.currentIndex + 1}
              totalQuestions={session.questions.length}
              selectedIndex={session.selectedIndex}
              submitted={session.submitted}
              onSelect={session.select}
            />
            <div className="flex justify-end mt-6">
              {session.submitted ? (
                <button
                  type="button"
                  onClick={session.next}
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
                >
                  {session.currentIndex + 1 >= session.questions.length ? 'See Results' : 'Next Question →'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={session.submit}
                  disabled={session.selectedIndex === null}
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40"
                >
                  Submit Answer
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  )
}
