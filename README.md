# IronMind

> **Train your mind. Complete your quests. Become stronger.**

IronMind transforms real-life tasks and personal habits into an authoritative RPG progression system. By completing real-world quests, users earn XP, level up, build daily streaks, accumulate coins, and advance their Intellect and Willpower character attributes. 

Designed with Apple-grade minimalism inspired by Apple Health and Apple Fitness, IronMind features fluid physics, refined typography, subtle glowing cues, and an anti-cheat server-side progression architecture.

---

## Key Features

- **Authoritative Anti-Cheat Progression**: XP, levels, daily streaks, coin rewards, and character attributes are calculated exclusively server-side via atomic transactions. Clients cannot manipulate stats.
- **Dynamic Character System**:
  - **Leveling**: Non-linear level progression calculated via `XP = round(100 * Level^1.5)`. Multi-level up detection supported.
  - **Attributes**: Distinct quest categories feed into character stats:
    - **Intellect** (`+1 INT` per quest): Focus, cognitive capacity, deep work.
    - **Willpower** (`+1 WIL` per quest): Physical grit, discipline, impulse resistance.
  - **Streak System**: Calendar-based streak calculation preventing duplicate daily increments while penalizing missed days.
  - **Coin Treasury**: Warm accent coins awarded on every completion.
- **Apple-Grade Aesthetic & Motion**:
  - Custom Apple-style easing curves (`cubic-bezier(0.28, 0.11, 0.32, 1)`).
  - Floating ambient light orbs, subtle grid backdrop, and interactive micro-stat cards.
  - Subtle level-up modal with scale transitions and soft blue glow.
  - Full `prefers-reduced-motion: reduce` compliance.
- **Gemini AI Quest Directives**:
  - Integrated with Google Gemini 1.5 Flash API for crisp, actionable quests under 12 words.
  - Resilient offline fallback library ensuring 100% uptime even without an API key.
- **Instant Guest Sandbox**:
  - Try the full application immediately in local demo mode without needing to configure cloud credentials first.

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | Unified SSR, Client hydration & Server API routes |
| **Language** | TypeScript 5 (Strict Mode) | End-to-end type safety |
| **Styling** | Tailwind CSS 3 | Apple-inspired design tokens and layout |
| **Animation** | Framer Motion 11 | Fluid animations with custom Apple cubic-bezier curves |
| **Icons** | Lucide React | Clean, consistent line iconography |
| **Auth** | Firebase Authentication | Secure Email/Password identity management |
| **Database** | Firebase Firestore & Admin SDK | Authoritative transactional cloud store |
| **AI** | Google Gemini 1.5 Flash | Concrete self-improvement quest generation |

---

## Architecture & Data Flow

```
[ Browser / Client ]
      │
      ├─► Firebase Auth (Client SDK) ──► Issues Firebase ID Token
      │
      └─► Next.js 14 API Routes (Server) [Authorization: Bearer <ID-Token>]
                │
                ├─► lib/auth.ts (Verifies Token via Firebase Admin)
                │
                ├─► lib/progression.ts (Authoritative RPG Engine)
                │         • XP = round(100 * N^1.5)
                │         • Streak Date Logic (YYYY-MM-DD)
                │         • Attribute Increments
                │
                ├─► lib/db.ts (Atomic Firestore Transaction)
                │         • Enforces single-completion
                │         • Prevents concurrent race conditions
                │
                └─► lib/ai.ts (Google Gemini 1.5 Flash API + Fallback)
```

---

## Firestore Schema & Security Rules

### Data Schema

#### `users/{uid}`
```json
{
  "uid": "string",
  "email": "string | null",
  "level": 1,
  "xp": 0,
  "coins": 50,
  "streak": 0,
  "lastCompletedDate": "YYYY-MM-DD | null",
  "attributes": {
    "intellect": 10,
    "willpower": 10
  },
  "createdAt": "ISO-8601 string"
}
```

#### `users/{uid}/tasks/{taskId}`
```json
{
  "id": "string",
  "uid": "string",
  "title": "string",
  "category": "intellect | willpower",
  "completed": false,
  "xpReward": 35,
  "coinReward": 15,
  "createdAt": "ISO-8601 string",
  "completedAt": "ISO-8601 string | null"
}
```

### Security Rules (`firestore.rules`)
```cel
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false;

      match /tasks/{taskId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if false;
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
*Direct client writes are forbidden across all collections. All state changes are executed by the verified Next.js server via Firebase Admin SDK transactions.*

---

## API Endpoints

All protected endpoints expect the header `Authorization: Bearer <firebase-id-token>`.

- `POST /api/user/init`: Initializes user profile and default quests.
- `GET /api/user/me`: Retrieves authoritative stats for the authenticated user.
- `GET /api/tasks`: Fetches user active and completed quests.
- `POST /api/tasks`: Creates a new quest. Server determines XP and Coin rewards based on category.
- `DELETE /api/tasks/[id]`: Deletes a quest owned by the user.
- `POST /api/tasks/complete`: **The only endpoint allowed to advance progression.** Takes `{ taskId }`, validates ownership in an atomic transaction, updates XP, Level, Streak, Coins, and Attributes, and commits atomically.
- `POST /api/quest-ai`: Generates a short, concrete quest using Gemini AI with offline fallback.

---

## Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/Ravisen2208/IronMind.git
cd IronMind
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Firebase client credentials, Firebase Admin private key, and Gemini API key (optional for local testing; demo fallback works out of the box).

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm run start
```

---

## Deployment (Vercel)

1. Import the GitHub repository `Ravisen2208/IronMind` in Vercel.
2. Under Project Settings -> Environment Variables, add the keys from `.env.example`.
3. Deploy. Next.js App Router API routes deploy as serverless functions with zero additional server configuration.

---

## Third-Party Disclosure

IronMind utilizes the following production libraries, APIs, and hosting providers:

- **Core & Runtime**: Next.js 14, React 18, React-DOM 18, Node.js
- **Styling & Design System**: Tailwind CSS 3, PostCSS, Autoprefixer
- **Motion & Interactions**: Framer Motion 11
- **Iconography**: Lucide React
- **Class Merging**: `clsx`, `tailwind-merge`
- **Identity & Authentication**: Firebase Authentication (`firebase/auth`)
- **Cloud Database & Transactions**: Firebase Firestore (`firebase-admin/firestore`)
- **Artificial Intelligence**: Google Generative AI SDK (`@google/generative-ai`, Gemini 1.5 Flash)
- **Version Control & Hosting**: GitHub, Vercel
