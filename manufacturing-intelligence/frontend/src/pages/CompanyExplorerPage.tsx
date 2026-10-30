import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { getCompanies, exportCompanies } from '../api/companies';
import type { CompanySearchParams } from '../types';

export const CompanyExplorerPage: React.FC = () => {
  const navigate = useNavigate();

  // Search and Filter States
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedClassification, setSelectedClassification] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedEmployeeRange, setSelectedEmployeeRange] = useState<string>('');
  const [hasWebsite, setHasWebsite] = useState<boolean | undefined>(undefined);
  const [isVerified, setIsVerified] = useState<boolean | undefined>(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const queryParams: CompanySearchParams = {
    q: search || undefined,
    countries: selectedCountry ? [selectedCountry] : undefined,
    classifications: selectedClassification ? [selectedClassification] : undefined,
    industrySector: selectedSector || undefined,
    employeeRanges: selectedEmployeeRange ? [selectedEmployeeRange] : undefined,
    hasWebsite,
    isVerified,
    page,
    pageSize,
    sortBy,
    sortDir,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['companies-list', queryParams],
    queryFn: () => getCompanies(queryParams),
  });

  const handleExport = async (format: 'csv' | 'excel' | 'json') => {
    try {
      const url = await exportCompanies(queryParams, format);
      const link = document.createElement('a');
      link.href = url;
      link.download = `manufacturing_companies_${Date.now()}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Failed to trigger export. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Quick Export Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Company Explorer</h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and inspect verified global manufacturing companies across all 5 target regions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Download className="h-3.5 w-3.5" />
            Excel
          </button>
          <button
            onClick={() => handleExport('json')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Download className="h-3.5 w-3.5" />
            JSON
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search legal name, domain, city, registration number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Country Selector */}
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setPage(1);
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Regions</option>
              <option value="United States">🇺🇸 United States</option>
              <option value="India">🇮🇳 India</option>
              <option value="United Kingdom">🇬🇧 United Kingdom</option>
              <option value="Middle East">🇦🇪 Middle East (All GCC)</option>
              <option value="United Arab Emirates">🇦🇪 UAE</option>
              <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
              <option value="Qatar">🇶🇦 Qatar</option>
              <option value="Oman">🇴🇲 Oman</option>
              <option value="Bahrain">🇧🇭 Bahrain</option>
              <option value="Kuwait">🇰🇼 Kuwait</option>
              <option value="Singapore">🇸🇬 Singapore</option>
            </select>

            {/* Manufacturing Classification Selector */}
            <select
              value={selectedClassification}
              onChange={(e) => {
                setSelectedClassification(e.target.value);
                setPage(1);
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Classifications</option>
              <option value="confirmed_manufacturer">Confirmed Manufacturer</option>
              <option value="probable_manufacturer">Probable Manufacturer</option>
              <option value="contract_manufacturer">Contract / OEM</option>
              <option value="manufacturer_and_distributor">Mfg & Distributor</option>
              <option value="multi_facility_manufacturer">Multi-Facility</option>
              <option value="distributor_only">Distributor Only (Excluded)</option>
            </select>

            {/* Industry Sector Selector */}
            <select
              value={selectedSector}
              onChange={(e) => {
                setSelectedSector(e.target.value);
                setPage(1);
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All 10 Taxonomy Sectors</option>
              <option value="Industrial machinery and equipment">Industrial Machinery</option>
              <option value="Robotics and automation">Robotics & Automation</option>
              <option value="Automotive and transportation">Automotive & Transport</option>
              <option value="Electrical and electronics">Electrical & Electronics</option>
              <option value="Metal and fabrication">Metal & Fabrication</option>
              <option value="Chemicals and materials">Chemicals & Materials</option>
              <option value="Food and agriculture">Food & Agriculture</option>
              <option value="Pharmaceuticals and healthcare">Pharma & Healthcare</option>
              <option value="Textiles and consumer manufacturing">Textiles & Consumer</option>
              <option value="Construction and infrastructure">Construction & Infra</option>
            </select>
            {/* Employee Range Selector */}
            <select
              value={selectedEmployeeRange}
              onChange={(e) => {
                setSelectedEmployeeRange(e.target.value);
                setPage(1);
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Employee Ranges</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1,000 employees</option>
              <option value="1001-5000">1,001-5,000 employees</option>
              <option value="5000+">5,000+ employees</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80 gap-3">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isVerified === true}
                onChange={(e) => {
                  setIsVerified(e.target.checked ? true : undefined);
                  setPage(1);
                }}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
              />
              <span className="text-slate-300">Verified Manufacturers Only</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasWebsite === true}
                onChange={(e) => {
                  setHasWebsite(e.target.checked ? true : undefined);
                  setPage(1);
                }}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
              />
              <span className="text-slate-300">Has Official Website</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span>Sort:</span>
              <select
                value={`${sortBy}:${sortDir}`}
                onChange={(e) => {
                  const [sb, sd] = e.target.value.split(':');
                  setSortBy(sb);
                  setSortDir(sd as 'asc' | 'desc');
                  setPage(1);
                }}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
              >
                <option value="created_at:desc">Newest First</option>
                <option value="created_at:asc">Oldest First</option>
                <option value="legal_name:asc">Name (A-Z)</option>
                <option value="employee_count:desc">Employees (High-Low)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
              >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>
      </div>
    </div>

      {/* Main Companies Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Company Legal Name</th>
                <th className="py-3 px-4">Country & City</th>
                <th className="py-3 px-4">Industry Sector</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Workforce</th>
                <th className="py-3 px-4">Official Website</th>
                <th className="py-3 px-4">Data Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-indigo-500" />
                      Loading company directory...
                    </div>
                  </td>
                </tr>
              ) : data && data.items.length > 0 ? (
                data.items.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/companies/${c.id}`)}
                    className="hover:bg-slate-800/50 cursor-pointer transition group"
                  >
                    <td className="py-3.5 px-4 font-medium text-white">
                      <div className="flex items-center gap-2">
                        {c.isVerified && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        )}
                        <div>
                          <div className="group-hover:text-indigo-400 font-semibold transition">
                            {c.legalName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {c.registrationNumber || c.internalId}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div className="text-slate-200 font-medium">{c.country}</div>
                      <div className="text-slate-400">{c.city || '—'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div className="text-slate-200 font-medium">{c.industrySector}</div>
                      <div className="text-slate-400 truncate max-w-xs">{c.industrySubsector || '—'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          c.manufacturingClassification.includes('confirmed')
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : c.manufacturingClassification.includes('probable')
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            : c.manufacturingClassification.includes('contract')
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {c.manufacturingClassification.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono text-slate-300">
                      {c.employeeCount ? `${c.employeeCount.toLocaleString()} emp` : c.employeeCountRange || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      {c.officialWebsite ? (
                        <a
                          href={c.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 font-mono truncate max-w-[150px]"
                        >
                          {c.rootDomain || 'visit'}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500">Unavailable</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${Math.round(c.dataCompletenessScore * 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-400">
                          {Math.round(c.dataCompletenessScore * 100)}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/companies/${c.id}`);
                        }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No manufacturing companies match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Bar */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-200">{((page - 1) * pageSize) + (data?.items.length ? 1 : 0)}</span> to{' '}
            <span className="font-semibold text-slate-200">{Math.min(page * pageSize, data?.total ?? 0)}</span> of{' '}
            <span className="font-semibold text-slate-200">{(data?.total ?? 0).toLocaleString()}</span> records
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2">
              Page <span className="font-semibold text-slate-200">{page}</span> of{' '}
              <span className="font-semibold text-slate-200">{data?.totalPages ?? 1}</span>
            </span>
            <button
              disabled={data ? page >= data.totalPages : true}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompanyExplorerPage;

