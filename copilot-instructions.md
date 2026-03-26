# Copilot Instructions — FinTech Promo App

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

You are working on a **FinTech Promo App** — a Next.js application with swipe cards, AI-generated messages, booking flow, and admin dashboard.

## Project Context

- **Tech**: Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Google Gemini AI
- **Goal**: Build a promotional financial app with gamified client flow and AI-powered broker tools
- **Reference**: See `IMPLEMENTATION_PLAN.md` for full architectural breakdown

## Core Rules — ALWAYS FOLLOW

### 1. Next.js Conventions

- Use **App Router** (`app/` directory only)
- All files: **TypeScript** (`.ts`, `.tsx`)
- Client components must have `"use client"` directive at the top
- API routes: `app/api/[route]/route.ts` (always POST/GET handlers)
- Admin pages: `app/admin/page.tsx`

### 2. Directory Structure (STRICT)

```
app/
  admin/
    page.tsx
  api/
    client-message/
      route.ts
    agent-prep/
      route.ts
  layout.tsx
  page.tsx
components/
  SwipeCard.tsx
  SwipeDeck.tsx
  AiClientMessage.tsx
  LeadForm.tsx
  BookingCalendar.tsx
  BookingFlow.tsx
  AdminLeadDetails.tsx
lib/
  types.ts          # All TypeScript interfaces
  mockOffers.ts     # Static offer data
  storage.ts        # localStorage utilities (SSR-safe)
.env.local          # GEMINI_API_KEY (NEVER hardcode)
IMPLEMENTATION_PLAN.md  # Progress checklist
```

### 3. Component Patterns

- **Always use functional components** with hooks
- Props interface: `interface [ComponentName]Props { ... }`
- Export at bottom of file
- No default exports (named exports only)

### 4. Types

Define in `lib/types.ts`:

```typescript
// Offer interface
interface Offer {
  id: string;
  title: string;
  description: string;
  maxAmount: number;
  interestRate: number;
  imageUrl: string;
}

// ClientLead interface
interface ClientLead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  desiredAmount: number;
  likedOfferIds: string[];
  bookedDate: string; // ISO 8601
  bookedTime: string; // HH:MM
}
```

### 5. Storage (lib/storage.ts)

- **Always SSR-safe**: Check `typeof window !== 'undefined'`
- Never use direct localStorage in components
- Export utility functions: `saveLeads()`, `getLeads()`, `addLead()`

### 6. API Routes Pattern

Always return JSON:

```typescript
export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Process with Gemini API...
    return Response.json({ data: result, error: null });
  } catch (err) {
    return Response.json(
      { data: null, error: (err as Error).message },
      { status: 500 },
    );
  }
}
```

### 7. Gemini Integration

- Use `@google/generative-ai` package
- Always specify language in prompt (Bulgarian or English)
- Model: `gemini-1.5-flash` (or latest stable)
- **Never log API keys** in console/output

### 8. Environment Variables

- Create `.env.local` with `GEMINI_API_KEY=your_key_here`
- Create `.env.example` (without actual key)
- Never commit `.env.local`

### 9. Styling

- **Tailwind CSS only** (no CSS modules)
- Responsive mobile-first design
- Use `lucide-react` for icons
- Framer Motion for animations only

### 10. Progress Tracking

- Update `IMPLEMENTATION_PLAN.md` checklist in real-time
- Mark steps as complete: `[x]` instead of `[ ]`
- Before each task, read the current checklist status

## File Naming Conventions

| Type       | Convention | Example                                 |
| ---------- | ---------- | --------------------------------------- |
| Components | PascalCase | `SwipeCard.tsx`, `AdminLeadDetails.tsx` |
| Utils/Lib  | camelCase  | `mockOffers.ts`, `storage.ts`           |
| API routes | kebab-case | `client-message`, `agent-prep`          |
| Types file | camelCase  | `types.ts`                              |

## Before Writing Any Code

1. Check `IMPLEMENTATION_PLAN.md` — what step are we on?
2. Read `lib/types.ts` — are all types defined?
3. Verify `.env.local` exists with `GEMINI_API_KEY`
4. Confirm Next.js version in `package.json` is latest

## Common Tasks

- **New component**: Create in `components/`, add typing, use hooks
- **New API route**: Create in `app/api/[name]/route.ts` with POST/GET
- **Call Gemini**: Use route + `fetch()` from component, handle errors
- **Save data**: Use `lib/storage.ts` utility functions only
- **Debug localStorage**: Open DevTools → Application → LocalStorage

---

_Last updated: 2026-03-26 | Project: FinTech Promo App | Status: In Progress_
