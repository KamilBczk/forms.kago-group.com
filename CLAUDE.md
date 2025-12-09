# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 contact form application for Kago Group, built with TypeScript, React 19, and Tailwind CSS 4. The application features a single-page contact form that captures user information and browser metadata, sending emails via Resend.

## Development Commands

**Start development server:**
```bash
npm run dev
```
Server runs on http://localhost:3000 with Turbopack enabled.

**Build for production:**
```bash
npm run build
```
Uses Next.js with Turbopack for optimized builds.

**Start production server:**
```bash
npm start
```

**Lint code:**
```bash
npm run lint
```

## Architecture

### Core Flow
1. Root (`/`) redirects to `/letter` (see `src/app/page.tsx:5`)
2. Contact form at `/letter` captures user input + browser metadata
3. Client-side validation with Zod + React Hook Form
4. Form data + metadata sent to `/api/contact`
5. Server validates, enriches with IP/headers, sends email via Resend

### Key Technologies
- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Zod** for schema validation (client + server)
- **React Hook Form** + `@hookform/resolvers` for form management
- **Resend** for transactional email delivery
- **GSAP** for animations

### Directory Structure
```
src/
├── app/
│   ├── api/contact/route.ts    # Contact form API endpoint
│   ├── letter/                 # Contact form page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage (redirects to /letter)
├── components/
│   ├── ContactForm.tsx         # Main contact form component
│   ├── MagicLink.tsx           # Animation component
│   ├── ui/                     # Reusable UI components
│   └── animations/             # GSAP animation components
├── hooks/
│   └── useBrowserInfo.ts       # Hook for capturing browser metadata
└── lib/
    └── validations.ts          # Zod schemas and types
```

## Form Architecture

### Data Flow
The contact form captures comprehensive data in two layers:

**User Input Fields:**
- firstName, lastName (min 2 chars)
- email (validated email format)
- phone (min 10 chars)
- services (object with 6 boolean fields: website, custom, design, consulting, seo, support - at least one required)
- message (min 10 chars)

**Browser Metadata (auto-captured):**
- Client-side via `useBrowserInfo` hook: userAgent, referrer, browserLanguage, screenResolution, timezone, route
- Server-side via API route headers: ipAddress (from x-forwarded-for or x-real-ip)

### Validation Strategy
- **Client-side:** `contactFormSchema` in `src/lib/validations.ts` validates user input before submission
- **Server-side:** Same schema validates complete payload (user input + metadata) in API route
- All error messages are in French

### Email Delivery
API route at `src/app/api/contact/route.ts` constructs HTML email with:
- Contact information section
- Selected services (mapped to French labels)
- User message
- Technical metadata section

## Environment Configuration

Required variables in `.env.local`:

```bash
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=contact@yourdomain.com           # Recipient email
RESEND_FROM_EMAIL=noreply@yourdomain.com       # Sender (must be verified in Resend)
```

See `CONFIGURATION.md` for detailed Resend setup instructions.

## Path Aliases

Use `@/` prefix for imports from `src/`:
```typescript
import { contactFormSchema } from '@/lib/validations';
import ContactForm from '@/components/ContactForm';
```

## Styling

Tailwind CSS 4 with PostCSS. Custom color used: `bg-[#4990f9]` for primary buttons.

## Important Notes

- Application is in French (UI, validation messages, email content)
- Root route redirects to `/letter` - main entry point is the contact form
- Browser metadata collection is automatic and non-optional
- Form requires at least one service to be selected
- All API responses include French error messages
