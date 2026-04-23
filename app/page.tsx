'use client';

import Link from 'next/link';
import { useState } from 'react';
import { QuestionDeck } from '@/components/QuestionDeck';
import { AiClientMessage } from '@/components/AiClientMessage';
import { BookingFlow } from '@/components/BookingFlow';
import { rootQuestions } from '@/lib/questions';
import { QuestionAnswer } from '@/lib/types';

type FlowStep = 'swipe' | 'message' | 'booking';

export default function Home() {
  const [step, setStep] = useState<FlowStep>('swipe');
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);

  const handleQuestionsComplete = (completed: QuestionAnswer[]) => {
    setAnswers(completed);
    setStep('message');
  };

  const handleBookingSuccess = () => {
    setStep('swipe');
    setAnswers([]);
  };

  return (
    <>
      {/* Navigation */}
      <nav className='fixed top-0 left-0 right-0 z-50 border-b border-white/50 bg-white/75 backdrop-blur-xl'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6'>
          <div className='flex items-center gap-2'>
            {/* Flame icon like Tinder */}
            <svg
              width='32'
              height='38'
              viewBox='0 0 32 38'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <defs>
                <linearGradient
                  id='flameGrad'
                  x1='16'
                  y1='0'
                  x2='16'
                  y2='38'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop offset='0%' stopColor='#ff6b35' />
                  <stop offset='55%' stopColor='#ff2d55' />
                  <stop offset='100%' stopColor='#c0392b' />
                </linearGradient>
                <linearGradient
                  id='innerFlame'
                  x1='16'
                  y1='12'
                  x2='16'
                  y2='36'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop offset='0%' stopColor='#ffcc02' />
                  <stop offset='100%' stopColor='#ff6b35' />
                </linearGradient>
              </defs>
              {/* Outer flame */}
              <path
                d='M16 0C16 0 10 7 8 13C6 19 8 22 8 22C8 22 5 20 5 16C5 16 1 21 1 27C1 33 7.5 38 16 38C24.5 38 31 33 31 27C31 19 22 12 22 12C22 12 24 17 20 20C20 20 22 16 19 10C17 6 16 0 16 0Z'
                fill='url(#flameGrad)'
              />
              {/* Inner flame */}
              <path
                d='M16 14C16 14 13 18 13 22C13 25.3 14.3 27 16 28C17.7 27 19 25.3 19 22C19 18 16 14 16 14Z'
                fill='url(#innerFlame)'
                opacity='0.9'
              />
            </svg>
            {/* Brand name */}
            <span
              className='text-2xl font-black tracking-tight'
              style={{
                background:
                  'linear-gradient(135deg, #ff6b35 0%, #ff2d55 60%, #c0392b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em',
              }}
            >
              finder
            </span>
          </div>
          <div className='flex items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50/80 p-1.5 text-sm font-medium text-slate-600 shadow-sm'>
            <Link
              href='/admin'
              className='cursor-pointer rounded-full px-4 py-2 text-slate-700 transition hover:bg-white hover:text-emerald-700'
            >
              Makler-Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='pt-20'>
        {step === 'swipe' && (
          <QuestionDeck
            questions={rootQuestions}
            onComplete={handleQuestionsComplete}
          />
        )}

        {step === 'message' && (
          <AiClientMessage
            answers={answers}
            onComplete={() => setStep('booking')}
          />
        )}

        {step === 'booking' && (
          <BookingFlow
            questionAnswers={answers}
            onSuccess={handleBookingSuccess}
          />
        )}
      </main>
    </>
  );
}
