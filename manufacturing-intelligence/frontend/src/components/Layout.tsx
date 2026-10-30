import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Building2,
  Database,
  ShieldCheck,
  Download,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCompanyStats, searchCompanies } from '../api/companies';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['company-stats'],
    queryFn: getCompanyStats,
    refetchInterval: 15_000,
  });

  const { data: quickResults } = useQuery({
    queryKey: ['quick-search', searchQuery],
    queryFn: () => searchCompanies(searchQuery),
    enabled: searchQuery.trim().length >= 2,
  });

  const navItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Company Explorer', path: '/explorer', icon: Building2 },
    { label: 'Data Collection', path: '/collection', icon: Database },
    { label: 'Data Quality', path: '/quality', icon: ShieldCheck },
    { label: 'Export Center', path: '/export', icon: Download },
  ];

  const targetCount = 50_000;
  const verifiedCount = stats?.verifiedManufacturers ?? 0;
  const progressPct = stats?.progressToTarget ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="font-semibold text-lg tracking-tight text-white">GlobalMfg</span>
            <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">
              Intelligence Platform
            </span>
          </div>
        </div>

        {/* Global Search Bar with Autocomplete */}
        <div className="relative w-96">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies, registration no, domain..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {isSearching && quickResults && quickResults.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-2 z-50 max-h-80 overflow-y-auto">
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Matching Companies
              </div>
              {quickResults.map((co) => (
                <button
                  key={co.id}
                  onClick={() => {
                    navigate(`/companies/${co.id}`);
                    setIsSearching(false);
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center justify-between transition group"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-200 group-hover:text-indigo-400">
                      {co.legalName}
                    </div>
                    <div className="text-xs text-slate-400">
                      {co.city ? `${co.city}, ` : ''}{co.country} • {co.industrySector ?? 'Manufacturing'}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 50,000 Target Progress Counter in Header */}
        <div className="flex items-center gap-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-1.5 flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Target Progress
              </span>
              <span className="text-xs font-bold text-slate-100">
                {verifiedCount.toLocaleString()} <span className="text-slate-400 font-normal">/ {targetCount.toLocaleString()}</span>
              </span>
            </div>
            <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(progressPct, 1))}%` }}
              />
            </div>
            <span className="text-xs font-bold text-cyan-400">{progressPct}%</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">System Live</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col justify-between shrink-0">
          <nav className="space-y-1.5">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Regional Quick Links & Status */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              5 Target Regions
            </div>
            <div className="space-y-1 text-xs text-slate-300 px-3">
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="flex items-center gap-1.5">🇺🇸 United States</span>
                <span className="text-slate-400 font-mono">15k target</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="flex items-center gap-1.5">🇮🇳 India</span>
                <span className="text-slate-400 font-mono">15k target</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="flex items-center gap-1.5">🇬🇧 United Kingdom</span>
                <span className="text-slate-400 font-mono">8k target</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="flex items-center gap-1.5">🇦🇪 Middle East (GCC)</span>
                <span className="text-slate-400 font-mono">8k target</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="flex items-center gap-1.5">🇸🇬 Singapore</span>
                <span className="text-slate-400 font-mono">4k target</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
};
export default Layout;

