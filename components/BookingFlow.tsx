'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LeadForm } from './LeadForm';
import { BookingCalendar } from './BookingCalendar';
import { addLead } from '@/lib/storage';
import { ClientLead } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle } from 'lucide-react';

interface BookingFlowProps {
  likedOfferIds: string[];
  onSuccess: () => void;
}

type FlowStep = 'form' | 'calendar' | 'success';

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  desiredAmount: number;
}

export function BookingFlow({ likedOfferIds, onSuccess }: BookingFlowProps) {
  const [step, setStep] = useState<FlowStep>('form');
  const [formData, setFormData] = useState<LeadFormData | null>(null);

  const handleFormSubmit = (data: LeadFormData) => {
    setFormData(data);
    setStep('calendar');
  };

  const handleBookingSubmit = (date: string, time: string) => {
    if (!formData) return;

    const newLead: ClientLead = {
      id: uuidv4(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      desiredAmount: formData.desiredAmount,
      likedOfferIds,
      bookedDate: date,
      bookedTime: time,
    };

    const success = addLead(newLead);
    if (success) {
      setStep('success');
    } else {
      alert('Failed to save booking. Please try again.');
    }
  };

  const stepOrder: FlowStep[] = ['form', 'calendar', 'success'];
  const currentStepIndex = stepOrder.indexOf(step);

  return (
    <div className='relative min-h-screen overflow-hidden px-4 py-12 sm:px-6'>
      <div className='absolute inset-0 -z-20 bg-linear-to-b from-emerald-50 via-white to-slate-100' />
      <div className='absolute left-0 top-24 -z-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl' />
      <div className='absolute right-0 bottom-16 -z-10 h-80 w-80 rounded-full bg-slate-300/25 blur-3xl' />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mx-auto w-full max-w-5xl'
      >
        <div className='grid gap-6 lg:grid-cols-[0.82fr_1.18fr]'>
          <div className='rounded-[2rem] border border-white/70 bg-slate-900 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.2)]'>
            <p className='text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300'>
              Geführte Reservierung
            </p>
            <h2 className='mt-4 text-3xl font-semibold'>
              Von Interesse zum Berateranruf Übergehen.
            </h2>
            <p className='mt-4 text-sm leading-7 text-slate-300'>
              Teilen Sie Ihre Daten mit, wählen Sie einen Termin aus, und lassen
              Sie einen Makler die beste Struktur für Ihre ausgewählten Angebote
              finalisieren.
            </p>

            <div className='mt-8 space-y-4'>
              {stepOrder.map((stepName, idx) => (
                <div
                  key={stepName}
                  className={`rounded-[1.5rem] border px-4 py-4 transition ${
                    idx === currentStepIndex
                      ? 'border-emerald-400/50 bg-emerald-400/10'
                      : idx < currentStepIndex
                        ? 'border-white/15 bg-white/8'
                        : 'border-white/10 bg-white/4'
                  }`}
                >
                  <p className='text-xs uppercase tracking-[0.22em] text-slate-400'>
                    Schritt {idx + 1}
                  </p>
                  <p className='mt-2 text-base font-medium text-white capitalize'>
                    {stepName === 'form'
                      ? 'Kundenprofil'
                      : stepName === 'calendar'
                        ? 'Besprechungstermin'
                        : 'Bestätigung'}
                  </p>
                </div>
              ))}
            </div>

            <div className='mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5'>
              <p className='text-sm text-slate-400'>Ausgewählte Angebote</p>
              <p className='mt-2 text-3xl font-semibold text-emerald-300'>
                {likedOfferIds.length}
              </p>
            </div>
          </div>

          <div className='rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl'>
            <div className='mb-8 flex justify-center gap-2'>
              {stepOrder.map((s, idx) => (
                <div
                  key={s}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? 'w-10 bg-slate-900'
                      : idx < currentStepIndex
                        ? 'w-6 bg-emerald-600'
                        : 'w-2.5 bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {step === 'form' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700/80'>
                  Schritt 1
                </p>
                <h2 className='mb-3 mt-3 text-3xl font-semibold text-slate-950'>
                  Erzählen Sie uns etwas über sich
                </h2>
                <p className='mb-8 max-w-2xl text-sm leading-7 text-slate-600'>
                  Wir verwenden diese Daten, um Sie mit dem richtigen Makler
                  abzugleichen und die Finanzierungsdiskussion anzupassen.
                </p>
                <LeadForm onSubmit={handleFormSubmit} />
              </motion.div>
            )}

            {step === 'calendar' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700/80'>
                  Schritt 2
                </p>
                <h2 className='mb-3 mt-3 text-3xl font-semibold text-slate-950'>
                  Termin buchen
                </h2>
                <p className='mb-8 max-w-2xl text-sm leading-7 text-slate-600'>
                  Wählen Sie einen Wochentag aus, der für Sie passt. Ihr Berater
                  wird bereits Ihre ausgewählten Angebote vor dem Anruf haben.
                </p>
                <BookingCalendar onSubmit={handleBookingSubmit} />

                <button
                  onClick={() => setStep('form')}
                  className='mt-4 cursor-pointer w-full rounded-full border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50'
                >
                  Zurück zu Details
                </button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className='text-center'
              >
                <div className='mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100'>
                  <CheckCircle className='h-10 w-10 text-emerald-700' />
                </div>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700/80'>
                  Schritt 3
                </p>
                <h2 className='mb-3 mt-3 text-3xl font-semibold text-slate-950'>
                  Reservierung bestätigt
                </h2>
                <p className='mx-auto max-w-xl text-base leading-7 text-slate-600'>
                  Vielen Dank,{' '}
                  <span className='font-semibold'>{formData?.firstName}</span>.
                  Ein Makler aus unserem Team wird Sie unter{' '}
                  <span className='font-semibold'>{formData?.phone}</span>{' '}
                  kontaktieren und mit den ausgewählten Finanzierungsoptionen
                  fortfahren.
                </p>

                <div className='mx-auto mb-6 mt-8 max-w-md rounded-[1.5rem] border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-5'>
                  <p className='text-sm text-slate-700'>
                    <span className='font-semibold'>Buchungsstatus:</span>{' '}
                    Reserviert und warten auf Bestätigung durch Berater.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/';
                    }
                    onSuccess();
                  }}
                  className='w-full rounded-full bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800'
                >
                  Zu Angeboten zurück
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <div className='mt-6 text-center text-sm text-slate-600'>
          <p>
            Ausgewählte {likedOfferIds.length} Kreditangebot
            {likedOfferIds.length !== 1 ? 'e' : ''}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
