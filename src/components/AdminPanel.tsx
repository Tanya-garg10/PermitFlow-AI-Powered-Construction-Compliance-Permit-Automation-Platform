import React, { useState, useEffect } from 'react';
import { Regulation } from '../types';
import { Trash2, BarChart3, Users, Settings, PlusCircle } from 'lucide-react';

interface AdminPanelProps {
  regulations: Regulation[];
  onAddRegulation: (r: any) => void;
  onDeleteRegulation: (id: string) => void;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminPanel({ regulations, onAddRegulation, onDeleteRegulation }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'rules' | 'users'>('analytics');
  
  // Regulation Add Form States
  const [regCategory, setRegCategory] = useState('Zoning');
  const [regName, setRegName] = useState('');
  const [regDesc, setRegDesc] = useState('');
  const [regLimitType, setRegLimitType] = useState<'max' | 'min' | 'exact'>('max');
  const [regValue, setRegValue] = useState('');
  const [regUnit, setRegUnit] = useState('');

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const mockUsers: AdminUser[] = [
    { id: "usr-1", name: "Rajesh Kumar", email: "taniyagarg1007@gmail.com", role: "Contractor" },
    { id: "usr-2", name: "Priya Sharma", email: "architect@permitflow.com", role: "Architect" },
    { id: "usr-3", name: "Anil Patel", email: "contractor@permitflow.com", role: "Contractor" },
    { id: "usr-4", name: "Sunil Deshmukh", email: "officer@permitflow.com", role: "Municipal Officer" },
    { id: "usr-5", name: "Admin root", email: "admin@permitflow.com", role: "Admin" }
  ];

  // Fetch Analytics from server
  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        setAnalyticsData(data);
        setLoadingAnalytics(false);
      })
      .catch(err => {
        console.error("Error loading analytics:", err);
        setLoadingAnalytics(false);
      });
  }, [regulations]); // Reload when regulations change

  const handleCreateRegulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regValue) return;

    onAddRegulation({
      category: regCategory,
      name: regName,
      description: regDesc,
      limitType: regLimitType,
      value: Number(regValue),
      unit: regUnit || "units"
    });

    // Reset Form
    setRegName('');
    setRegDesc('');
    setRegValue('');
    setRegUnit('');
  };

  return (
    <div id="admin-panel-container" className="space-y-6 font-sans text-slate-800">
      
      {/* Sub Header tabs switcher */}
      <div className="flex border-b border-slate-200">
        <button
          id="admin-tab-analytics"
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'analytics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 inline mr-1.5" />
          System Analytics
        </button>
        <button
          id="admin-tab-rules"
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'rules' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5 inline mr-1.5" />
          Regulations Manager
        </button>
        <button
          id="admin-tab-users"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5 inline mr-1.5" />
          User Directory
        </button>
      </div>

      {/* ADMIN TAB CONTENTS */}

      {activeTab === 'analytics' && (
        <div id="admin-analytics-view" className="space-y-6">
          {loadingAnalytics ? (
            <p className="text-xs text-slate-400 text-center py-12 italic">Compiling municipal statistics databases...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Chart 1: Permit status breakout (Draft, Submitted, Approved, Rejected) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block mb-4">Permit Status Allocation</span>
                <div className="space-y-4 text-xs font-sans">
                  {analyticsData?.permitStatusCounts.map((stat: any, idx: number) => {
                    const total = analyticsData.permitStatusCounts.reduce((acc: number, c: any) => acc + c.value, 0) || 1;
                    const percent = Math.round((stat.value / total) * 100);

                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between font-bold text-[11px]">
                          <span className="text-slate-700">{stat.name} ({stat.value} Filings)</span>
                          <span className="text-slate-500 font-mono font-black">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              stat.name === 'Approved' ? 'bg-emerald-500' :
                              stat.name === 'Submitted' ? 'bg-blue-500' :
                              stat.name === 'Rejected' ? 'bg-rose-500' :
                              'bg-slate-400'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 2: Violation counts */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block mb-4">Zoning Violation categories</span>
                <div className="space-y-3.5 text-xs">
                  {analyticsData?.violationTypes.map((v: any, idx: number) => {
                    const maxCount = Math.max(...analyticsData.violationTypes.map((i: any) => i.count)) || 1;
                    const percent = Math.round((v.count / maxCount) * 100);

                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <span className="w-28 text-slate-700 font-bold truncate">{v.category}</span>
                        <div className="flex-1 bg-slate-50 rounded-lg h-5 overflow-hidden relative border border-slate-200 flex items-center pl-2">
                          <div
                            className="absolute top-0 left-0 h-full bg-blue-600/10 border-r-2 border-blue-500 rounded-r transition-all"
                            style={{ width: `${percent}%` }}
                          />
                          <span className="relative z-10 font-mono text-[10px] text-blue-700 font-black">{v.count} violations flagged</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 3: Average approval days */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block mb-4">Average Clearance Turnaround (Days)</span>
                <div className="space-y-4 text-xs">
                  {analyticsData?.averageApprovalTime.map((item: any, idx: number) => {
                    const maxDays = Math.max(...analyticsData.averageApprovalTime.map((i: any) => i.days)) || 1;
                    const percent = Math.round((item.days / maxDays) * 100);

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-700">{item.category} Occupancy</span>
                          <span className="text-blue-600 font-mono font-black">{item.days} business days</span>
                        </div>
                        <div className="w-full bg-slate-50 rounded-lg h-3 overflow-hidden border border-slate-200 relative flex items-center pl-2">
                          <div
                            className="absolute top-0 left-0 h-full bg-blue-600/10 border-r border-blue-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 4: Historical Approval success rate */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block mb-4">Clearing rate Progression</span>
                  <div className="flex items-end justify-between h-28 pt-4 border-b border-slate-200 border-l border-slate-200 px-4 font-mono text-[9px] text-slate-400">
                    {analyticsData?.approvalRateHistory.map((item: any, idx: number) => {
                      const hPercent = item.rate;

                      return (
                        <div key={idx} className="flex flex-col items-center gap-1 w-8 shrink-0">
                          <span className="text-blue-600 font-bold text-[10px]">{hPercent}%</span>
                          <div
                            className="w-4 bg-gradient-to-t from-blue-100 to-blue-600 border-t border-blue-500 rounded-t"
                            style={{ height: `${hPercent * 0.8}px` }}
                          />
                          <span className="text-slate-400 font-bold mt-1">{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold italic mt-3 text-center">Historical tracking of month-over-month first-time zoning clearances.</p>
              </div>

            </div>
          )}
        </div>
      )}

      {activeTab === 'rules' && (
        <div id="admin-rules-manager" className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          
          {/* List of active regulations rules */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block mb-4">Active Building Standards ({regulations.length})</span>
            
            <div className="overflow-x-auto text-xs text-slate-700">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 font-mono text-[10px] uppercase text-slate-400">
                    <th className="py-2.5 px-3">Standard / Name</th>
                    <th className="py-2.5 px-3">Limits</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {regulations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{reg.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{reg.description}</div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="text-slate-400 lowercase font-medium">{reg.limitType}</span>
                        <span className="text-slate-900 font-black ml-1.5">{reg.value}</span>
                        <span className="text-slate-500 ml-1">{reg.unit}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-blue-50 border border-blue-200 text-blue-700 font-bold font-mono">
                          {reg.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          id={`delete-reg-btn-${reg.id}`}
                          onClick={() => onDeleteRegulation(reg.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form to add a new regulation */}
          <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between h-fit space-y-4 shadow-sm text-slate-800">
            <div>
              <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block mb-4">Add Zoning Standard</span>
              
              <form onSubmit={handleCreateRegulation} className="space-y-3.5 text-xs text-slate-700">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Standard Name</label>
                  <input
                    id="reg-name-input"
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g., Minimum Front Setback"
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Standard Description</label>
                  <input
                    id="reg-desc-input"
                    type="text"
                    value={regDesc}
                    onChange={(e) => setRegDesc(e.target.value)}
                    placeholder="e.g., Min open front space from boundary"
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Category Code</label>
                    <select
                      id="reg-cat-select"
                      value={regCategory}
                      onChange={(e) => setRegCategory(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:outline-none font-semibold"
                    >
                      <option value="Zoning">Zoning</option>
                      <option value="BuildingCode">BuildingCode</option>
                      <option value="Environmental">Environmental</option>
                      <option value="FireSafety">FireSafety</option>
                      <option value="Parking">Parking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Constraint</label>
                    <select
                      id="reg-limit-select"
                      value={regLimitType}
                      onChange={(e) => setRegLimitType(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:outline-none font-semibold"
                    >
                      <option value="max">Max Limit</option>
                      <option value="min">Min Limit</option>
                      <option value="exact">Exact match</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Limit Value</label>
                    <input
                      id="reg-val-input"
                      type="number"
                      step="0.1"
                      required
                      value={regValue}
                      onChange={(e) => setRegValue(e.target.value)}
                      placeholder="e.g., 5.0"
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Value Unit</label>
                    <input
                      id="reg-unit-input"
                      type="text"
                      value={regUnit}
                      onChange={(e) => setRegUnit(e.target.value)}
                      placeholder="e.g., m or spaces"
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  id="submit-reg-btn"
                  type="submit"
                  className="w-full flex items-center justify-center space-x-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-xs text-white shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Standard</span>
                </button>
              </form>
            </div>
            
            <p className="text-[10px] text-slate-400 font-semibold leading-normal italic text-center">Creating standard rules triggers an automated re-evaluation of all submitted drawings and recalculates their compliance score.</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div id="admin-users-directory" className="bg-white border border-slate-200 rounded-2xl p-5 text-xs text-slate-800 max-w-4xl shadow-sm">
          <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block mb-4">User Registry Directory</span>
          
          <div className="space-y-2.5">
            {mockUsers.map((user) => (
              <div key={user.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-black text-slate-800">{user.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 font-bold">{user.email}</div>
                </div>

                <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-700 shadow-sm">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
