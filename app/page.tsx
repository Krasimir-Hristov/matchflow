'use client';

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

  const handleMessageComplete = (offers: string[]) => {
    setStep('booking');
  };

  const handleBookingSuccess = () => {
    // Reset flow
    setStep('swipe');
    setLikedOfferIds([]);
  };

  return (
    <>
      {/* Navigation */}
      <nav className='fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50'>
        <div className='max-w-7xl mx-auto px-4 py-4 flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-blue-600'>💳 FinTech Promo</h1>
          <div className='flex gap-4'>
            <a
              href='/'
              className='text-gray-700 hover:text-blue-600 font-semibold transition'
            >
              Client Flow
            </a>
            <a
              href='/admin'
              className='text-gray-700 hover:text-blue-600 font-semibold transition'
            >
              Broker Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='pt-16'>
        {step === 'swipe' && (
          <SwipeDeck offers={mockOffers} onComplete={handleSwipeComplete} />
        )}

        {step === 'message' && (
          <AiClientMessage
            likedOfferIds={likedOfferIds}
            onComplete={handleMessageComplete}
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
