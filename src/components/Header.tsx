import React from 'react';
import { Activity, ShieldCheck, Cpu, Radio, Sparkles, Building2, ClipboardList } from 'lucide-react';

interface HeaderProps {
  activeTab: 'epidemiology' | 'civic' | 'history';
  setActiveTab: (tab: 'epidemiology' | 'civic' | 'history') => void;
  incidentCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, incidentCount }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 shadow-lg shadow-teal-500/20 ring-1 ring-white/20">
              <Activity className="w-6 h-6 text-white stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded bg-teal-500/15 text-teal-400 border border-teal-500/30">
                  BRICS HEALTH RESILIENCE
                </span>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  RURAL TRIAGE NODE
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                AI Epidemiological Analyst
                <span className="text-xs px-2 py-0.5 rounded-full font-normal bg-slate-800 text-slate-300 border border-slate-700">
                  Gemini 3.8 Flash
                </span>
              </h1>
            </div>
          </div>

          {/* Navigation Mode Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveTab('epidemiology')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'epidemiology'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-1 ring-teal-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Epidemiological Triage</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-950/40 font-mono">Primary</span>
            </button>

            <button
              onClick={() => setActiveTab('civic')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'civic'
                  ? 'bg-cyan-700 text-white shadow-md shadow-cyan-700/30 ring-1 ring-cyan-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Civic Inspector</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-950/40 font-mono">Vision</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-slate-800 text-teal-300 ring-1 ring-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>SITREP Log</span>
              {incidentCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-teal-500/20 text-teal-300 font-mono font-bold">
                  {incidentCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick status bar */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-slate-300">Edge Pipeline</span>
            </div>
            <div className="h-3 w-px bg-slate-800"></div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">BRICS Telemetry v4.2</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
