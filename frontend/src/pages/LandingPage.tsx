import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Crosshair,
  Layers,
  Gauge,
  Target,
  TrendingUp,
  Sparkles,
  GitBranch,
  Network,
  Clock,
  Bell,
  FolderTree,
  Globe,
  Hash,
  FileText,
  Mail,
  Sun,
  Moon,
  ArrowRight,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from '../design/ThemeContext';
import { api } from '../api/client';

const VENDOR_NAMES = [
  'Kaspersky', 'BitDefender', 'CrowdStrike', 'Sophos', 'Fortinet', 'Microsoft', 'ESET', 'Avast',
  'Symantec', 'TrendMicro', 'Google', 'PaloAlto', 'FireEye', 'CheckPoint', 'Cisco', 'F-Secure',
  'ClamAV', 'Cyren', 'GData', 'Malwarebytes', 'McAfee', 'SentinelOne', 'Vipre', 'Webroot',
  'Yandex', 'Zillya', 'ZoneAlarm', 'Acronis', 'AhnLab', 'ALYac', 'Antiy-AVL', 'Arcabit',
  'Avira', 'Baidu', 'CMC', 'Comodo', 'DrWeb', 'Emsisoft', 'Gridinsoft', 'Ikarus',
  'Jiangmin', 'K7AntiVirus', 'K7GW', 'Kingsoft', 'Lionic', 'MAX', 'MaxSecure', 'NANO-Antivirus',
  'QuickHeal', 'Rising', 'Sangfor', 'SUPERAntiSpyware', 'TACHYON', 'Tencent', 'TotalDefense', 'Trustlook',
  'VBA32', 'ViRobot', 'Zoner', 'Cynet', 'DeepInstinct', 'Elastic', 'Sentinel', 'Trellix',
  'WithSecure', 'Varist', 'Tehtris', 'Huorong', 'Alibaba', 'Skyhigh', 'CTX', 'Trapmine'
];

const FLAGGED_VENDORS = new Set(['Kaspersky', 'BitDefender', 'CrowdStrike', 'Sophos']);

interface LiveStatsData {
  sourcesOnline: number;
  totalSources: number;
  status: 'green' | 'amber' | 'red';
  aiChain: string;
}

