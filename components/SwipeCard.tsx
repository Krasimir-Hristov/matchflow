'use client';

import { Offer } from '@/lib/types';
import { motion } from 'framer-motion';
import { useMotionValue, useTransform } from 'framer-motion';

interface SwipeCardProps {
  offer: Offer;
  onSwipe: (direction: 'left' | 'right') => void;
}

export function SwipeCard({ offer, onSwipe }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 100;

    if (info.offset.x > swipeThreshold) {
      onSwipe('right');
    } else if (info.offset.x < -swipeThreshold) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      drag='x'
      dragConstraints={{ left: -200, right: 200 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      className='absolute w-full h-full bg-white rounded-lg shadow-lg p-6 cursor-grab active:cursor-grabbing'
    >
      <div className='flex flex-col h-full'>
        {/* Offer Image */}
        <div className='relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-200'>
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className='w-full h-full object-cover'
          />
        </div>

        {/* Offer Details */}
        <div className='flex-1'>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            {offer.title}
          </h2>
          <p className='text-gray-600 mb-4'>{offer.description}</p>

          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='font-semibold text-gray-700'>Max Amount:</span>
              <span className='text-green-600 font-bold'>
                {offer.maxAmount.toLocaleString()} BGN
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='font-semibold text-gray-700'>
                Interest Rate:
              </span>
              <span className='text-blue-600 font-bold'>
                {offer.interestRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Swipe Indicators */}
        <div className='flex justify-between mt-6 text-sm text-gray-500'>
          <span>👈 Swipe left to skip</span>
          <span>Swipe right to like 👉</span>
        </div>
      </div>
    </motion.div>
  );
}
