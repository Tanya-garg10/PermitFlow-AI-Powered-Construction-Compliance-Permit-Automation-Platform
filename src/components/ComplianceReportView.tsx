import React, { useState } from 'react';
import { Project, ComplianceIssue } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, FileDown, Send, ArrowLeft } from 'lucide-react';
import BlueprintVisualizer from './BlueprintVisualizer';
import { translateText } from '../i18n';

interface ComplianceReportViewProps {
  project: Project;
  onBack: () => void;
  onSubmitPermit: (projectId: string) => void;
  selectedLang: string;
}

export default function ComplianceReportView({ project, onBack, onSubmitPermit, selectedLang }: ComplianceReportViewProps) {
  const t = (text: string) => translateText(text, selectedLang);
  const [activeTab, setActiveTab] = useState<'report' | 'form' | 'tracker'>('report');
  const [downloading, setDownloading] = useState(false);

  const report = project.complianceReport;
  const issues = report?.issues || [];
  const score = project.complianceScore || 100;

  // Language translator dictionary for small localized headers
  const getLabel = (enText: string) => {
    if (selectedLang === 'Hindi') {
      if (enText === 'Compliance Score') return 'अनुपालन स्कोर';
      if (enText === 'Violations') return 'उल्लंघन सूची';
      if (enText === 'AI Compliance Report') return 'एआई अनुपालन रिपोर्ट';
      if (enText === 'Suggestions') return 'सुझाव';
    }
    return enText;
  };

  const getStatusIcon = (status: ComplianceIssue['status']) => {
    switch (status) {
      case 'Pass':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'Warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'Violation':
        return <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  const getStatusColor = (status: ComplianceIssue['status']) => {
    switch (status) {
      case 'Pass':
        return 'border-emerald-200 bg-emerald-50 text-slate-800';
      case 'Warning':
        return 'border-amber-200 bg-amber-50 text-slate-800';
      case 'Violation':
        return 'border-rose-200 bg-rose-50 text-slate-800';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-600';
    }
  };

  // Simulating downloading the report as a customized mock PDF file
  const handleDownloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      const textContent = `
        PERMITFLOW COMPLIANCE REPORT
        =========================================
        Project: ${project.name}
        Location: ${project.location}
        Building Type: ${project.buildingType}
        Compliance Score: ${project.complianceScore}%
        Risk Classification: ${project.riskScore}
        Generated on: ${new Date().toLocaleDateString()}
        
        ISSUES DETECTED:
        ${issues.map((i, index) => `${index + 1}. [${i.status}] ${i.ruleName} (Actual: ${i.actual}, Expected: ${i.expected})\n   Message: ${i.message}\n   AI Suggestion: ${i.suggestion}`).join('\n\n')}
        
        GOVERNMENT PERMIT APPLICATION PRE-FILED DETALS:
        Owner: ${project.formDetails?.ownerName}
        Applicant: ${project.formDetails?.applicantName}
        Survey Number: ${project.formDetails?.surveyNumber}
        Estimated Budget: ${project.formDetails?.estimatedCost}
        =========================================
        Generated via PermitFlow Construction Compliance Autopilot
      `;
      
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_compliance_report.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }, 1500);
  };

  const permitStatuses = [
    { label: t('Draft'), desc: t('Project portfolio initialized'), num: 1 },
    { label: t('Submitted'), desc: t('Filing dispatched to municipality'), num: 2 },
    { label: t('Under Review'), desc: t('Officer verification active'), num: 3 },
    { label: t('Document Verification'), desc: t('Secondary certificates review'), num: 4 },
    { label: t('Approved'), desc: t('Zoning Permit Certificate signed'), num: 5 }
  ];

  const getStatusNumber = (status: Project['status']) => {
    if (status === 'Draft') return 1;
    if (status === 'Submitted') return 2;
    if (status === 'Under Review') return 3;
    if (status === 'Document Verification') return 4;
    if (status === 'Approved' || status === 'Completed') return 5;
    if (status === 'Rejected') return 3; // Stay at middle for rejection
    return 1;
  };

  const activeNum = getStatusNumber(project.status);

  return (
    <div id="compliance-view-container" className="space-y-6 font-sans text-slate-800">
      
      {/* Return button and Summary line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <button
            id="report-back-btn"
            onClick={onBack}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{project.name}</h1>
            <p className="text-[11px] text-slate-500 font-semibold">{project.location}</p>
          </div>
        </div>

        {/* Action button row */}
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          <button
            id="report-download-pdf-btn"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 disabled:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 border border-slate-200 shadow-sm"
          >
            {downloading ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin mr-1" />
                <span>{t('Compiling...')}</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-blue-600" />
                <span>{t('Download Report')}</span>
              </>
            )}
          </button>

          {project.status === 'Draft' && (
            <button
              id="report-submit-permit-btn"
              onClick={() => onSubmitPermit(project.id)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold text-white shadow-md shadow-blue-500/10"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t('Submit for Approval')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Special requested documents alert card */}
      {project.documentsRequested && project.documentsRequested.length > 0 && (
        <div id="outstanding-docs-notice" className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 shadow-sm animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black text-rose-800">{t('Action Required: Document Verification Outstanding')}</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              {t('The municipal reviewing officer has requested supplementary documents to proceed with approval:')}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.documentsRequested.map((doc, idx) => (
                <span key={idx} className="bg-rose-100/70 border border-rose-200 text-rose-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  {doc}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Workspace Tabs: Compliance Report, Pre-filled Form, Tracker */}
      <div className="flex border-b border-slate-200">
        <button
          id="tab-btn-report"
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'report' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t(getLabel('AI Compliance Report'))}
        </button>
        <button
          id="tab-btn-form"
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'form' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t('Government Form Autofill')}
        </button>
        <button
          id="tab-btn-tracker"
          onClick={() => setActiveTab('tracker')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'tracker' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t('Permit Pipeline Tracker')}
        </button>
      </div>

      {/* TAB CONTENTS */}

      {activeTab === 'report' && (
        <div id="tab-report-content" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Issues list, visualizer, and detail audits */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Interactive Blueprint Visualizer and Version Control */}
            <BlueprintVisualizer 
              projectName={project.name} 
              buildingType={project.buildingType} 
            />

            {/* Extract Information summary cards */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block mb-4">{t('OCR Extracted Dimensions (Sarvam Document Intelligence)')}</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-slate-500 text-[10px] font-bold block uppercase tracking-wide">{t('Occupancy Profile')}</span>
                  <span className="font-bold text-slate-800 block mt-1">{project.extractedData?.occupancyType || "Standard occupancy"}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-slate-500 text-[10px] font-bold block uppercase tracking-wide">{t('Calculated FAR')}</span>
                  <span className="font-bold text-slate-800 block mt-1">{project.extractedData?.farValue || "1.2"} (Floor Area Ratio)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-slate-500 text-[10px] font-bold block uppercase tracking-wide">{t('Parking Spaces')}</span>
                  <span className="font-bold text-slate-800 block mt-1">{project.extractedData?.parkingSpaces || "4"} bays provided</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-slate-500 text-[10px] font-bold block uppercase tracking-wide">{t('Front Setback Boundary')}</span>
                  <span className="font-bold text-slate-800 block mt-1">{project.extractedData?.setbackFront || "3.5"} meters</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 col-span-2">
                  <span className="text-slate-500 text-[10px] font-bold block uppercase tracking-wide">{t('Seismic & structural bearings')}</span>
                  <span className="font-mono text-[11px] text-slate-600 block mt-1 truncate">{project.extractedData?.structuralNotes || "Frame specifications compliant."}</span>
                </div>
              </div>
            </div>

            {/* Compliance Issues audit feed */}
            <div className="space-y-4">
              <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block">{t(getLabel('Violations'))} & Audits ({issues.length} Rules Checked)</span>
              
              {issues.length === 0 ? (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                  {t('No issues detected. Ready for automatic filing!')}
                </div>
              ) : (
                issues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`border rounded-2xl p-4 flex gap-4 transition-all shadow-sm ${getStatusColor(issue.status)}`}
                  >
                    <div className="mt-0.5 shrink-0">{getStatusIcon(issue.status)}</div>
                    <div className="space-y-1.5 w-full">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-800">{issue.ruleName}</span>
                        <span className="text-[10px] font-mono font-bold uppercase">{issue.category}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white/80 p-2 rounded border border-slate-200/50">
                        <div>
                          <span className="text-slate-500 font-medium">{t('Permitted:')}</span>
                          <span className="text-slate-800 ml-1.5 font-bold">{issue.expected}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">{t('Calculated:')}</span>
                          <span className="text-slate-800 ml-1.5 font-bold">{issue.actual}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{issue.message}</p>
                      
                      {issue.status !== 'Pass' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex gap-1 text-[11px] text-slate-500 leading-normal">
                          <span className="font-bold font-mono text-blue-600 shrink-0">{t('AI Suggestion:')}</span>
                          <span>{issue.suggestion}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Right Column: Compliance Score, Approval Probability, and Submission Checklist */}
          <div className="space-y-6">
            
            {/* Compliance Score Radial Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm flex flex-col justify-between h-72">
              <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block">{t(getLabel('Compliance Score'))}</span>
              
              <div className="relative inline-flex items-center justify-center my-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="54" strokeWidth="10" stroke="#f1f5f9" fill="transparent" />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    strokeWidth="10"
                    stroke={score >= 90 ? '#10b981' : score >= 75 ? '#f59e0b' : '#ef4444'}
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - score / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute flex flex-col">
                  <span className="text-3xl font-black tracking-tight text-slate-900">{score}%</span>
                  <span className="text-[10px] uppercase font-mono text-slate-400 mt-0.5 font-bold">Rating</span>
                </div>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full inline-block mx-auto border ${
                score >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                score >= 75 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {score >= 90 ? 'Approved Parameters' : score >= 75 ? 'Modifications Recommended' : 'Action Required'}
              </span>
            </div>

            {/* AI Permit Approval Probability Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-5 shadow-xl text-center space-y-3">
              <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider block">AI Approval Probability</span>
              
              <div className="text-3xl font-black text-white tracking-tight font-mono">
                {score >= 95 ? '98.6%' : score >= 80 ? '84.2%' : '41.0%'}
              </div>

              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    score >= 95 ? 'bg-emerald-400' : score >= 80 ? 'bg-amber-400' : 'bg-rose-400'
                  }`} 
                  style={{ width: score >= 95 ? '98.6%' : score >= 80 ? '84.2%' : '41.0%' }} 
                />
              </div>

              <p className="text-[10px] text-slate-300 leading-normal font-sans font-medium text-left">
                {score >= 95 ? 'Highly likely to pass board clearances on first submission review.' : 
                 score >= 80 ? 'Minor setback adjustments recommended to secure near-instant signature.' : 
                 'High-risk infractions. Resolve front setbacks and parking counts before submitting.'}
              </p>
            </div>

            {/* AI-generated Submission Checklist */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block border-b border-slate-100 pb-2">AI-Generated Checklist</span>
              <div className="space-y-2.5 text-xs font-semibold text-slate-700">
                <div className="flex items-start gap-2.5">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 accent-blue-600 mt-0.5" />
                  <span>Verify front boundary setback limits ({project.extractedData?.setbackFront || '3.5'}m)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <input type="checkbox" defaultChecked={score >= 80} className="rounded border-slate-300 accent-blue-600 mt-0.5" />
                  <span>Verify parking counts match building density limits</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 accent-blue-600 mt-0.5" />
                  <span>Execute digital land registry verification</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <input type="checkbox" defaultChecked={score >= 95} className="rounded border-slate-300 accent-blue-600 mt-0.5" />
                  <span>Upload certified structural seismic calculations</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 accent-blue-600 mt-0.5" />
                  <span>Run environmental drainage runoff assessment</span>
                </div>
              </div>
            </div>

            {/* Officer's Comments Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block mb-3">Municipal Officer Review Notes</span>
              {project.officerNotes ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 leading-normal font-semibold font-mono">
                  "{project.officerNotes}"
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-2">Filing pending officer verification. No commentary published.</p>
              )}
            </div>

          </div>

        </div>
      )}

      {activeTab === 'form' && (
        <div id="tab-form-content" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Municipal Form 1A: Permit Request</h3>
              <p className="text-xs text-slate-500 mt-0.5">Pre-populated dynamically using AI Blueprint scanning context.</p>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200 font-bold uppercase shrink-0">Form Autofilled</span>
          </div>

          {/* Form visual display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 font-sans">
            
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wide border-b border-slate-100 pb-1">1. Ownership / Applicant Details</h4>
              
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5 uppercase font-mono font-bold">Registered Plot Owner Name</label>
                <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 font-semibold">
                  {project.formDetails?.ownerName || "N/A"}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5 uppercase font-mono font-bold">Authorized Applicant Representative</label>
                <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 font-semibold">
                  {project.formDetails?.applicantName || "N/A"}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5 uppercase font-mono font-bold">Registered Office / Applicant Address</label>
                <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 font-semibold">
                  {project.formDetails?.applicantAddress || "N/A"}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wide border-b border-slate-100 pb-1">2. Technical & Zoning Parameters</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5 uppercase font-mono font-bold">Cadastral Survey Number</label>
                  <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 font-semibold font-mono">
                    {project.formDetails?.surveyNumber || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5 uppercase font-mono font-bold">Site Plot Dimensions (sqm)</label>
                  <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 font-semibold font-mono">
                    {project.formDetails?.plotArea || "N/A"} sqm
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5 uppercase font-mono font-bold">Proposed Height Limit</label>
                  <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 font-semibold font-mono">
                    {project.formDetails?.proposedHeight || "N/A"} m
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5 uppercase font-mono font-bold">Proposed Floor Levels</label>
                  <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 font-semibold font-mono">
                    {project.formDetails?.proposedFloors || "N/A"} Levels
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5 uppercase font-mono font-bold">Architect License Registry</label>
                  <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 font-semibold font-mono text-[10px] truncate">
                    {project.formDetails?.architectLicense || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5 uppercase font-mono font-bold">Estimated Project Outlay</label>
                  <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 font-semibold font-mono">
                    {project.formDetails?.estimatedCost || "N/A"}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'tracker' && (
        <div id="tab-tracker-content" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="mb-8">
            <h3 className="text-base font-black text-slate-900">Zoning Approval Pipeline</h3>
            <p className="text-xs text-slate-500 mt-1">Real-time checklist track of your municipal filing progress.</p>
          </div>

          {/* Stepper tracker */}
          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {permitStatuses.map((step) => {
              const isPast = activeNum > step.num;
              const isCurrent = activeNum === step.num;

              return (
                <div key={step.num} className="relative flex gap-4 text-xs">
                  {/* Point icon */}
                  <div className={`absolute -left-6 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isPast ? 'bg-emerald-500 border-emerald-400 text-white' :
                    isCurrent ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-500/25' :
                    'bg-white border-slate-200 text-slate-400 font-bold'
                  }`}>
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <span className="text-[9px] font-mono font-bold">{step.num}</span>
                    )}
                  </div>

                  <div>
                    <span className={`font-bold block ${
                      isPast ? 'text-slate-700 font-semibold' : isCurrent ? 'text-blue-600 font-black' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                    <p className={`text-[11px] mt-0.5 ${
                      isPast || isCurrent ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
