import React, { useState } from 'react';
import { Eye, Layers, Compass, CheckCircle2, AlertTriangle, ArrowRight, CornerDownRight, RotateCcw } from 'lucide-react';

interface BlueprintVisualizerProps {
  projectName: string;
  buildingType: string;
}

export default function BlueprintVisualizer({ projectName, buildingType }: BlueprintVisualizerProps) {
  const [version, setVersion] = useState<'v1' | 'v2'>('v1');
  const [showObjects, setShowObjects] = useState(true);
  const [showSetbacks, setShowSetbacks] = useState(true);

  return (
    <div id="blueprint-visualizer" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl text-slate-100 space-y-6">
      
      {/* Visualizer header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-black tracking-wider uppercase text-blue-400">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            AI Computer Vision Blueprint Analyzer
          </div>
          <h3 className="text-base font-black tracking-tight text-white mt-1">
            {projectName || "Gurugram Villa Masterplan"}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Scanned vectors parsed by PaddleOCR & CAD Layer Segmentation.</p>
        </div>

        {/* Version Switcher Controls */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setVersion('v1')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all ${
              version === 'v1'
                ? 'bg-rose-950 border border-rose-800 text-rose-300'
                : 'hover:bg-slate-900 text-slate-400'
            }`}
          >
            Version 1.0 (Violated)
          </button>
          <div className="text-slate-600 px-0.5"><ArrowRight className="w-3.5 h-3.5" /></div>
          <button
            onClick={() => setVersion('v2')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all ${
              version === 'v2'
                ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                : 'hover:bg-slate-900 text-slate-400'
            }`}
          >
            Version 2.0 (Autopilot Corrected)
          </button>
        </div>
      </div>

      {/* Main Interactive CAD Display (SVG stage) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Interactive Blueprint Canvas Stage (7 columns) */}
        <div className="md:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-4 relative h-[300px] overflow-hidden flex items-center justify-center">
          
          {/* Boundary coordinate legend */}
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-slate-900/95 px-2 py-1 rounded border border-slate-800 font-mono text-[8px] text-slate-500 font-bold">
            Grid Scale: 1:100 (Metric)
          </div>

          <div className="absolute top-2.5 left-2.5 z-10 bg-slate-900/95 px-2 py-1 rounded border border-slate-800 font-mono text-[8px] text-slate-500 font-bold space-x-2">
            <span>X: 145.22</span>
            <span>Y: 847.19</span>
          </div>

          {/* Draw CAD vector map */}
          <svg className="w-full h-full max-h-[260px]" viewBox="0 0 320 220">
            {/* Grid Pattern Background */}
            <defs>
              <pattern id="visualizer-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                <rect width="16" height="16" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#visualizer-grid)" />

            {/* Boundary Lot Line (Outer Border - White Dash) */}
            <rect x="15" y="15" width="290" height="190" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="4,4" />
            <text x="25" y="27" fill="#475569" className="font-mono text-[7px] font-bold">PROPERTY PLOT BOUNDARY LINE</text>

            {/* Front Setback Guideline Line (Yellow/Red in v1, Green in v2) */}
            {showSetbacks && (
              <>
                <line 
                  x1="65" y1="15" x2="65" y2="205" 
                  stroke={version === 'v1' ? '#ef4444' : '#10b981'} 
                  strokeWidth="1.5" 
                  strokeDasharray="2,2" 
                />
                <text 
                  x="70" y="195" 
                  fill={version === 'v1' ? '#ef4444' : '#10b981'} 
                  className="font-mono text-[6.5px] font-bold uppercase tracking-wider"
                >
                  Setback Line: {version === 'v1' ? '2.4m Infraction' : '3.8m OK'}
                </text>
              </>
            )}

            {/* Proposed Building Structure Rectangle (V1 is wide and pushes against setback, V2 is narrowed back) */}
            <rect 
              x={version === 'v1' ? '50' : '75'} 
              y="40" 
              width={version === 'v1' ? '220' : '190'} 
              height="140" 
              fill="#1e293b" 
              fillOpacity="0.4"
              stroke={version === 'v1' ? '#ef4444' : '#3b82f6'} 
              strokeWidth="2.5" 
              rx="4"
              className="transition-all duration-300"
            />
            <text 
              x={version === 'v1' ? '160' : '170'} 
              y="110" 
              textAnchor="middle" 
              fill={version === 'v1' ? '#fda4af' : '#93c5fd'} 
              className="font-mono text-[10px] font-black uppercase tracking-widest"
            >
              Proposed Footprint
            </text>

            {/* Object Detection tags overlaid on plan */}
            {showObjects && (
              <>
                {/* Fire Exit Sign */}
                <g transform={version === 'v1' ? "translate(220, 45)" : "translate(200, 45)"} className="transition-all duration-300">
                  <rect width="36" height="12" fill="#064e3b" stroke="#059669" strokeWidth="0.5" rx="2" />
                  <text x="18" y="9" textAnchor="middle" fill="#34d399" className="font-mono text-[6px] font-bold">FIRE EXIT</text>
                </g>

                {/* Main Entry Gate */}
                <g transform="translate(15, 110)">
                  <path d="M 0,0 L 15,-15" stroke="#3b82f6" strokeWidth="2" fill="none" />
                  <text x="18" y="-1" fill="#3b82f6" className="font-mono text-[6px] font-bold">ENTRY GATE</text>
                </g>

                {/* Parking space detection */}
                <g transform="translate(210, 145)">
                  <rect width="45" height="25" fill="#172554" stroke="#1d4ed8" strokeWidth="0.5" rx="2" />
                  <text x="22" y="12" textAnchor="middle" fill="#60a5fa" className="font-mono text-[6.5px] font-bold">PARKING BAYS</text>
                  <text x="22" y="21" textAnchor="middle" fill="#93c5fd" className="font-mono text-[5.5px] font-bold">
                    {version === 'v1' ? '2 Provided (Viol.)' : '4 Provided (OK)'}
                  </text>
                </g>
                
                {/* Load bearing Column indicators */}
                <circle cx={version === 'v1' ? '50' : '75'} cy="40" r="4" fill="#ef4444" className="transition-all duration-300" />
                <circle cx="270" cy="40" r="4" fill="#3b82f6" />
                <circle cx={version === 'v1' ? '50' : '75'} cy="180" r="4" fill="#ef4444" className="transition-all duration-300" />
                <circle cx="270" cy="180" r="4" fill="#3b82f6" />
              </>
            )}
          </svg>

          {/* Overlaid status tags on canvas */}
          <div className="absolute top-2.5 right-2.5 flex items-center space-x-2">
            {version === 'v1' ? (
              <div className="bg-rose-950 border border-rose-800 text-rose-400 px-2 py-0.5 rounded text-[8px] font-mono font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> INFRACTIONS FLAG
              </div>
            ) : (
              <div className="bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded text-[8px] font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED AUTOPILOT COMPLIANT
              </div>
            )}
          </div>
        </div>

        {/* Diagnostic side console (5 columns) */}
        <div className="md:col-span-5 space-y-4">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">CAD Object Layer Checks</span>
          
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            
            {/* Diagnostic Switchers */}
            <div className="flex gap-4 border-b border-slate-800 pb-2.5 text-[10px] font-mono text-slate-400">
              <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={showObjects} 
                  onChange={(e) => setShowObjects(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 accent-blue-600"
                />
                <span>Detected Objects</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={showSetbacks} 
                  onChange={(e) => setShowSetbacks(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 accent-blue-600"
                />
                <span>Setback Envelopes</span>
              </label>
            </div>

            {/* Diagnostic Logs based on active version */}
            {version === 'v1' ? (
              <div className="space-y-3.5 text-xs text-slate-300 font-mono">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Infraction: Setback Invasion</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal font-medium">
                    Calculated front clearance is 2.4 meters, failing the mandatory minimum residential boundary setback of 3.0 meters by 0.6m.
                  </p>
                </div>

                <div className="space-y-1 border-t border-slate-900 pt-2.5">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Infraction: Parking Density Fail</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal font-medium">
                    Only 2 parking bays found in coordinate index, failing density requirements. At least 3 bays mandated.
                  </p>
                </div>

                <div className="space-y-1 border-t border-slate-900 pt-2.5">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-50" />
                    <span>Zoning: FAR Excess Warn</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal font-medium">
                    Floor Area Ratio exceeds optimal residential index, creating structural loads risks on Zone IV foundation plans.
                  </p>
                </div>

              </div>
            ) : (
              <div className="space-y-3.5 text-xs text-slate-300 font-mono">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Correction: Front Boundary Clear</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal font-medium">
                    Building footprint shifted backward by 1.4m. Setback boundary clearance expanded to 3.8 meters (Complies).
                  </p>
                </div>

                <div className="space-y-1 border-t border-slate-900 pt-2.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Correction: Basement Stack-Parking</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal font-medium">
                    Basement mechanical hydraulic stacking bays added. Parking capacity increased to 4 spaces (Complies).
                  </p>
                </div>

                <div className="space-y-1 border-t border-slate-900 pt-2.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Correction: FAR Compression</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal font-medium">
                    Footprint slightly scaled down and mezzanine floor dropped. FAR compressed to 2.2 Compliant status.
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* Autopilot optimization advice */}
          <div className="p-3 bg-blue-950/40 border border-blue-900 rounded-xl text-[10px] font-mono text-blue-300 leading-relaxed">
            💡 <span className="font-bold">PermitFlow Advisory:</span> In v2.0, clicking submit will file the corrected compliance design. Municipal approval probability increases from 41% to 98.6%.
          </div>

        </div>

      </div>

    </div>
  );
}
