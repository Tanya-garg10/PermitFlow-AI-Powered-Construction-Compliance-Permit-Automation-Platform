import React, { useState } from 'react';
import { Project } from '../types';
import { LayoutGrid, CheckCircle2, Clock, XOctagon, Sparkles, ArrowUpRight, Plus, MapPin, FileText } from 'lucide-react';
import GisPlotValidator from './GisPlotValidator';
import RegulationRAG from './RegulationRAG';

interface DashboardCardsProps {
  projects: Project[];
  onProjectClick: (p: Project) => void;
  onNewProjectClick: () => void;
}

export default function DashboardCards({ projects, onProjectClick, onNewProjectClick }: DashboardCardsProps) {
  const total = projects.length;
  const pending = projects.filter(p => p.status === 'Submitted' || p.status === 'Under Review' || p.status === 'Document Verification').length;
  const approved = projects.filter(p => p.status === 'Approved' || p.status === 'Completed').length;
  const rejected = projects.filter(p => p.status === 'Rejected').length;
  
  const avgScore = total > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (p.complianceScore || 0), 0) / total) 
    : 100;

  const statCards = [
    { title: "Total Projects", value: total, icon: <LayoutGrid className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50/70 border-blue-100" },
    { title: "Pending Permits", value: pending, icon: <Clock className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50/70 border-amber-100" },
    { title: "Approved Permits", value: approved, icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50/70 border-emerald-100" },
    { title: "Rejected Permits", value: rejected, icon: <XOctagon className="w-5 h-5 text-rose-600" />, bg: "bg-rose-50/70 border-rose-100" },
    { title: "Avg Compliance", value: `${avgScore}%`, icon: <Sparkles className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50/70 border-purple-100" }
  ];

  const [activeTab, setActiveTab] = useState<'portfolios' | 'gis' | 'rag'>('portfolios');

  return (
    <div id="dashboard-cards-container" className="space-y-6 font-sans">
      
      {/* Dashboard Top Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Compliance Console</h1>
          <p className="text-xs text-slate-500 mt-1">Manage real-time municipal audits, track approval progress, and review automated regulations checkups.</p>
        </div>

        <button
          id="dash-create-project-btn"
          onClick={onNewProjectClick}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold text-white shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-150 shrink-0 self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Wizard</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-white border rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow ${card.bg}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-bold">{card.title}</span>
              {card.icon}
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Custom Tabs Switcher Bar */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 space-x-1 bg-white/50 p-1 rounded-xl border">
        <button
          onClick={() => setActiveTab('portfolios')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'portfolios' 
              ? 'bg-blue-600 text-white font-black shadow' 
              : 'hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>My Active Portfolios</span>
        </button>
        <button
          onClick={() => setActiveTab('gis')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'gis' 
              ? 'bg-blue-600 text-white font-black shadow' 
              : 'hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Smart City GIS Map</span>
        </button>
        <button
          onClick={() => setActiveTab('rag')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'rag' 
              ? 'bg-blue-600 text-white font-black shadow' 
              : 'hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Regulation Search (RAG)</span>
        </button>
      </div>

      {/* Dynamic Tab Panel Content */}
      {activeTab === 'gis' ? (
        <GisPlotValidator />
      ) : activeTab === 'rag' ? (
        <RegulationRAG />
      ) : (
        <>
          {/* Project Table Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider">Active Project Portfolios</span>
              <span className="text-[10px] text-slate-500 font-bold">{projects.length} Portfolios Found</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider bg-slate-50/30">
                    <th className="py-3 px-4">Project Name & Location</th>
                    <th className="py-3 px-4">Building Specs</th>
                    <th className="py-3 px-4">Zoning Audit</th>
                    <th className="py-3 px-4">Risk Rating</th>
                    <th className="py-3 px-4">Tracker Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {projects.map((p) => (
                    <tr
                      key={p.id}
                      id={`project-row-${p.id}`}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                      onClick={() => onProjectClick(p)}
                    >
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {p.name}
                        </div>
                        <div className="flex items-center text-[10px] text-slate-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                          {p.location}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-700">
                        <div className="font-semibold font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-block">{p.buildingType}</div>
                        <div className="text-[10px] text-slate-500 mt-1 font-medium">
                          {p.floors} Floors | {p.height}m Height
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                p.complianceScore >= 95 ? 'bg-emerald-500' : p.complianceScore >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${p.complianceScore}%` }}
                            />
                          </div>
                          <span className={`font-mono font-bold text-xs ${
                            p.complianceScore >= 95 ? 'text-emerald-600' : p.complianceScore >= 80 ? 'text-amber-600' : 'text-rose-600'
                          }`}>
                            {p.complianceScore}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          p.riskScore === 'Low' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/55' :
                          p.riskScore === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200/55' :
                          'bg-rose-50 text-rose-700 border border-rose-200/55'
                        }`}>
                          {p.riskScore} Risk
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                          p.status === 'Draft' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                          p.status === 'Submitted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          p.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          p.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          p.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          id={`view-btn-${p.id}`}
                          onClick={() => onProjectClick(p)}
                          className="inline-flex items-center justify-center p-1.5 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-600 hover:text-blue-600 transition-all"
                          title="Open Compliance Workspace"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity and System timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Activity Log */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block mb-4">Verification Audit Log</span>
              <div className="space-y-4">
                <div className="flex gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-slate-600">Greenfield Residential Villa status updated to</span>
                    <span className="font-bold text-slate-800"> Draft</span>
                    <p className="text-[10px] text-slate-400 mt-1">4 days ago</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-slate-600">Architect Priya Sharma uploaded masterplan for</span>
                    <span className="font-bold text-slate-800"> Skyline Commercial Hub</span>
                    <p className="text-[10px] text-slate-400 mt-1">2 days ago</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-slate-600">Municipal Board rejected filing</span>
                    <span className="font-bold text-slate-800"> Old Town Industrial Complex</span>
                    <span className="text-rose-600 font-medium"> due to 113% FAR violation</span>
                    <p className="text-[10px] text-slate-400 mt-1">10 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informational Guidelines Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" /> Auto-filled Government Forms
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  All compliance checkups automatically sync structural statistics directly to your local government municipal application documents. Click any portfolio row to download a pre-compiled draft of the regulatory form.
                </p>
              </div>
              <div className="p-3 bg-white border border-blue-100 rounded-xl text-[11px] text-slate-600 shadow-sm">
                <span className="font-mono font-bold text-blue-600">Zoning Tip:</span> Ensure setbacks have at least 15% green landscaped boundaries to clear environmental checklist ratings instantly.
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
