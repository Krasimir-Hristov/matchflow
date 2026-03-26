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
      {/* Date Selection */}
      <div>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          Select a Date
        </h3>

        {/* Calendar Header */}
        <div className='flex justify-between items-center mb-4'>
          <button
            onClick={handlePrevMonth}
            className='p-2 hover:bg-gray-100 rounded-lg transition'
          >
            <ChevronLeft className='w-5 h-5 text-gray-700' />
          </button>
          <h4 className='text-base font-semibold text-gray-800'>
            {monthYearString}
          </h4>
          <button
            onClick={handleNextMonth}
            className='p-2 hover:bg-gray-100 rounded-lg transition'
          >
            <ChevronRight className='w-5 h-5 text-gray-700' />
          </button>
        </div>

        {/* Weekday Labels */}
        <div className='grid grid-cols-7 gap-2 mb-2'>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className='text-center text-xs font-semibold text-gray-600'
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
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
                className={`py-2 text-sm font-medium rounded-lg transition ${
                  isDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-800 hover:border-blue-500'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            Select a Time
          </h3>
          <div className='grid grid-cols-4 gap-2'>
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-2 text-sm font-medium rounded-lg transition ${
                  selectedTime === time
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-800 hover:border-blue-500'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Submission */}
      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='bg-blue-50 p-4 rounded-lg border border-blue-200'
        >
          <p className='text-sm text-gray-700'>
            Meeting scheduled for:{' '}
            <span className='font-semibold text-blue-600'>
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
        className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200'
      >
        Confirm Booking
      </button>
    </motion.div>
  );
}
