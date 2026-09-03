# Freight Navigator AI

src/

├── app/                              # Next.js App Router (Pages & Layout)

│   ├── layout.tsx                    # Global layout (includes Sidebar & TopNav)

│   ├── page.tsx                      # 🏠 Command Center (Dashboard Home)

│   ├── forecast/

│   │   └── page.tsx                  # 📈 Freight Forecasting Page

│   ├── optimizer/

│   │   └── page.tsx                  # 🚢 Charter Optimizer Page

│   ├── fleet/

│   │   └── page.tsx                  # 🗺️ Fleet & Route Planner Page

│   ├── risk/

│   │   └── page.tsx                  # ⚠️ Risk Radar Page

│   └── settings/

│       └── page.tsx                  # User Profile & Settings Page

│

├── components/                       # Reusable UI Components

│   ├── layout/

│   │   ├── Sidebar.tsx               # Left navigation menu

│   │   ├── TopNav.tsx                # Top bar with search and notifications

│   │   └── PageHeader.tsx            # Standardized title block for each page

│   │

│   ├── dashboard/

│   │   ├── KpiWidget.tsx             # Stat cards (e.g., current avg freight rate)

│   │   ├── AiRecommendationCard.tsx  # Actionable AI insights carousel/list

│   │   └── ActiveAlertsList.tsx      # High-priority warnings summary

│   │

│   ├── forecast/

│   │   ├── ForecastChart.tsx         # Recharts component for historical + predicted rates

│   │   ├── MarketDriversPanel.tsx    # Explains AI reasoning (weather, supply, etc.)

│   │   └── RouteSelector.tsx         # Inputs for origin, destination, and cargo type

│   │

│   ├── optimizer/

│   │   ├── CharterInputForm.tsx      # Form for tonnage, draft limits, laycan

│   │   ├── AiResultsPanel.tsx        # Displays the recommended vessel and booking window

│   │   ├── VesselSpecCard.tsx        # Visual specs (Handysize vs Supramax, etc.)

│   │   └── StrategyComparison.tsx    # Table comparing Spot vs Multi-Voyage contracts

│   │

│   ├── fleet/

│   │   ├── FleetGanttChart.tsx       # Timeline of active and idle vessels

│   │   ├── InteractiveRouteMap.tsx   # Mapbox/Leaflet implementation showing vessels

│   │   └── RepositioningList.tsx     # AI suggestions for idle time reduction

│   │

│   ├── risk/

│   │   ├── RiskMatrixGrid.tsx        # 2D grid of Probability vs. Impact

│   │   ├── RiskFilters.tsx           # Toggles for weather, congestion, etc.

│   │   └── WarningFeed.tsx           # Scrolling feed of real-time alerts

│   │

│   └── ui/                           # Base UI components (e.g., shadcn/ui library)

│       ├── button.tsx

│       ├── card.tsx

│       ├── input.tsx

│       ├── select.tsx

│       ├── badge.tsx

│       └── table.tsx

│

├── hooks/                            # Custom React Hooks (Business Logic & Data)

│   ├── useForecastData.ts            # Fetches historical and predictive freight rates

│   ├── useOptimizer.ts               # Handles state and API calls for the Charter Optimizer form

│   ├── useFleetSchedule.ts           # Fetches vessel status and parses Gantt chart data

│   ├── useRiskAlerts.ts              # Manages real-time or polled risk data and notifications

│   └── useMapData.ts                 # Handles map layers, coordinates, and port data

│

├── lib/                              # Utilities and Configurations

│   ├── api.ts                        # Axios/Fetch wrappers and base URL setup

│   ├── utils.ts                      # Formatting functions (currency, dates, tonnage)

│   └── constants.ts                  # Static data (vessel types, standard port lists)

│

└── types/                            # TypeScript Interfaces & Types

    ├── index.ts                      # Global types (Vessel, Route, Contract, Risk)

    └── api.ts                        # Request/Response types for the backend
Problem:

Bulk cargo companies currently decide vessel charters by checking freight prices every day. Because freight rates, demand, port congestion, and vessel availability keep changing, they may book at the wrong time, choose an unsuitable vessel, or face vessel idle time.

💡 Proposed Solution: AI-Powered Freight Forecasting & Chartering System

Build a smart dashboard that predicts future freight rates and tells the logistics manager:

When to book

Predict whether freight rates are likely to rise or fall and suggest the best time to enter a short-term or medium-term charter contract.

Which vessel to choose

Recommend Handysize, Supramax, Panamax or Capesize based on:

Cargo quantity

Origin and destination

Port draft

LOA and beam restrictions

Loading/unloading capacity

How to reduce idle time

Predict periods when a vessel may remain idle and suggest alternative routes, cargoes, or positioning.

Risk alerts

Give early warnings about:

Freight price volatility

Port congestion

Supply-demand changes

Weather/disruptions

Vessel availability

🔄 Current vs Proposed

Current:

Check market daily → Find vessel → Negotiate spot contract → Repeat

Proposed:

Historical + Market + Port Data → AI Forecast → Best Booking Window → Best Vessel → Multi-Voyage Contract

🎯 Main SIH Objective

Move bulk cargo procurement from reactive spot chartering to proactive, AI-driven short-term and medium-term multi-voyage chartering.

Example

Suppose 50,000 tonnes of coal needs to move from Australia → Paradip.

The system could say:

Recommended: Supramax

Best booking window: Next 2–3 weeks

Expected freight trend: Increasing

Reason: Paradip's port constraints + current vessel availability

Risk: Moderate congestion at loading port

Strategy: Lock a 3-voyage contract instead of booking individual spot voyages.

So, in one line, your SIH project is:

“An AI-powered freight forecasting and vessel optimization platform that predicts freight rates, recommends the right vessel and booking time, and helps companies shift from costly spot contracts to optimized multi-voyage charter contracts.”

This is a stronger SIH framing because you're not just building a freight-price prediction model. You're building a decision-support system for chartering, where forecasting directly leads to a business action.
also made connection with https://github.com/ravikeshbalan2005/sih_2026_frontend.git

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/39ee6d45-2b7f-4e8b-89cb-a9f7dbf59ad3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
