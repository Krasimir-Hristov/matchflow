'use client';

import { useState } from 'react';
import { Offer } from '@/lib/types';
import { SwipeCard } from './SwipeCard';
import { motion, AnimatePresence } from 'framer-motion';

interface SwipeDeckProps {
  offers: Offer[];
  onComplete: (likedOfferIds: string[]) => void;
}

export function SwipeDeck({ offers, onComplete }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedOffers, setLikedOffers] = useState<string[]>([]);
  const completion = offers.length
    ? Math.round((currentIndex / offers.length) * 100)
    : 0;

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
      <div className='relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16'>
        <div className='absolute inset-0 bg-linear-to-b from-emerald-50 via-white to-slate-100' />
        <div className='absolute -left-24 top-24 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl' />
        <div className='absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-slate-300/30 blur-3xl' />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='relative w-full max-w-2xl rounded-[2rem] border border-white/60 bg-white/85 p-10 text-center shadow-[0_30px_90px_rgba(31,41,55,0.12)] backdrop-blur-xl'
        >
          <p className='mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700/80'>
            Review complete
          </p>
          <h2 className='mb-4 text-4xl font-semibold text-slate-900'>
            Your curated shortlist is ready.
          </h2>
          <p className='mx-auto mb-8 max-w-xl text-base leading-7 text-slate-600'>
            You liked {likedOffers.length} offer
            {likedOffers.length !== 1 ? 's' : ''}. Continue to receive a guided
            recommendation and schedule a consultation.
          </p>
          <button
            onClick={() => window.location.reload()}
            className='rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800'
          >
            Review again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='relative isolate min-h-screen overflow-hidden px-4 pb-12 pt-10 sm:px-6 lg:px-8'>
      <div className='absolute inset-0 -z-20 bg-linear-to-b from-emerald-50 via-[#f7faf8] to-slate-100' />
      <div className='absolute left-1/2 top-28 -z-10 h-136 w-136 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl' />
      <div className='absolute right-0 top-0 -z-10 h-80 w-80 rounded-full bg-slate-300/25 blur-3xl' />

      <div className='mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'>
        <div className='max-w-2xl'>
          <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800 shadow-sm backdrop-blur'>
            Curated lending offers
          </div>
          <h1 className='mt-6 max-w-xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl'>
            Premium financing, presented like a private advisory desk.
          </h1>
          <p className='mt-5 max-w-xl text-lg leading-8 text-slate-600'>
            Compare pre-selected offers in a refined swipe flow built for trust,
            speed, and clarity. Every card highlights the terms that matter
            before you speak to a broker.
          </p>

          <div className='mt-8 flex flex-wrap gap-3'>
            {[
              'Bank-grade review',
              'Curated lenders',
              'Human advisor follow-up',
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
              <p className='text-sm text-slate-500'>Current review</p>
              <p className='mt-2 text-2xl font-semibold text-slate-900'>
                {currentIndex + 1}/{offers.length}
              </p>
            </div>
            <div className='rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur'>
              <p className='text-sm text-slate-500'>Liked offers</p>
              <p className='mt-2 text-2xl font-semibold text-emerald-700'>
                {likedOffers.length}
              </p>
            </div>
            <div className='rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur'>
              <p className='text-sm text-slate-500'>Progress</p>
              <p className='mt-2 text-2xl font-semibold text-slate-900'>
                {completion}%
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl'>
            <div className='mb-5 flex items-center justify-between gap-4'>
              <div>
                <p className='text-sm font-medium uppercase tracking-[0.2em] text-slate-500'>
                  Offer stack
                </p>
                <p className='mt-2 text-sm text-slate-600'>
                  Swipe right to shortlist, left to skip.
                </p>
              </div>
              <div className='flex gap-2'>
                {Array.from({ length: offers.length }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`rounded-full transition-all ${
                      idx < currentIndex
                        ? 'h-2.5 w-7 bg-emerald-600'
                        : idx === currentIndex
                          ? 'h-2.5 w-10 bg-slate-900'
                          : 'h-2.5 w-2.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className='relative h-136 w-full'>
              {offers
                .slice(currentIndex + 1, currentIndex + 3)
                .map((offer, idx) => (
                  <div
                    key={offer.id}
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
                <SwipeCard
                  key={currentOffer.id}
                  offer={currentOffer}
                  onSwipe={handleSwipe}
                />
              </AnimatePresence>
            </div>
          </div>

          <div className='flex items-center justify-between rounded-[1.5rem] border border-white/70 bg-slate-900 px-5 py-4 text-slate-50 shadow-[0_16px_45px_rgba(15,23,42,0.18)]'>
            <p className='text-sm text-slate-300'>Shortlisted so far</p>
            <p className='text-lg font-semibold'>
              {likedOffers.length} offer{likedOffers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
