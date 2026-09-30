import React, { useState } from 'react';
import {
  ClipboardList,
  Download,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Building2,
  ExternalLink,
  Search,
} from 'lucide-react';
import { JsonViewer } from './JsonViewer';

interface IncidentRecord {
  type: 'epidemiological' | 'civic';
  id: string;
  timestamp: string;
  title: string;
  severity: string;
  summary: string;
  data: any;
}

interface IncidentHistoryViewProps {
  incidents: IncidentRecord[];
  onClear: () => void;
}

export const IncidentHistoryView: React.FC<IncidentHistoryViewProps> = ({ incidents, onClear }) => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(
    incidents.length > 0 ? incidents[0] : null
  );
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredIncidents = incidents.filter((item) => {
    const matchesSeverity =
      severityFilter === 'ALL' || item.severity?.toUpperCase() === severityFilter.toUpperCase();
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleExportAll = () => {
    const jsonString = JSON.stringify(incidents, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brics-triage-audit-log-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-teal-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              SITREP Incident & Triage Telemetry Log
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail of all processed rural health worker reports and municipal civic hazard inspections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAll}
            disabled={incidents.length === 0}
            className={`px-3 py-2 text-xs font-mono font-semibold rounded-xl border flex items-center gap-1.5 transition cursor-pointer ${
              incidents.length === 0
                ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export All JSON</span>
          </button>

          <button
            onClick={onClear}
            disabled={incidents.length === 0}
            className={`px-3 py-2 text-xs font-mono font-semibold rounded-xl border flex items-center gap-1.5 transition cursor-pointer ${
              incidents.length === 0
                ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms, pathogens, locations, or descriptions..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSeverityFilter(lvl)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                severityFilter === lvl
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Log split view */}
      {filteredIncidents.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold text-slate-400">No triage records found in this view.</p>
          <p className="text-xs mt-1">Run an analysis in the Epidemiological Triage or Civic Inspector tabs to log incidents.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Incident List */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredIncidents.map((incident) => {
              const isSelected = selectedIncident?.id === incident.id;
              const isEpi = incident.type === 'epidemiological';
              return (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500/50 shadow-md ring-1 ring-teal-500/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400">
                      {isEpi ? (
                        <>
                          <Stethoscope className="w-3 h-3 text-teal-400" />
                          <span>EPI DISPATCH</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3 h-3 text-cyan-400" />
                          <span>CIVIC PHOTO</span>
                        </>
                      )}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        incident.severity?.toUpperCase() === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : incident.severity?.toUpperCase() === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : incident.severity?.toUpperCase() === 'MEDIUM'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {incident.severity}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-200 line-clamp-1">
                    {incident.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {incident.summary}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-2">
                    {new Date(incident.timestamp).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Incident Detail Viewer */}
          <div className="lg:col-span-7 h-[600px]">
            {selectedIncident ? (
              <JsonViewer
                data={selectedIncident.data}
                title={`Incident Audit: ${selectedIncident.id}`}
              />
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl h-full flex items-center justify-center text-slate-500">
                Select an incident from the log to view its full structured payload.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
