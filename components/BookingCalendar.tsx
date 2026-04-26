'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getLeads } from '@/lib/storage';

interface BookingCalendarProps {
  onSubmit: (date: string, time: string) => void;
}

export function BookingCalendar({ onSubmit }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());

  // Load booked slots from storage
  useEffect(() => {
    try {
      const leads = getLeads();
      const slots = new Set<string>();
      leads.forEach((lead) => {
        slots.add(`${lead.bookedDate}_${lead.bookedTime}`);
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBookedSlots(slots);
    } catch (error) {
      console.error('Error loading booked slots:', error);
    }
  }, []);

  // Check if a time slot is already booked
  const isTimeSlotBooked = (date: string, time: string) => {
    return bookedSlots.has(`${date}_${time}`);
  };

  // Time slot options
  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const formatDateString = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${month}-${d}`;
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    date.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0 || date.getDay() === 6; // Disable past dates and weekends
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      onSubmit(selectedDate, selectedTime);
    }
  };

  const monthYearString = currentMonth.toLocaleString('de-DE', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-6'
    >
      <div>
        <h3 className='mb-4 text-lg font-semibold text-slate-900'>
          Datum wählen
        </h3>

        <div className='mb-4 flex items-center justify-between'>
          <button
            onClick={handlePrevMonth}
            className='cursor-pointer rounded-full border border-slate-200 bg-white p-2 transition hover:bg-slate-50'
          >
            <ChevronLeft className='h-5 w-5 text-slate-700' />
          </button>
          <h4 className='text-base font-semibold text-slate-900'>
            {monthYearString}
          </h4>
          <button
            onClick={handleNextMonth}
            className='cursor-pointer rounded-full border border-slate-200 bg-white p-2 transition hover:bg-slate-50'
          >
            <ChevronRight className='h-5 w-5 text-slate-700' />
          </button>
        </div>

        <div className='grid grid-cols-7 gap-2 mb-2'>
          {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map((day) => (
            <div
              key={day}
              className='text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500'
            >
              {day}
            </div>
          ))}
        </div>

        <div className='grid grid-cols-7 gap-2'>
          {calendarDays.map((day, idx) => {
            const dateString = day ? formatDateString(day) : '';
            const isDisabled = day ? isDateDisabled(day) : true;
            const isSelected = selectedDate === dateString;

            return (
              <button
                key={idx}
                onClick={() => {
                  if (!isDisabled) {
                    setSelectedDate(dateString);
                  }
                }}
                disabled={isDisabled}
                className={`rounded-2xl py-2.5 text-sm font-medium transition ${
                  isDisabled
                    ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                    : isSelected
                      ? 'cursor-pointer bg-emerald-700 text-white shadow-lg shadow-emerald-900/15'
                      : 'cursor-pointer border border-slate-200 bg-white text-slate-800 hover:border-emerald-500'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className='mb-4 text-lg font-semibold text-slate-900'>
            Zeit wählen
          </h3>
          <div className='grid grid-cols-4 gap-2'>
            {timeSlots.map((time) => {
              const isBooked = isTimeSlotBooked(selectedDate, time);
              return (
                <button
                  key={time}
                  onClick={() => !isBooked && setSelectedTime(time)}
                  disabled={isBooked}
                  className={`rounded-2xl py-2.5 text-sm font-medium transition ${
                    isBooked
                      ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'
                      : selectedTime === time
                        ? 'cursor-pointer bg-slate-900 text-white'
                        : 'cursor-pointer border border-slate-200 bg-white text-slate-800 hover:border-emerald-500'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='rounded-[1.5rem] border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-4'
        >
          <p className='text-sm text-slate-700'>
            Besprechung geplant für:{' '}
            <span className='font-semibold text-emerald-700'>
              {(() => { const [y, m, d] = selectedDate.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('de-DE', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              }); })()}{' '}
              at {selectedTime}
            </span>
          </p>
        </motion.div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedDate || !selectedTime}
        className='w-full cursor-pointer rounded-full bg-emerald-700 px-4 py-3 font-semibold text-white transition duration-200 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300'
      >
        Reservierung bestätigen
      </button>
    </motion.div>
  );
}
