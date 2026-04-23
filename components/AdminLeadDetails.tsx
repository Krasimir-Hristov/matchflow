'use client';

import { useState } from 'react';
import { ClientLead } from '@/lib/types';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminLeadDetailsProps {
  lead: ClientLead;
  onBack: () => void;
}

export function AdminLeadDetails({ lead, onBack }: AdminLeadDetailsProps) {
  const [prepNotes, setPrepNotes] = useState<string>('');
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);

  // Group question answers by category
  const answersByCategory = (lead.questionAnswers ?? []).reduce<
    Record<string, typeof lead.questionAnswers>
  >((acc, ans) => {
    if (!acc[ans.category]) acc[ans.category] = [];
    acc[ans.category].push(ans);
    return acc;
  }, {});

  const handleGeneratePrepNotes = async () => {
    setLoadingNotes(true);
    setNotesError(null);

    try {
      const response = await fetch('/api/agent-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead }),
      });

      const data = await response.json();

      if (data.error) {
        setNotesError(data.error);
      } else {
        setPrepNotes(data.data || '');
      }
    } catch (err) {
      setNotesError(
        err instanceof Error ? err.message : 'Failed to generate notes',
      );
    } finally {
      setLoadingNotes(false);
    }
  };

  return (
    <div className='min-h-screen bg-linear-to-b from-slate-50 to-white'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-4xl mx-auto px-4 py-6 flex items-center gap-4'>
          <button
            onClick={onBack}
            className='cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition'
          >
            <ArrowLeft className='w-6 h-6 text-gray-700' />
          </button>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              {lead.firstName} {lead.lastName}
            </h1>
            <p className='text-gray-600'>Kundentreffdetails</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Client Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='lg:col-span-1 space-y-6'
          >
            {/* Contact Card */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                Kontaktinformation
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm text-gray-600 font-semibold'>
                    E-Mail
                  </label>
                  <p className='text-gray-900 mt-1 break-all'>{lead.email}</p>
                </div>
                <div>
                  <label className='text-sm text-gray-600 font-semibold'>
                    Telefon
                  </label>
                  <p className='text-gray-900 mt-1 font-mono'>{lead.phone}</p>
                </div>
                <div>
                  <label className='text-sm text-gray-600 font-semibold'>
                    Gewünschter Betrag
                  </label>
                  <p className='text-2xl font-bold text-green-600 mt-1'>
                    {lead.desiredAmount.toLocaleString('de-DE')} EUR
                  </p>
                </div>
              </div>
            </div>

            {/* Meeting Details Card */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                Besprechungsdetails
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm text-gray-600 font-semibold'>
                    Datum
                  </label>
                  <p className='text-gray-900 mt-1 font-semibold'>
                    {new Date(lead.bookedDate).toLocaleDateString('de-DE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <label className='text-sm text-gray-600 font-semibold'>
                    Uhrzeit
                  </label>
                  <p className='text-gray-900 mt-1 font-semibold text-lg'>
                    {lead.bookedTime}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Liked Offers & Prep Notes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className='lg:col-span-2 space-y-6'
          >
            {/* Speedcheck Profile */}
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center justify-between mb-5'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  Speedcheck Profil
                </h3>
                <span className='text-xs font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1'>
                  {
                    (lead.questionAnswers ?? []).filter(
                      (a) => a.answer === 'yes',
                    ).length
                  }{' '}
                  JA
                </span>
              </div>
              {Object.keys(answersByCategory).length === 0 ? (
                <p className='text-gray-500 text-sm'>
                  Keine Speedcheck-Daten vorhanden.
                </p>
              ) : (
                <div className='space-y-5'>
                  {Object.entries(answersByCategory).map(
                    ([category, catAnswers]) => (
                      <div key={category}>
                        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2'>
                          {category}
                        </p>
                        <div className='space-y-2'>
                          {catAnswers.map((ans) => (
                            <div
                              key={ans.questionId}
                              className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${
                                ans.answer === 'yes'
                                  ? 'bg-emerald-50 border-emerald-200'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <span
                                className={`mt-0.5 shrink-0 text-sm font-bold ${
                                  ans.answer === 'yes'
                                    ? 'text-emerald-600'
                                    : 'text-slate-400'
                                }`}
                              >
                                {ans.answer === 'yes' ? '✓' : '✗'}
                              </span>
                              <div className='flex-1 min-w-0'>
                                <p className='text-sm text-gray-800 leading-snug'>
                                  {ans.questionText}
                                </p>
                              </div>
                              <span
                                className={`text-xs font-semibold uppercase rounded-full px-2 py-0.5 shrink-0 ${
                                  ans.answer === 'yes'
                                    ? 'text-emerald-700 bg-emerald-100'
                                    : 'text-slate-500 bg-slate-100'
                                }`}
                              >
                                {ans.answer === 'yes' ? 'JA' : 'NEIN'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* AI Prep Notes Card */}
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  KI-Makler-Vorbereitung
                </h3>
                <button
                  onClick={handleGeneratePrepNotes}
                  disabled={loadingNotes}
                  className={`cursor-pointer px-4 py-2 rounded-lg font-semibold transition text-sm ${
                    loadingNotes
                      ? 'cursor-not-allowed bg-gray-300 text-gray-600'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {loadingNotes ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className='inline-block'
                    >
                      ✨
                    </motion.span>
                  ) : (
                    '✨'
                  )}{' '}
                  Generate Notes
                </button>
              </div>

              {notesError && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3'
                >
                  <AlertCircle className='w-5 h-5 text-red-600 shrink-0 mt-0.5' />
                  <div>
                    <h4 className='font-semibold text-red-800'>Fehler</h4>
                    <p className='text-red-700 text-sm'>{notesError}</p>
                  </div>
                </motion.div>
              )}

              {prepNotes && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className='bg-linear-to-br from-purple-50 to-blue-50 rounded-lg p-5 border-l-4 border-purple-500'
                >
                  <p className='text-gray-800 leading-relaxed whitespace-pre-wrap'>
                    {prepNotes}
                  </p>
                </motion.div>
              )}

              {!prepNotes && !loadingNotes && !notesError && (
                <div className='text-center py-8 text-gray-600'>
                  <p className='mb-3 text-sm'>
                    Klicken Sie auf die Schaltfläche oben, um KI-gestützte
                    Vorkehrungsnoten zu generieren
                  </p>
                  <p className='text-xs text-gray-500'>
                    Unser KI-Berater analysiert die Interessen des Kunden und
                    schlägt Fokusgebiete für Ihr Treffen vor.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
