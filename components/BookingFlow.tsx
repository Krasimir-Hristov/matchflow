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

export function BookingFlow({ likedOfferIds, onSuccess }: BookingFlowProps) {
  const [step, setStep] = useState<FlowStep>('form');
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    desiredAmount: number;
  } | null>(null);

  const handleFormSubmit = (data: any) => {
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

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-green-50 to-white p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <div className='bg-white rounded-lg shadow-lg p-8'>
          {/* Step Indicator */}
          <div className='flex justify-center gap-2 mb-8'>
            {['form', 'calendar', 'success'].map((s, idx) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  step === s
                    ? 'bg-green-500 w-8'
                    : ['form', 'calendar'].includes(step) &&
                        ['form', 'calendar'].indexOf(s) <
                          ['form', 'calendar'].indexOf(step)
                      ? 'bg-green-500 w-3'
                      : 'bg-gray-300 w-3'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Lead Form */}
          {step === 'form' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                Tell us about yourself
              </h2>
              <LeadForm onSubmit={handleFormSubmit} />
            </motion.div>
          )}

          {/* Step 2: Booking Calendar */}
          {step === 'calendar' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                Book Your Meeting
              </h2>
              <BookingCalendar onSubmit={handleBookingSubmit} />

              <button
                onClick={() => setStep('form')}
                className='w-full mt-4 px-4 py-2 text-gray-600 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition'
              >
                ← Back
              </button>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className='text-center'
            >
              <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                Booking Confirmed! ✓
              </h2>
              <p className='text-gray-600 mb-4'>
                Thank you,{' '}
                <span className='font-semibold'>{formData?.firstName}</span>!
              </p>
              <p className='text-gray-600 mb-6'>
                A broker from our team will contact you at{' '}
                <span className='font-semibold'>{formData?.phone}</span> for
                your meeting.
              </p>

              <div className='bg-green-50 p-4 rounded-lg mb-6'>
                <p className='text-sm text-gray-700'>
                  <span className='font-semibold'>Meeting Date:</span>{' '}
                  {formData && likedOfferIds.length > 0
                    ? new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        parseInt(new Date().toISOString().split('-')[2]),
                      ).toLocaleDateString('bg-BG', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'TBD'}
                </p>
              </div>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/';
                  }
                  onSuccess();
                }}
                className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition'
              >
                Start Over
              </button>
            </motion.div>
          )}
        </div>

        {/* Info Footer */}
        <div className='mt-8 text-center text-sm text-gray-600'>
          <p>
            Selected {likedOfferIds.length} loan offer
            {likedOfferIds.length !== 1 ? 's' : ''}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
