import React, { useState } from 'react';
import { Project } from '../types';
import { CheckCircle2, XCircle, ClipboardList, Send, History } from 'lucide-react';
import BlueprintVisualizer from './BlueprintVisualizer';

interface OfficerPanelProps {
  projects: Project[];
  onUpdateProject: (p: Project) => void;
}

export default function OfficerPanel({ projects, onUpdateProject }: OfficerPanelProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [officerNotes, setOfficerNotes] = useState('');
  const [requestDocs, setRequestDocs] = useState<string[]>([]);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Request' | null>(null);

  // Filter projects awaiting review (Submitted, Under Review, Document Verification)
  const pendingProjects = projects.filter(p => p.status !== 'Draft' && p.status !== 'Completed');

  const handleSelectProject = (p: Project) => {
    setSelectedProject(p);
    setOfficerNotes(p.officerNotes || '');
    setRequestDocs(p.documentsRequested || []);
    setActionType(null);
  };

  const handleDocCheckboxChange = (doc: string, checked: boolean) => {
    if (checked) {
      setRequestDocs(prev => [...prev, doc]);
    } else {
      setRequestDocs(prev => prev.filter(d => d !== doc));
    }
  };

  const handleOfficerActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !actionType) return;

    let newStatus = selectedProject.status;
    let finalNotes = officerNotes;

    if (actionType === 'Approve') {
      newStatus = 'Approved';
      finalNotes = finalNotes || "Approved by Municipal Board. Structural and zoning parameters pass all compliance specifications.";
    } else if (actionType === 'Reject') {
      newStatus = 'Rejected';
      finalNotes = finalNotes || "Rejected. Please address setback infractions and Floor Area Ratio (FAR) violations in design draft before refiling.";
    } else if (actionType === 'Request') {
      newStatus = 'Document Verification';
      finalNotes = finalNotes || "Supplementary verification documents requested to proceed.";
    }

    const updated: Project = {
      ...selectedProject,
      status: newStatus,
      officerNotes: finalNotes,
      documentsRequested: actionType === 'Request' ? requestDocs : []
    };

    onUpdateProject(updated);
    setSelectedProject(null);
    setActionType(null);
  };

  const standardChecklistDocs = [
    "Fire NOC Application Receipt",
    "Soil Stability Certification",
    "Aviation Height Clearance",
    "Water Supply Consent certificate",
    "Environmental Impact Assessment (EIA)"
  ];

  return (
    <div id="officer-panel-container" className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-slate-800">
      
      {/* Left Column: List of Submitted projects */}
      <div className="md:col-span-1 space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block mb-3">Filings Awaiting Review ({pendingProjects.length})</span>
          
          {pendingProjects.length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center italic">No submitted filings at this time.</p>
          ) : (
            <div className="space-y-2.5">
              {pendingProjects.map((p) => (
                <div
                  key={p.id}
                  id={`officer-project-card-${p.id}`}
                  onClick={() => handleSelectProject(p)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedProject?.id === p.id
                      ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-black text-xs text-slate-800 line-clamp-1">{p.name}</span>
                    <span className="text-[9px] font-mono font-bold uppercase text-blue-600 shrink-0">
                      Score: {p.complianceScore}%
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{p.location}</div>
                  
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[10px] font-mono">
                    <span className="text-slate-500 font-semibold">{p.buildingType}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      p.status === 'Submitted' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      p.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      p.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center & Right Column: Interactive Review Workspace */}
      <div className="md:col-span-2">
        {selectedProject ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-6 shadow-sm">
            
            {/* Title */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wide">Review Workspace</span>
                <h2 className="text-lg font-black text-slate-900 mt-1">{selectedProject.name}</h2>
                <p className="text-[11px] text-slate-500 font-semibold">{selectedProject.location} • Filed by {selectedProject.creatorName}</p>
              </div>

              <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase border ${
                selectedProject.riskScore === 'Low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                selectedProject.riskScore === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {selectedProject.riskScore} Risk rating
              </span>
            </div>

            {/* Extracted Details for the Officer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="text-slate-500 text-[10px] block font-sans font-bold uppercase tracking-wider">Extracted Area Specs</span>
                <div className="text-slate-700 mt-1.5 space-y-1 font-semibold">
                  <div>Plot Size: <span className="text-slate-900 font-bold">{selectedProject.plotArea} sqm</span></div>
                  <div>Floors Level: <span className="text-slate-900 font-bold">{selectedProject.floors} Levels</span></div>
                  <div>Zoning FAR: <span className="text-slate-900 font-bold">{selectedProject.extractedData?.farValue}</span></div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="text-slate-500 text-[10px] block font-sans font-bold uppercase tracking-wider">Safety & Setbacks</span>
                <div className="text-slate-700 mt-1.5 space-y-1 font-semibold">
                  <div>Max Height: <span className="text-slate-900 font-bold">{selectedProject.height} m</span></div>
                  <div>Front Setback: <span className="text-slate-900 font-bold">{selectedProject.extractedData?.setbackFront} m</span></div>
                  <div>Sides Setback: <span className="text-slate-900 font-bold">{selectedProject.extractedData?.setbackSides} m</span></div>
                </div>
              </div>
            </div>

            {/* Interactive Blueprint Visualizer and Version Control */}
            <BlueprintVisualizer 
              projectName={selectedProject.name} 
              buildingType={selectedProject.buildingType} 
            />

            {/* Compliance Audit Trail & Version Control */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider block border-b border-slate-200/60 pb-1.5 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-blue-500" /> Compliance Audit Log (Immutable Ledger)
              </span>
              <div className="relative pl-4 space-y-3.5 text-[11px] font-sans text-slate-600 before:absolute before:left-1 before:top-1.5 before:bottom-1.5 before:w-[1px] before:bg-slate-200">
                <div className="relative flex gap-2">
                  <span className="absolute -left-[15px] w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <div>
                    <span className="font-bold text-slate-800 block">Tesseract OCR & PaddleOCR Analysis Complete</span>
                    <span className="text-[9px] font-mono text-slate-400 block mt-0.5">Parsed 2 vector blueprint sheets successfully with setback boundary checks.</span>
                  </div>
                </div>
                <div className="relative flex gap-2">
                  <span className="absolute -left-[15px] w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <div>
                    <span className="font-bold text-slate-800 block">Sarvam Speech Pre-fill Hook</span>
                    <span className="text-[9px] font-mono text-slate-400 block mt-0.5">Extracted plot parameters {selectedProject.plotArea} sqm and height {selectedProject.height}m from speech transcription.</span>
                  </div>
                </div>
                <div className="relative flex gap-2">
                  <span className="absolute -left-[15px] w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white animate-pulse" />
                  <div>
                    <span className="font-bold text-slate-800 block">Filing Status Verified: {selectedProject.status}</span>
                    <span className="text-[9px] font-mono text-slate-400 block mt-0.5">Assigned to Reviewer Board desk. Last active {new Date(selectedProject.createdAt).toLocaleDateString()}.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Form console */}
            <form onSubmit={handleOfficerActionSubmit} className="space-y-5 pt-4 border-t border-slate-200">
              <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block">Decision Actions</span>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  id="officer-approve-btn"
                  type="button"
                  onClick={() => setActionType('Approve')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-xl text-center transition-all ${
                    actionType === 'Approve'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 mb-1.5 text-emerald-600" />
                  <span className="text-xs font-bold">Approve Permit</span>
                </button>

                <button
                  id="officer-reject-btn"
                  type="button"
                  onClick={() => setActionType('Reject')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-xl text-center transition-all ${
                    actionType === 'Reject'
                      ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <XCircle className="w-5 h-5 mb-1.5 text-rose-600" />
                  <span className="text-xs font-bold">Reject Permit</span>
                </button>

                <button
                  id="officer-request-btn"
                  type="button"
                  onClick={() => setActionType('Request')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-xl text-center transition-all ${
                    actionType === 'Request'
                      ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <ClipboardList className="w-5 h-5 mb-1.5 text-amber-600" />
                  <span className="text-xs font-bold">Request Docs</span>
                </button>
              </div>

              {/* Conditional Request Documents Checklist */}
              {actionType === 'Request' && (
                <div id="officer-doc-request-checklist" className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2.5 shadow-inner">
                  <span className="text-[10px] font-mono text-amber-700 font-bold uppercase block mb-1">Checklist of documents to demand</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-sans">
                    {standardChecklistDocs.map((doc, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          id={`doc-check-${idx}`}
                          type="checkbox"
                          checked={requestDocs.includes(doc)}
                          onChange={(e) => handleDocCheckboxChange(doc, e.target.checked)}
                          className="rounded border-slate-300 bg-white accent-blue-600"
                        />
                        <span className="font-semibold">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Text area comments */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reviewer's official notes / rejections clauses</label>
                <textarea
                  id="officer-comments-input"
                  rows={3}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="e.g., Setback clearances pass structural checking, but please attach structural load validation certificates..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="officer-submit-action-btn"
                  type="submit"
                  disabled={!actionType}
                  className="flex items-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 rounded-lg text-xs font-bold text-white shadow-md shadow-blue-500/10"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Officer Decision</span>
                </button>
              </div>

            </form>

          </div>
        ) : (
          <div className="h-full min-h-[300px] border border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-white shadow-sm">
            <ClipboardList className="w-10 h-10 text-slate-300 mb-3" />
            <h3 className="font-black text-sm text-slate-700">Review Board Desk</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">Select a pending blueprint filing from the left panel to open structural diagrams, evaluate compliance, and submit municipal clearance decisions.</p>
          </div>
        )}
      </div>

    </div>
  );
}
