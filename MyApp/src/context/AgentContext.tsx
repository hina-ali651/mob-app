/**
 * AgentContext.tsx
 * ----------------
 * Global React context for all agentic state.
 *
 * Provides:
 *  - Voice AI responses (with loading state)
 *  - Wage negotiation results (multi-step)
 *  - Employer verification results
 *  - Market pulse / economic dashboard data
 *
 * Consumers import `useAgent()` — no prop drilling required.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  AgentService,
  JobAdvice,
  MarketPulse,
  NegotiationResult,
  VoiceResponse,
  VerificationResult,
  EscrowVerificationResult,
  WeatherData,
} from '../services/AgentService';

// ─── State Types ──────────────────────────────────────────────────────────────

export type NegotiationPhase =
  | 'idle'
  | 'vetting'
  | 'analysing'
  | 'complete';

export type VerificationPhase =
  | 'idle'
  | 'scanning'
  | 'safe'
  | 'scam';

interface AgentState {
  // ── Voice / Chat ──────────────────────────────────────
  voiceLoading: boolean;
  voiceResponse: VoiceResponse | null;
  clearVoiceResponse: () => void;
  sendVoiceMessage: (
    message: string,
    skill: string,
    city: string,
  ) => Promise<void>;

  // ── Negotiation ───────────────────────────────────────
  negotiationPhase: NegotiationPhase;
  negotiatingJobId: number | null;
  negotiationResult: NegotiationResult | null;
  startNegotiation: (jobId: number, baseRate: number) => Promise<void>;
  clearNegotiation: () => void;

  // ── Employer Verification ─────────────────────────────
  verificationPhase: VerificationPhase;
  verificationResult: VerificationResult | null;
  runEmployerVerification: (phone: string) => Promise<void>;
  submitEmployerReport: (phone: string, name: string, complaint: string) => Promise<any>;
  clearVerification: () => void;

  // ── Market Pulse (Economic Tab) ───────────────────────
  marketPulseLoading: boolean;
  marketPulse: MarketPulse | null;
  fetchMarketPulse: (skill: string, city: string) => Promise<void>;

  // ── Job Advice ────────────────────────────────────────
  jobAdviceLoading: boolean;
  jobAdvice: JobAdvice | null;
  fetchJobAdvice: (
    jobTitle: string,
    jobCategory: string,
    baseRate: number,
    distance: string,
  ) => Promise<void>;
  clearJobAdvice: () => void;

  // ── Escrow Verification ───────────────────────────────
  escrowLoading: boolean;
  escrowResult: EscrowVerificationResult | null;
  submitWorkCompletion: (
    jobId: number,
    jobTitle: string,
    baseRate: number,
    onPayout: (amount: number) => void,
  ) => Promise<void>;
  clearEscrowResult: () => void;

  // ── Weather ───────────────────────────────────────────
  weatherLoading: boolean;
  weatherData: WeatherData | null;
  fetchWeather: (city: string, skill: string) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AgentContext = createContext<AgentState | null>(null);

export function useAgent(): AgentState {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgent must be used inside <AgentProvider>');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AgentProvider({ children }: { children: React.ReactNode }) {
  // ── Voice / Chat ─────────────────────────────────────────────────────────
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState<VoiceResponse | null>(null);

  const sendVoiceMessage = useCallback(
    async (message: string, skill: string, city: string) => {
      setVoiceLoading(true);
      try {
        // Use the agentic orchestrator — it classifies intent and routes
        // to the right specialist (market, safety, job_advice, or chat).
        const res = await AgentService.orchestrate(message, skill, city);
        setVoiceResponse(res);
      } finally {
        setVoiceLoading(false);
      }
    },
    [],
  );

  const clearVoiceResponse = useCallback(() => setVoiceResponse(null), []);

  // ── Negotiation ──────────────────────────────────────────────────────────
  const [negotiationPhase, setNegotiationPhase] = useState<NegotiationPhase>('idle');
  const [negotiatingJobId, setNegotiatingJobId] = useState<number | null>(null);
  const [negotiationResult, setNegotiationResult] = useState<NegotiationResult | null>(null);

  const startNegotiation = useCallback(
    async (jobId: number, baseRate: number) => {
      setNegotiatingJobId(jobId);
      setNegotiationResult(null);

      // Phase 1 – Vetting employer credibility (local fast pass)
      setNegotiationPhase('vetting');
      await new Promise(r => setTimeout(r, 1400));

      // Phase 2 – Calling AI for rate intelligence
      setNegotiationPhase('analysing');
      const result = await AgentService.negotiate(jobId, baseRate);

      setNegotiationResult(result);
      setNegotiationPhase('complete');
    },
    [],
  );

  const clearNegotiation = useCallback(() => {
    setNegotiationPhase('idle');
    setNegotiatingJobId(null);
    setNegotiationResult(null);
  }, []);

  // ── Employer Verification ────────────────────────────────────────────────
  const [verificationPhase, setVerificationPhase] = useState<VerificationPhase>('idle');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const runEmployerVerification = useCallback(async (phone: string) => {
    setVerificationPhase('scanning');
    setVerificationResult(null);
    const result = await AgentService.verifyEmployer(phone);
    setVerificationResult(result);
    setVerificationPhase(result.status); // 'safe' | 'scam'
  }, []);

  const submitEmployerReport = useCallback(async (phone: string, name: string, complaint: string) => {
    const result = await AgentService.reportEmployer(phone, name, complaint);
    return result;
  }, []);

  const clearVerification = useCallback(() => {
    setVerificationPhase('idle');
    setVerificationResult(null);
  }, []);

  // ── Market Pulse ─────────────────────────────────────────────────────────
  const [marketPulseLoading, setMarketPulseLoading] = useState(false);
  const [marketPulse, setMarketPulse] = useState<MarketPulse | null>(null);

  const fetchMarketPulse = useCallback(async (skill: string, city: string) => {
    setMarketPulseLoading(true);
    try {
      const result = await AgentService.getMarketPulse(skill, city);
      setMarketPulse(result);
    } finally {
      setMarketPulseLoading(false);
    }
  }, []);

  // ── Job Advice ───────────────────────────────────────────────────────────
  const [jobAdviceLoading, setJobAdviceLoading] = useState(false);
  const [jobAdvice, setJobAdvice] = useState<JobAdvice | null>(null);

  const fetchJobAdvice = useCallback(
    async (
      jobTitle: string,
      jobCategory: string,
      baseRate: number,
      distance: string,
    ) => {
      setJobAdviceLoading(true);
      try {
        const result = await AgentService.getJobAdvice(
          jobTitle,
          jobCategory,
          baseRate,
          distance,
        );
        setJobAdvice(result);
      } finally {
        setJobAdviceLoading(false);
      }
    },
    [],
  );

  const clearJobAdvice = useCallback(() => setJobAdvice(null), []);

  // ── Escrow Verification ──────────────────────────────────────────────────
  const [escrowLoading, setEscrowLoading] = useState(false);
  const [escrowResult, setEscrowResult] = useState<EscrowVerificationResult | null>(null);

  const submitWorkCompletion = useCallback(
    async (
      jobId: number,
      jobTitle: string,
      baseRate: number,
      onPayout: (amount: number) => void,
    ) => {
      setEscrowLoading(true);
      try {
        const result = await AgentService.verifyWorkCompletion(
          jobId,
          jobTitle,
          baseRate,
        );
        setEscrowResult(result);
        if (result.status === 'APPROVED') {
          onPayout(result.payout_released);
        }
      } finally {
        setEscrowLoading(false);
      }
    },
    [],
  );

  const clearEscrowResult = useCallback(() => setEscrowResult(null), []);

  // ── Weather State ───────────────────────────────────────
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const fetchWeather = useCallback(async (city: string, skill: string) => {
    setWeatherLoading(true);
    try {
      const data = await AgentService.fetchWeather(city, skill);
      setWeatherData(data);
    } catch (e) {
      console.warn('[AgentContext] fetchWeather error', e);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  // ─── Context Value ───────────────────────────────────────────────────────
  const value: AgentState = {
    voiceLoading,
    voiceResponse,
    clearVoiceResponse,
    sendVoiceMessage,

    negotiationPhase,
    negotiatingJobId,
    negotiationResult,
    startNegotiation,
    clearNegotiation,

    verificationPhase,
    verificationResult,
    runEmployerVerification,
    submitEmployerReport,
    clearVerification,

    marketPulseLoading,
    marketPulse,
    fetchMarketPulse,

    jobAdviceLoading,
    jobAdvice,
    fetchJobAdvice,
    clearJobAdvice,

    escrowLoading,
    escrowResult,
    submitWorkCompletion,
    clearEscrowResult,
    // Weather
    weatherLoading,
    weatherData,
    fetchWeather,
  };

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
}
