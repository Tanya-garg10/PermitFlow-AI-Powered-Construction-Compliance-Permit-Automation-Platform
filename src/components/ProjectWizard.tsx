import React, { useState } from 'react';
import { Sparkles, Upload, Volume2, Mic, CheckCircle2, ChevronRight, CornerDownRight, ArrowLeft, Loader2 } from 'lucide-react';
import { translateText } from '../i18n';

interface ProjectWizardProps {
  selectedLang: string;
  onBack: () => void;
  onSubmit: (projectData: any) => void;
  isSubmitting: boolean;
}

export default function ProjectWizard({ selectedLang, onBack, onSubmit, isSubmitting }: ProjectWizardProps) {
  const t = (text: string) => translateText(text, selectedLang);
  // Form States
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [plotArea, setPlotArea] = useState('');
  const [buildingType, setBuildingType] = useState<'Residential' | 'Commercial' | 'Industrial' | 'Mixed Use'>('Residential');
  const [floors, setFloors] = useState('');
  const [height, setHeight] = useState('');
  
  // Document states
  const [blueprintName, setBlueprintName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Voice Recording simulation state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceLog, setVoiceLog] = useState('');

  // OCR simulation states
  const [runOcr, setRunOcr] = useState(false);
  const [ocrSteps, setOcrSteps] = useState<string[]>([]);
  const [ocrProgress, setOcrProgress] = useState(0);

  // Trigger simulated voice assistant input
  const handleVoiceInput = () => {
    setIsRecording(true);
    setVoiceLog(t('Listening for speech... Speak your plot parameters...'));
    
    setTimeout(() => {
      setVoiceLog(t('Transcribing: "My plot area is 400 square meters. Building height is 7.5 meters with 2 floors of residential use."'));
      
      setTimeout(() => {
        setName('Gurugram Luxury Villa');
        setLocation('Sector 15, Gurugram, HR');
        setPlotArea('400');
        setBuildingType('Residential');
        setFloors('2');
        setHeight('7.5');
        setBlueprintName('automated_residential_layout_v1.pdf');
        setIsRecording(false);
        setVoiceLog(t('Forms pre-filled successfully from voice input!'));
      }, 1500);

    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setBlueprintName(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBlueprintName(file.name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !plotArea || !floors || !height) {
      alert(t('Please fill in all details or use the Voice Input feature!'));
      return;
    }

    setRunOcr(true);
    setOcrProgress(10);
    setOcrSteps([t('Initializing Tesseract & PaddleOCR framework...')]);

    const steps = [
      t('Extracting bounding coordinates from drawing board raster vectors...'),
      t('Extracting room labels and door coordinate offsets...'),
      t('Extracting occupancy indicators: detected single-family occupancy structure.'),
      t('Extracting height dimensions and structural deck clearances...'),
      t('Calculated plot bounding coefficient: Floor Area Ratio (FAR) matches.'),
      t('Triggering Sarvam Document Intelligence translation checks...'),
      t('Sending compiled vector blocks to server for zoning checks...')
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setOcrSteps(prev => [...prev, steps[currentStep]]);
        setOcrProgress(prev => Math.min(prev + 12, 95));
        currentStep++;
      } else {
        clearInterval(interval);
        setOcrProgress(100);
        setTimeout(() => {
          onSubmit({
            name,
            location,
            plotArea,
            buildingType,
            floors,
            height,
            blueprintUrl: blueprintName || "blueprint_spec.pdf",
            siteImageUrl: "site_photo.jpg"
          });
        }, 1000);
      }
    }, 600);
  };

  return (
    <div id="project-wizard-container" className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm text-slate-800 font-sans">
      
      {/* Header back button */}
      <button
        id="wizard-back-btn"
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-mono text-blue-600 hover:text-blue-700 mb-6 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
        <span className="font-bold">{t('Return to Dashboard')}</span>
      </button>

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">{t('Project Blueprint Autopilot')}</h2>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          {t('Upload blueprints and documents to initiate OCR parsing and Sarvam document intelligence auditing.')}
        </p>
      </div>

      {!runOcr ? (
        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          {/* Voice Input Integration */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-mono text-blue-600 font-black uppercase flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> {t('Sarvam Speech Recognition')}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                {t('Have building dimensions ready? Click record to speak. Sarvam AI will automatically structure, parse and fill the form fields for you.')}
              </p>
              {voiceLog && (
                <div className="text-[11px] text-blue-700 mt-2.5 font-semibold font-mono flex items-center gap-1.5 bg-blue-50 px-2.5 py-1.5 rounded border border-blue-100">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0" />
                  <span>{voiceLog}</span>
                </div>
              )}
            </div>

            <button
              id="voice-record-btn"
              type="button"
              onClick={handleVoiceInput}
              disabled={isRecording}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-all shadow-sm ${
                isRecording
                  ? 'bg-red-600 animate-pulse text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <Mic className="w-4 h-4 text-slate-500" />
              <span>{isRecording ? t('Listening...') : t('Voice Assist')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Project Specs Column */}
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">{t('Project Identity')}</span>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Project Portfolio Name')}</label>
                <input
                  id="project-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('e.g., Gurugram Residential Villa')}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Municipal Location Address')}</label>
                <input
                  id="project-location-input"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t('e.g., Sector 15, Gurugram, HR')}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Plot Area (sqm)')}</label>
                  <input
                    id="project-area-input"
                    type="number"
                    required
                    value={plotArea}
                    onChange={(e) => setPlotArea(e.target.value)}
                    placeholder={t('e.g., 400')}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Building Use Code')}</label>
                  <select
                    id="project-type-select"
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold"
                  >
                    <option value="Residential">{t('Residential Use')}</option>
                    <option value="Commercial">{t('Commercial Use')}</option>
                    <option value="Mixed Use">{t('Mixed Use')}</option>
                    <option value="Industrial">{t('Industrial Use')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Number of Floors')}</label>
                  <input
                    id="project-floors-input"
                    type="number"
                    required
                    value={floors}
                    onChange={(e) => setFloors(e.target.value)}
                    placeholder={t('e.g., 2')}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Max Height (meters)')}</label>
                  <input
                    id="project-height-input"
                    type="number"
                    step="0.1"
                    required
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={t('e.g., 7.5')}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

            </div>

            {/* Document Upload Column */}
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">{t('Required Document Attachments')}</span>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">{t('Vector Blueprint drawing (PDF / DWG / PNG)')}</label>
                <div
                  id="blueprint-dropzone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                  }`}
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                >
                  <input
                    id="file-upload-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.dwg"
                    onChange={handleFileChange}
                  />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-700 font-bold">
                    {blueprintName ? blueprintName : t('Drag & drop blueprint layout')}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">{t('Supports PDF, CAD file, image up to 20MB')}</p>
                  
                  {blueprintName && (
                    <div className="mt-3 inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded px-2.5 py-1 text-[10px] font-mono font-bold shadow-sm">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{t('Ready to Parse')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Supplementary Documents Checklist */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block mb-2.5">{t('Checklist of standard enclosures')}</span>
                <div className="space-y-2 text-slate-700 text-[11px] font-medium">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 bg-white accent-blue-600" />
                    <span>{t('Owner Property Registry Documents')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 bg-white accent-blue-600" />
                    <span>{t('Registered Architect License Certificate')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 bg-white accent-blue-600" />
                    <span>{t('Zoning NOC Application Form receipt')}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Action Trigger */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              id="start-ocr-compliance-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-xl text-xs font-bold text-white shadow-md shadow-blue-500/10"
            >
              <span>Trigger OCR & Check Compliance</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      ) : (
        /* OCR Document scanning simulation screen */
        <div id="ocr-progress-container" className="py-8 space-y-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              Scanning Vector Blueprints (PaddleOCR & Sarvam Integration)
            </span>
            <span className="font-mono text-slate-600 font-black">{ocrProgress}%</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-full transition-all duration-300"
              style={{ width: `${ocrProgress}%` }}
            />
          </div>

          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 h-56 overflow-y-auto font-mono text-[11px] text-slate-100 space-y-2">
            {ocrSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CornerDownRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span className={idx === ocrSteps.length - 1 ? "text-blue-300 font-bold" : "text-slate-400"}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 text-center italic leading-relaxed">
            Scanning layers, dimension offsets, property boundaries and structure occupancy codes...
          </p>
        </div>
      )}

    </div>
  );
}
