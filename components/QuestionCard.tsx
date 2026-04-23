'use client';

import { Question } from '@/lib/types';
import { Heart, X, ChevronRight } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  PanInfo,
} from 'framer-motion';

interface QuestionCardProps {
  question: Question;
  onSwipe: (direction: 'left' | 'right') => void;
  questionNumber: number;
  totalQuestions: number;
}

const categoryColors: Record<string, string> = {
  Familienstand: 'text-violet-700/80',
  Arbeitsvertrag: 'text-blue-700/80',
  'Monatliches Netto-Einkommen': 'text-emerald-700/80',
  Wohnsituation: 'text-amber-700/80',
  Immobilienbesitz: 'text-rose-700/80',
  Immobiliendetails: 'text-orange-700/80',
};

const categoryBg: Record<string, string> = {
  Familienstand: 'bg-violet-50 border-violet-200/70',
  Arbeitsvertrag: 'bg-blue-50 border-blue-200/70',
  'Monatliches Netto-Einkommen': 'bg-emerald-50 border-emerald-200/70',
  Wohnsituation: 'bg-amber-50 border-amber-200/70',
  Immobilienbesitz: 'bg-rose-50 border-rose-200/70',
  Immobiliendetails: 'bg-orange-50 border-orange-200/70',
};

export function QuestionCard({
  question,
  onSwipe,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const jaOpacity = useTransform(x, [0, 80], [0, 1]);
  const neinOpacity = useTransform(x, [-80, 0], [1, 0]);

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

  const colorClass = categoryColors[question.category] ?? 'text-emerald-700/80';
  const bgClass =
    categoryBg[question.category] ?? 'bg-emerald-50 border-emerald-200/70';
  const hasSubQuestions =
    question.subQuestions && question.subQuestions.length > 0;

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
      {/* JA indicator */}
      <motion.div
        style={{ opacity: jaOpacity }}
        className='pointer-events-none absolute right-6 top-6 z-10 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-sm'
      >
        JA
      </motion.div>

      {/* NEIN indicator */}
      <motion.div
        style={{ opacity: neinOpacity }}
        className='pointer-events-none absolute left-6 top-6 z-10 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm'
      >
        NEIN
      </motion.div>

      <div className='flex h-full flex-col'>
        {/* Category badge */}
        <div className='mb-5'>
          <span
            className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${bgClass} ${colorClass}`}
          >
            {question.category}
          </span>
        </div>

        {/* Question number */}
        <p className='mb-3 text-xs font-medium text-slate-400 uppercase tracking-[0.2em]'>
          Frage {questionNumber} von {totalQuestions}
        </p>

        {/* Main question text */}
        <div className='flex flex-1 items-center'>
          <h2 className='text-2xl font-semibold leading-snug text-slate-950 sm:text-3xl'>
            {question.text}
          </h2>
        </div>

        {/* Sub-questions indicator */}
        {hasSubQuestions && (
          <div className='mb-4 flex items-center gap-2 rounded-[1.25rem] border border-slate-200/60 bg-slate-50/80 px-4 py-3'>
            <ChevronRight className='h-4 w-4 text-slate-400' />
            <p className='text-xs font-medium text-slate-500'>
              JA öffnet {question.subQuestions!.length} weitere{' '}
              {question.subQuestions!.length === 1
                ? 'Folgefrage'
                : 'Folgefragen'}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className='flex items-center justify-center gap-6 pt-4'>
          <button
            onClick={() => animateSwipe('left')}
            className='flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-rose-200 bg-white shadow-md transition hover:bg-rose-50 hover:border-rose-300'
            aria-label='Nein'
          >
            <X className='h-6 w-6 text-rose-500' />
          </button>
          <div className='flex flex-col items-center gap-1'>
            <p className='text-xs font-medium text-slate-400 uppercase tracking-widest'>
              NEIN
            </p>
            <div className='h-px w-12 bg-slate-200' />
            <p className='text-xs font-medium text-emerald-600 uppercase tracking-widest'>
              JA
            </p>
          </div>
          <button
            onClick={() => animateSwipe('right')}
            className='flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-emerald-200 bg-white shadow-md transition hover:bg-emerald-50 hover:border-emerald-300'
            aria-label='Ja'
          >
            <Heart className='h-6 w-6 text-emerald-500' />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
