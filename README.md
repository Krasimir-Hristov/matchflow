# FinTech Promo App

A modern Next.js application featuring a gamified client flow with Tinder-style swipe cards for loan offers, AI-generated personalized messages, a booking system, and an Admin dashboard where brokers get AI-powered preparation notes for their meetings.

## 🚀 Features

- **Swipe Interface**: Tinder-style card swipes for loan offer selection
- **AI Personalization**: Gemini-powered personalized messages for clients
- **Booking System**: Date/time picker with form validation
- **Admin Dashboard**: Broker view with client meetings and AI-generated prep notes
- **localStorage Persistence**: Mock database using browser storage
- **Responsive Design**: Mobile-first Tailwind CSS styling

## 🔧 Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up `.env.local` with your Gemini API key:

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

Key files:

- `app/api/` — Gemini API endpoints
- `app/admin/` — Admin dashboard
- `components/` — React components for swipe, booking, etc.
- `lib/` — Types, mock data, storage utilities

## 🎯 User Flows

**Client**: Swipe → AI Message → Book Meeting  
**Admin**: Dashboard → Select Client → Generate AI Prep Notes

## 🤖 AI Features

- **Client Messages**: Personalized summaries based on offer selection
- **Broker Prep**: Meeting focus areas and cross-sell recommendations

## 📊 Status: ✅ Complete (7/7 Steps)
