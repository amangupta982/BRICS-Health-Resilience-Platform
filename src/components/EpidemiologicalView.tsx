import React, { useState } from 'react';
import {
  AlertTriangle,
  Send,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Tag,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  Truck,
  CheckSquare,
  Square,
  FileText,
  Volume2,
  Code2,
  Share2,
  Clock,
  Layers,
  MapPin,
  Mic,
} from 'lucide-react';
import { EpidemiologicalAnalysis, PresetReport, SeverityLevel } from '../types';
import { PRESET_REPORTS } from '../data/presets';
import { JsonViewer } from './JsonViewer';

interface EpidemiologicalViewProps {
  onIncidentLogged: (incident: any) => void;
}

export const EpidemiologicalView: React.FC<EpidemiologicalViewProps> = ({ onIncidentLogged }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_REPORTS[0].id);
  const [rawText, setRawText] = useState<string>(PRESET_REPORTS[0].rawText);
  const [region, setRegion] = useState<string>('purus-brazil');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<EpidemiologicalAnalysis | null>(null);
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState<'tactical' | 'json'>('tactical');
  const [simulatedVoicePlaying, setSimulatedVoicePlaying] = useState(false);

  const handleSelectPreset = (preset: PresetReport) => {
    setSelectedPresetId(preset.id);
    setRawText(preset.rawText);
    setRegion(preset.location);
    setCompletedActions({});
  };

  const handleClear = () => {
    setRawText('');
    setSelectedPresetId('');
    setAnalysis(null);
    setError(null);
    setCompletedActions({});
  };

  const handleSimulateVoice = () => {
    setSimulatedVoicePlaying(true);
    // Voice playback simulation using Web Speech synthesis if available
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(rawText.slice(0, 180));
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      utterance.onend = () => setSimulatedVoicePlaying(false);
      utterance.onerror = () => setSimulatedVoicePlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setSimulatedVoicePlaying(false), 2500);
    }
  };

  const runAnalysis = async () => {
    if (!rawText.trim()) {
      setError('Please provide or select a field report text.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: rawText,
          region: region,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Triage failed');
      }

      const data = await response.json();
      const result: EpidemiologicalAnalysis = {
        ...data.analysis,
        id: `epi-${Date.now()}`,
        timestamp: data.timestamp || new Date().toISOString(),
        raw_input: rawText,
        region: region,
      };

      setAnalysis(result);
      setCompletedActions({});
      onIncidentLogged({
        type: 'epidemiological',
        id: result.id,
        timestamp: result.timestamp,
        title: result.inferred_condition || result.keywords[0] || 'Field Incident',
        severity: result.severity_level,
        summary: result.crisis_summary,
        data: result,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Network or model error during report analysis.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAction = (index: number) => {
    setCompletedActions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCopySummary = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.crisis_summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const getSeverityBadge = (level: SeverityLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-500/15 border-red-500/30 text-red-400',
          indicator: 'bg-red-500 shadow-red-500/50',
          ping: 'bg-red-400',
          titleText: 'CRITICAL PRIORITY',
          badgeText: 'IMMEDIATE AIRLIFT / CODE RED',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
          indicator: 'bg-orange-500 shadow-orange-500/50',
          ping: 'bg-orange-400',
          titleText: 'HIGH PRIORITY',
          badgeText: 'URGENT DEPOT REROUTE / 12HR PROTOCOL',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
          indicator: 'bg-yellow-500 shadow-yellow-500/50',
          ping: 'bg-yellow-400',
          titleText: 'MEDIUM CONCERN',
          badgeText: 'INVESTIGATE & BUFFER REFILL',
        };
      case 'LOW':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          indicator: 'bg-emerald-500 shadow-emerald-500/50',
          ping: 'bg-emerald-400',
          titleText: 'ROUTINE STABLE',
          badgeText: 'STANDARD BUFFER INVENTORY',
        };
      default:
        return {
          bg: 'bg-slate-500/15 border-slate-500/30 text-slate-300',
          indicator: 'bg-slate-400',
          ping: 'bg-slate-400',
          titleText: 'UNKNOWN',
          badgeText: 'AWAITING DISPATCH',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Sub-banner & Context */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                FIELD-DISPATCH AI INGESTION
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Automated Medical Ingestion & Triage
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              Rural Health Worker Unstructured Report Classifier
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
              Handles panicked, misspelled, and incomplete field dispatches from remote community health workers across BRICS geographies. Converts chaotic voice/SMS reports into structured epidemiological telemetry and strategic facility manager directives.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const randomPreset = PRESET_REPORTS[Math.floor(Math.random() * PRESET_REPORTS.length)];
                handleSelectPreset(randomPreset);
              }}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
              <span>Random Field Case</span>
            </button>
          </div>
        </div>

        {/* Realistic Presets Scrollbar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Select Realistic Field Incident Dispatch Presets:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {PRESET_REPORTS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`shrink-0 px-3 py-2 rounded-xl text-left border transition cursor-pointer max-w-xs ${
                  selectedPresetId === preset.id
                    ? 'bg-teal-950/40 border-teal-500/50 text-white shadow-sm ring-1 ring-teal-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-bold bg-slate-800 text-slate-300">
                    {preset.regionCode}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      preset.expectedSeverity === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : preset.expectedSeverity === 'HIGH'
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        : preset.expectedSeverity === 'MEDIUM'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {preset.expectedSeverity}
                  </span>
                </div>
                <div className="text-xs font-semibold line-clamp-1 text-slate-200">
                  {preset.title}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-teal-400 shrink-0" />
                  <span>{preset.location}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Raw Text Ingestion Console */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Raw Health Worker Dispatch
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSimulateVoice}
                  title="Simulate Voice Dispatch Audio"
                  className={`p-1.5 rounded-lg border text-xs font-mono transition flex items-center gap-1 cursor-pointer ${
                    simulatedVoicePlaying
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Radio Voice</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200 transition cursor-pointer px-2 py-1 rounded hover:bg-slate-800"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Dispatch Facility / Clinic Region
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. Purus Sub-basin, Amazonas (Brazil)"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            <div className="relative flex-1 mt-2">
              <textarea
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  setSelectedPresetId('');
                }}
                rows={9}
                placeholder="Paste raw, messy, or panicked SMS/WhatsApp report here... (e.g. 'plz send emergency meds river overflow, 14 kids puking watery stool, no iv fluids left...')"
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm font-mono leading-relaxed placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-y"
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-1 px-1">
                <span>{rawText.length} characters • {rawText.split(/\s+/).filter(Boolean).length} words</span>
                <span className="text-teal-400/80">Edge Ingestion Ready</span>
              </div>
            </div>

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 leading-normal">{error}</div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <button
                onClick={runAnalysis}
                disabled={loading || !rawText.trim()}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  loading || !rawText.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 shadow-teal-500/20 active:scale-[0.99]'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Analyzing Clinical Telemetry & Stockout...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Triage Field Report (Gemini 3.8 Flash)</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Strict JSON Output Enforced:</span>
              <span className="text-teal-400 font-semibold">severity • summary • actions • keywords</span>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Output & Tactical Operations Console */}
        <div className="lg:col-span-7 space-y-4">
          {analysis ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
              {/* Output Tab Switcher */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveOutputTab('tactical')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                      activeOutputTab === 'tactical'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Tactical Overview</span>
                  </button>
                  <button
                    onClick={() => setActiveOutputTab('json')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                      activeOutputTab === 'json'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Structured JSON Payload</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <Clock className="w-3 h-3 text-teal-400" />
                  <span>{new Date(analysis.timestamp || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>

              {activeOutputTab === 'tactical' ? (
                <div className="space-y-5">
                  {/* Severity Banner */}
                  {(() => {
                    const badge = getSeverityBadge(analysis.severity_level);
                    return (
                      <div
                        className={`rounded-xl p-4 border ${badge.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-4 w-4 shrink-0">
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${badge.ping} opacity-75`}
                            ></span>
                            <span
                              className={`relative inline-flex rounded-full h-4 w-4 ${badge.indicator}`}
                            ></span>
                          </div>
                          <div>
                            <div className="text-[10px] font-mono font-bold tracking-widest uppercase">
                              Severity Level Classification
                            </div>
                            <div className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                              {analysis.severity_level}
                              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-950/60 text-slate-200 border border-white/10">
                                {badge.titleText}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] font-mono text-slate-400 uppercase">
                            Operational Response Tier
                          </div>
                          <div className="text-xs font-mono font-bold text-white">
                            {badge.badgeText}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 2-Sentence Plain-Language Crisis Summary */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-teal-400" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                          Crisis Summary (2 Sentences)
                        </span>
                      </div>
                      <button
                        onClick={handleCopySummary}
                        className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-teal-400 transition cursor-pointer"
                      >
                        {copiedSummary ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Summary</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                      "{analysis.crisis_summary}"
                    </p>
                  </div>

                  {/* 3 Strategic Recommendations for Facility Manager */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-teal-400" />
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                          Immediate Strategic Recommendations (Facility Manager Directives)
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-teal-400">
                        {Object.values(completedActions).filter(Boolean).length}/
                        {analysis.immediate_actions.length} Completed
                      </span>
                    </div>

                    <div className="space-y-2">
                      {analysis.immediate_actions.map((action, idx) => {
                        const isDone = !!completedActions[idx];
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleAction(idx)}
                            className={`p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer select-none ${
                              isDone
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200 shadow-sm'
                            }`}
                          >
                            <button
                              type="button"
                              className="mt-0.5 shrink-0 text-teal-400"
                            >
                              {isDone ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-500" />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-teal-300">
                                  Action 0{idx + 1}
                                </span>
                              </div>
                              <p
                                className={`text-xs sm:text-sm mt-1 leading-snug ${
                                  isDone ? 'line-through text-slate-400' : 'text-slate-100 font-medium'
                                }`}
                              >
                                {action}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5 Keyword Tags */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                        Keywords (5 Standardized Tags)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30 hover:bg-teal-500/20 transition cursor-default shadow-sm"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Inferred Medical Context Breakdown */}
                  {(analysis.inferred_condition ||
                    analysis.confidence_score !== undefined ||
                    analysis.supply_chain_deficits) && (
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                          Inferred Clinical & Supply Chain Context
                        </span>
                        {analysis.confidence_score !== undefined && (
                          <div className="flex items-center gap-1.5 text-xs font-mono">
                            <span className="text-slate-400">Confidence:</span>
                            <span className="text-emerald-400 font-bold">
                              {analysis.confidence_score}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {analysis.inferred_condition && (
                          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">
                              Primary Inferred Syndrome
                            </span>
                            <span className="font-semibold text-slate-200 mt-0.5 block">
                              {analysis.inferred_condition}
                            </span>
                          </div>
                        )}

                        {analysis.suspected_etiology && (
                          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">
                              Suspected Etiology / Vector
                            </span>
                            <span className="font-semibold text-slate-200 mt-0.5 block">
                              {analysis.suspected_etiology}
                            </span>
                          </div>
                        )}

                        {analysis.vulnerable_population_impact && (
                          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">
                              Demographic Impact
                            </span>
                            <span className="font-semibold text-slate-200 mt-0.5 block">
                              {analysis.vulnerable_population_impact}
                            </span>
                          </div>
                        )}

                        {analysis.recommended_quarantine_level && (
                          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">
                              Infection Control Tier
                            </span>
                            <span className="font-semibold text-cyan-300 mt-0.5 block">
                              {analysis.recommended_quarantine_level}
                            </span>
                          </div>
                        )}
                      </div>

                      {analysis.supply_chain_deficits && analysis.supply_chain_deficits.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] font-mono text-red-400 block uppercase font-semibold mb-1">
                            Critical Supply Chain Deficits & Stockouts:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.supply_chain_deficits.map((item, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-500/10 text-red-300 border border-red-500/20"
                              >
                                ✕ {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[460px]">
                  <JsonViewer data={analysis} title="BRICS Standard Epidemiological Triage Payload" />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800/80 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[420px] text-slate-500 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center text-teal-400 shadow-inner">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-300">
                Awaiting Rural Health Worker Dispatch Ingestion
              </h3>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                Select one of the realistic BRICS field presets above or paste raw, unstructured field text. The AI Epidemiological Analyst will convert it strictly into JSON with severity_level, crisis_summary, immediate_actions, and keywords.
              </p>
              <button
                onClick={runAnalysis}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold font-mono bg-teal-600 hover:bg-teal-500 text-white transition cursor-pointer shadow-md shadow-teal-600/20"
              >
                Ingest & Triage Selected Preset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
