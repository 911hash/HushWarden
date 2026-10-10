# HushWarden

**The explainable layer between you and the threat.**

[![Live Demo](https://img.shields.io/badge/demo-live-30A46C?style=flat-square)](https://hushwarden.vercel.app)
[![Tests](https://img.shields.io/badge/tests-88%20passing-30A46C?style=flat-square)]()
[![License](https://img.shields.io/badge/license-MIT-4F7DF3?style=flat-square)]()
[![Bundle](https://img.shields.io/badge/bundle-83KB%20gzip-4F7DF3?style=flat-square)]()

---

## The Problem

You get a suspicious email, a link from a customer, or a file someone forwarded. You run it through VirusTotal. Result:

> **4 out of 72 engines flagged this URL.**

So what?

- Is it a high-confidence credential harvester, or four legacy heuristics tripping on an expired certificate?
- Is that "4" actually four independent detections, or one shared blacklist that four vendors ingested?
- Was it clean yesterday and flagged today — meaning an attacker just weaponized it — or has it been flagged for years?
- What should a non-technical employee do with it?

**VirusTotal is a database. It tells you what engines found. It does not tell you what those findings mean.**

That gap — between raw detections and an actionable verdict — is where security teams waste hours, and where non-technical users make the wrong call.

## What HushWarden Does

HushWarden is a full-stack threat intelligence platform for anyone who has to make a security decision they don't have the training to make. It analyzes **four types of targets** across **seven independent intelligence sources**, and produces a verdict you can actually act on.

### Analysis Targets

**URLs** — full redirect-chain tracing with SSRF protection. Every hop is validated against a private-IP blocklist, so scanning a malicious URL never risks your infrastructure.

**File hashes** — MD5, SHA-1, or SHA-256. Lookup-only by default; nothing is submitted without explicit consent.

**Files** — drag-and-drop upload with stream-hashing in memory. Contents are never written to disk, never executed, never uploaded.

**Email** — full RFC-compliant parsing of `.eml` and `.msg` files, or connect your Gmail via read-only OAuth and analyze every incoming message automatically.

### What You Get For Every Target

**A transparent risk score.**
Every point is attributed to a named evidence group — AV detections, reputation lists, domain infrastructure, behavioral signals, geolocation. Each group has a hard cap that prevents double-counting from shared feeds. When five vendors echo the same blacklist, that's one signal, not five.

**A confidence score based on source independence.**
Not "how bad is this" but "how sure are we." Five independent sources agreeing yields high confidence. One weak source yelling into the void yields low confidence, even if the score is elevated.

**Verdict drift tracking.**
Every watchlist target is re-scanned on a schedule. When a sender's reputation changes, you see the exact diff: what was added, removed, or modified, and why. A domain that was clean yesterday and flagged today tells a different story than one that's been flagged for a year.

**Plain-English explanations.**
For non-technical stakeholders. Built by an LLM reasoning chain (Groq → Cloudflare Workers AI → Mistral) that receives **only anonymized evidence**.

**An attack chain visualization.**
Hand-crafted SVG tracing the flow from initial URL through every redirect hop to the final landing destination. Each hop shows the resolved IP, ASN, country, and redirect mechanism.

**A forensic artifact graph.**
Every sender, recipient, IP, ASN, domain, URL, and attachment hash becomes a node in a queryable graph. Click any indicator to pivot to every target that shares it.

**A chronological forensic timeline.**
For any email, see the full lifecycle: domain registration date, certificate issuance, message sent, message delivered, URL first seen by VirusTotal.

### The Platform Around It

**Gmail integration.** Read-only OAuth. HushWarden cannot send, delete, or modify email — ever. Inbox sync runs every 60 seconds, analyzing new messages automatically.

**Watchlist with scheduled rescans.** Add any URL, hash, or email indicator. The background worker checks it on your configured interval and fires an alert the moment the verdict changes.

**Alerts feed.** Every drift event, escalation, or downgrade. Filterable by severity. Grouped by day. Sidebar badge with unread count.

**Investigations history.** Full scan archive with filters, sorting, and bulk actions. Dense data tables with keyboard navigation.

**Case management.** Group related targets into cases. Add comments. Escalate, resolve, reopen. Every state change written to an immutable audit trail.

**Compare view.** Side-by-side diff of any two scans of the same target. Added, removed, and changed factors displayed with plain-English descriptions.

**Command palette.** Cmd+K / Ctrl+K from anywhere. Fuzzy search across routes, recent scans, watchlist targets, and quick actions.

**Analysis dashboard.** Recent scans, KPI strip, drift alerts, source status panel, and a temporal evolution chart.

**Settings.** Live status of every API key, the AI provider chain, privacy toggles, retention policy, and appearance preferences.

### Privacy & Security

**Privacy Mode by default.** URL submission to VirusTotal is off. File uploads are off. Email bodies never persist to disk. Before any LLM call, a local anonymizer strips emails, phone numbers, URLs, and names — the mapping never leaves the server.

**SSRF protection.** Scheme restriction, pre-flight DNS resolution, private-IP blocking, per-hop validation on every redirect, 5-hop cap, 5-second timeout, no cookies, no credentials, no non-standard ports.

**Encrypted tokens.** Gmail refresh tokens are encrypted at rest with Fernet.

**Read-only Gmail scope.** Cannot send, delete, or modify. Ever.

### Design & Engineering

**Multi-user session isolation.** Every table carries a session ID. Two browsers see two inboxes, two histories, two graph views.

**Hand-built design system.** 32 UI primitives — Button, Modal, Drawer, Tooltip, Combobox, DataTable, and more — every one written from scratch. **Zero component libraries.**

**Dark and light themes.** Both accessible. Both intentional. Theme-scoped severity tokens so colors stay legible on any surface.

**Density modes.** Compact (36px rows) for analysts. Comfortable (44px) for general use.

**Defang toggle.** Every URL, IP, and domain displayed as `hxxp://example[.]com` by default. Alt-copy for the live value.

**Keyboard-first.** Every route operable without a mouse. Focus rings on every interactive element. Command palette for navigation.

**Reduced-motion compliant.** Every animation respects `prefers-reduced-motion`.

## Screenshots

> Screenshots coming soon. The live demo at [hushwarden.vercel.app](https://hushwarden.vercel.app) shows the app end-to-end.

## How It Works

```
┌────────────────────────────────────────────────────────────────┐
│  Target input                                                   │
│  ────────────                                                   │
│  URL · Hash · File · Email (.eml, .msg, or Gmail inbox)         │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────┐
│  Seven intelligence sources, queried in parallel                │
│  ──────────────────────────────────────────────                 │
│  • VirusTotal           • Google Safe Browsing                  │
│  • abuse.ch URLhaus     • OpenPhish                             │
│  • DNS resolution       • RDAP domain age                       │
│  • Certificate Transparency (crt.sh)                            │
│                                                                 │
│  Plus, for email:                                               │
│  • SPF / DKIM / DMARC / ARC authentication results              │
│  • Received-chain hop analysis                                  │
│  • Sender / Reply-To mismatch detection                         │
│  • IP geolocation and ASN enrichment                            │
│  • Attachment stream-hashing                                    │
│  • HTML body sanitization                                       │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────┐
│  Deterministic risk engine                                      │
│  ────────────────────────────                                   │
│  Pure function. No network I/O. No clock reads. Every score     │
│  is reproducible from the evidence alone.                       │
│                                                                 │
│  Evidence groups: AV_DETECTIONS · REPUTATION_LISTS ·            │
│  DOMAIN_INFRA · BEHAVIOR · GEOLOCATION · MITIGATING             │
│  Each group has a hard cap. Total caps at 100.                  │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────┐
│  LLM reasoning chain (anonymized)                               │
│  ────────────────────────────────                               │
│  Groq → Cloudflare Workers AI → Mistral                         │
│  Any provider can fail. The chain falls through automatically.  │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────┐
│  Verdict · Evidence · Drift · Timeline · Graph · Cases          │
└────────────────────────────────────────────────────────────────┘
```

## Why Not Just Use VirusTotal?

VirusTotal is one of the seven sources HushWarden consults. It's an excellent database. HushWarden is the layer above it.

| Capability | VirusTotal | HushWarden |
|---|---|---|
| **Purpose** | Detection aggregation | Explainability & correlation |
| **Scoring** | Engine count ratio (e.g., 14/72) | 0–100 with transparent evidence groups and anti-double-counting caps |
| **Confidence** | Implicit | Explicit 0–100%, based on independent source agreement |
| **History** | Snapshot | Verdict drift with deterministic diffs |
| **Language** | Vendor technical tags | Dual-view: plain English + technical |
| **Graph** | Relationship graphs | Queryable artifact graph with pivot |
| **Case management** | None | Full lifecycle with audit trail |
| **Privacy** | Submissions are public | Read-only by default; zero file uploads without consent |

## Tech Stack

**Frontend**
- React 18 + TypeScript + Vite
- Tailwind CSS v3 with a custom token system (dark + light themes)
- Recharts for the temporal sparkline
- **Zero UI component libraries.** Every primitive — Button, Modal, Drawer, Tooltip, Combobox, DataTable, Pagination, Toast — is hand-built.

**Backend**
- FastAPI + Python 3.11
- Pydantic v2 for every request/response boundary
- SQLAlchemy 2.x + SQLite (Postgres-ready)
- httpx (async) with a token-bucket rate limiter for VirusTotal's free tier
- APScheduler for the inbox sync worker and retention purge
- `mail-parser` for RFC-compliant email parsing
- `bleach` for HTML sanitization
- `cryptography` for Fernet token encryption

**AI**
- Groq (primary) → Cloudflare Workers AI (fallback 1) → Mistral (fallback 2)
- Deterministic template fallback if all three providers fail
- PII anonymizer runs before any external call

**Security**
- SSRF protection: private IP blocking, per-hop validation, no non-standard ports
- Read-only Gmail scope (cannot send, delete, or modify)
- Refresh tokens encrypted at rest (Fernet)
- Files stream-hashed in memory, never written to disk

**Deployment**
- Frontend: Vercel
- Backend: Render
- Source: GitHub

## Engineering Notes

- **88 backend tests passing** across risk engine, SSRF, email parsing, OAuth, LLM fallback, forensic graph, case management, and multi-tenant isolation
- **83 KB gzip** initial route (route-level code splitting, Recharts isolated to its own chunk)
- **Zero console errors** across 16 routes
- **Zero horizontal overflow** at 320px on every page, both themes
- **Reduced-motion compliance** verified on all animated surfaces
- **Lighthouse: 98 Performance · 98 Accessibility · 100 Best Practices** on the Overview route

## Privacy

HushWarden is built around a specific promise: **analyze the threat, not the person.**

- Gmail access is strictly `gmail.readonly`. The app cannot send, delete, or modify email.
- Email bodies never persist to disk. Only hashes and structured metadata.
- Before any LLM call, a local PII anonymizer strips email addresses, phone numbers, URLs, and names. The mapping never leaves the server.
- URLs are never submitted to VirusTotal for public scanning unless `ALLOW_VT_URL_SUBMISSION=true` is explicitly set.
- Uploaded files are stream-hashed in memory. Contents are never written to disk or uploaded anywhere.
- Attachments in emails are stream-hashed — never executed, never deserialized, never sent to third parties.

## Setup

### Prerequisites

- Python 3.11+ and Node.js 18+
- A Google Cloud project with the Gmail API enabled
- Optional: API keys for VirusTotal, Google Safe Browsing, abuse.ch, Groq, Cloudflare Workers AI, Mistral

### Local Development

```bash
git clone https://github.com/911hash/HushWarden.git
cd HushWarden

# Backend
cd backend
python -m venv venv
source venv/bin/activate        # Windows: .\venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install

# Env
cd ..
cp .env.example .env
# Edit .env with your credentials

# Run — Terminal 1
cd backend && source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Run — Terminal 2
cd frontend && npm run dev -- --host
```

Open `http://localhost:5173`.

### Environment Variables

See `.env.example`. Required for full functionality:

```ini
# Gmail OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:8000/api/auth/gmail/callback
SESSION_SECRET=                # generate with: openssl rand -hex 32

# Threat intelligence
VIRUSTOTAL_API_KEY=
GOOGLE_SAFE_BROWSING_API_KEY=
ABUSECH_AUTH_KEY=

# AI reasoning chain
LLM_PROVIDER=groq
LLM_API_KEY=
LLM_MODEL=openai/gpt-oss-120b
LLM_FALLBACK_PROVIDERS=cloudflare,mistral
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
MISTRAL_API_KEY=
```

**No keys?** The app runs fully in demo mode with simulated data.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Service status, configured sources, demo mode |
| `GET` | `/api/health/config` | Per-source configuration status (no secrets) |
| `POST` | `/api/analyze/url` | SSRF-safe URL analysis with redirect tracing |
| `POST` | `/api/analyze/hash` | MD5 / SHA-1 / SHA-256 lookup |
| `POST` | `/api/analyze/file` | Stream-hash and analyze uploaded file |
| `POST` | `/api/analyze/email` | Parse, authenticate, and score an email |
| `GET` | `/api/scans` | Paginated scan history |
| `GET` | `/api/scans/{id}` | Full scan report |
| `GET` | `/api/history/{target}` | All scans for a specific target |
| `GET` | `/api/compare/{id1}/{id2}` | Verdict drift diff |
| `GET` | `/api/watchlist` | Monitored targets |
| `POST` | `/api/watchlist` | Add target to watchlist |
| `POST` | `/api/watchlist/{id}/rescan` | Trigger manual rescan |
| `GET` | `/api/alerts` | Threat escalation and drift feed |
| `GET` | `/api/auth/gmail/status` | Gmail connection status |
| `GET` | `/api/inbox` | Gmail inbox with per-email risk scores |
| `POST` | `/api/inbox/sync` | Trigger manual inbox sync |
| `GET` | `/api/graph/recent` | Recent artifact graph nodes |
| `GET` | `/api/graph/pivot/{node_id}` | Pivot to all connected entities |
| `GET` | `/api/timeline/{scan_id}` | Forensic timeline for a scan |
| `POST` | `/api/cases` | Create investigation case |
| `POST` | `/api/cases/{id}/escalate` | Escalate case with note |

## Limitations

- **No native malware engine.** HushWarden is an interpretation layer, not a detection engine.
- **No incremental streaming.** Sources are fetched in parallel and returned as one response.
- **SQLite only.** Postgres migration is a one-line change but hasn't been tested at scale.
- **Single-tenant deployment.** Multi-user session isolation is implemented; multi-tenant org isolation is designed but not enforced at the API layer.

## Roadmap

- [ ] IMAP support (Outlook, Fastmail, self-hosted)
- [ ] MITRE ATT&CK technique mapping on detected factors
- [ ] Webhook alerts (Slack, Teams, PagerDuty) for watchlist drift
- [ ] Postgres migration with read replicas
- [ ] SSO / SAML for team deployments

## License

MIT — see [LICENSE](LICENSE).

---

**Built from scratch.** No component libraries. No templates. Every line of the scoring engine, every UI primitive, every phase verified.