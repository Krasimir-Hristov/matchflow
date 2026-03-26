'use client';

import { useState } from 'react';
import { Offer } from '@/lib/types';
import { SwipeCard } from './SwipeCard';
import { motion } from 'framer-motion';

interface SwipeDeckProps {
  offers: Offer[];
  onComplete: (likedOfferIds: string[]) => void;
}

export function SwipeDeck({ offers, onComplete }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedOffers, setLikedOffers] = useState<string[]>([]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setLikedOffers([...likedOffers, offers[currentIndex].id]);
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= offers.length) {
      // All cards have been swiped
      onComplete(
        direction === 'right'
          ? [...likedOffers, offers[currentIndex].id]
          : likedOffers,
      );
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const currentOffer = offers[currentIndex];

  if (!currentOffer) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-blue-50 to-white'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='text-center'
        >
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            All Done! 🎉
          </h2>
          <p className='text-gray-600 mb-6'>
            You liked {likedOffers.length} offer
            {likedOffers.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition'
          >
            Start Over
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-blue-50 to-white p-4'>
      {/* Header */}
      <div className='w-full max-w-md mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 text-center mb-2'>
          Loan Offers
        </h1>
        <div className='flex justify-center gap-2'>
          {Array.from({ length: offers.length }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx < currentIndex
                  ? 'bg-green-500 w-3'
                  : idx === currentIndex
                    ? 'bg-blue-500 w-3'
                    : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </div>
        <p className='text-center text-gray-600 mt-4 text-sm'>
          Card {currentIndex + 1} of {offers.length}
        </p>
      </div>

      {/* Swipe Card Stack */}
      <div className='relative w-full max-w-md h-96 mb-8'>
        {/* Background cards (preview) */}
        {offers.slice(currentIndex + 1, currentIndex + 3).map((_, idx) => (
          <div
            key={`bg-${idx}`}
            className='absolute w-full h-full bg-white rounded-lg shadow-md'
            style={{
              top: `${(idx + 1) * 8}px`,
              left: `${(idx + 1) * 4}px`,
              zIndex: -idx - 1,
            }}
          />
        ))}

        {/* Main card */}
        <div className='relative w-full h-full'>
          <SwipeCard
            key={currentOffer.id}
            offer={currentOffer}
            onSwipe={handleSwipe}
          />
        </div>
      </div>

      {/* Info Text */}
      <div className='text-center mb-6'>
        <p className='text-gray-700'>
          You've liked{' '}
          <span className='font-bold text-green-600'>{likedOffers.length}</span>{' '}
          offer
          {likedOffers.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
