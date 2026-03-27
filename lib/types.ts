/**
 * Core TypeScript types for FinTech Promo App
 */

export interface Offer {
  id: string;
  title: string;
  description: string;
  maxAmount: number;
  interestRate: number;
}

export interface ClientLead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  desiredAmount: number;
  likedOfferIds: string[];
  bookedDate: string; // ISO 8601 format: YYYY-MM-DD
  bookedTime: string; // HH:MM format
}
