'use client';

import { Offer } from '@/lib/types';
import { Heart, X } from 'lucide-react';
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
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
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
  const normalizedTitle = title.toLowerCase();

  if (
    normalizedTitle.includes('unternehmen') ||
    normalizedTitle.includes('betrieb') ||
    normalizedTitle.includes('kanzlei') ||
    normalizedTitle.includes('praxis')
  ) {
    return ['Flexible Laufzeit', 'Persoenliche Beratung', 'Schnelle Pruefung'];
  }

  if (
    normalizedTitle.includes('energie') ||
    normalizedTitle.includes('elektro') ||
    normalizedTitle.includes('hybrid')
  ) {
    return [
      'Nachhaltiger Fokus',
      'Guenstiger Zinssatz',
      'Foerderfaehige Investition',
    ];
  }

  if (
    normalizedTitle.includes('startup') ||
    normalizedTitle.includes('technik') ||
    normalizedTitle.includes('e-commerce')
  ) {
    return [
      'Digitale Abwicklung',
      'Wachstumsorientiert',
      'Kurze Bearbeitungszeit',
    ];
  }

  return ['Schnelle Zusage', 'Transparente Konditionen', 'Planbare Monatsrate'];
};

export function SwipeCard({ offer, onSwipe }: SwipeCardProps) {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-20, 0, 20]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const skipOpacity = useTransform(x, [-80, 0], [1, 0]);
  const monthlyPayment = getMonthlyPayment(offer.maxAmount, offer.interestRate);
  const highlights = getOfferHighlights(offer.title);

  const animateSwipe = async (direction: 'left' | 'right') => {
    await controls.start({
      x: direction === 'right' ? 500 : -500,
      opacity: 0,
      transition: { duration: 0.3 },
    });
    onSwipe(direction);
  };

  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const swipeThreshold = 100;
    const offset = info.offset.x;

    if (Math.abs(offset) > swipeThreshold) {
      const direction = offset > 0 ? 'right' : 'left';
      await animateSwipe(direction);
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
        Merken
      </motion.div>
      <motion.div
        style={{ opacity: skipOpacity }}
        className='pointer-events-none absolute left-6 top-6 z-10 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm'
      >
        Weiter
      </motion.div>

      <div className='flex h-full flex-col'>
        <div className='mb-4 flex items-center justify-between gap-3'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700/80'>
              Ausgewaehltes Finanzierungsangebot
            </p>
            <h2 className='mt-2 text-2xl font-semibold text-slate-950'>
              {offer.title}
            </h2>
          </div>
          <div className='rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800'>
            {offer.interestRate}% Sollzins
          </div>
        </div>

        <div className='mb-4 rounded-[1.5rem] border border-emerald-200/50 bg-emerald-50/50 p-3'>
          <div className='inline-flex gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700'>
            <span className='text-emerald-500'>✓</span>
            Premium geprueft
          </div>
        </div>

        <p className='mb-5 text-sm leading-7 text-slate-600'>
          {offer.description}
        </p>

        <div className='grid gap-3 sm:grid-cols-2'>
          <div className='rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-4'>
            <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
              Kreditrahmen
            </p>
            <p className='mt-2 text-lg font-semibold text-slate-950'>
              {formatCurrency(offer.maxAmount)}
            </p>
          </div>
          <div className='flex flex-col justify-center rounded-[1.25rem] border border-emerald-200/60 bg-linear-to-br from-emerald-50 to-teal-50 p-4 overflow-hidden relative'>
            <div className='absolute -right-4 -top-4 h-16 w-16 rounded-full bg-emerald-200/40' />
            <div className='absolute -bottom-3 -left-3 h-10 w-10 rounded-full bg-teal-200/50' />
            <div className='relative flex items-center gap-2'>
              <div className='flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20'>
                <span className='text-emerald-700 text-xs'>✦</span>
              </div>
              <span className='text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700'>
                Top Angebot
              </span>
            </div>
            <div className='relative mt-1.5 flex gap-1'>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i <= 4 ? 'bg-emerald-400' : 'bg-emerald-100'}`}
                />
              ))}
            </div>
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

        <div className='mt-auto flex items-center justify-center gap-6 pt-6'>
          <button
            type='button'
            aria-label='Angebot ueberspringen'
            onClick={() => void animateSwipe('left')}
            className='group cursor-pointer flex h-16 w-16 items-center justify-center rounded-full border-2 border-rose-200 bg-white text-rose-500 shadow-[0_12px_30px_rgba(244,63,94,0.14)] transition hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-600 hover:shadow-[0_18px_36px_rgba(244,63,94,0.18)]'
          >
            <X
              className='h-7 w-7 transition group-hover:scale-110'
              strokeWidth={2.5}
            />
          </button>
          <button
            type='button'
            aria-label='Angebot merken'
            onClick={() => void animateSwipe('right')}
            className='group cursor-pointer flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-200 bg-linear-to-br from-emerald-50 to-white text-emerald-600 shadow-[0_14px_34px_rgba(16,185,129,0.16)] transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-[0_20px_40px_rgba(16,185,129,0.22)]'
          >
            <Heart
              className='h-8 w-8 fill-current transition group-hover:scale-110'
              strokeWidth={2.2}
            />
          </button>
        </div>

        <div className='mt-4 flex items-center justify-center gap-8 text-xs font-medium uppercase tracking-[0.16em] text-slate-400'>
          <span>Skip</span>
          <span>Like</span>
        </div>
      </div>
    </motion.div>
  );
}
