import React, { useState } from 'react';
import {
  Building2,
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  RefreshCw,
  Send,
  Layers,
  Code,
  FileCheck,
  Image as ImageIcon,
  Check,
  Copy,
} from 'lucide-react';
import { CivicInspectionAnalysis, PresetCivicInspection } from '../types';
import { PRESET_CIVIC_INSPECTIONS } from '../data/presets';
import { JsonViewer } from './JsonViewer';

interface CivicInspectorViewProps {
  onIncidentLogged: (incident: any) => void;
}

export const CivicInspectorView: React.FC<CivicInspectorViewProps> = ({ onIncidentLogged }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_CIVIC_INSPECTIONS[0].id);
  const [activeImageUri, setActiveImageUri] = useState<string>(PRESET_CIVIC_INSPECTIONS[0].svgDataUri || '');
  const [userNote, setUserNote] = useState<string>('Analyze this photo and classify the civic infrastructure issue.');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [classification, setClassification] = useState<CivicInspectionAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');

  const handleSelectPreset = (preset: PresetCivicInspection) => {
    setSelectedPresetId(preset.id);
    setActiveImageUri(preset.svgDataUri || '');
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setActiveImageUri(dataUri);
      setSelectedPresetId('custom-upload');
    };
    reader.readAsDataURL(file);
  };

  const runClassification = async () => {
    if (!activeImageUri) {
      setError('Please select or upload a citizen photo for inspection.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Determine if image is SVG data URI or raster
      let imageBase64Payload = '';
      let mimeType = 'image/jpeg';

      if (activeImageUri.startsWith('data:image/')) {
        const parts = activeImageUri.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        if (mimeMatch) mimeType = mimeMatch[1];
        imageBase64Payload = parts[1] || '';
      }

      // If SVG data uri, convert to canvas png base64 for vision API
      if (activeImageUri.includes('svg+xml')) {
        imageBase64Payload = await convertSvgDataUriToPngBase64(activeImageUri);
        mimeType = 'image/png';
      }

      const response = await fetch('/api/classify-civic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageBase64Payload,
          mimeType: mimeType,
          text: userNote,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Inspection failed');
      }

      const data = await response.json();
      const result: CivicInspectionAnalysis = {
        ...data.classification,
        id: `civic-${Date.now()}`,
        timestamp: data.timestamp || new Date().toISOString(),
        imageUrl: activeImageUri,
      };

      setClassification(result);
      onIncidentLogged({
        type: 'civic',
        id: result.id,
        timestamp: result.timestamp,
        title: `${result.issueType}: ${result.affectedInfrastructure}`,
        severity: result.severity,
        summary: result.description,
        data: result,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while inspecting image.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render SVG to canvas PNG for vision API
  const convertSvgDataUriToPngBase64 = (svgUri: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, 600, 400);
          ctx.drawImage(img, 0, 0, 600, 400);
          const pngUrl = canvas.toDataURL('image/png');
          resolve(pngUrl.split(',')[1]);
        } else {
          resolve('');
        }
      };
      img.onerror = () => {
        resolve('');
      };
      img.src = svgUri;
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner & Refuses Fakes Tip */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                FIRST-PASS MUNICIPAL CIVIC INSPECTOR
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Multimodal Image Classification
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              Citizen Photo Infrastructure & Fraud Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
              Analyzes citizen complaint photos and strictly classifies genuine public infrastructure hazards versus personal/indoor non-civic objects. A second agent verifies this output.
            </p>
          </div>

          <div className="px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-cyan-400 font-bold block mb-0.5">Refuses Fakes Proof:</span>
            <span>Indoor scenes, laptops & snacks return </span>
            <span className="text-amber-400 font-bold">isCivicIssue: false</span>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              Test Presets (Civic Hazards vs Refusal Proofs):
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {PRESET_CIVIC_INSPECTIONS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/50 shadow-sm ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        preset.isCivic
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {preset.isCivic ? 'CIVIC ISSUE' : 'REFUSAL TEST'}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {preset.expectedType}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 line-clamp-2 mt-1">
                    {preset.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Photo Viewer & Classification Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Ingestion & Citizen Submission */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Citizen Photo Attachment
                </h3>
              </div>

              <label className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload Custom</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Photo Preview Canvas */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group shadow-inner">
              {activeImageUri ? (
                <img
                  src={activeImageUri}
                  alt="Civic inspection specimen"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 text-slate-500">
                  <Building2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No specimen image selected</p>
                </div>
              )}

              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                <span>Specimen: {selectedPresetId}</span>
                <span className="text-cyan-400">Public Photo Specimen</span>
              </div>
            </div>

            {/* User Message Input */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Citizen Note / Dispatch Instruction
              </label>
              <textarea
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                rows={2}
                placeholder="Analyze this photo and classify the civic infrastructure issue."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 leading-normal">{error}</div>
              </div>
            )}

            <button
              onClick={runClassification}
              disabled={loading || !activeImageUri}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                loading || !activeImageUri
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/20 active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Inspecting Infrastructure Hazard...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Analyze Citizen Photo (First-Pass Inspector)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Structured Output Panel */}
        <div className="lg:col-span-7 space-y-4">
          {classification ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
              {/* Header Tabs */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('visual')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                      activeTab === 'visual'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Inspection Verdict</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('json')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                      activeTab === 'json'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Structured Output Schema (JSON)</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  {new Date(classification.timestamp || Date.now()).toLocaleTimeString()}
                </div>
              </div>

              {activeTab === 'visual' ? (
                <div className="space-y-4">
                  {/* Proof of Refusal / Civic Status Banner */}
                  <div
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner ${
                      classification.isCivicIssue
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {classification.isCivicIssue ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-amber-400 shrink-0" />
                      )}
                      <div>
                        <div className="text-[10px] font-mono font-bold tracking-widest uppercase">
                          CIVIC HAZARD VERIFICATION
                        </div>
                        <div className="text-lg font-black text-white flex items-center gap-2">
                          isCivicIssue: {classification.isCivicIssue ? 'true' : 'false'}
                          <span
                            className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                              classification.isCivicIssue
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {classification.isCivicIssue
                              ? 'CONFIRMED PUBLIC HAZARD'
                              : 'REFUSES FAKES PROOF (NON-CIVIC)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">
                        Inspector Confidence
                      </div>
                      <div className="text-sm font-mono font-bold text-white">
                        {(classification.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Primary Classification Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        issueType
                      </span>
                      <span className="text-sm font-bold text-cyan-300 mt-0.5 block font-mono">
                        {classification.issueType}
                      </span>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        severity
                      </span>
                      <span
                        className={`text-sm font-bold mt-0.5 block font-mono ${
                          classification.severity === 'Critical'
                            ? 'text-red-400'
                            : classification.severity === 'High'
                            ? 'text-orange-400'
                            : classification.severity === 'Medium'
                            ? 'text-yellow-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {classification.severity}
                      </span>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        affectedInfrastructure
                      </span>
                      <span className="text-xs font-semibold text-slate-200 mt-0.5 block line-clamp-2">
                        {classification.affectedInfrastructure}
                      </span>
                    </div>
                  </div>

                  {/* Factual Description */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Factual Description
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {classification.description}
                    </p>
                  </div>

                  {/* 3-6 Raw Observations */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        Raw Observations (Factual Enumeration)
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {classification.rawObservations.length} items observed
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {classification.rawObservations.map((obs, i) => (
                        <li
                          key={i}
                          className="text-xs font-mono text-slate-300 flex items-start gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/80"
                        >
                          <span className="text-cyan-400 font-bold shrink-0">0{i + 1}.</span>
                          <span>{obs}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="h-[460px]">
                  <JsonViewer data={classification} title="Civic Infrastructure Structured Schema" />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800/80 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[420px] text-slate-500 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center text-cyan-400 shadow-inner">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-300">
                Awaiting Citizen Specimen Photo Inspection
              </h3>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                Choose a specimen preset (Pothole, Water Leak, Garbage Dumpster, or the "Refuses Fakes" proof laptop/snack) or upload your own citizen photo. The inspector will return structured JSON conforming to the municipal schema.
              </p>
              <button
                onClick={runClassification}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold font-mono bg-cyan-600 hover:bg-cyan-500 text-white transition cursor-pointer shadow-md shadow-cyan-600/20"
              >
                Inspect Selected Photo Specimen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
