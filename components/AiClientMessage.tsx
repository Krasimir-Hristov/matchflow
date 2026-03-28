'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';

interface AiClientMessageProps {
  likedOfferIds: string[];
  onComplete: (likedOfferIds: string[]) => void;
}

export function AiClientMessage({
  likedOfferIds,
  onComplete,
}: AiClientMessageProps) {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMessage = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/client-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ likedOfferIds }),
          signal: controller.signal,
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setMessage(data.data || '');
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(
          err instanceof Error ? err.message : 'Failed to fetch message',
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchMessage();

    return () => controller.abort();
  }, [likedOfferIds]);

  return (
    <div className='relative min-h-screen overflow-hidden px-4 py-12 sm:px-6'>
      <div className='absolute inset-0 -z-20 bg-linear-to-b from-emerald-50 via-white to-slate-100' />
      <div className='absolute left-12 top-20 -z-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl' />
      <div className='absolute right-0 top-32 -z-10 h-80 w-80 rounded-full bg-slate-300/25 blur-3xl' />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mx-auto w-full max-w-3xl'
      >
        <div className='rounded-[2rem] border border-white/70 bg-white/82 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10'>
          <div className='mb-8 text-center'>
            <p className='text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700/80'>
              Beraternotiz
            </p>
            <h2 className='mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl'>
              Ihre persönliche Finanzierungszusammenfassung
            </h2>
            <p className='mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600'>
              Unser KI-Berater hat Ihre ausgewählten Angebote zu einer
              prägnanten Empfehlung verdichtet, bevor Sie einen Termin mit einem
              Kreditspezialisten vereinbaren.
            </p>
          </div>

          <div className='mb-8 flex flex-wrap justify-center gap-3'>
            {[
              'Maßgeschneiderte Analyse',
              'Bank-Niveau-Verarbeitung',
              'Von Makler überprüfter nächster Schritt',
            ].map((badge) => (
              <span
                key={badge}
                className='rounded-full border border-slate-200/80 bg-slate-50/80 px-4 py-2 text-sm font-medium text-slate-700'
              >
                {badge}
              </span>
            ))}
          </div>

          {loading && (
            <div className='mb-8 flex min-h-56 flex-col items-center justify-center rounded-[1.75rem] border border-emerald-100 bg-linear-to-br from-emerald-50 to-white px-6 text-center'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className='mb-4'
              >
                <Loader2 className='h-8 w-8 text-emerald-700' />
              </motion.div>
              <p className='text-lg font-medium text-slate-800'>
                Vorbereitung Ihrer Empfehlung
              </p>
              <p className='mt-2 text-sm text-slate-500'>
                Wir überprüfen Ihre Auswahl und erstellen eine prägnante
                Beraternotiz.
              </p>
            </div>
          )}

          {error && !loading && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className='mb-8 flex gap-3 rounded-[1.5rem] border border-red-200 bg-red-50 p-5'
            >
              <AlertCircle className='mt-0.5 h-5 w-5 shrink-0 text-red-600' />
              <div>
                <h3 className='font-semibold text-red-800'>Fehler</h3>
                <p className='text-red-700 text-sm'>{error}</p>
              </div>
            </motion.div>
          )}

          {message && !loading && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='mb-8 rounded-[1.75rem] border border-emerald-100 bg-linear-to-br from-white via-emerald-50/70 to-slate-50 p-7 shadow-inner'
            >
              <div className='mb-4 flex items-center justify-between gap-3'>
                <p className='text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700/80'>
                  Beraternotiz
                </p>
                <span className='rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-medium text-emerald-800'>
                  {likedOfferIds.length} ausgewählt
                </span>
              </div>
              <p className='text-lg leading-8 text-slate-800'>{message}</p>
            </motion.div>
          )}

          <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
            <button
              onClick={() => window.history.back()}
              className='rounded-full border border-slate-300 bg-white cursor-pointer px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50'
            >
              Zurück
            </button>
            <button
              onClick={() => onComplete(likedOfferIds)}
              disabled={loading || !!error}
              className='rounded-full cursor-pointer bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-300'
            >
              Zur Reservierung fortfahren
            </button>
          </div>
        </div>

        <div className='mt-6 text-center text-sm text-slate-600'>
          <p>
            You selected {likedOfferIds.length} loan offer
            {likedOfferIds.length !== 1 ? 's' : ''}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
