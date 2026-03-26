import { Offer } from './types';

/**
 * Mock loan offers for the FinTech Promo App
 */

export const mockOffers: Offer[] = [
  {
    id: 'offer_1',
    title: 'Business Growth Loan',
    description:
      'Perfect for expanding your business. Flexible terms up to 100,000 BGN.',
    maxAmount: 100000,
    interestRate: 5.5,
    imageUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
  },
  {
    id: 'offer_2',
    title: 'Consumer Personal Loan',
    description:
      'Fast approval for your personal needs. Borrow from 1,000 to 50,000 BGN.',
    maxAmount: 50000,
    interestRate: 7.2,
    imageUrl:
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop',
  },
  {
    id: 'offer_3',
    title: 'Green Home Energy Loan',
    description:
      'Finance your solar panels and energy-efficient upgrades. Up to 80,000 BGN.',
    maxAmount: 80000,
    interestRate: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1517139102544-8aa7a7b6a4f7?w=400&h=300&fit=crop',
  },
  {
    id: 'offer_4',
    title: 'Tech Startup Leasing',
    description:
      'Lease cutting-edge technology for your startup. Equipment up to 60,000 BGN.',
    maxAmount: 60000,
    interestRate: 6.1,
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=400&h=300&fit=crop',
  },
];
