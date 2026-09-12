# ⚔️ IronMind

> **Train your mind. Complete your quests. Forge an unbreakable character.**

**IronMind** is a gamified productivity, fitness, and cognitive development ecosystem. It transforms everyday tasks, algorithmic coding challenges, structured gym workouts, and deep study sessions into RPG-style micro-quests with real-time progression.

Built with an authoritative anti-cheat RPG engine, real-time Firebase syncing, and Google Gemini AI mentors, IronMind delivers instant dashboard hydration, dynamic routine generation, and an interactive algorithmic DSA code studio.

---

## 🌐 Live Deployment

IronMind is deployed and continuously delivered via Render Blueprint:

| Service | Component | Live Production URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Next.js 14 (App Router) | **[https://ironmind-client.onrender.com](https://ironmind-client.onrender.com)** |
| **Backend REST API** | Express.js + TypeScript | **[https://ironmind-server.onrender.com](https://ironmind-server.onrender.com)** |
| **Source Repository** | GitHub (Public) | **[https://github.com/Ravisen2208/IronMind](https://github.com/Ravisen2208/IronMind)** |

---

## 📸 Visual Showcase

<div align="center">
  <img src="client/public/images/hero-ironmind.jpg" alt="IronMind Hero Showcase" width="90%" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.3);" />
  <p><em>Cosmic RPG Dashboard featuring Character Stats, Daily Quests, and Real-Time Leveling</em></p>
</div>

<div align="center">
  <img src="client/public/images/feature-cards.jpg" alt="IronMind Feature Highlights" width="90%" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.3);" />
  <p><em>Adaptive Gemini AI Mentors for Gym Routines, Deep Study, and DSA Code Studio</em></p>
</div>

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Client** | **Next.js 14** (App Router), **React 18**, **TypeScript 5**, **Tailwind CSS 3** |
| **Styling & Physics** | **Framer Motion 11**, Custom Canvas Particle Engine, Cosmic Theme System |
| **Backend API** | **Express.js 4**, **Node.js 20**, **TypeScript**, CORS middleware |
| **Authentication** | **Firebase Authentication** (Email/Password + One-Click Guest Sandbox) |
| **Database & Persistence**| **Google Cloud Firestore** (with Server-Side Atomic Transactions & In-Memory Fallback) |
| **AI Intelligence** | **Google Gemini API** (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-3.6-flash`, `gemini-1.5-flash`) |
| **Cloud Infrastructure** | **Render** (`render.yaml` Blueprint multi-service architecture) |

---

## ✨ Core Pillars & Features

### 1. ⚔️ Authoritative Anti-Cheat RPG Progression Engine
- **Server Authority**: The client only submits completed `taskId` identifiers. Clients can never modify `xpReward`, `coinReward`, `level`, `streak`, or stat attributes directly.
- **Level Scaling Formula**:
  $$\text{XP Required for Level } N = \text{round}(100 \times N^{1.5})$$
- **Stat Specialization**:
  - **Intellect (`+INT`)**: Gained via Study sessions, algorithmic coding, and reading quests.
  - **Willpower (`+WIL`)**: Fortified through Gym sessions, heavy compound lifts, and consistency streaks.
- **Strict Date Streak Engine**: Calendar-based progression comparing ISO date tokens to protect genuine daily habits.

### 2. 🧠 Gemini DSA Code Studio & Interactive AI Mentor
- **Interactive Multi-Language Studio**: Solve LeetCode-style algorithmic challenges in **C++**, **Python**, **JavaScript**, and **Java** with an integrated code runner and testcase validator.
- **Real-Time AI Code Inspection**: Ask Gemini for algorithmic hints, Big-O time/space complexity audits, or optimal reference implementations.
- **Custom Problem Generator**: Generate tailored algorithmic challenges on any topic (*Dynamic Programming*, *Graphs*, *Binary Search Trees*, *Tries*, etc.) at any difficulty level.

### 3. 🏋️‍♂️ Gemini Gym AI Coach
- Dynamic workout protocol builder customized to any **Goal** (*Strength & Power*, *Hypertrophy*, *Endurance*), **Muscle Group** (*Chest*, *Back*, *Legs*, *Shoulders*, *Arms*, *Full Body*), **Equipment**, and **Duration**.
- Automatic calculation of sets, reps, rest periods, and biomechanical safety cues.
- One-click transformation of workout routines into actionable daily IronMind quests.

### 4. 📚 Gemini Deep Study & Focus Coach
- MIT/Stanford-inspired cognitive directives breaking complex topics into structured 45-minute focus intervals.
- Generates core invariant breakdowns, spaced retrieval checkpoints, and actionable learning milestones.

### 5. ⚡ Zero-Latency Instant Hydration
- Instant local state caching loads character stats, attributes, and daily quests in **0 milliseconds**.
- Non-blocking background sync silently reconciles state with Firestore and Render backend.

---

## 📁 Repository Structure

```
IronMind/
├── .env.example                     # Unified template for all environment keys
├── .gitignore                        # Comprehensive secrets & build exclusion rules
├── package.json                      # Monorepo root script runner
├── render.yaml                       # Render Blueprint deployment specification
├── README.md                         # Comprehensive documentation
│
├── client/                           # Next.js 14 Frontend Application
│   ├── .env.example                  # Client-specific environment variable template
│   ├── next.config.mjs               # Production rewrites & protocol proxying
│   ├── package.json                  # Frontend dependencies & scripts
│   ├── tailwind.config.ts            # Custom design tokens & cosmic themes
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Cosmic shell, ThemeProvider, ToastProvider
│   │   ├── page.tsx                  # Animated landing & guest portal
│   │   ├── dashboard/                # Character overview & quest log
│   │   ├── quests/                   # Filterable quest management hub
│   │   ├── gym/                      # Workout tracking & Gemini AI coach
│   │   ├── study/                    # DSA Code Studio & Focus coach
│   │   ├── progress/                 # 7-day activity & attribute graphs
│   │   ├── profile/                  # Account settings & level breakdown
│   │   ├── login/ & signup/          # Authentication portals
│   ├── components/                   # Modular React UI components
│   │   ├── animations/               # AnimatedBackground, LevelUpModal, MotionWrapper
│   │   ├── character/                # CharacterCard, StatCard
│   │   ├── gym/                      # GymTracker, GymAICoachModal, SevenDayGymRoutine
│   │   ├── study/                    # DsaCodeStudio, DsaAIAssistant, StudyAICoachModal
│   │   ├── quests/                   # QuestCard, QuestForm, QuestEditorModal
│   │   └── ui/                       # Navbar, Toast, ThemeToggle, LoadingSkeleton
│   ├── context/                      # AuthContext, ThemeContext
│   └── lib/                          # apiRequest helper, firebase client
│
└── server/                           # Express.js API Backend
    ├── .env.example                  # Server-specific environment variable template
    ├── tsconfig.json                 # TypeScript build configuration
    ├── package.json                  # Backend dependencies & build scripts
    └── src/
        ├── server.ts                 # Express initialization, CORS, healthcheck
        ├── lib/
        │   ├── auth.ts               # Firebase token verification & optionalAuth
        │   ├── firebase-admin.ts     # Firebase Admin SDK cert initialization
        │   ├── db.ts                 # Firestore atomic transactions & in-memory store
        │   └── progression.ts        # Authoritative XP & level mathematics
        └── routes/
            ├── user.ts               # Profile retrieval & initialization
            ├── tasks.ts              # Quest CRUD & atomic completion
            ├── categories.ts         # Custom & default quest categories
            └── questAi.ts            # Multi-model Gemini AI endpoints
```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- *(Optional)*: Free Google Gemini API Key and Firebase Project

### 1. Clone the Repository
```bash
git clone https://github.com/Ravisen2208/IronMind.git
cd IronMind
```

### 2. Install Dependencies
Install all root, client, and server dependencies:
```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 3. Setup Environment Variables
Copy the templates to your local environment files:

**For Frontend:**
```bash
cp client/.env.example client/.env.local
```
Configure your Firebase Client web credentials in `client/.env.local` (or run in Demo Mode out-of-the-box without keys).

**For Backend:**
```bash
cp server/.env.example server/.env
```
Configure your `GEMINI_API_KEY` and Firebase Admin credentials in `server/.env` (or use built-in offline resilient fallbacks).

### 4. Run Locally
Run both client and server concurrently with a single command from the monorepo root:
```bash
npm run dev
```

Or run each service individually in separate terminals:
```bash
# Terminal 1: Backend Server (Port 5000)
npm run dev --prefix server

# Terminal 2: Frontend Client (Port 3000)
npm run dev --prefix client
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 🚀 Deployment (Render Blueprint)

IronMind is configured for zero-configuration, reproducible deployments via [`render.yaml`](./render.yaml):

1. Go to your [Render Dashboard](https://dashboard.render.com/) -> **New +** -> **Blueprint**.
2. Connect your GitHub repository (`Ravisen2208/IronMind`).
3. Render automatically provisions:
   - `ironmind-server`: Web service running `npm install && npm run build` -> `npm start` with health check at `/health`.
   - `ironmind-client`: Web service running `npm install && npm run build` -> `npm start` linked to `https://ironmind-server.onrender.com`.
4. Enter the prompted secret keys (`GEMINI_API_KEY`, `FIREBASE_ADMIN_*`, `NEXT_PUBLIC_FIREBASE_*`) into Render's secure dashboard.
5. Click **Apply**. Both services will build and deploy automatically.

---

## 🛡️ Security & Privacy Assurance

- **Zero Secrets in Git**: All `.env`, `.env.local`, and private service account JSON files are strictly excluded via [`.gitignore`](./.gitignore).
- **Public & Clean**: Scanned with automated secret detection ensuring zero API keys or private keys exist across all tracked files and commit history.
- **Server-Side API Keys**: The Google Gemini API Key and Firebase Admin Private Key are strictly confined to the backend server and never exposed to the client browser.

---

## 📜 Third-Party Tools & AI Disclosure

In accordance with hackathon submission guidelines, here is the complete disclosure of third-party libraries, APIs, and AI tools utilized in the development of IronMind:

1. **AI Models & Cloud APIs**:
   - **Google Gemini API** (`@google/generative-ai`): Utilized for real-time code analysis, algorithmic hints, custom DSA problem generation, dynamic strength training workout protocols, and cognitive study directives.
   - **Google Firebase**: Firebase Authentication (user identity management) and Google Cloud Firestore (atomic cloud database).

2. **Open-Source Libraries & Frameworks**:
   - **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion, Lucide React icons, Canvas Confetti.
   - **Backend**: Express.js, Firebase Admin SDK, CORS, Dotenv, TypeScript, ts-node-dev.

3. **AI Coding Assistance Disclosure**:
   - **Antigravity (Google DeepMind)**: Assisted during the hackathon with project scaffolding, component styling, TypeScript error resolution, and production deployment configuration for Render.

---

## 📄 License

This project was built for hackathon submission and is licensed under the **MIT License**.
