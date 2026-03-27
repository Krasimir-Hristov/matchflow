'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SwipeDeck } from '@/components/SwipeDeck';
import { AiClientMessage } from '@/components/AiClientMessage';
import { BookingFlow } from '@/components/BookingFlow';
import { mockOffers } from '@/lib/mockOffers';

type FlowStep = 'swipe' | 'message' | 'booking';

export default function Home() {
  const [step, setStep] = useState<FlowStep>('swipe');
  const [likedOfferIds, setLikedOfferIds] = useState<string[]>([]);

  const handleSwipeComplete = (offers: string[]) => {
    setLikedOfferIds(offers);
    setStep('message');
  };

  const handleBookingSuccess = () => {
    // Reset flow
    setStep('swipe');
    setLikedOfferIds([]);
  };

  return (
    <>
      {/* Navigation */}
      <nav className='fixed top-0 left-0 right-0 z-50 border-b border-white/50 bg-white/75 backdrop-blur-xl'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200/70 bg-linear-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-900/15'>
              <span className='text-lg'>◫</span>
            </div>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700/80'>
                Matchflow
              </p>
              <h1 className='text-lg font-semibold text-slate-900 sm:text-xl'>
                Premium Lending Concierge
              </h1>
            </div>
          </div>
          <div className='flex items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50/80 p-1.5 text-sm font-medium text-slate-600 shadow-sm'>
            <Link
              href='/'
              className='rounded-full px-4 py-2 text-slate-700 transition hover:bg-white hover:text-emerald-700'
            >
              Client Flow
            </Link>
            <Link
              href='/admin'
              className='rounded-full px-4 py-2 text-slate-700 transition hover:bg-white hover:text-emerald-700'
            >
              Broker Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='pt-20'>
        {step === 'swipe' && (
          <SwipeDeck offers={mockOffers} onComplete={handleSwipeComplete} />
        )}

        {step === 'message' && (
          <AiClientMessage
            likedOfferIds={likedOfferIds}
            onComplete={() => setStep('booking')}
          />
        )}

        {step === 'booking' && (
          <BookingFlow
            likedOfferIds={likedOfferIds}
            onSuccess={handleBookingSuccess}
          />
        )}
      </main>
    </>
  );
}
