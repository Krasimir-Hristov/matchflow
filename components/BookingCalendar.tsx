'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCalendarProps {
  onSubmit: (date: string, time: string) => void;
}

export function BookingCalendar({ onSubmit }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    return date.toISOString().split('T')[0];
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

  const monthYearString = currentMonth.toLocaleString('en-US', {
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
          Select a Date
        </h3>

        <div className='mb-4 flex items-center justify-between'>
          <button
            onClick={handlePrevMonth}
            className='rounded-full border border-slate-200 bg-white p-2 transition hover:bg-slate-50'
          >
            <ChevronLeft className='h-5 w-5 text-slate-700' />
          </button>
          <h4 className='text-base font-semibold text-slate-900'>
            {monthYearString}
          </h4>
          <button
            onClick={handleNextMonth}
            className='rounded-full border border-slate-200 bg-white p-2 transition hover:bg-slate-50'
          >
            <ChevronRight className='h-5 w-5 text-slate-700' />
          </button>
        </div>

        <div className='grid grid-cols-7 gap-2 mb-2'>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
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
                      ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-900/15'
                      : 'border border-slate-200 bg-white text-slate-800 hover:border-emerald-500'
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
            Select a Time
          </h3>
          <div className='grid grid-cols-4 gap-2'>
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`rounded-2xl py-2.5 text-sm font-medium transition ${
                  selectedTime === time
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-white text-slate-800 hover:border-emerald-500'
                }`}
              >
                {time}
              </button>
            ))}
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
            Meeting scheduled for:{' '}
            <span className='font-semibold text-emerald-700'>
              {new Date(selectedDate).toLocaleDateString('bg-BG', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}{' '}
              at {selectedTime}
            </span>
          </p>
        </motion.div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedDate || !selectedTime}
        className='w-full rounded-full bg-emerald-700 px-4 py-3 font-semibold text-white transition duration-200 hover:bg-emerald-800 disabled:bg-slate-300'
      >
        Confirm Booking
      </button>
    </motion.div>
  );
}
