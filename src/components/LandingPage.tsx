import React from 'react';
import { FileSearch, Sparkles, Navigation, Layers, ShieldCheck, Languages, ArrowRight, ChevronRight, Volume2, HardHat } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStartClick: () => void;
  onDemoClick: () => void;
}

export default function LandingPage({ onStartClick, onDemoClick }: LandingPageProps) {
  const stats = [
    { label: "Permits Processed", value: "24,800+", desc: "Across 14 Municipalities", color: "text-blue-600" },
    { label: "Compliance Success Rate", value: "98.4%", desc: "Direct First-Time Passes", color: "text-emerald-600" },
    { label: "Approval Time Reduced", value: "82%", desc: "From Months to Weeks", color: "text-indigo-600" }
  ];

  const features = [
    {
      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50 border-amber-100",
      title: "AI Blueprint Analysis",
      desc: "Our deep document intelligence extracts dimensions, FAR calculations, setbacks, and road widths automatically from standard blueprint PDFs."
    },
    {
      icon: <FileSearch className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50 border-blue-100",
      title: "Real-Time Regulation Check",
      desc: "Instant automated auditing against municipal zoning restrictions, regional building codes, environmental guidelines, and fire safety provisions."
    },
    {
      icon: <Navigation className="w-5 h-5 text-cyan-600" />,
      bg: "bg-cyan-50 border-cyan-100",
      title: "Permit Process Tracking",
      desc: "Track submissions in real-time with our interactive progress pipeline, receiving visual status logs at each verification checkpoint."
    },
    {
      icon: <Layers className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50 border-purple-100",
      title: "Government Form Autofill",
      desc: "Never copy data twice. AI intelligently pre-populates official local and state municipality forms from blueprint schematics."
    },
    {
      icon: <Volume2 className="w-5 h-5 text-pink-600" />,
      bg: "bg-pink-50 border-pink-100",
      title: "Sarvam Voice Assistant",
      desc: "Speak your dimensions in Hindi, Tamil, or English, and watch the platform automatically transcribe, parse, and fill forms."
    },
    {
      icon: <Languages className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-100",
      title: "Multilingual Intelligence",
      desc: "Translate compliance audits and speak with the AI assistant chatbot in 9 Indian languages for localized collaboration."
    }
  ];

  return (
    <div id="landing-page-container" className="relative min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* Soft Blue/Cyan Radiant Background Blur for Elegant Smart City Theme */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-100/60 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-cyan-100/40 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-100/30 blur-[120px] rounded-full" />
        
        {/* Subtle high-tech blueprint drawing grid overlay in soft gray-blue */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#0284c7_1px,transparent_1px),linear-gradient(to_bottom,#0284c7_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10 flex flex-col items-center justify-center">
        
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-8 text-xs text-blue-700 shadow-sm backdrop-blur-md animate-bounce">
          <HardHat className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold">Powered by Sarvam AI Document Intelligence</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl">
          <h1 className="font-sans font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none mb-6">
            <span className="block text-slate-900 font-black">PermitFlow</span>
            <span className="block mt-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 py-1">
              The Construction Compliance Autopilot
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Upload your construction project blueprints. Our AI checks zoning regulations, detects safety and design compliance gaps, auto-fills municipal permit forms, and guides you step-by-step to approval.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              id="landing-start-btn"
              onClick={onStartClick}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium text-sm text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Start Project Wizard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="landing-demo-btn"
              onClick={onDemoClick}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-medium text-sm text-slate-700 shadow-sm transition-all"
            >
              <span>Launch Demo Console</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Statistics Section with bento styled cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-24">
          {stats.map((st, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group hover:border-blue-500/40 transition-all duration-200 hover:shadow-md"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className={`text-3xl sm:text-4xl font-sans font-black tracking-tight mb-2 ${st.color}`}>
                {st.value}
              </p>
              <h3 className="text-sm font-bold text-slate-800 mb-1">{st.label}</h3>
              <p className="text-xs text-slate-500">{st.desc}</p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="w-full max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Core Capabilities</span>
            <h2 className="text-3xl font-sans font-black text-slate-900 mt-4">
              Next-Gen Municipal Blueprint Automation
            </h2>
            <p className="text-sm text-slate-500 mt-3 max-w-xl mx-auto leading-relaxed">
              PermitFlow bridges the gap between complicated building code booklets and architectural schematics in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((ft, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/95 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all duration-200 group"
              >
                <div className={`p-3 border rounded-xl inline-block mb-4 transition-colors ${ft.bg}`}>
                  {ft.icon}
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{ft.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ft.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info statement */}
        <div className="mt-24 pt-8 border-t border-slate-200 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 PermitFlow Technologies. Municipal AI Autopilot Network.</p>
          <div className="flex space-x-4">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Security Standards</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Regulatory Coverage</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">API Integration Docs</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
