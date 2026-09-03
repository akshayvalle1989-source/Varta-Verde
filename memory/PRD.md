# Varta Verde — Product Requirements Document (living doc)

## Original Problem Statement
Build a complete website from the attached PRD (varta_verde_prd.pdf) using the provided Stitch UI zip for look & feel, and the three research MD files (millet diversification, horticulture guide, farm machinery by soil type) as the data source for information dissemination. No AWS / external cloud. Basic, PRD-adherent website.

## Architecture
- **Frontend:** React 19 (CRA + craco), Tailwind, lucide-react, framer-motion. Custom terracotta/clay + forest-green "Agrarian Clay & Botanical" design system (Plus Jakarta Sans + Noto Sans Devanagari), Warli dotted bands.
- **Backend:** FastAPI, rule-based advisory engines + rule-based Veda Verde chat. No external LLM (user builds/embeds their own custom chatbot later).
- **DB:** Local MongoDB. Collections auto-seeded on startup from `backend/seed_data.py` (distilled from the 3 research MD guides): soil_machinery, crops, horticulture, landraces, schemes, success_stories.
- **No authentication** — fully open access (per PRD). Browser Web Speech API for voice (free).

## User Personas (from PRD)
- Ramesh Kumar — smallholder, low literacy, voice-first (1.5 ha clay-loam, Rajasthan).
- Lakshmi Devi — woman/SHG leader, wants horticulture transition & scheme workflows.
- Siddharth Patel — progressive young farmer, wants landraces & exact implement specs.
- Dr. Anita Rao — KVK extension worker, needs quick lookup + printable sheets.

## Core Requirements (static)
- 4 Advisory Modules with input filters → rule-based recommendation cards.
- Government Schemes portal (SMAM, MIDH, NFSM, PKVY) with eligibility calculator + document checklists + apply links.
- Veda Verde conversational assistant (text + voice), low-confidence fallback → KVK escalation.
- Homepage 2x2 module hub + welcome banner + success story + active subsidies + KVK diagnostic.
- EN + Hindi language toggle. Mobile-first, low-bandwidth, high-legibility outdoor UI.

## Implemented (2026-06)
- [x] Homepage hub dashboard (`GET /api/dashboard`).
- [x] Farm Machinery Advisor — soil × area × topography × tillage rule engine (`POST /api/advisor/machinery`): prime mover, safety warning, implements, secondary implement, SMAM subsidy + CHC rental, spec metrics.
- [x] Crop Diversification Advisor — millets & oilseeds scored by zone/season/rainfall/market (`POST /api/advisor/crops`): water saving vs paddy, yield, MSP, ROI, intercropping, best varieties.
- [x] Livelihood & Horticulture Advisor — flowers/fruits by land/water/capital/market distance (`POST /api/advisor/livelihood`): gestation, setup cost, income, demand seasons, MIDH subsidy.
- [x] Traditional Seed Advisor — landraces by state/pest/salinity/nutrition (`POST /api/advisor/seeds`): strengths, pest resistance, organic protocol, seed bank contacts.
- [x] Govt Schemes portal + eligibility calculator + search/filter (`GET /api/schemes`, `POST /api/schemes/eligibility`).
- [x] Veda Verde rule-based chat with voice input/read-aloud (`POST /api/chat`) + KVK fallback.
- [x] EN/HI toggle, Web Speech voice, PDF-export/print buttons (UI hooks).
- [x] Tested end-to-end: 100% backend + frontend pass (iteration_1).

## Backlog / Remaining (P1/P2)
- P1: Embed user's own custom chatbot in place of the rule-based Veda Verde stub.
- P1: Real PDF export/print of advisory sheets (currently UI buttons).
- P2: Add Telugu/Gujarati/Tamil localizations (PRD phase 1 mentions EN+HI first).
- P2: Offline PWA caching; KVK escalation dashboard; farmer-to-farmer seed exchange forum (PRD phase 3).
- P2: Refine scheme eligibility to actually filter by profile/state.
- P2: Pest-photo upload diagnostic (needs object storage).

## Next Tasks
- Await user review of the MVP and gather feedback on which phase-2/3 features to prioritize.
