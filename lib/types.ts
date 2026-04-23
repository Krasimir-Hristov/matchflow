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

export interface Question {
  id: string;
  text: string;
  category: string;
  groupId?: string; // questions in the same group are mutually exclusive (YES skips others)
  subQuestions?: Question[];
}

export interface QuestionAnswer {
  questionId: string;
  questionText: string;
  category: string;
  answer: 'yes' | 'no';
}

export interface ClientLead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  desiredAmount: number;
  likedOfferIds: string[];
  questionAnswers: QuestionAnswer[];
  bookedDate: string; // ISO 8601 format: YYYY-MM-DD
  bookedTime: string; // HH:MM format
}
