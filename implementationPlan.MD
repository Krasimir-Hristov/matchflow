# FinTech Promo App - Project Architecture & Steps

## 📌 Project Overview

A promotional Next.js application for a financial company. The app features a gamified client flow (Tinder-style swipe cards for loan offers), AI-generated personalized messages, a booking system, and an Admin dashboard where brokers get AI-generated preparation notes for their meetings.

**Tech Stack:** Next.js (App Router), Tailwind CSS, Framer Motion, Google Gemini API (`@google/generative-ai`), LocalStorage (for mock database).

---

## ✅ Progress Checklist

- [x] Create copilot-instructions.md
- [x] Step 1: Project Setup & Dependencies
  - [x] Initialize Next.js with App Router, TypeScript, Tailwind CSS
  - [x] Install framer-motion, @google/generative-ai, lucide-react, uuid
  - [x] Install shadcn/ui and calendar component
  - [x] Set up .env.local with GEMINI_API_KEY
- [x] Step 2: Types & Mock Data
  - [x] Create lib/types.ts with Offer and ClientLead interfaces
  - [x] Create lib/mockOffers.ts with 4 loan offers
  - [x] Create lib/storage.ts with SSR-safe localStorage utilities
- [x] Step 3: Client UI - The Swipe Interface (Tinder Style)
  - [x] Create components/SwipeCard.tsx with Framer Motion drag logic
  - [x] Create components/SwipeDeck.tsx to manage card stack
- [x] Step 4: Client AI Summary Integration
  - [x] Create app/api/client-message/route.ts with Gemini API call
  - [x] Create components/AiClientMessage.tsx to display message
- [x] Step 5: Form, Calendar & Saving Data
  - [x] Create components/LeadForm.tsx with validation
  - [x] Create components/BookingCalendar.tsx for date/time selection
  - [x] Create components/BookingFlow.tsx combining form and calendar
  - [x] Integrate localStorage saving via lib/storage.ts
- [x] Step 6: Admin Dashboard UI
  - [x] Create app/admin/page.tsx with meetings table and stats
  - [x] Create components/AdminLeadDetails.tsx with client details
- [x] Step 7: Admin AI Broker Prep
  - [x] Create app/api/agent-prep/route.ts with Gemini API call
  - [x] Integrate "Generate AI Prep" button in AdminLeadDetails
- [x] Step 8: Env, Config & Docs
  - [x] Create .env.example with GEMINI_API_KEY template
  - [x] Create .env.local with placeholder
  - [x] Create comprehensive README.md
- [x] Step 9: Polish & QA
  - [x] Update app/page.tsx with integrated client flow (Swipe → Message → Booking)
  - [x] Add top navigation (Client Flow & Broker Dashboard links)
  - [x] Responsive design (Tailwind + mobile-first)
  - [x] Smooth animations (Framer Motion throughout)
  - [x] Error handling in all API calls and components
  - [x] localStorage validation (SSR-safe)

## ✨ Project Complete!

All 9 steps successfully implemented. The FinTech Promo App is ready for testing.

## 🚀 Step 1: Project Setup & Dependencies

1. Initialize Next.js project with App Router, TypeScript, and Tailwind CSS.
2. Install dependencies:
   - `framer-motion` (for swipe animations)
   - `@google/generative-ai` (for Gemini AI integration)
   - `lucide-react` (for icons)
   - `react-calendar` or build a custom simple time-slot picker.
3. Set up environment variables: Add `GEMINI_API_KEY` to `.env.local`.

## 🗂️ Step 2: Types & Mock Data

1. Create `lib/types.ts`. Define interfaces for:
   - `Offer` (id, title, description, maxAmount, interestRate, imageUrl)
   - `ClientLead` (id, firstName, lastName, email, phone, desiredAmount, likedOfferIds, bookedDate, bookedTime)
2. Create `lib/mockOffers.ts` and export a constant array of `Offer` objects (at least 4 different loan types: Business, Consumer, Green Home, Tech Leasing).
3. Create a utility file `lib/storage.ts` to handle safely reading/writing `ClientLead` arrays to browser `localStorage` (ensure it handles Next.js SSR gracefully by checking `typeof window !== 'undefined'`).

## 🃏 Step 3: Client UI - The Swipe Interface (Tinder Style)

1. Create `components/SwipeCard.tsx` using `framer-motion`. Implement `drag="x"`, `useMotionValue`, and `useTransform` to handle the swipe left (reject) and swipe right (accept) logic.
2. Create `components/SwipeDeck.tsx` to map through `mockOffers`. Keep track of `likedOffers` in state.
3. Once all cards are swiped, trigger a state change to move to the AI Summary phase.

## 🤖 Step 4: Client AI Summary Integration

1. Create an API route: `app/api/client-message/route.ts`.
2. This route should accept an array of `likedOffers`.
3. Use the Gemini API (`gemini-1.5-flash` or similar) to generate a short, friendly, personalized message in Bulgarian.
   - _Prompt logic:_ "The client liked these loan offers: [Offers]. Write a short, engaging message summarizing their interest (e.g., 'You seem interested in business development') and invite them to book a meeting with an agent."
4. Create `components/AiClientMessage.tsx` to fetch and display this message with a "Book a Meeting" button.

## 📅 Step 5: Form, Calendar & Saving Data

1. Create `components/LeadForm.tsx`. Fields: First/Last Name, Email, Phone, Desired Amount (Dropdown).
2. Create `components/BookingCalendar.tsx`. A simple UI to pick a date and a time slot.
3. Combine them in `components/BookingFlow.tsx`.
4. On final submit:
   - Create a `ClientLead` object (form data + date/time + `likedOffers`).
   - Save to `localStorage` using the utility from Step 2.
   - Show a success message (No real email, just UI confirmation).

## 📊 Step 6: Admin Dashboard UI

1. Create `app/admin/page.tsx`. This is the broker's view.
2. Read the `ClientLead` array from `localStorage` on component mount (using `useEffect`).
3. Display a list/table of all booked meetings (Name, Phone, Date/Time).
4. Create a clickable row/card that opens a detailed view (`components/AdminLeadDetails.tsx`) showing all user data and the specific offers they liked.

## 🧠 Step 7: Admin AI Broker Prep

1. Create an API route: `app/api/agent-prep/route.ts`.
2. This route accepts the `ClientLead` data AND the full list of `mockOffers`.
3. Use the Gemini API to generate a preparation summary for the broker.
   - _Prompt logic:_ "You are an expert financial consultant advising a broker. The client wants [Amount], liked [Liked Offers]. Based on our full portfolio [All Offers], write a short prep note for the broker: 1) What to focus on during the meeting. 2) A cross-sell opportunity."
4. Add a "Generate AI Prep" button in the `AdminLeadDetails` component that calls this API and displays the broker tips.
