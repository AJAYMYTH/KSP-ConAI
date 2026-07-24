# 🚔 KSP-ConAI — Crime Intelligence Copilot (Frontend)

An executive-grade, AI-powered Crime Intelligence & Suspect Profiling Platform built for the **Karnataka State Police (KSP)**. This application combines Astro.js static/SSR routing with interactive React islands, real-time AI reasoning feeds, interactive suspect association networks, geospatial crime hotspot mapping, and bilingual (English / Kannada) state persistence.

---

## 🌟 Key Features

### 1. 🛡️ Role-Based Access Control & Gateways
- **Multi-Role Login Gateway**: Dedicated interface for Officers, Investigators, Analysts, and System Administrators.
- **Permission Guard**: Granular route filtering and feature toggling based on active user credentials and departmental clearance.

### 2. 🤖 AI Assistant & Reasoning Chain (`/app/assistant`)
- **Real-Time Streaming**: Integrated with Vercel AI SDK (`ai` & `@ai-sdk/react`) over Server-Sent Events (SSE).
- **Interactive Thinking Panel**: Dynamic AI reasoning trace with live execution steps and multi-modal audio TTS transcription output.

### 3. 🕸️ Suspect Association & Case Network Graph (`/app/graph` & `/app/cases/[caseId]`)
- **Interactive Concentric Network**: Built with `@xyflow/react` (React Flow) for rendering suspect links, gang hierarchies, and financial node paths.
- **Side Inspector Drawer**: Real-time suspect node inspection, risk assessment score, and direct case linking.
- **Similar Case Comparison**: Automated vector similarity matching for modus operandi comparison across historical FIR files.

### 4. 🗺️ Geospatial Crime Hotspot Map (`/app/map`)
- **Dynamic Leaflet Integration**: Live category filtering (Cybercrime, Narcotics, Organized Crime, Property Offenses).
- **FIR Fast Search**: Jump to exact crime coordinates and view precinct-level risk density overlays.

### 5. 📊 Executive Dashboards & Predictive Analytics (`/app/dashboard`)
- **Predictive Insights**: Forecasted crime trends, temporal anomaly alerts, and regional incident rates powered by Recharts.
- **Offender Behavioral Profiler**: Socio-demographic indicators, recidivism probability matrices, and offender registry matching.

### 6. 🌐 Global Bilingual Support (English / Kannada)
- Real-time language switching across all pages and interactive components via `i18next` and `react-i18next`.

---

## 🛠️ Technology Stack

- **Framework**: [Astro v4](https://astro.build/) (SSR & Static Routing)
- **UI & Components**: [React 18](https://react.dev/) (Astro Islands Architecture)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom `@theme` variables (`app/styles/globals.css`)
- **AI UI Integration**: Vercel AI SDK (`ai`, `@ai-sdk/react`)
- **Graph & Mapping**: `@xyflow/react` (React Flow), [Leaflet](https://leafletjs.com/)
- **Charts & Data**: [Recharts](https://recharts.org/), [Lucide React Icons](https://lucide.dev/)
- **Internationalization**: `i18next`, `react-i18next`
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)

---

## 📁 Directory Structure

```text
frontend/
├── app/
│   ├── components/
│   │   ├── admin/          # Compliance dashboard & admin console
│   │   ├── analytics/      # Offender behavioral profiler components
│   │   ├── assistant/      # AI reasoning chat & audio loaders
│   │   ├── auth/           # Login gateway & PermissionGuard
│   │   ├── cases/          # Case timeline, React Flow graph & comparison grid
│   │   ├── common/         # Error boundaries & fallback wrappers
│   │   ├── dashboard/      # Executive grid & predictive analytics
│   │   ├── layout/         # Executive navbar & 5-column footer
│   │   ├── map/            # Leaflet crime hotspot mapping
│   │   ├── pages/          # Static legal & policy views
│   │   ├── reports/        # Reports manager & vault
│   │   ├── search/         # Live FIR search interface
│   │   └── sections/       # Landing page bento & hero sections
│   ├── i18n/               # English & Kannada translation dictionaries & hooks
│   ├── layouts/            # Master Astro layout with ViewTransitions
│   ├── lib/                # API layer (api.ts), auth context & utility functions
│   ├── pages/              # Astro page routes (/app, /app/login, /app/dashboard, etc.)
│   ├── styles/             # Global CSS tokens & Tailwind CSS v4 configuration
│   └── types/              # TypeScript models for FIRs, suspects, & analytics
├── public/                 # Static brand assets (Karnataka Emblem, Favicon, Mockups)
├── astro.config.mjs        # Astro configuration & Vite devSrcDirRewrite middleware
├── package.json            # Node.js dependencies & scripts
├── tsconfig.json           # TypeScript configuration with @/* path aliases
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm` (v9+)

### Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.local.template` to `.env.local`:
   ```bash
   cp .env.local.template .env.local
   ```
   *Update `NEXT_PUBLIC_API_URL` to point to your backend service.*

---

## 📜 Available Scripts

In the `frontend` directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Astro local development server at `http://localhost:4321/app` |
| `npm run build` | Builds the production bundle to `client/` |
| `npm run preview` | Previews the production build locally |
| `npm run astro` | Runs Astro CLI commands |

---

## 🔐 Environment Variables

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Optional | `http://localhost:8000` | Base URL for the Crime Intelligence API endpoints |
| `NEXT_PUBLIC_WS_URL` | Optional | `ws://localhost:8000/ws` | WebSocket URL for live case feeds |

---

## 📄 License

Internal project for **Karnataka State Police (KSP)**. All rights reserved.
