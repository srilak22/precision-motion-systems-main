import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Download,
  FileSpreadsheet,
  FileJson,
  FileText,
  Clock,
} from 'lucide-react';
import { triggerExportJob, getExportJobs } from '../api/export';
import type { ExportParams } from '../types';

export const ExportCenterPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [format, setFormat] = useState<'csv' | 'excel' | 'json'>('csv');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'internal_id',
    'legal_name',
    'registration_number',
    'country',
    'city',
    'official_website',
    'email',
    'phone',
    'manufacturing_classification',
    'industry_sector',
    'main_products',
    'employee_count',
  ]);

  const availableFields = [
    { id: 'internal_id', label: 'Internal ID' },
    { id: 'legal_name', label: 'Legal Name' },
    { id: 'registration_number', label: 'Official Registration No' },
    { id: 'country', label: 'Country' },
    { id: 'city', label: 'City' },
    { id: 'registered_address', label: 'Registered Address' },
    { id: 'official_website', label: 'Official Website' },
    { id: 'email', label: 'Public Business Email' },
    { id: 'phone', label: 'Public Office Phone' },
    { id: 'manufacturing_classification', label: 'Manufacturing Classification' },
    { id: 'classification_confidence', label: 'Classification Confidence' },
    { id: 'industry_sector', label: 'Industry Sector' },
    { id: 'industry_subsector', label: 'Industry Subsector' },
    { id: 'main_products', label: 'Main Products' },
    { id: 'employee_count', label: 'Workforce (Employee Count)' },
    { id: 'is_verified', label: 'Verified Status' },
    { id: 'data_completeness_score', label: 'Completeness Score' },
    { id: 'discovery_source', label: 'Data Provenance Source' },
  ];

  const { data: exportHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['export-history'],
    queryFn: getExportJobs,
    refetchInterval: 3_000,
  });

  const exportMutation = useMutation({
    mutationFn: (params: ExportParams) => triggerExportJob(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['export-history'] });
      alert('Export job scheduled. File will be ready for download in a few seconds.');
    },
  });

  const handleGenerateExport = () => {
    const params: ExportParams = {
      format,
      countries: selectedCountry ? [selectedCountry] : undefined,
      industries: selectedIndustry ? [selectedIndustry] : undefined,
      verifiedOnly,
      fields: selectedFields,
    };
    exportMutation.mutate(params);
  };

  const toggleField = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter((f) => f !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Export Center</h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate filtered company datasets in CSV, Excel (.xlsx), and JSON formats with custom field selections.
        </p>
      </div>

      {/* Export Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Format & Filter Selection */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              1. Choose Export Format
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'csv', label: 'CSV', icon: FileText, desc: 'Flat tabular format' },
                { id: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet, desc: 'Formatted spreadsheet' },
                { id: 'json', label: 'JSON', icon: FileJson, desc: 'Structured JSON objects' },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = format === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setFormat(fmt.id as any)}
                    className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <div className="mt-3">
                      <div className="text-sm font-bold text-white">{fmt.label}</div>
                      <div className="text-[11px] text-slate-400">{fmt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtering Criteria */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              2. Filter Dataset
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Country / Region</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                >
                  <option value="">All Regions</option>
                  <option value="United States">United States</option>
                  <option value="India">India</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Middle East">Middle East (GCC)</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Manufacturing Sector</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                >
                  <option value="">All Taxonomy Sectors</option>
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
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                />
                <span className="text-slate-300 font-medium">Export Verified Manufacturers Only (Recommended)</span>
              </label>
            </div>
          </div>

          {/* Trigger Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleGenerateExport}
              disabled={exportMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {exportMutation.isPending ? 'Generating Export...' : 'Generate Export File'}
            </button>
          </div>
        </div>

        {/* Right Column: Field Selector */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              3. Field Selection ({selectedFields.length})
            </h3>
            <button
              onClick={() => setSelectedFields(availableFields.map((f) => f.id))}
              className="text-[11px] text-indigo-400 hover:underline font-medium"
            >
              Select All
            </button>
          </div>

          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            {availableFields.map((field) => {
              const isChecked = selectedFields.includes(field.id);
              return (
                <label
                  key={field.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800/60 cursor-pointer text-xs transition"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleField(field.id)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                  />
                  <span className={isChecked ? 'text-slate-100 font-medium' : 'text-slate-400'}>
                    {field.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Export History & Download Center */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          Export File History & Downloads
        </h2>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Record Count</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Download Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {historyLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">Loading export history...</td>
                  </tr>
                ) : exportHistory && exportHistory.length > 0 ? (
                  exportHistory.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {new Date(job.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 uppercase font-bold text-indigo-400">
                        {job.format}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {(job.recordCount ?? 0).toLocaleString()} records
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {job.fileSizeBytes ? `${(job.fileSizeBytes / 1024).toFixed(1)} KB` : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            job.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : job.status === 'processing'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {job.status === 'completed' && job.downloadUrl ? (
                          <a
                            href={job.downloadUrl}
                            download
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </a>
                        ) : (
                          <span className="text-slate-500">Processing...</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No files exported yet. Generate your first export above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExportCenterPage;

