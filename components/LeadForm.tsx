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
    { value: 5000, label: '5,000 BGN' },
    { value: 10000, label: '10,000 BGN' },
    { value: 25000, label: '25,000 BGN' },
    { value: 50000, label: '50,000 BGN' },
    { value: 75000, label: '75,000 BGN' },
    { value: 100000, label: '100,000 BGN' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!/^[+\d\s\-()]{7,}$/.test(formData.phone))
      newErrors.phone = 'Invalid phone format';

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
      {/* First Name */}
      <div>
        <label
          htmlFor='firstName'
          className='block text-sm font-semibold text-gray-700 mb-2'
        >
          First Name *
        </label>
        <input
          type='text'
          id='firstName'
          name='firstName'
          value={formData.firstName}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
            errors.firstName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder='John'
        />
        {errors.firstName && (
          <p className='text-red-600 text-sm mt-1'>{errors.firstName}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label
          htmlFor='lastName'
          className='block text-sm font-semibold text-gray-700 mb-2'
        >
          Last Name *
        </label>
        <input
          type='text'
          id='lastName'
          name='lastName'
          value={formData.lastName}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
            errors.lastName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder='Doe'
        />
        {errors.lastName && (
          <p className='text-red-600 text-sm mt-1'>{errors.lastName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-semibold text-gray-700 mb-2'
        >
          Email *
        </label>
        <input
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder='john@example.com'
        />
        {errors.email && (
          <p className='text-red-600 text-sm mt-1'>{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor='phone'
          className='block text-sm font-semibold text-gray-700 mb-2'
        >
          Phone Number *
        </label>
        <input
          type='tel'
          id='phone'
          name='phone'
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder='+359 2 123 4567'
        />
        {errors.phone && (
          <p className='text-red-600 text-sm mt-1'>{errors.phone}</p>
        )}
      </div>

      {/* Desired Amount */}
      <div>
        <label
          htmlFor='desiredAmount'
          className='block text-sm font-semibold text-gray-700 mb-2'
        >
          How much would you like to borrow? *
        </label>
        <select
          id='desiredAmount'
          name='desiredAmount'
          value={formData.desiredAmount}
          onChange={handleChange}
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500'
        >
          {desiredAmountOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type='submit'
        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200'
      >
        Continue to Booking
      </button>
    </motion.form>
  );
}
