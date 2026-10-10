# HushWarden

> **VirusTotal tells you what engines found. HushWarden tells you what it means.**

HushWarden is an explainable threat intelligence platform for email. It connects
to Gmail, analyzes every message across seven independent intelligence sources,
and produces a verdict you can actually understand — with every point of the
score traceable to specific evidence.

---

## The Problem

A security analyst gets a phishing report. VirusTotal says "4/72 engines
flagged this URL." So what?

- Is it a high-confidence credential harvester, or four legacy heuristics
  tripping on an expired certificate?
- Is that "4" actually four independent detections, or one shared blacklist
  that four vendors ingested?
- Was it clean yesterday and flagged today — meaning an attacker just
  weaponized it — or has it been flagged for years?
- What should a non-technical employee do with it?

Traditional threat intelligence tools answer none of these questions. They
report numbers without context, snapshots without history, and detections
without confidence.

---

## What HushWarden Does

1. Connects to your Gmail with read-only OAuth.
2. Analyzes every email across 7 intelligence sources: VirusTotal, Google
   Safe Browsing, abuse.ch URLhaus, OpenPhish, DNS, RDAP, and certificate
   transparency.
3. Correlates independent sources — five vendors sharing a feed count as
   one signal, not five.
4. Tracks verdict drift — every rescan is diffed against the last, so you
   see what changed and why.
5. Generates plain-English explanations via a fallback chain of three LLMs
   (Groq -> Cloudflare Workers AI -> Mistral), with email bodies anonymized
   before any external call.
6. Builds a forensic graph linking every sender, IP, domain, hash, and URL
   across your inbox.

---

## Screenshots

Screenshots of HushWarden across desktop, mobile, and empty states are located in `screenshots/`:
- `screenshots/overview_1280_dark.png` — Overview Dashboard (Desktop Dark Mode)
- `screenshots/overview_1280_light.png` — Overview Dashboard (Desktop Light Mode)
- `screenshots/overview_320_dark.png` — Overview Dashboard (Mobile 320px)
- `screenshots/overview_empty_state.png` — Overview Dashboard (Zero Scans State)
- `screenshots/alerts_1280_dark.png` — Alerts and Drift Feed (Desktop Dark Mode)

<p align="center">
  <img src="media/threatlens-demo.svg" alt="HushWarden dashboard preview" width="840" />
</p>

---

## Architecture

HushWarden is designed as a modular, responsive full-stack system:

```
[ Client: React 18 + TS + Tailwind + Vite ]
                    │
            HTTP / REST (Port 5173 -> 8000)
                    ▼
[ FastAPI App (Python 3.11+) ]
   ├── Multi-User Session Isolation (tl_session SameSite=None; Secure)
   ├── Gmail Read-Only Sync & MIME / RFC 822 Parser
   ├── Anonymized LLM Reasoner (Groq -> Cloudflare AI -> Mistral)
   ├── SSRF Protection & Safe DNS Resolver (socket / ipaddress)
   ├── Pure Risk Engine (Deterministic, Group Caps & Decay)
   ├── Artifact Forensic Graph Service (Nodes, Edges, Cross-Case Pivots)
   ├── Comparison Service (Verdict Drift & Metric Diffs)
   ├── Background Watchlist Monitor (Asyncio Task)
   └── SQLite Database (SQLAlchemy 2.x)
```

---

## Why Not Just Use VirusTotal?

| Capability | VirusTotal | HushWarden |
| :--- | :--- | :--- |
| **Primary Goal** | Massive malware & scanner aggregation database | Explainability, correlation & evolution layer |
| **Scoring Model** | Engine count ratio (e.g. 14/72) | Transparent 0–100 score with group caps & anti-double-counting |
| **Confidence Metric** | Implicit | Explicit 0–100% score based on independent source agreement |
| **Verdict Evolution** | Historical scan timestamps | Direct comparative diffs ("What Changed?") with deterministic summaries |
| **Attack Chain** | Multi-hop relationship graphs | Focused redirect & infrastructure flow visualization |
| **Language** | Security vendor technical tags | Dual-view: Plain English (executive) + Technical (SOC analyst) |
| **Privacy Default** | Public submissions scanned & shared globally | Private lookup only by default; zero file uploads without explicit consent |

---

## Tech Stack

- **Frontend**:
  - React 18 + TypeScript + Vite
  - Vanilla CSS tokens & Tailwind CSS v3 for high-density SOC styling
  - Lucide React for consistent icons
  - Recharts for time-series verdict evolution charts
  - Custom SVG/CSS for Attack Chain & Artifact Graphs
  - React Router v6
- **Backend**:
  - Python 3.11+ / Python 3.12+
  - FastAPI + Pydantic v2
  - SQLite + SQLAlchemy 2.x
  - `httpx` (async HTTP client with timeouts & streaming)
  - Pure deterministic scoring module (isolated from network & database)
- **Servers & Ports**:
  - Backend: `http://localhost:8000`
  - Frontend: `http://localhost:5173`

---

## Local Setup

### Prerequisites
- Python 3.11+ installed and on your PATH
- Node.js 18+ (Node 20+ recommended) and `npm`

### One-Command Start (Linux / macOS)
```bash
chmod +x dev.sh
./dev.sh
```
`dev.sh` will:
1. Copy `.env.example` to `.env` if not present.
2. Create `backend/venv`, activate it, and install `requirements.txt`.
3. Install frontend dependencies via `npm install`.
4. Launch the FastAPI backend on port 8000 and the Vite frontend on port 5173 concurrently.

### One-Command Start (Windows PowerShell)
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\dev.ps1
```
Or start manually in two terminal tabs:
```powershell
# Terminal 1: Backend
cd backend
python -m venv venv
.\venv\Scripts\pip install -r requirements.txt
$env:PYTHONPATH = "backend"
.\venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Frontend
cd frontend
npm install
npm run dev -- --host
```

---

## Privacy

1. **No Automatic URL Submission**: By default, URLs are looked up by report hash only (`ALLOW_VT_URL_SUBMISSION=false`). They are never submitted to public scanning engines without consent.
2. **Zero File Uploads**: Uploaded files are stream-hashed in memory (`SHA-256`, `SHA-1`, `MD5`) and looked up by hash. Binary file contents are **never saved to disk** and never uploaded to external services without explicit user opt-in.
3. **Anonymized LLM Reasoning**: Email bodies are stripped of personal identifiers, sensitive headers, and credentials before reaching external reasoning models.

---

## Limitations

- **No Native Antivirus Engine**: HushWarden synthesizes and correlates multi-source intelligence; it does not disassemble raw binaries or run an in-house kernel scanner.
- **RDAP Rate Limits**: Public RDAP endpoints can rate-limit high-throughput bulk queries.
- **Keyless DNS Visibility**: Passive DNS and historical DNS records require commercial feeds (e.g. SecurityTrails/Farsight).

---

## License

MIT
