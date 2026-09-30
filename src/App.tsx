/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { EpidemiologicalView } from './components/EpidemiologicalView';
import { CivicInspectorView } from './components/CivicInspectorView';
import { IncidentHistoryView } from './components/IncidentHistoryView';
import { ShieldCheck, Activity, Globe2, Radio, Database, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'epidemiology' | 'civic' | 'history'>('epidemiology');
  const [incidents, setIncidents] = useState<any[]>([
    {
      type: 'epidemiological',
      id: 'epi-seed-01',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      title: 'Pediatric Acute Diarrhea & Dehydration Outbreak',
      severity: 'CRITICAL',
      summary:
        'A severe flood-induced outbreak of profuse watery diarrhea has struck a riverside clinic with pediatric dehydration cases rapidly escalating. Complete exhaustion of Ringer\'s Lactate and oral rehydration salts threatens infant survival unless emergency medivac and fluids arrive immediately.',
      data: {
        severity_level: 'CRITICAL',
        crisis_summary:
          'A severe flood-induced outbreak of profuse watery diarrhea has struck a riverside clinic with pediatric dehydration cases rapidly escalating. Complete exhaustion of Ringer\'s Lactate and oral rehydration salts threatens infant survival unless emergency medivac and fluids arrive immediately.',
        immediate_actions: [
          'Authorize immediate boat or helicopter medivac for four unresponsive dehydrated infants to the regional hospital.',
          'Dispatch an emergency airlift of 200 units Ringer\'s Lactate, pediatric IV giving sets, and 500 sachets of ORS.',
          'Instruct the on-duty auxiliary nurse to boil river water and establish a temporary oral rehydration post while awaiting reinforcements.',
        ],
        keywords: ['Cholera', 'Dehydration', 'Flooding', 'IV Fluids', 'Pediatric Shock'],
        inferred_condition: 'Suspected Cholera / Acute Secretory Gastroenteritis',
        confidence_score: 96,
        suspected_etiology: 'Vibrio cholerae / Waterborne pathogen via flood contamination',
        vulnerable_population_impact: 'Infants and small children under 5 years old',
        supply_chain_deficits: ['Ringer Lactate', 'ORS Sachets', 'Pediatric Cannulas', 'Backup Generator Fuel'],
        recommended_quarantine_level: 'Droplet / Contact',
      },
    },
    {
      type: 'civic',
      id: 'civic-seed-01',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      title: 'Pothole: Asphalt Transit Roadway',
      severity: 'High',
      summary:
        'Deep circular pothole crater on a two-lane asphalt public road containing standing rainwater and loose asphalt debris, presenting a severe tire blow-out hazard for public transit.',
      data: {
        issueType: 'Pothole',
        severity: 'High',
        description:
          'Deep circular pothole crater on a two-lane asphalt public road containing standing rainwater and loose asphalt debris, presenting a severe tire blow-out hazard for public transit.',
        confidence: 0.94,
        isCivicIssue: true,
        rawObservations: [
          'Circular asphalt crater approximately 60cm in diameter',
          'Puddle of murky standing water occupying the depression',
          'Fractured asphalt edges with exposed aggregate',
          'Yellow dashed roadway lane dividing line',
          'Surrounding spider-web alligator cracking in asphalt',
        ],
        affectedInfrastructure: 'Municipal roadway asphalt surface and traffic lane',
      },
    },
  ]);

  const handleIncidentLogged = (incident: any) => {
    setIncidents((prev) => [incident, ...prev]);
  };

  const handleClearIncidents = () => {
    setIncidents([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Ticker Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono py-1.5 px-4 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-teal-400 font-bold">
              <Activity className="w-3.5 h-3.5" />
              BRICS HEALTH RESILIENCE PLATFORM
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">
              Protocol: <span className="text-slate-300">WHO-SITREP-COMPLIANT / ICD-11 TRIAGE</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Globe2 className="w-3 h-3 text-cyan-400" />
              <span>Nodes: BRA • RUS • IND • CHN • ZAF</span>
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>Model: Gemini 3.8 Flash</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        incidentCount={incidents.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'epidemiology' && (
          <EpidemiologicalView onIncidentLogged={handleIncidentLogged} />
        )}

        {activeTab === 'civic' && (
          <CivicInspectorView onIncidentLogged={handleIncidentLogged} />
        )}

        {activeTab === 'history' && (
          <IncidentHistoryView
            incidents={incidents}
            onClear={handleClearIncidents}
          />
        )}
      </main>

      {/* Professional Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-slate-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="text-slate-400">
              BRICS Health Resilience Platform • Autonomous Epidemiological & Civic Triage Engine
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Powered by @google/genai & Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Zero-Exposure Server Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
