'use client';

import { useState } from 'react';
import { ClientLead } from '@/lib/types';
import { getLeads } from '@/lib/storage';
import { mockOffers } from '@/lib/mockOffers';
import { AdminLeadDetails } from '@/components/AdminLeadDetails';
import { motion } from 'framer-motion';
import { Home, Users } from 'lucide-react';

export default function AdminPage() {
  const [leads] = useState<ClientLead[]>(() => getLeads());
  const [selectedLead, setSelectedLead] = useState<ClientLead | null>(null);
  const loading = false;

  const handleBack = () => {
    setSelectedLead(null);
  };

  // If a lead is selected, show the details view
  if (selectedLead) {
    return (
      <AdminLeadDetails
        lead={selectedLead}
        offers={mockOffers}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className='min-h-screen bg-linear-to-b from-slate-50 to-white'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 py-6'>
          <div className='flex items-center gap-3 mb-2'>
            <Users className='w-8 h-8 text-blue-600' />
            <h1 className='text-3xl font-bold text-gray-900'>
              Makler-Dashboard
            </h1>
          </div>
          <p className='text-gray-600'>
            Bevorstehende Kundenbesprechungen verwalten
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'
        >
          <div className='bg-white rounded-lg shadow p-6 border-l-4 border-blue-500'>
            <p className='text-gray-600 text-sm font-semibold'>
              Gesamtbesprechungen
            </p>
            <p className='text-3xl font-bold text-gray-900 mt-2'>
              {leads.length}
            </p>
          </div>
          <div className='bg-white rounded-lg shadow p-6 border-l-4 border-green-500'>
            <p className='text-gray-600 text-sm font-semibold'>Bevorstehend</p>
            <p className='text-3xl font-bold text-gray-900 mt-2'>
              {leads.filter((l) => new Date(l.bookedDate) >= new Date()).length}
            </p>
          </div>
          <div className='bg-white rounded-lg shadow p-6 border-l-4 border-purple-500'>
            <p className='text-gray-600 text-sm font-semibold'>
              Durchschn. Kreditbetrag
            </p>
            <p className='text-2xl font-bold text-gray-900 mt-2'>
              {leads.length > 0
                ? Math.round(
                    leads.reduce((sum, l) => sum + l.desiredAmount, 0) /
                      leads.length,
                  ).toLocaleString()
                : 0}{' '}
              EUR
            </p>
          </div>
        </motion.div>

        {/* Meetings Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='bg-white rounded-lg shadow overflow-hidden'
        >
          {loading ? (
            <div className='p-12 text-center'>
              <div className='inline-block'>
                <div className='w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin' />
              </div>
              <p className='mt-4 text-gray-600'>Lädt Besprechungen...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className='p-12 text-center'>
              <Home className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                Noch keine Besprechungen
              </h3>
              <p className='text-gray-600'>
                Besprechungen werden hier angezeigt, wenn Kunden sie buchen.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-800'>
                      Kundenname
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-800'>
                      Telefon
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-800'>
                      Kreditbetrag
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-800'>
                      Datum & Uhrzeit
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-800'>
                      Status
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-800'>
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, idx) => {
                    const meetingDate = new Date(lead.bookedDate);
                    const isUpcoming = meetingDate >= new Date();

                    return (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className='border-b border-gray-200 hover:bg-gray-50 transition'
                      >
                        <td className='px-6 py-4'>
                          <p className='font-semibold text-gray-900'>
                            {lead.firstName} {lead.lastName}
                          </p>
                          <p className='text-sm text-gray-600'>{lead.email}</p>
                        </td>
                        <td className='px-6 py-4 text-gray-900 font-mono'>
                          {lead.phone}
                        </td>
                        <td className='px-6 py-4'>
                          <p className='font-semibold text-gray-900'>
                            {lead.desiredAmount.toLocaleString('de-DE')} EUR
                          </p>
                        </td>
                        <td className='px-6 py-4 text-gray-900'>
                          <p className='font-semibold'>
                            {meetingDate.toLocaleDateString('de-DE', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p className='text-sm text-gray-600'>
                            {lead.bookedTime}
                          </p>
                        </td>
                        <td className='px-6 py-4'>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isUpcoming
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {isUpcoming ? 'Bevorstehend' : 'Vorbei'}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition'
                          >
                            Details ansehen
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
