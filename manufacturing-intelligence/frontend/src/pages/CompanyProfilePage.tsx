import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  CheckCircle2,
  ArrowLeft,
  Globe,
  MapPin,
  Users,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  Factory,
  AlertTriangle,
} from 'lucide-react';
import { getCompany, updateCompanyReview } from '../api/companies';

export const CompanyProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'leadership' | 'financials' | 'provenance' | 'review'>('overview');

  const [reviewStatus, setReviewStatus] = useState<string>('');
  const [reviewNote, setReviewNote] = useState<string>('');
  const [overrideClassif, setOverrideClassif] = useState<string>('');

  const { data: company, isLoading, error } = useQuery({
    queryKey: ['company-detail', id],
    queryFn: () => getCompany(id!),
    enabled: Boolean(id),
  });

  const reviewMutation = useMutation({
    mutationFn: (updateData: any) => updateCompanyReview(id!, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['company-stats'] });
      alert('Review status updated successfully.');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
        Loading company profile...
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-8 text-center text-slate-300">
        <h2 className="text-xl font-bold text-red-400">Company Not Found</h2>
        <p className="text-sm mt-2">The requested company record could not be retrieved.</p>
        <Link to="/explorer" className="mt-4 inline-block text-indigo-400 underline text-sm">
          Return to Explorer
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back Link */}
      <Link
        to="/explorer"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Company Explorer
      </Link>

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {company.legalName}
              </h1>
              {company.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified Entity
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                {company.manufacturingClassification.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                {company.city ? `${company.city}, ` : ''}{company.country}
              </span>
              <span className="font-mono text-slate-300">
                Reg: {company.registrationNumber || 'Pending'}
              </span>
              <span className="font-mono text-slate-400">
                ID: {company.internalId}
              </span>
              <span className="text-slate-400">
                Sector: <strong className="text-slate-200">{company.industrySector}</strong>
              </span>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Completeness
              </span>
              <div className="text-xl font-bold text-white flex items-center gap-2">
                {Math.round(company.dataCompletenessScore * 100)}%
                <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.round(company.dataCompletenessScore * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Confidence
              </span>
              <div className="text-xl font-bold text-cyan-400">
                {Math.round((company.classificationConfidence || 0.9) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mt-8 gap-2 overflow-x-auto text-xs font-medium">
          {[
            { id: 'overview', label: 'Overview & Facilities' },
            { id: 'products', label: 'Products & Capabilities' },
            { id: 'leadership', label: `Leadership (${company.executives?.length ?? 0})` },
            { id: 'financials', label: `Financials (${company.financials?.length ?? 0})` },
            { id: 'provenance', label: `Evidence Audit Trail (${company.fieldEvidence?.length ?? 0})` },
            { id: 'review', label: 'Classification Review' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview & Location */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity & Legal Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-400" />
              Corporate Identity & Legal Data
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Official Legal Name</span>
                <span className="text-slate-200 font-semibold text-right">{company.legalName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Trading Name</span>
                <span className="text-slate-200">{company.tradingName || '—'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Official Registration Number</span>
                <span className="text-slate-200 font-mono font-semibold">{company.registrationNumber || 'Unavailable'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Legal Entity Status</span>
                <span className="text-emerald-400 font-medium capitalize">{company.legalStatus}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Industry Sector</span>
                <span className="text-slate-200 font-medium">{company.industrySector}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Sub-Industry Category</span>
                <span className="text-slate-200">{company.industrySubsector || '—'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Discovery Source</span>
                <span className="text-indigo-400 font-mono">{company.discoverySource}</span>
              </div>
            </div>
          </div>

          {/* Digital Presence & Public Contacts */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              Digital Presence & Public Contacts
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Official Website</span>
                {company.officialWebsite ? (
                  <a
                    href={company.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline font-mono flex items-center gap-1"
                  >
                    {company.officialWebsite}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-slate-500">None documented</span>
                )}
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Canonical Root Domain</span>
                <span className="text-slate-200 font-mono">{company.rootDomain || '—'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Public Business Email</span>
                <span className="text-slate-200 font-mono">{company.email || '—'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Office Telephone</span>
                <span className="text-slate-200 font-mono">{company.phone || '—'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Registered Office Address</span>
                <span className="text-slate-200 text-right max-w-xs">{company.registeredAddress || '—'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Headquarters Address</span>
                <span className="text-slate-200 text-right max-w-xs">{company.operationalAddress || company.registeredAddress || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products & Capabilities */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Factory className="h-4 w-4 text-emerald-400" />
              Manufactured Products & Capabilities
            </h3>
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Documented Products
              </div>
              <div className="flex flex-wrap gap-2">
                {company.mainProducts && company.mainProducts.length > 0 ? (
                  company.mainProducts.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium"
                    >
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-xs">No specific product line tagged.</span>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800">
                  <div className="text-xs text-slate-400">OEM Capabilities</div>
                  <div className="text-sm font-bold text-white mt-1">
                    {company.isOem ? 'Yes (Verified)' : 'Not Documented'}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800">
                  <div className="text-xs text-slate-400">ODM Capabilities</div>
                  <div className="text-sm font-bold text-white mt-1">
                    {company.isOdm ? 'Yes (Verified)' : 'Not Documented'}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800">
                  <div className="text-xs text-slate-400">Workforce Scale</div>
                  <div className="text-sm font-bold text-white mt-1">
                    {company.employeeCount ? `${company.employeeCount.toLocaleString()} Employees` : company.employeeCountRange || '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Leadership & Directors */}
      {activeTab === 'leadership' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-400" />
            Publicly Listed Leadership & Board Directors
          </h3>
          {company.executives && company.executives.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-400 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Full Name</th>
                    <th className="py-2.5 px-4">Job Title</th>
                    <th className="py-2.5 px-4">Role Type</th>
                    <th className="py-2.5 px-4">Profile URL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {company.executives.map((person) => (
                    <tr key={person.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-semibold text-white">{person.fullName}</td>
                      <td className="py-3 px-4 text-slate-300">{person.jobTitle}</td>
                      <td className="py-3 px-4 capitalize">
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                          {person.roleType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {person.publicProfileUrl ? (
                          <a
                            href={person.publicProfileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            Profile <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-slate-500">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-6 text-center">
              No leadership personnel publicly documented for this entity yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Financial Records */}
      {activeTab === 'financials' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-rose-400" />
            Reported Financial Data & Revenue Records
          </h3>
          {company.financials && company.financials.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-400 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Financial Year</th>
                    <th className="py-2.5 px-4">Revenue Amount</th>
                    <th className="py-2.5 px-4">Currency</th>
                    <th className="py-2.5 px-4">Reporting Status</th>
                    <th className="py-2.5 px-4">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {company.financials.map((fin) => (
                    <tr key={fin.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-bold text-white font-mono">{fin.financialYear}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-400">
                        {fin.revenueAmount ? fin.revenueAmount.toLocaleString() : 'Undisclosed'}
                      </td>
                      <td className="py-3 px-4 font-mono">{fin.revenueCurrency}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          fin.isReported ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {fin.isReported ? 'Officially Reported' : 'Secondary Estimate'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{fin.source || 'Regulatory Filing'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-6 text-center">
              No financial filings documented for this private entity.
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Data Provenance & Evidence Audit Trail (Section 4J) */}
      {activeTab === 'provenance' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              Field Evidence & Data Provenance Audit Trail
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Audited Provenance Records
            </span>
          </div>
          {company.fieldEvidence && company.fieldEvidence.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-400 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Field Name</th>
                    <th className="py-2.5 px-4">Extracted Value</th>
                    <th className="py-2.5 px-4">Source URL</th>
                    <th className="py-2.5 px-4">Confidence</th>
                    <th className="py-2.5 px-4">Verification</th>
                    <th className="py-2.5 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {company.fieldEvidence.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-mono text-indigo-400 font-semibold">{ev.fieldName}</td>
                      <td className="py-3 px-4 font-mono text-slate-300 max-w-xs truncate">{ev.fieldValue}</td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                        {ev.sourceUrl || 'System Registry'}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-cyan-400">
                        {Math.round(ev.confidence * 100)}%
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                          {ev.isVerified ? 'Verified' : 'Unconfirmed'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(ev.extractedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-6 text-center">
              Provenance records are maintained in system logs.
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Classification Review & Human Queue */}
      {activeTab === 'review' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 max-w-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Human Review Queue & Classification Override
          </h3>
          <p className="text-xs text-slate-400">
            Current Review Status:{' '}
            <strong className="text-slate-200 uppercase font-mono">{company.reviewStatus || 'Pending'}</strong>
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Set Review Status</label>
              <select
                value={reviewStatus || company.reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
              >
                <option value="pending">Pending Review</option>
                <option value="approved">Approved as Manufacturing Company</option>
                <option value="rejected">Rejected (Non-Manufacturer)</option>
                <option value="flagged">Flagged for Secondary Audit</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Classification Override</label>
              <select
                value={overrideClassif || company.manufacturingClassification}
                onChange={(e) => setOverrideClassif(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
              >
                <option value="confirmed_manufacturer">Confirmed Manufacturer</option>
                <option value="probable_manufacturer">Probable Manufacturer</option>
                <option value="contract_manufacturer">Contract / OEM Manufacturer</option>
                <option value="manufacturer_and_distributor">Manufacturer & Distributor</option>
                <option value="multi_facility_manufacturer">Multi-Facility Manufacturer</option>
                <option value="distributor_only">Distributor Only</option>
                <option value="service_provider_only">Service Provider Only</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Audit Notes</label>
              <textarea
                rows={3}
                placeholder="Enter audit notes or evidence justification..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
              />
            </div>

            <button
              onClick={() => {
                reviewMutation.mutate({
                  reviewStatus: (reviewStatus || company.reviewStatus) as any,
                  reviewNote,
                  manufacturingClassification: overrideClassif || undefined,
                });
              }}
              disabled={reviewMutation.isPending}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition disabled:opacity-50"
            >
              {reviewMutation.isPending ? 'Saving...' : 'Save Review Decision'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CompanyProfilePage;

