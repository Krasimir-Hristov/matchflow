'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface LeadFormProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    desiredAmount: number;
  }) => void;
}

export function LeadForm({ onSubmit }: LeadFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    desiredAmount: 10000,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const desiredAmountOptions = [
    { value: 5000, label: '5.000 EUR' },
    { value: 10000, label: '10.000 EUR' },
    { value: 25000, label: '25.000 EUR' },
    { value: 50000, label: '50.000 EUR' },
    { value: 75000, label: '75.000 EUR' },
    { value: 100000, label: '100.000 EUR' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = 'Vorname ist erforderlich';
    if (!formData.lastName.trim())
      newErrors.lastName = 'Nachname ist erforderlich';
    if (!formData.email.trim()) newErrors.email = 'E-Mail ist erforderlich';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Ungültiges E-Mail-Format';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon ist erforderlich';
    if (!/^[+\d\s\-()]{7,}$/.test(formData.phone))
      newErrors.phone = 'Ungültiges Telefonformat';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'desiredAmount' ? parseInt(value) : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className='space-y-5'
    >
      <div>
        <label
          htmlFor='firstName'
          className='mb-2 block text-sm font-semibold text-slate-700'
        >
          Vorname *
        </label>
        <input
          type='text'
          id='firstName'
          name='firstName'
          value={formData.firstName}
          onChange={handleChange}
          className={`w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
            errors.firstName ? 'border-red-500' : 'border-slate-300'
          }`}
          placeholder='Max'
        />
        {errors.firstName && (
          <p className='text-red-600 text-sm mt-1'>{errors.firstName}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='lastName'
          className='mb-2 block text-sm font-semibold text-slate-700'
        >
          Nachname *
        </label>
        <input
          type='text'
          id='lastName'
          name='lastName'
          value={formData.lastName}
          onChange={handleChange}
          className={`w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
            errors.lastName ? 'border-red-500' : 'border-slate-300'
          }`}
          placeholder='Müller'
        />
        {errors.lastName && (
          <p className='text-red-600 text-sm mt-1'>{errors.lastName}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='email'
          className='mb-2 block text-sm font-semibold text-slate-700'
        >
          E-Mail *
        </label>
        <input
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          className={`w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
            errors.email ? 'border-red-500' : 'border-slate-300'
          }`}
          placeholder='john@example.com'
        />
        {errors.email && (
          <p className='text-red-600 text-sm mt-1'>{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='phone'
          className='mb-2 block text-sm font-semibold text-slate-700'
        >
          Telefonnummer *
        </label>
        <input
          type='tel'
          id='phone'
          name='phone'
          value={formData.phone}
          onChange={handleChange}
          className={`w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
            errors.phone ? 'border-red-500' : 'border-slate-300'
          }`}
          placeholder='+49 30 123 4567'
        />
        {errors.phone && (
          <p className='text-red-600 text-sm mt-1'>{errors.phone}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='desiredAmount'
          className='mb-2 block text-sm font-semibold text-slate-700'
        >
          Wie viel möchten Sie leihen? *
        </label>
        <select
          id='desiredAmount'
          name='desiredAmount'
          value={formData.desiredAmount}
          onChange={handleChange}
          className='w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500'
        >
          {desiredAmountOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type='submit'
        className='w-full cursor-pointer rounded-full bg-emerald-700 px-4 py-3 font-semibold text-white transition duration-200 hover:bg-emerald-800'
      >
        Zur Reservierung fortfahren
      </button>
    </motion.form>
  );
}