// FadeIn component that respects prefers-reduced-motion with intersection observer
const FadeIn: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '100px 0px 100px 0px' }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    // Safety timer ensures content is never left invisible in headless / slow environments
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 400);

    return () => {
      clearTimeout(fallbackTimer);
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-200 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveStats, setLiveStats] = useState<LiveStatsData | null>(null);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api
      .getHealthConfig()
      .then(data => {
        if (!isMounted) return;
        if (!data || !data.sources) {
          setStatsError(true);
          return;
        }
        const configuredCount = Object.values(data.sources).filter(s => s?.configured).length;
        const totalCount = Object.keys(data.sources).length || 7;
        setLiveStats({
          sourcesOnline: configuredCount,
          totalSources: totalCount,
          status: configuredCount >= 5 ? 'green' : configuredCount > 0 ? 'amber' : 'red',
          aiChain: 'Groq · Cloudflare · Mistral',
        });
      })
      .catch(() => {
        if (isMounted) {
          setStatsError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans antialiased selection:bg-blue-500/20 selection:text-blue-400 overflow-x-hidden">
      {/* Skip to Content Link */}
      <a
        href="#landing-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:ring-2 focus:ring-blue-400 font-medium text-xs"
      >
        Skip to content
      </a>

      {/* SECTION 1 — NAV BAR */}
      <header
        role="banner"
        className="sticky top-0 z-40 h-16 w-full backdrop-blur-md bg-[var(--bg-base)]/85 border-b border-[var(--border-subtle)] transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Left: Wordmark + Tagline */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
            title="HushWarden - Explainable Threat Intelligence"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-600/20 transition-colors">
              <svg viewBox="0 0 32 32" className="w-7 h-7" aria-hidden="true">
                <path
                  d="M16 3 L27 8 V16 C27 23 22 28 16 29 C10 28 5 23 5 16 V8 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <line
                  x1="11"
                  y1="17"
                  x2="21"
                  y2="17"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-bold text-sm tracking-wider text-[var(--text-primary)] leading-tight">
                HUSH<span className="text-blue-500">WARDEN</span>
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)] font-sans hidden sm:inline leading-none">
                Explainable Threat Intelligence
              </span>
            </div>
          </div>

          {/* Right: Desktop Links + Theme Toggle + Launch App */}
          <nav
            aria-label="Public marketing navigation"
            className="hidden md:flex items-center gap-6"
          >
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('privacy')}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
            >
              Privacy
            </button>
            <a
              href="https://github.com/ankitdey/threatlens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Toggle theme (currently ${theme})`}
              aria-pressed={theme === 'dark'}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Mobile Right Controls: Theme Toggle & Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Toggle theme (currently ${theme})`}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-panel)] px-4 py-4 space-y-3 shadow-lg">
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('privacy')}
              className="block w-full text-left py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Privacy
            </button>
            <a
              href="https://github.com/ankitdey/threatlens"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
              >
                <span>Launch HushWarden</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main id="landing-main" tabIndex={-1} className="focus:outline-none">
        {/* SECTION 2 — HERO */}
        <section
          id="hero"
          aria-labelledby="hero-heading"
          className="pt-20 pb-20 md:pt-28 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <FadeIn className="max-w-[720px] mx-auto text-center flex flex-col items-center">
            {/* Eyebrow */}
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-400">
                EXPLAINABLE THREAT INTELLIGENCE
              </span>
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-3xl sm:text-[48px] font-semibold text-[var(--text-primary)] tracking-tight leading-[1.15] mb-6"
            >
              VirusTotal tells you what engines found.{' '}
              <span className="block mt-1 text-blue-500">HushWarden tells you what it means.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-[18px] text-[var(--text-secondary)] leading-relaxed mb-8 max-w-[660px]">
              Analyze URLs, file hashes, files, and email across seven independent intelligence
              sources. Get a transparent risk score, a confidence rating, and a verdict you can
              actually act on.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              >
                <span>Launch HushWarden</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--bg-panel)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              >
                <span>See how it works</span>
              </button>
            </div>

            {/* Stat line */}
            <p className="text-xs sm:text-[14px] text-[var(--text-tertiary)] font-mono tracking-tight">
              88 backend tests · 83 KB initial bundle · Zero UI libraries
            </p>
          </FadeIn>
        </section>

        {/* SECTION 7 (PRE-EMPTIVE RESERVED AREA) / LIVE STATS BAR */}
        {/* Placed prominently below hero or problem, reserve space for live stats bar to avoid layout shift */}
        <section
          id="live-stats"
          aria-labelledby="live-stats-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
        >
          <h2 id="live-stats-heading" className="sr-only">
            Live Telemetry Stats
          </h2>
          <div className="min-h-[52px]">
            {liveStats && !statsError ? (
              <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] shadow-xs transition-opacity duration-200">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      liveStats.status === 'green'
                        ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                        : liveStats.status === 'amber'
                        ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                        : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                    }`}
                  />
                  <span className="font-medium text-[var(--text-primary)]">Backend Status:</span>
                  <span
                    className={`font-mono ${
                      liveStats.status === 'green'
                        ? 'text-emerald-400'
                        : liveStats.status === 'amber'
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {liveStats.status === 'green' ? 'Operational' : 'Degraded'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-tertiary)]">Sources Online:</span>
                  <span className="font-mono font-medium text-[var(--text-primary)] bg-[var(--bg-inset)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                    {liveStats.sourcesOnline} / {liveStats.totalSources}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-tertiary)]">AI Provider Chain:</span>
                  <span className="font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {liveStats.aiChain}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* SECTION 3 — THE PROBLEM */}
        <section
          id="problem"
          aria-labelledby="problem-heading"
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)]"
        >
          <FadeIn className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column (60% at 1280px) */}
            <div className="lg:col-span-7">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-500 block mb-3">
                THE PROBLEM
              </span>
              <h2
                id="problem-heading"
                className="text-2xl sm:text-[32px] font-semibold text-[var(--text-primary)] tracking-tight leading-snug mb-5"
              >
                A detection count is not a verdict.
              </h2>
              <p className="text-base sm:text-[16px] text-[var(--text-secondary)] leading-relaxed mb-4">
                You run a suspicious URL through VirusTotal. Result: 4 out of 72 engines flagged it.
                So what?
              </p>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Is that four independent signals, or one shared blacklist that four vendors ingested?
                Was it clean yesterday and flagged today? A number without context is not a decision.
              </p>
            </div>

            {/* Right Column (40% at 1280px) — Styled Mockup Card */}
            <div className="lg:col-span-5">
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-5 shadow-sm font-mono overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <span className="text-xs sm:text-sm font-semibold text-red-400">
                      4 / 72 engines detected
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-tertiary)] bg-[var(--bg-inset)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                    RAW FEED
                  </span>
                </div>

                {/* 72 Vendor Names Matrix */}
                <div
                  aria-label="72 multi-engine vendor detections mockup"
                  className="max-h-[170px] overflow-y-auto pr-1 flex flex-wrap gap-1.5"
                >
                  {VENDOR_NAMES.map(vendor => {
                    const isFlagged = FLAGGED_VENDORS.has(vendor);
                    return (
                      <span
                        key={vendor}
                        className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                          isFlagged
                            ? 'bg-red-500/15 border border-red-500/35 text-red-400 font-semibold shadow-xs'
                            : 'bg-[var(--bg-inset)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        {vendor}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Context Note Below Mockup Card */}
              <div className="mt-4 p-3 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed italic">
                &ldquo;Is that four independent signals, or one shared blacklist that four vendors
                ingested? Was it clean yesterday and flagged today? A number without context is not a
                decision.&rdquo;
              </div>
            </div>
          </FadeIn>
        </section>

        {/* SECTION 4 — HOW IT WORKS */}
        <section
          id="how-it-works"
          aria-labelledby="how-it-works-heading"
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)]"
        >
          <FadeIn>
            <div className="text-center max-w-[640px] mx-auto mb-14">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-500 block mb-3">
                HOW IT WORKS
              </span>
              <h2
                id="how-it-works-heading"
                className="text-2xl sm:text-[32px] font-semibold text-[var(--text-primary)] tracking-tight leading-snug"
              >
                From raw indicator to explainable decision
              </h2>
            </div>

            {/* Three-step visual */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-3">
              {/* Step 1 */}
              <div className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-6 h-full flex flex-col hover:border-[var(--border-strong)] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                    <Crosshair className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                    STEP 01
                  </span>
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Analyze any target
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  URLs with full redirect tracing. File hashes (MD5, SHA-1, SHA-256). Files via
                  drag-and-drop. Email via .eml upload or Gmail inbox sync.
                </p>
              </div>

              {/* Arrow Connector 1 */}
              <div className="hidden lg:flex items-center justify-center shrink-0 px-2" aria-hidden="true">
                <svg
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                  fill="none"
                  className="text-blue-500/70"
                >
                  <path
                    d="M2 10H24M24 10L16 2M24 10L16 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-6 h-full flex flex-col hover:border-[var(--border-strong)] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                    STEP 02
                  </span>
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Correlate seven sources
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  VirusTotal, Google Safe Browsing, URLhaus, OpenPhish, DNS, RDAP, and Certificate
                  Transparency — queried in parallel. For email: SPF/DKIM/DMARC auth, header
                  forensics, sender geolocation.
                </p>
              </div>

              {/* Arrow Connector 2 */}
              <div className="hidden lg:flex items-center justify-center shrink-0 px-2" aria-hidden="true">
                <svg
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                  fill="none"
                  className="text-emerald-500/70"
                >
                  <path
                    d="M2 10H24M24 10L16 2M24 10L16 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Step 3 */}
              <div className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-6 h-full flex flex-col hover:border-[var(--border-strong)] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                    STEP 03
                  </span>
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Get an explainable verdict
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Every point traceable. Confidence based on source agreement. Plain-English
                  explanation. Drift tracking over time.
                </p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* SECTION 5 — FEATURES GRID */}
        <section
          id="features"
          aria-labelledby="features-heading"
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)]"
        >
          <FadeIn>
            <div className="text-center max-w-[640px] mx-auto mb-14">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-500 block mb-3">
                FEATURES
              </span>
              <h2
                id="features-heading"
                className="text-2xl sm:text-[32px] font-semibold text-[var(--text-primary)] tracking-tight leading-snug"
              >
                Enterprise-grade threat intelligence without the black box
              </h2>
            </div>

            {/* 9 Feature Cards: 3 columns desktop, 2 tablet, 1 mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card 1 */}
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-6 hover:border-[var(--border-strong)] transition-colors flex flex-col">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                  <Gauge className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Transparent scoring
                </h3>
                <p className="text-sm sm:text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  Every point attributed to a named evidence group with a hard cap. Five vendors
                  sharing a feed count as one signal, not five.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-6 hover:border-[var(--border-strong)] transition-colors flex flex-col">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Confidence, not just severity
                </h3>
                <p className="text-sm sm:text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  0–100 confidence derived from independent source agreement. One weak source alone
                  cannot manufacture high confidence.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-6 hover:border-[var(--border-strong)] transition-colors flex flex-col">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Verdict drift tracking
                </h3>
                <p className="text-sm sm:text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  Every rescan produces a deterministic diff. See exactly what changed and why — not
                  just that something changed.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-6 hover:border-[var(--border-strong)] transition-colors flex flex-col">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Plain-English explanations
                </h3>
                <p className="text-sm sm:text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  Powered by an LLM chain (Groq → Cloudflare → Mistral) that receives only
                  anonymized evidence. PII never leaves the server.
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-6 hover:border-[var(--border-strong)] transition-colors flex flex-col">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                  <GitBranch className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Attack chain visualization
                </h3>
                <p className="text-sm sm:text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  Hand-crafted SVG tracing every redirect hop from initial URL to final landing
                  destination. Each hop shows IP, ASN, and country.
                </p>
              </div>

              {/* Card 6 */}
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-6 hover:border-[var(--border-strong)] transition-colors flex flex-col">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                  <Network className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Forensic artifact graph
                </h3>
                <p className="text-sm sm:text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  Every sender, IP, domain, and hash becomes a queryable node. Click any indicator
                  to pivot to every target that shares it.
                </p>
              </div>

              {/* Card 7 */}
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-6 hover:border-[var(--border-strong)] transition-colors flex flex-col">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Chronological forensic timeline
                </h3>
                <p className="text-sm sm:text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  For any email: domain registration date, certificate issuance, message sent,
                  message delivered, URL first seen by VirusTotal.
                </p>
              </div>

              {/* Card 8 */}
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-6 hover:border-[var(--border-strong)] transition-colors flex flex-col">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Watchlist and alerts
                </h3>
                <p className="text-sm sm:text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  Add any indicator. Background rescans on your schedule. Get alerted the moment the
                  verdict changes.
                </p>
              </div>

              {/* Card 9 */}
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-6 hover:border-[var(--border-strong)] transition-colors flex flex-col">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                  <FolderTree className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Case management
                </h3>
                <p className="text-sm sm:text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  Group related targets into cases. Comment, escalate, resolve. Every action written
                  to an immutable audit trail.
                </p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* SECTION 6 — ANALYSIS TARGETS STRIP */}
        <section
          id="targets"
          aria-labelledby="targets-heading"
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)]"
        >
          <FadeIn>
            <div className="mb-8">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-500 block mb-2">
                WHAT YOU CAN ANALYZE
              </span>
              <h2
                id="targets-heading"
                className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tracking-tight"
              >
                Comprehensive threat intelligence across four distinct vectors
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* URL */}
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-5 flex flex-col hover:border-[var(--border-strong)] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-3">
                  <Globe className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">URL</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Full redirect-chain tracing with SSRF protection.
                </p>
              </div>

              {/* Hash */}
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-5 flex flex-col hover:border-[var(--border-strong)] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-3">
                  <Hash className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">Hash</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  MD5, SHA-1, or SHA-256 lookup with reputation context.
                </p>
              </div>

              {/* File */}
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-5 flex flex-col hover:border-[var(--border-strong)] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-3">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">File</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Drag-and-drop upload. Stream-hashed in memory. Never stored.
                </p>
              </div>

              {/* Email */}
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[10px] p-5 flex flex-col hover:border-[var(--border-strong)] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-3">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">Email</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  .eml upload or Gmail inbox sync with full header forensics.
                </p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* SECTION 8 — PRIVACY CALLOUT */}
        <section
          id="privacy"
          aria-labelledby="privacy-heading"
          className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)]"
        >
          <FadeIn className="max-w-[720px] mx-auto">
            <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] border-l-4 border-l-blue-500 rounded-[10px] p-6 sm:p-8 shadow-sm">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-500 block mb-2">
                PRIVACY BY DESIGN
              </span>
              <h2
                id="privacy-heading"
                className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-3"
              >
                Analyze the threat. Not the person.
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                Email bodies never touch disk. Before any LLM call, a local anonymizer strips emails,
                phone numbers, URLs, and names. The mapping never leaves your server. Files are
                stream-hashed in memory and never uploaded. URLs are never submitted to VirusTotal
                for public scanning unless you explicitly opt in. Gmail access is strictly
                read-only.
              </p>
              <a
                href="https://github.com/ankitdey/threatlens#privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
              >
                <span>Read the full privacy design</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </FadeIn>
        </section>

        {/* SECTION 9 — FINAL CTA */}
        <section
          id="final-cta"
          aria-labelledby="final-cta-heading"
          className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-t border-[var(--border-subtle)]"
        >
          <FadeIn className="max-w-[720px] mx-auto">
            <h2
              id="final-cta-heading"
              className="text-2xl sm:text-[32px] font-semibold text-[var(--text-primary)] tracking-tight mb-4"
            >
              See what your sources have been hiding.
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
              HushWarden is live. Analyze your first target in under 60 seconds.
            </p>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-base transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            >
              <span>Launch HushWarden</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </FadeIn>
        </section>
      </main>

      {/* SECTION 10 — FOOTER */}
      <footer
        role="contentinfo"
        aria-label="HushWarden footer"
        className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-panel)] min-h-[64px] py-6 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Col 1: Wordmark + tagline */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
              <svg viewBox="0 0 32 32" className="w-7 h-7" aria-hidden="true">
                <path
                  d="M16 3 L27 8 V16 C27 23 22 28 16 29 C10 28 5 23 5 16 V8 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <line
                  x1="11"
                  y1="17"
                  x2="21"
                  y2="17"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs tracking-wider text-[var(--text-primary)]">
                HUSH<span className="text-blue-500">WARDEN</span>
              </span>
              <span className="text-xs text-[var(--text-tertiary)] hidden sm:inline">·</span>
              <span className="text-xs text-[var(--text-tertiary)]">
                Explainable threat intelligence.
              </span>
            </div>
          </div>

          {/* Col 2: Links */}
          <nav
            aria-label="Footer links"
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-[var(--text-secondary)]"
          >
            <a
              href="https://github.com/ankitdey/threatlens"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
            >
              GitHub
            </a>
            <span className="text-[var(--text-tertiary)]">·</span>
            <a
              href="https://github.com/ankitdey/threatlens#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
            >
              README
            </a>
            <span className="text-[var(--text-tertiary)]">·</span>
            <button
              type="button"
              onClick={() => scrollToSection('privacy')}
              className="hover:text-[var(--text-primary)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
            >
              Privacy
            </button>
            <span className="text-[var(--text-tertiary)]">·</span>
            <a
              href="https://github.com/ankitdey/threatlens#limitations"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
            >
              Limitations
            </a>
          </nav>

          {/* Col 3: Copyright */}
          <div className="text-xs text-[var(--text-tertiary)] text-center md:text-right">
            Built by Ankit Dey · MIT License · 2026
          </div>
        </div>
      </footer>
    </div>
  );
};
