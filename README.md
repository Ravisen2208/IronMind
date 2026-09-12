# IronMind

> **Train your mind. Complete your quests. Become stronger.**

IronMind is an Apple-inspired gamified productivity platform that turns everyday goals, study sessions, workouts, work, habits, and personal goals into RPG-style quests.

Designed with the minimalism, calm aesthetics, and fluid physics of Apple Health, Apple Fitness, and iOS/macOS system design, IronMind delivers an authoritative anti-cheat RPG engine with server-calculated rewards, permanent attribute progression, daily consistency defense, and Google Gemini AI directives.

---

## Complete Application Modules

| Module | Route | Purpose |
| :--- | :--- | :--- |
| **Landing** | `/` | Animated hero with floating micro-stat cards, smooth scroll reveals, and in-page guest sandbox |
| **Login** | `/login` | Apple-style email/password authentication & instant guest sandbox entry |
| **Signup** | `/signup` | Account creation with automatic character and starting stat initialization |
| **Dashboard** | `/dashboard` | Unified Apple Fitness-style overview: Level, XP, Streaks, Coins, Attributes, Today's Completion, and quick actions |
| **My Quests** | `/quests` | Full quest manager with active/completed tabs, real-time search, category filters, priority filters, quest editor modal, and custom category creator |
| **Gym & Fitness** | `/gym` | Dedicated workout tracker: exercise picker, muscle groups, sets & reps counter, workout streak, and Willpower progression |
| **Study & Focus** | `/study` | Deep focus manager: subjects, topics, study timer, study streak, and Intellect progression |
| **Progress & Analytics** | `/progress` | 7-day Apple-style minimalist activity bar chart (Mon–Sun), study hours, workout sessions, and milestone streaks |
| **Profile & Settings** | `/profile` | Apple Settings interface: account info, level progression breakdown, reduced motion toggle, and notifications toggle |

---

## Anti-Cheat RPG Progression Architecture

1. **Strict Server Authority**:
   - The browser client only transmits `{ "taskId": "..." }` when requesting quest completion.
   - Clients cannot supply `xpReward`, `coinReward`, `level`, `streak`, or `attributes`.
   - All state transitions execute atomically via Firestore transactions.
   - Completed quests are permanently locked against reward modification or duplicate completion.

2. **Leveling Formula**:
   $$\text{XP Required for Level } N = \text{round}(100 \times N^{1.5})$$
   Supports single and multi-level advancements seamlessly.

3. **Attributes Progression**:
   - **Intellect** (`+1 INT`): Enhanced by Study, Coding, and Reading quests.
   - **Willpower** (`+1 WIL`): Enhanced by Gym, Health, and Mindfulness quests.

4. **Consistency Streak System**:
   - Compares server calendar dates (`YYYY-MM-DD`).
   - Yesterday $\rightarrow$ `streak + 1`
   - Today $\rightarrow$ `streak unchanged`
   - Missed day $\rightarrow$ resets to `1`

5. **Priority Reward Matrix**:
   - **Low Priority**: 25 XP, 10 Coins
   - **Medium Priority**: 40 XP, 18 Coins
   - **High Priority**: 60 XP, 30 Coins
   - **Gym & Study Sessions**: +10 XP, +5 Coins session focus bonus

---

## Flexible Categories System

IronMind includes 8 built-in Apple-styled default categories and supports user-created custom categories:
- **Default**: Study, Gym, Work, Reading, Mindfulness, Health, Coding, Personal
- **Custom Categories**: Users can create categories with custom names, line icons, and Apple accent colors directly from the quest creation or manager views.

---

## Apple Design System & Motion

- **Color Tokens**:
  - Background: `#F5F5F7`
  - Primary Surface: `#FFFFFF`
  - Secondary Surface: `#FBFBFD`
  - Primary Text: `#1D1D1F`
  - Secondary Text: `#6E6E73`
  - Muted Text: `#86868B`
  - Accent (Apple Blue): `#0071E3` (Hover: `#0058B0`)
  - Success (Green): `#34C759`
  - Warning (Gold Coins): `#FF9F0A`
  - Danger (Red): `#FF3B30`
  - Divider: `#D2D2D7`
- **Curves & Physics**: Apple curve `cubic-bezier(0.28, 0.11, 0.32, 1)`.
- **Card Surfaces**: 24px–32px border radius, soft 2px–20px shadow, subtle `translateY(-2px)` hover lift.
- **Navigation**:
  - Desktop: Translucent frosted glass sticky header (`glass-nav`).
  - Mobile: Fixed iOS-style bottom tab bar (`MobileBottomNav`) for seamless one-handed mobile navigation.
- **Accessibility**: ARIA progress bar semantics, keyboard focus rings, and full `prefers-reduced-motion: reduce` compliance.

---

## API Endpoints

All protected endpoints require an `Authorization: Bearer <token>` header.

- `POST /api/user/init`: Initializes user profile and default quests.
- `GET /api/user/me`: Retrieves authoritative character stats.
- `GET /api/tasks`: Lists quests with query filters (`?type=`, `?category=`, `?priority=`, `?completed=`, `?search=`).
- `POST /api/tasks`: Creates a quest with authoritative reward assignment.
- `PATCH /api/tasks/[id]`: Edits an incomplete quest's title, description, category, priority, or due date.
- `DELETE /api/tasks/[id]`: Deletes a quest owned by the user.
- `POST /api/tasks/complete`: Executes atomic anti-cheat progression.
- `GET /api/categories`: Returns default and custom user categories.
- `POST /api/categories`: Creates a new custom category.
- `PATCH /api/categories/[id]`: Updates a custom category.
- `DELETE /api/categories/[id]`: Deletes a custom category.
- `POST /api/quest-ai`: Generates a concrete micro-quest under 12 words with Google Gemini 1.5 Flash (with resilient offline fallback).

---

## Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/Ravisen2208/IronMind.git
cd IronMind
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(Optional for local testing: Instant Guest Sandbox and offline AI fallback work out of the box).*

### 3. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Run Automated Test Suite
```bash
node ./scripts/verify.mjs
```

### 5. Production Build
```bash
npm run build
npm run start
```

---

## Third-Party Disclosure

- **Core Framework**: Next.js 14 (App Router), React 18, React-DOM 18
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3, PostCSS, Autoprefixer
- **Motion**: Framer Motion 11
- **Icons**: Lucide React
- **Identity & Authentication**: Firebase Authentication
- **Cloud Database**: Firebase Firestore & Firebase Admin SDK
- **AI Directives**: Google Generative AI (`@google/generative-ai`, Gemini 1.5 Flash)
- **Hosting & CI**: Vercel, GitHub
