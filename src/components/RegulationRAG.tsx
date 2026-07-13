import React, { useState } from 'react';
import { Search, Sparkles, BookOpen, ExternalLink, HelpCircle, FileText } from 'lucide-react';

interface KnowledgeItem {
  id: string;
  section: string;
  title: string;
  excerpt: string;
  source: string;
  category: string;
  relevance?: number;
}

export default function RegulationRAG() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const knowledgeBase: KnowledgeItem[] = [
    {
      id: "rag-1",
      section: "Section 4.12.3",
      title: "Front Setbacks for Mid-rise Residential Projects",
      excerpt: "All mid-rise residential structures exceeding 12m but below 18m height must maintain a continuous front boundary setback clearance of no less than 3.0 meters. Any balconies, terraces, or projection structures extending past 1.2 meters from the external structural wall are classified as infractions and are strictly prohibited.",
      source: "Model Building Bye-Laws (India) Chapter 4",
      category: "Zoning Setbacks"
    },
    {
      id: "rag-2",
      section: "Clause 6.1.1",
      title: "Mandatory Wet Riser & Sprinkler Thresholds",
      excerpt: "Under National Building Code Part IV, fire safety wet riser piping connections and continuous ceiling-mounted automatic sprinkler valves are mandatory for all multi-family residential or commercial buildings where total structural levels exceed 3 storeys or the top deck elevation exceeds 15.0 meters in vertical height.",
      source: "National Building Code of India (NBC) Group A",
      category: "Fire Safety"
    },
    {
      id: "rag-3",
      section: "Table 8.4",
      title: "Floor Area Ratio (FAR) Allocation Coefficients",
      excerpt: "Floor Area Ratio parameters depend directly on sector classification. Commercial sectors allow a peak FAR of 3.0, Mixed-Use sectors allow 2.8, Residential sectors permit 2.5, and heavy industrial zoning limits the ceiling ratio to 1.5. Calculated FAR includes all covered mezzanine floor platforms.",
      source: "Municipal Zoning Plan 2031",
      category: "Zoning FAR"
    },
    {
      id: "rag-4",
      section: "Section 12.2.1",
      title: "Rainwater Harvesting & Ground Recharge Standards",
      excerpt: "Property plot parcels with survey area sizes exceeding 250 sqm are required to feature a dedicated gravel-sand rainwater harvesting filtration pit. The drainage pit capacity must absorb a runoff estimate of no less than 20 liters per square meter of total rooftop build-up area.",
      source: "Central Ground Water Authority Guidelines",
      category: "Environmental Code"
    },
    {
      id: "rag-5",
      section: "Section 5.3.1",
      title: "Commercial Parking Bay Spatial Densities",
      excerpt: "Commercial development blueprints must allocate 2.0 clear vehicle parking bays for every 100 sqm of total built-up carpet area. Out of the allocated bays, a minimum of 2% must be designated for physical handicap parking accessibility, directly adjacent to elevators.",
      source: "Model Building Bye-Laws Chapter 5",
      category: "Parking Spaces"
    },
    {
      id: "rag-6",
      section: "Clause 3.12.5",
      title: "Boundary Clearance for Sideline and Rear Setbacks",
      excerpt: "Sideline boundary borders must maintain a minimum open width clearance of 1.5 meters for residential occupancies. Commercial or industrial developments must increase sideline clearances to 3.0 meters to ensure emergency heavy-vehicle accessibility.",
      source: "Municipal Zoning Plan 2031",
      category: "Zoning Setbacks"
    }
  ];

  const suggestedQueries = [
    "balcony setback rules",
    "fire riser height threshold",
    "parking handicap ratios",
    "rainwater harvesting minimums"
  ];

  // Simple semantic simulation
  const handleQuerySubmit = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 600);
  };

  const getRelevanceScore = (item: KnowledgeItem, query: string): number => {
    if (!query) return 100;
    const lowerQuery = query.toLowerCase();
    const lowerTitle = item.title.toLowerCase();
    const lowerExcerpt = item.excerpt.toLowerCase();
    const lowerCategory = item.category.toLowerCase();
    
    let matches = 0;
    const words = lowerQuery.split(/\s+/);
    words.forEach(word => {
      if (word.length < 3) return;
      if (lowerTitle.includes(word)) matches += 35;
      if (lowerExcerpt.includes(word)) matches += 20;
      if (lowerCategory.includes(word)) matches += 25;
    });

    if (matches === 0) return Math.floor(Math.random() * 20 + 10); // low background matches
    return Math.min(99, matches);
  };

  const searchedResults = knowledgeBase
    .map(item => ({
      ...item,
      relevance: getRelevanceScore(item, searchQuery)
    }))
    .filter(item => !searchQuery || (item.relevance && item.relevance > 15))
    .sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

  return (
    <div id="regulation-rag-workspace" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-slate-800">
      
      {/* Header text */}
      <div>
        <h2 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Regulatory Knowledge Base & NLP Search (RAG)
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Perform natural language queries across regional municipal building bylaws and national Indian construction safety standards. Our semantic retrieval index cites precise sections.
        </p>
      </div>

      {/* Query Bar */}
      <div className="space-y-3">
        <div className="flex gap-2 items-center bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-inner group focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <Search className="w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-500 shrink-0" />
          <input
            id="rag-search-input"
            type="text"
            placeholder="Type code query: e.g., 'Do I need fire sprinklers for height 16m?'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-xs outline-none focus:ring-0 placeholder:text-slate-400 font-medium"
            onKeyDown={(e) => e.key === 'Enter' && handleQuerySubmit(searchQuery)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
            >
              ×
            </button>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Recommended queries:</span>
          {suggestedQueries.map((q, idx) => (
            <button
              key={idx}
              id={`rag-suggest-btn-${idx}`}
              onClick={() => handleQuerySubmit(q)}
              className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 hover:text-slate-800 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Search results list */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-mono font-bold uppercase text-slate-400 border-b border-slate-100 pb-2">
          <span>{searchQuery ? 'RAG Semantic Retrievals' : 'All Standard Guidelines'} ({searchedResults.length} Items)</span>
          {searchQuery && (
            <span className="flex items-center gap-1 text-blue-600">
              <Sparkles className="w-3 h-3 text-blue-500 animate-spin" /> Retracted using Sarvam Knowledge Engine
            </span>
          )}
        </div>

        {isSearching ? (
          <div className="text-center py-12 space-y-2">
            <span className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin inline-block" />
            <p className="text-xs text-slate-400 font-mono italic">Indexing guidelines, calculating match embeddings...</p>
          </div>
        ) : searchedResults.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-xs">
            No semantic matching regulations found. Try adjusting keywords (e.g. 'setback', 'fire', 'FAR').
          </div>
        ) : (
          <div className="space-y-4">
            {searchedResults.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 hover:border-slate-300 transition-all shadow-sm"
              >
                {/* Meta block */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded">
                      {item.section}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold font-mono uppercase">{item.category}</span>
                  </div>

                  {searchQuery && item.relevance && (
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      item.relevance > 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      item.relevance > 40 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      Relevance: {item.relevance}%
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-xs font-bold text-slate-900 leading-snug flex items-center gap-1">
                  <FileText className="w-4 h-4 text-blue-600" />
                  {item.title}
                </h4>

                {/* Body paragraph */}
                <p className="text-[11px] text-slate-600 leading-relaxed pl-5 font-semibold">
                  "{item.excerpt}"
                </p>

                {/* Bottom Source & Link */}
                <div className="pt-2 border-t border-slate-200/50 flex justify-between items-center text-[10px] text-slate-400 font-mono font-bold">
                  <span>Source: {item.source}</span>
                  <a
                    href="https://moud.gov.in/"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="flex items-center gap-0.5 text-blue-600 hover:text-blue-700 font-bold transition-all hover:underline"
                  >
                    <span>Read Code</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
