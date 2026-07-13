import React, { useState } from 'react';
import { Map, MapPin, Landmark, ShieldCheck, TreePine, Eye, Compass, Info, Search, RefreshCw } from 'lucide-react';

interface PlotData {
  id: string;
  name: string;
  ward: string;
  owner: string;
  registryNo: string;
  zone: 'Residential' | 'Commercial' | 'Mixed Use' | 'Industrial';
  area: number;
  frontage: number;
  nearestRoad: string;
  roadDistance: number;
  nearestHydrantDistance: number;
  nearbyTransitMetres: number;
  farLimit: number;
  maxHeight: number;
  minFrontSetback: number;
  environmentalIndex: string;
  carbonFootprintEst: string;
  landUseConformity: boolean;
}

export default function GisPlotValidator() {
  const plots: PlotData[] = [
    {
      id: "plot-101",
      name: "Sector 15, Plot A-24",
      ward: "Ward 4 - Gurugram (MCG)",
      owner: "Subhash Chawla",
      registryNo: "HR-GUR-REG-2024-918",
      zone: "Residential",
      area: 400,
      frontage: 15,
      nearestRoad: "Sector Internal Road (12m width)",
      roadDistance: 3,
      nearestHydrantDistance: 35,
      nearbyTransitMetres: 250,
      farLimit: 2.5,
      maxHeight: 15.0,
      minFrontSetback: 3.0,
      environmentalIndex: "Class B (Moderate vegetation mandated)",
      carbonFootprintEst: "14.2 Tons CO2/Year projected",
      landUseConformity: true
    },
    {
      id: "plot-102",
      name: "Bandra G-Block, Plot 10",
      ward: "Ward 12 - Bandra (MCGM)",
      owner: "Client Properties Ltd",
      registryNo: "MH-MUM-REG-2023-1102",
      zone: "Commercial",
      area: 5000,
      frontage: 45,
      nearestRoad: "BKC Arterial Road (45m width)",
      roadDistance: 8,
      nearestHydrantDistance: 12,
      nearbyTransitMetres: 80,
      farLimit: 3.0,
      maxHeight: 50.0,
      minFrontSetback: 5.0,
      environmentalIndex: "Class A (LEED gold pre-screened)",
      carbonFootprintEst: "185.4 Tons CO2/Year projected",
      landUseConformity: true
    },
    {
      id: "plot-103",
      name: "Sector 15, Plot B-12",
      ward: "Ward 4 - Gurugram (MCG)",
      owner: "Devi Sharan Enterprises",
      registryNo: "HR-GUR-REG-2025-4422",
      zone: "Mixed Use",
      area: 850,
      frontage: 22,
      nearestRoad: "Sector Main Double Road (24m width)",
      roadDistance: 5,
      nearestHydrantDistance: 45,
      nearbyTransitMetres: 120,
      farLimit: 2.8,
      maxHeight: 25.0,
      minFrontSetback: 5.0,
      environmentalIndex: "Class B (Rainwater recharge pit mandatory)",
      carbonFootprintEst: "32.8 Tons CO2/Year projected",
      landUseConformity: true
    },
    {
      id: "plot-104",
      name: "Udyog Vihar Plot 44",
      ward: "Ward 2 - Udyog Vihar (HSIIDC)",
      owner: "Vikas Castings Ltd",
      registryNo: "HR-GUR-REG-2021-0422",
      zone: "Industrial",
      area: 2500,
      frontage: 38,
      nearestRoad: "Industrial Corridor (30m width)",
      roadDistance: 6,
      nearestHydrantDistance: 95,
      nearbyTransitMetres: 850,
      farLimit: 1.5,
      maxHeight: 20.0,
      minFrontSetback: 5.0,
      environmentalIndex: "Class C (Effluent discharge monitor mandated)",
      carbonFootprintEst: "412.5 Tons CO2/Year projected",
      landUseConformity: true
    },
    {
      id: "plot-105",
      name: "Sohna Road Plot R-9",
      ward: "Ward 18 - Sohna (MCG)",
      owner: "Preeti Oberoi",
      registryNo: "HR-SOH-REG-2026-8812",
      zone: "Residential",
      area: 600,
      frontage: 18,
      nearestRoad: "Sohna Link Highway (36m width)",
      roadDistance: 4,
      nearestHydrantDistance: 110,
      nearbyTransitMetres: 420,
      farLimit: 2.5,
      maxHeight: 15.0,
      minFrontSetback: 3.0,
      environmentalIndex: "Class B (Solar rooftop standard)",
      carbonFootprintEst: "18.6 Tons CO2/Year projected",
      landUseConformity: true
    }
  ];

  const [selectedPlotId, setSelectedPlotId] = useState<string>('plot-101');
  const [wardQuery, setWardQuery] = useState('');
  const [propertyVerificationLoading, setPropertyVerificationLoading] = useState(false);
  const [propertyStatus, setPropertyStatus] = useState<'verified' | 'unverified'>('verified');

  const selectedPlot = plots.find(p => p.id === selectedPlotId) || plots[0];

  const triggerPropertyAudit = () => {
    setPropertyVerificationLoading(true);
    setTimeout(() => {
      setPropertyVerificationLoading(false);
      setPropertyStatus('verified');
    }, 1200);
  };

  const filteredPlots = plots.filter(p => 
    p.ward.toLowerCase().includes(wardQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(wardQuery.toLowerCase()) ||
    p.zone.toLowerCase().includes(wardQuery.toLowerCase())
  );

  return (
    <div id="gis-plot-validator" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-slate-800">
      
      {/* Title block */}
      <div>
        <h2 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-600" />
          Interactive GIS Plot Validator & Ward Search
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Select property plot parcels directly from the Smart City Grid. Auto-verify zoning boundaries, digital property registration deeds, and analyze nearby fire safety / infrastructure clearance buffers.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Interactive SVG Map (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between h-[360px] relative overflow-hidden group">
          <div className="absolute top-2.5 left-2.5 z-10 bg-slate-800/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-700 font-mono text-[9px] text-blue-400 font-bold tracking-wider uppercase">
            GIS CAD Map Grid V1.2
          </div>
          
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-emerald-800 font-mono text-[9px] text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>GPS RTK LINKED</span>
          </div>

          {/* Interactive SVG Plot Parcels Map */}
          <div className="flex-1 flex items-center justify-center p-2">
            <svg className="w-full h-56" viewBox="0 0 400 240">
              {/* Grid background lines */}
              <defs>
                <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              
              {/* Smart City Arterial Highway roads */}
              <line x1="0" y1="120" x2="400" y2="120" stroke="#1e293b" strokeWidth="22" strokeLinecap="round" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="#475569" strokeWidth="2" strokeDasharray="5,10" />
              
              <line x1="150" y1="0" x2="150" y2="240" stroke="#1e293b" strokeWidth="16" />
              <line x1="150" y1="0" x2="150" y2="240" stroke="#475569" strokeWidth="1" strokeDasharray="3,6" />

              {/* Fire Hydrants and Transit Landmarks */}
              <circle cx="210" cy="115" r="4" fill="#ef4444" className="animate-pulse" />
              <text x="220" y="117" fill="#ef4444" className="font-mono text-[8px] font-bold">Hydrant 1A</text>

              <circle cx="140" cy="50" r="5" fill="#3b82f6" />
              <text x="75" y="53" fill="#3b82f6" className="font-mono text-[8px] font-bold">Transit Station</text>

              {/* Plot Parcels Group */}
              {/* Plot 101: Residential Plot (Top Left) */}
              <g 
                className="cursor-pointer" 
                onClick={() => setSelectedPlotId('plot-101')}
              >
                <rect 
                  x="20" y="15" width="100" height="80" 
                  fill={selectedPlotId === 'plot-101' ? '#3b82f6' : '#1e293b'} 
                  fillOpacity={selectedPlotId === 'plot-101' ? '0.25' : '0.6'}
                  stroke={selectedPlotId === 'plot-101' ? '#3b82f6' : '#475569'} 
                  strokeWidth={selectedPlotId === 'plot-101' ? '2' : '1'}
                  rx="6"
                  className="transition-all duration-200 hover:fill-slate-800"
                />
                <text x="70" y="50" textAnchor="middle" fill={selectedPlotId === 'plot-101' ? '#60a5fa' : '#94a3b8'} className="font-mono text-[10px] font-bold">P-101</text>
                <text x="70" y="65" textAnchor="middle" fill="#475569" className="font-mono text-[7px] uppercase font-bold">Resi (400m²)</text>
              </g>

              {/* Plot 102: Commercial Plot (Bottom Right) */}
              <g 
                className="cursor-pointer" 
                onClick={() => setSelectedPlotId('plot-102')}
              >
                <rect 
                  x="180" y="145" width="180" height="80" 
                  fill={selectedPlotId === 'plot-102' ? '#10b981' : '#1e293b'} 
                  fillOpacity={selectedPlotId === 'plot-102' ? '0.25' : '0.6'}
                  stroke={selectedPlotId === 'plot-102' ? '#10b981' : '#475569'} 
                  strokeWidth={selectedPlotId === 'plot-102' ? '2' : '1'}
                  rx="6"
                  className="transition-all duration-200 hover:fill-slate-800"
                />
                <text x="270" y="185" textAnchor="middle" fill={selectedPlotId === 'plot-102' ? '#34d399' : '#94a3b8'} className="font-mono text-[10px] font-bold">P-102</text>
                <text x="270" y="200" textAnchor="middle" fill="#475569" className="font-mono text-[7px] uppercase font-bold">Comm (5000m²)</text>
              </g>

              {/* Plot 103: Mixed Use (Top Right) */}
              <g 
                className="cursor-pointer" 
                onClick={() => setSelectedPlotId('plot-103')}
              >
                <rect 
                  x="180" y="15" width="110" height="80" 
                  fill={selectedPlotId === 'plot-103' ? '#8b5cf6' : '#1e293b'} 
                  fillOpacity={selectedPlotId === 'plot-103' ? '0.25' : '0.6'}
                  stroke={selectedPlotId === 'plot-103' ? '#8b5cf6' : '#475569'} 
                  strokeWidth={selectedPlotId === 'plot-103' ? '2' : '1'}
                  rx="6"
                  className="transition-all duration-200 hover:fill-slate-800"
                />
                <text x="235" y="50" textAnchor="middle" fill={selectedPlotId === 'plot-103' ? '#a78bfa' : '#94a3b8'} className="font-mono text-[10px] font-bold">P-103</text>
                <text x="235" y="65" textAnchor="middle" fill="#475569" className="font-mono text-[7px] uppercase font-bold">Mixed (850m²)</text>
              </g>

              {/* Plot 104: Industrial (Bottom Left) */}
              <g 
                className="cursor-pointer" 
                onClick={() => setSelectedPlotId('plot-104')}
              >
                <rect 
                  x="20" y="145" width="100" height="80" 
                  fill={selectedPlotId === 'plot-104' ? '#f59e0b' : '#1e293b'} 
                  fillOpacity={selectedPlotId === 'plot-104' ? '0.25' : '0.6'}
                  stroke={selectedPlotId === 'plot-104' ? '#f59e0b' : '#475569'} 
                  strokeWidth={selectedPlotId === 'plot-104' ? '2' : '1'}
                  rx="6"
                  className="transition-all duration-200 hover:fill-slate-800"
                />
                <text x="70" y="185" textAnchor="middle" fill={selectedPlotId === 'plot-104' ? '#fbbf24' : '#94a3b8'} className="font-mono text-[10px] font-bold">P-104</text>
                <text x="70" y="200" textAnchor="middle" fill="#475569" className="font-mono text-[7px] uppercase font-bold">Indus (2500m²)</text>
              </g>

              {/* Plot 105: Residential 2 (Top Far Right) */}
              <g 
                className="cursor-pointer" 
                onClick={() => setSelectedPlotId('plot-105')}
              >
                <rect 
                  x="305" y="15" width="75" height="80" 
                  fill={selectedPlotId === 'plot-105' ? '#3b82f6' : '#1e293b'} 
                  fillOpacity={selectedPlotId === 'plot-105' ? '0.25' : '0.6'}
                  stroke={selectedPlotId === 'plot-105' ? '#3b82f6' : '#475569'} 
                  strokeWidth={selectedPlotId === 'plot-105' ? '2' : '1'}
                  rx="6"
                  className="transition-all duration-200 hover:fill-slate-800"
                />
                <text x="342" y="50" textAnchor="middle" fill={selectedPlotId === 'plot-105' ? '#60a5fa' : '#94a3b8'} className="font-mono text-[10px] font-bold">P-105</text>
                <text x="342" y="65" textAnchor="middle" fill="#475569" className="font-mono text-[7px] uppercase font-bold">Resi (600m²)</text>
              </g>
            </svg>
          </div>

          <div className="text-[10px] text-slate-400 font-mono font-medium text-center bg-slate-950 py-1 rounded border border-slate-800/60">
            💡 Click any colored plot parcel on map grid to inspect regulatory criteria.
          </div>
        </div>

        {/* Right Column - Smart City Audits Console (7 Columns) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          
          {/* Ward Search Box */}
          <div className="flex gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 items-center">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search by Ward (e.g., 'Ward 4'), Plot Name, or Zone type..." 
              value={wardQuery}
              onChange={(e) => setWardQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs outline-none focus:ring-0 placeholder:text-slate-400 font-medium"
            />
            {wardQuery && (
              <button 
                onClick={() => setWardQuery('')} 
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick results if search exists */}
          {wardQuery && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 max-h-32 overflow-y-auto space-y-1">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block px-2">Matched Parcels ({filteredPlots.length})</span>
              {filteredPlots.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPlotId(p.id);
                    setWardQuery('');
                  }}
                  className={`w-full text-left text-xs p-1.5 px-2.5 rounded flex justify-between font-bold ${
                    selectedPlotId === p.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] opacity-80">{p.ward}</span>
                </button>
              ))}
            </div>
          )}

          {/* Plot Inspector Workspace */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 flex-1 flex flex-col justify-between">
            
            {/* Parcel Identity Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-2">
              <div>
                <span className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider block">Active GIS Inspection</span>
                <h3 className="font-black text-sm text-slate-900 mt-0.5">{selectedPlot.name}</h3>
                <p className="text-[10px] text-slate-500 font-semibold">{selectedPlot.ward}</p>
              </div>

              <div className="text-right">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border block w-fit ml-auto ${
                  selectedPlot.zone === 'Residential' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  selectedPlot.zone === 'Commercial' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  selectedPlot.zone === 'Mixed Use' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {selectedPlot.zone} Zone
                </span>
                <span className="text-[10px] font-mono font-semibold text-slate-400 mt-1 block">Area: {selectedPlot.area} sqm</span>
              </div>
            </div>

            {/* Sub-bento-grid audits */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              
              {/* Box 1: Digital Property Registry Verification */}
              <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col justify-between relative overflow-hidden group shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <Landmark className="w-3 h-3 text-blue-600" /> Deed Registry
                  </span>
                  
                  {propertyStatus === 'verified' ? (
                    <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">UNAUDITED</span>
                  )}
                </div>

                <div className="my-2 text-[10px] font-semibold text-slate-700 font-mono">
                  <div>Owner: <span className="font-bold text-slate-900">{selectedPlot.owner}</span></div>
                  <div className="truncate mt-0.5">Registry ID: {selectedPlot.registryNo}</div>
                </div>

                <button
                  onClick={triggerPropertyAudit}
                  disabled={propertyVerificationLoading}
                  className="w-full py-1 text-[9px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 font-bold transition-all flex items-center justify-center gap-1"
                >
                  {propertyVerificationLoading ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-slate-500" />
                      <span>SECURE SYNC...</span>
                    </>
                  ) : (
                    <span>DEED SECURE CHECK</span>
                  )}
                </button>
              </div>

              {/* Box 2: Nearby Infrastructure Analysis */}
              <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col justify-between shadow-sm">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Compass className="w-3 h-3 text-blue-600" /> Infrastructure Clearance
                </span>

                <div className="my-1 text-[10px] font-semibold text-slate-600 font-mono space-y-1">
                  <div>Arterial Buffer: <span className="text-slate-900 font-bold">{selectedPlot.roadDistance}m</span> (Clear)</div>
                  <div>Fire Hydrant: <span className={`font-bold ${selectedPlot.nearestHydrantDistance <= 50 ? 'text-emerald-600' : 'text-amber-600'}`}>{selectedPlot.nearestHydrantDistance}m</span></div>
                  <div>Metro Transit: <span className="text-slate-900 font-bold">{selectedPlot.nearbyTransitMetres}m</span></div>
                </div>

                <div className="text-[9px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60 font-mono text-slate-400 font-bold truncate">
                  Nearest Road: {selectedPlot.nearestRoad}
                </div>
              </div>

              {/* Box 3: Ward-wise zoning parameters */}
              <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm space-y-1 font-mono">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">Ward Parameters Lookup</span>
                <div className="text-[10px] text-slate-700 space-y-0.5 font-semibold">
                  <div className="flex justify-between"><span>Permissible FAR:</span> <span className="text-blue-600 font-bold">{selectedPlot.farLimit}</span></div>
                  <div className="flex justify-between"><span>Max Height Code:</span> <span className="text-slate-900 font-bold">{selectedPlot.maxHeight}m</span></div>
                  <div className="flex justify-between"><span>Front Setback Min:</span> <span className="text-slate-900 font-bold">{selectedPlot.minFrontSetback}m</span></div>
                </div>
              </div>

              {/* Box 4: Environmental impact estimation */}
              <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm space-y-1 font-mono flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1">
                    <TreePine className="w-3 h-3 text-emerald-600" /> Eco Impact
                  </span>
                  <div className="text-[9px] text-slate-500 font-sans mt-1 leading-tight truncate">
                    {selectedPlot.environmentalIndex}
                  </div>
                </div>
                <div className="text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 font-bold">
                  ♻️ {selectedPlot.carbonFootprintEst}
                </div>
              </div>

            </div>

            {/* Smart Land-Use Verification notice banner */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2 text-[11px] text-slate-700 font-medium">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-800">Smart Land-Use Verification: </span>
                Proposed plot zoning matches municipal Master Plan 2031 land allocation parameters perfectly. Land-use is fully conformant for {selectedPlot.zone} expansion.
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
