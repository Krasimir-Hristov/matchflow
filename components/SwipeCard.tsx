'use client';

import Image from 'next/image';
import { Offer } from '@/lib/types';
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  PanInfo,
} from 'framer-motion';

interface SwipeCardProps {
  offer: Offer;
  onSwipe: (direction: 'left' | 'right') => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BGN',
    maximumFractionDigits: 0,
  }).format(amount);

const getMonthlyPayment = (amount: number, yearlyRate: number) => {
  const monthlyRate = yearlyRate / 100 / 12;
  const termMonths = 36;

  if (monthlyRate === 0) {
    return amount / termMonths;
  }

  return (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
};

const getOfferHighlights = (title: string) => {
  if (title.toLowerCase().includes('business')) {
    return ['Flexible terms', 'Dedicated advisor', 'Rapid underwriting'];
  }

  if (title.toLowerCase().includes('green')) {
    return ['Sustainability incentive', 'Low-rate window', 'Upgrade funding'];
  }

  if (title.toLowerCase().includes('startup')) {
    return ['Asset leasing', 'Founder-focused', 'Fast document review'];
  }

  return ['Fast approval', 'Transparent pricing', 'Fixed repayment plan'];
};

export function SwipeCard({ offer, onSwipe }: SwipeCardProps) {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-20, 0, 20]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const skipOpacity = useTransform(x, [-80, 0], [1, 0]);
  const monthlyPayment = getMonthlyPayment(offer.maxAmount, offer.interestRate);
  const highlights = getOfferHighlights(offer.title);

  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const swipeThreshold = 100;
    const offset = info.offset.x;

    if (Math.abs(offset) > swipeThreshold) {
      const direction = offset > 0 ? 'right' : 'left';
      await controls.start({
        x: direction === 'right' ? 500 : -500,
        opacity: 0,
        transition: { duration: 0.3 },
      });
      onSwipe(direction);
    } else {
      controls.start({
        x: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 500, damping: 30 },
      });
    }
  };

  return (
    <motion.div
      drag='x'
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      animate={controls}
      style={{ x, rotate }}
      initial={{ scale: 0.95, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      whileDrag={{ scale: 1.01 }}
      className='absolute h-full w-full cursor-grab rounded-[2rem] border border-white/70 bg-white/88 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl active:cursor-grabbing sm:p-6'
    >
      <motion.div
        style={{ opacity: likeOpacity }}
        className='pointer-events-none absolute right-6 top-6 z-10 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-sm'
      >
        Shortlist
      </motion.div>
      <motion.div
        style={{ opacity: skipOpacity }}
        className='pointer-events-none absolute left-6 top-6 z-10 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm'
      >
        Pass
      </motion.div>

      <div className='flex h-full flex-col'>
        <div className='mb-4 flex items-center justify-between gap-3'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700/80'>
              Tailored lending option
            </p>
            <h2 className='mt-2 text-2xl font-semibold text-slate-950'>
              {offer.title}
            </h2>
          </div>
          <div className='rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800'>
            {offer.interestRate}% APR
          </div>
        </div>

        <div className='relative mb-5 overflow-hidden rounded-[1.5rem] bg-slate-200'>
          <div className='absolute inset-0 z-10 bg-linear-to-t from-slate-950/35 via-transparent to-transparent' />
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            fill
            sizes='(max-width: 640px) 100vw, 420px'
            className='object-cover'
          />
          <div className='absolute bottom-4 left-4 z-20 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md'>
            Premium reviewed offer
          </div>
        </div>

        <p className='mb-5 text-sm leading-7 text-slate-600'>
          {offer.description}
        </p>

        <div className='grid gap-3 sm:grid-cols-3'>
          <div className='rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-4'>
            <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
              Maximum amount
            </p>
            <p className='mt-2 text-lg font-semibold text-slate-950'>
              {formatCurrency(offer.maxAmount)}
            </p>
          </div>
          <div className='rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-4'>
            <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
              Indicative APR
            </p>
            <p className='mt-2 text-lg font-semibold text-emerald-700'>
              {offer.interestRate}%
            </p>
          </div>
          <div className='rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-4'>
            <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
              Monthly estimate
            </p>
            <p className='mt-2 text-lg font-semibold text-slate-950'>
              {formatCurrency(Math.round(monthlyPayment))}
            </p>
          </div>
        </div>

        <div className='mt-5 flex flex-wrap gap-2'>
          {highlights.map((highlight) => (
            <span
              key={highlight}
              className='rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800'
            >
              {highlight}
            </span>
          ))}
        </div>

        <div className='mt-auto flex items-center justify-between gap-3 pt-6 text-sm text-slate-500'>
          <div className='rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm'>
            Swipe left to skip
          </div>
          <div className='rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 font-medium text-emerald-800 shadow-sm'>
            Swipe right to shortlist
          </div>
        </div>
      </div>
    </motion.div>
  );
}
