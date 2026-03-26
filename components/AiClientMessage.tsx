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
    const fetchMessage = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/client-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ likedOfferIds }),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setMessage(data.data || '');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch message',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [likedOfferIds]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-purple-50 to-white p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-2xl'
      >
        <div className='bg-white rounded-lg shadow-lg p-8'>
          {/* Header */}
          <h2 className='text-3xl font-bold text-gray-800 mb-2 text-center'>
            Your Personalized Message
          </h2>
          <p className='text-center text-gray-600 mb-8'>
            Here's what our AI advisor has to say about your loan interests
          </p>

          {/* Loading State */}
          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className='flex justify-center mb-8'
            >
              <Loader2 className='w-8 h-8 text-blue-500' />
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className='bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex gap-3'
            >
              <AlertCircle className='w-5 h-5 text-red-600 shrink-0 mt-0.5' />
              <div>
                <h3 className='font-semibold text-red-800'>Error</h3>
                <p className='text-red-700 text-sm'>{error}</p>
              </div>
            </motion.div>
          )}

          {/* Message Content */}
          {message && !loading && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='bg-linear-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-8 border-l-4 border-blue-500'
            >
              <p className='text-gray-800 text-lg leading-relaxed'>{message}</p>
            </motion.div>
          )}

          {/* Buttons */}
          <div className='flex gap-4 justify-center'>
            <button
              onClick={() => window.history.back()}
              className='px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition'
            >
              Back
            </button>
            <button
              onClick={() => onComplete(likedOfferIds)}
              disabled={loading || !!error}
              className='px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition'
            >
              Book a Meeting →
            </button>
          </div>
        </div>

        {/* Info Footer */}
        <div className='mt-8 text-center text-sm text-gray-600'>
          <p>
            You've selected {likedOfferIds.length} loan offer
            {likedOfferIds.length !== 1 ? 's' : ''}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
