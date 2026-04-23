'use client';

import { useState } from 'react';
import { Question, QuestionAnswer } from '@/lib/types';
import { QuestionCard } from './QuestionCard';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionDeckProps {
  questions: Question[];
  onComplete: (answers: QuestionAnswer[]) => void;
}

export function QuestionDeck({ questions, onComplete }: QuestionDeckProps) {
  // queue holds the remaining questions to show
  const [queue, setQueue] = useState<Question[]>(questions);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  // total root questions for progress bar (fixed, never changes)
  const totalRoot = questions.length;
  const answeredRoot = answers.filter((a) =>
    questions.some((q) => q.id === a.questionId),
  ).length;

  const handleSwipe = (direction: 'left' | 'right') => {
    const [current, ...remaining] = queue;

    const newAnswer: QuestionAnswer = {
      questionId: current.id,
      questionText: current.text,
      category: current.category,
      answer: direction === 'right' ? 'yes' : 'no',
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    let nextQueue: Question[];

    if (direction === 'right') {
      // If this question belongs to a mutually exclusive group, drop siblings from queue
      const filtered = current.groupId
        ? remaining.filter((q) => q.groupId !== current.groupId)
        : remaining;

      // Prepend sub-questions if any
      nextQueue = current.subQuestions?.length
        ? [...current.subQuestions, ...filtered]
        : filtered;
    } else {
      nextQueue = remaining;
    }

    setQueue(nextQueue);

    if (nextQueue.length === 0) {
      onComplete(newAnswers);
    }
  };

  const currentQuestion = queue[0];
  const completion = Math.round((answeredRoot / totalRoot) * 100);

  if (!currentQuestion) {
    return null; // onComplete fires before this renders
  }

  return (
    <div className='relative isolate min-h-screen overflow-hidden px-4 pb-12 pt-10 sm:px-6 lg:px-8'>
      <div className='absolute inset-0 -z-20 bg-linear-to-b from-emerald-50 via-[#f7faf8] to-slate-100' />
      <div className='absolute left-1/2 top-28 -z-10 h-136 w-136 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl' />
      <div className='absolute right-0 top-0 -z-10 h-80 w-80 rounded-full bg-slate-300/25 blur-3xl' />

      <div className='mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'>
        {/* Left panel */}
        <div className='max-w-2xl'>
          <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800 shadow-sm backdrop-blur'>
            Persönlicher Speedcheck
          </div>
          <h1 className='mt-6 max-w-xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl'>
            Ihr Profil in wenigen Schritten — einfach Ja oder Nein antworten.
          </h1>
          <p className='mt-5 max-w-xl text-lg leading-8 text-slate-600'>
            Wischen Sie nach rechts für{' '}
            <span className='font-semibold text-emerald-700'>JA</span>, nach
            links für <span className='font-semibold text-slate-700'>NEIN</span>
            . Unsere Berater verwenden Ihre Antworten, um die beste
            Finanzierungslösung für Sie zu finden.
          </p>

          <div className='mt-8 flex flex-wrap gap-3'>
            {[
              '100% vertraulich',
              'Kein Kredit-Scoring',
              'Kostenlose Beratung',
            ].map((badge) => (
              <span
                key={badge}
                className='rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur'
              >
                {badge}
              </span>
            ))}
          </div>

          <div className='mt-10 grid gap-4 sm:grid-cols-3'>
            <div className='rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur'>
              <p className='text-sm text-slate-500'>Aktuelle Frage</p>
              <p className='mt-2 text-2xl font-semibold text-slate-900'>
                {answeredRoot + 1}/{totalRoot}
              </p>
            </div>
            <div className='rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur'>
              <p className='text-sm text-slate-500'>Ja-Antworten</p>
              <p className='mt-2 text-2xl font-semibold text-emerald-700'>
                {answers.filter((a) => a.answer === 'yes').length}
              </p>
            </div>
            <div className='rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur'>
              <p className='text-sm text-slate-500'>Fortschritt</p>
              <p className='mt-2 text-2xl font-semibold text-slate-900'>
                {completion}%
              </p>
            </div>
          </div>
        </div>

        {/* Right panel — card stack */}
        <div className='space-y-6'>
          <div className='rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl'>
            {/* Header */}
            <div className='mb-5 flex items-center justify-between gap-4'>
              <div>
                <p className='text-sm font-medium uppercase tracking-[0.2em] text-slate-500'>
                  Speedcheck
                </p>
                <p className='mt-2 text-sm text-slate-600'>
                  Nach rechts für JA, nach links für NEIN.
                </p>
              </div>
              {/* Progress dots — root questions only */}
              <div className='flex gap-2'>
                {Array.from({ length: totalRoot }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`rounded-full transition-all ${
                      idx < answeredRoot
                        ? 'h-2.5 w-7 bg-emerald-600'
                        : idx === answeredRoot
                          ? 'h-2.5 w-10 bg-slate-900'
                          : 'h-2.5 w-2.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Card stack */}
            <div className='relative h-136 w-full'>
              {/* Ghost cards behind */}
              {queue.slice(1, 3).map((_, idx) => (
                <div
                  key={idx}
                  className='absolute inset-x-0 rounded-[2rem] border border-white/70 bg-linear-to-br from-slate-100 to-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]'
                  style={{
                    top: `${(idx + 1) * 12}px`,
                    bottom: `${(idx + 1) * 10}px`,
                    left: `${(idx + 1) * 6}px`,
                    right: `${(idx + 1) * 6}px`,
                    zIndex: -idx - 1,
                  }}
                />
              ))}

              <AnimatePresence mode='wait'>
                <QuestionCard
                  key={currentQuestion.id}
                  question={currentQuestion}
                  onSwipe={handleSwipe}
                  questionNumber={answeredRoot + 1}
                  totalQuestions={totalRoot}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom bar */}
          <div className='flex items-center justify-between rounded-[1.5rem] border border-white/70 bg-slate-900 px-5 py-4 text-slate-50 shadow-[0_16px_45px_rgba(15,23,42,0.18)]'>
            <p className='text-sm text-slate-300'>
              Noch {queue.length} {queue.length === 1 ? 'Frage' : 'Fragen'}{' '}
              verbleibend
            </p>
            <p className='text-lg font-semibold'>
              {answers.filter((a) => a.answer === 'yes').length} JA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
