'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, notFound } from 'next/navigation'
import { getCertById, type CertMeta } from '@/data/learning/certs'
import { CGOA_QUESTIONS } from '@/data/learning/cgoa-questions'
import { CAPA_QUESTIONS } from '@/data/learning/capa-questions'
import { PCA_QUESTIONS } from '@/data/learning/pca-questions'
import { sampleQuestions, scoreQuiz, isPassing, type Question } from '@/lib/learning/quiz-engine'
import QuestionCard from '@/components/learning/question-card'
import QuestionNavigator from '@/components/learning/question-navigator'
import ExamTimer from '@/components/learning/exam-timer'
import QuizResults from '@/components/learning/quiz-results'
import Navigation from '@/components/layout/navigation'
import Footer from '@/components/sections/footer'

const QUESTION_BANKS: Record<string, Question[]> = {
  cgoa: CGOA_QUESTIONS,
  capa: CAPA_QUESTIONS,
  pca: PCA_QUESTIONS,
}

type QuizMode = 'learning' | 'exam'

function useQuizSession(bank: Question[], count: number, mode: QuizMode, durationMinutes: number) {
  const [questions] = useState<Question[]>(() => sampleQuestions(bank, count))
  const [answers, setAnswers] = useState<Map<string, number>>(new Map())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60)

  const current = questions[currentIndex]
  const selectedIndex = answers.get(current?.id) ?? null
  const answeredIndices = useMemo(
    () => new Set(questions.map((q, i) => (answers.has(q.id) ? i : -1)).filter((i) => i !== -1)),
    [questions, answers],
  )

  // Exam-mode countdown — auto-finishes the attempt when time runs out.
  useEffect(() => {
    if (mode !== 'exam' || finished) return
    if (secondsLeft <= 0) {
      setFinished(true)
      return
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [mode, finished, secondsLeft])

  function select(index: number) {
    if (mode === 'learning' && submitted) return
    setAnswers((prev) => new Map(prev).set(current.id, index))
  }

  // Learning mode only: reveal correctness + explanation for the current question.
  function submit() {
    if (selectedIndex === null) return
    setSubmitted(true)
  }

  function next() {
    if (currentIndex + 1 >= questions.length) {
      if (mode === 'learning') setFinished(true)
      return
    }
    setCurrentIndex((i) => i + 1)
    setSubmitted(false)
  }

  function prev() {
    if (currentIndex === 0) return
    setCurrentIndex((i) => i - 1)
    setSubmitted(false)
  }

  function jumpTo(index: number) {
    if (index < 0 || index >= questions.length) return
    setCurrentIndex(index)
    setSubmitted(false)
  }

  // Exam mode only: end the attempt on demand, from any question.
  function finishExam() {
    setFinished(true)
  }

  function retake() {
    setAnswers(new Map())
    setCurrentIndex(0)
    setSubmitted(false)
    setFinished(false)
    setSecondsLeft(durationMinutes * 60)
  }

  return {
    questions,
    answers,
    current,
    currentIndex,
    selectedIndex,
    submitted,
    finished,
    secondsLeft,
    answeredIndices,
    select,
    submit,
    next,
    prev,
    jumpTo,
    finishExam,
    retake,
  }
}

function ModeSelect({ cert, onSelect }: { cert: CertMeta; onSelect: (mode: QuizMode) => void }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
        {cert.shortName} Simulator
      </div>
      <h1 className="text-2xl font-bold mb-2">{cert.name}</h1>
      <p className="text-muted-foreground mb-10">
        {cert.questionCount} questions · {cert.durationMinutes} min · {cert.passThreshold}% to pass
      </p>
      <div className="grid sm:grid-cols-2 gap-4 text-left">
        <button
          type="button"
          onClick={() => onSelect('learning')}
          className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
        >
          <div className="text-lg font-bold mb-2">📘 Learning Mode</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            See whether you got it right and read the explanation immediately after each question. No timer — go at your own pace, one question at a time.
          </p>
        </button>
        <button
          type="button"
          onClick={() => onSelect('exam')}
          className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
        >
          <div className="text-lg font-bold mb-2">⏱️ Exam Mode</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A timed, {cert.durationMinutes}-minute simulation. Jump between questions freely — no feedback until you finish, matching the real exam experience.
          </p>
        </button>
      </div>
    </div>
  )
}

export default function QuizPage() {
  const params = useParams<{ certId: string }>()
  const cert = getCertById(params.certId)
  const bank = QUESTION_BANKS[params.certId]
  const [mode, setMode] = useState<QuizMode | null>(null)

  if (!cert || !cert.available || !bank) {
    notFound()
  }

  return mode === null ? (
    <main className="min-h-screen">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <ModeSelect cert={cert} onSelect={setMode} />
      </div>
      <Footer />
    </main>
  ) : (
    <QuizSession cert={cert} bank={bank} mode={mode} onExit={() => setMode(null)} />
  )
}

function QuizSession({
  cert,
  bank,
  mode,
  onExit,
}: {
  cert: CertMeta
  bank: Question[]
  mode: QuizMode
  onExit: () => void
}) {
  const session = useQuizSession(bank, cert.questionCount, mode, cert.durationMinutes)
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
      body: JSON.stringify({ certId: cert.id, mode, passed, scorePercent: score.percent }),
    }).catch(() => {
      // Metrics reporting is best-effort — a failure here shouldn't affect the quiz UX.
    })
  }, [session.finished, cert.id, mode, passed, score.percent])

  const isLastQuestion = session.currentIndex + 1 >= session.questions.length

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
            onRetake={() => {
              session.retake()
              onExit()
            }}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-3 text-sm font-mono">
              <span>
                {cert.shortName} Simulator — {mode === 'exam' ? 'Exam Mode' : 'Learning Mode'}
              </span>
              {mode === 'exam' && <ExamTimer secondsLeft={session.secondsLeft} />}
            </div>
            <div className="h-1 bg-secondary rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${((session.currentIndex + 1) / session.questions.length) * 100}%` }}
              />
            </div>

            {mode === 'exam' && (
              <div className="mb-6">
                <QuestionNavigator
                  total={session.questions.length}
                  currentIndex={session.currentIndex}
                  answered={session.answeredIndices}
                  onJump={session.jumpTo}
                />
              </div>
            )}

            <QuestionCard
              question={session.current}
              questionNumber={session.currentIndex + 1}
              totalQuestions={session.questions.length}
              selectedIndex={session.selectedIndex}
              submitted={mode === 'learning' && session.submitted}
              onSelect={session.select}
            />

            {mode === 'learning' ? (
              <div className="flex justify-end mt-6">
                {session.submitted ? (
                  <button
                    type="button"
                    onClick={session.next}
                    className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
                  >
                    {isLastQuestion ? 'See Results' : 'Next Question →'}
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
            ) : (
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={session.prev}
                  disabled={session.currentIndex === 0}
                  className="px-6 py-2.5 rounded-lg border border-border text-sm font-semibold disabled:opacity-40"
                >
                  ← Previous
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={session.finishExam}
                    className="px-6 py-2.5 rounded-lg border border-red-500/40 text-red-500 text-sm font-semibold hover:bg-red-500/10"
                  >
                    Finish Exam
                  </button>
                  {!isLastQuestion && (
                    <button
                      type="button"
                      onClick={session.next}
                      className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </main>
  )
}
