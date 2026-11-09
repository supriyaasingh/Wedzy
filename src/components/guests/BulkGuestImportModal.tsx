import React, { useState, useMemo } from 'react';
import {
  X,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Users,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import {
  downloadSampleCsvTemplate,
  parseAndValidateCsv,
  ParsedGuestRow,
} from '../../utils/csvHelper';
import { DiyaIcon } from '../illustrations/IndianWeddingDecorations';

interface BulkGuestImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (count: number) => void;
}

export const BulkGuestImportModal: React.FC<BulkGuestImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const { guests, bulkAddGuests } = useWedding();

  const [rawText, setRawText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedGuestRow[]>([]);
  const [hasParsed, setHasParsed] = useState(false);
  const [fileName, setFileName] = useState('');

  const existingPhoneSet = useMemo(() => {
    return new Set(guests.map((g) => g.phone.replace(/[^0-9]/g, '')));
  }, [guests]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
      const rows = parseAndValidateCsv(content, existingPhoneSet);
      setParsedRows(rows);
      setHasParsed(true);
    };
    reader.readAsText(file);
  };

  const handleParseText = () => {
    if (!rawText.trim()) return;
    const rows = parseAndValidateCsv(rawText, existingPhoneSet);
    setParsedRows(rows);
    setHasParsed(true);
  };

  const validRows = parsedRows.filter((r) => r.isValid);
  const invalidRows = parsedRows.filter((r) => !r.isValid);

  const handleRemoveRow = (index: number) => {
    setParsedRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRowChange = (index: number, field: keyof ParsedGuestRow, value: any) => {
    setParsedRows((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], [field]: value };
      
      // Re-validate row
      const errors: string[] = [];
      if (!target.name || target.name.trim().length < 2) errors.push('Name is too short');
      const cleanP = target.phone.replace(/[^0-9]/g, '');
      if (cleanP.length < 8) errors.push('Phone is too short');
      target.isValid = errors.length === 0;
      target.errors = errors;
      updated[index] = target;
      return updated;
    });
  };

  const handleConfirmImport = () => {
    if (validRows.length === 0) return;

    const formatted = validRows.map((r) => ({
      name: r.name,
      phone: r.phone,
      countryCode: r.countryCode,
      familyName: r.familyName || `${r.name.split(' ')[0]} Family`,
      category: r.category,
      expectedMembers: r.expectedMembers,
      notes: r.notes,
    }));

    const added = bulkAddGuests(formatted);
    onImportComplete(added);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-2xl border-2 border-[#E5C378] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Top Gold Border */}
        <div className="h-1.5 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#F59E0B]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#6B5E55] hover:text-[#800020] hover:bg-[#FAF0D4] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B45309]">
              <DiyaIcon className="w-4 h-4" />
              <span>Bulk Guest Import Engine</span>
            </div>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#800020] mt-1">
              Import Guests via CSV / Excel
            </h3>
            <p className="text-xs sm:text-sm text-[#6B5E55] mt-1">
              Upload your contact list to invite dozens of families at once. The engine automatically validates names, phone numbers, and detects duplicates.
            </p>
          </div>

          {/* Download Sample Template Banner */}
          <div className="p-3.5 bg-white rounded-xl border border-[#E5C378]/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#800020]" />
              <div>
                <strong className="text-[#3D291F] block">Download Pre-Formatted Template</strong>
                <span className="text-[#786C64]">Includes columns for names, phones, family units, categories & diet.</span>
              </div>
            </div>
            <button
              onClick={downloadSampleCsvTemplate}
              className="px-3 py-1.5 bg-[#FAF0D4] hover:bg-[#F5E3B5] text-[#800020] font-semibold rounded-md border border-[#E5C378] flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Template</span>
            </button>
          </div>

          {/* Upload Dropzone & Paste Area */}
          {!hasParsed && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#E5C378] hover:border-[#800020] rounded-xl p-6 text-center bg-white/70 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-8 h-8 text-[#B45309] mx-auto mb-2" />
                <span className="font-bold text-xs sm:text-sm text-[#800020] block">
                  Click to Browse or Drag & Drop CSV File
                </span>
                <span className="text-[11px] text-[#786C64] mt-1 block">
                  Supports comma-separated (.csv) exports from Google Contacts, Excel, or Apple Contacts.
                </span>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-semibold text-[#3D291F]">Or Paste Raw CSV Data Directly:</span>
                </div>
                <textarea
                  rows={4}
                  placeholder={`Full Name,Phone Number,Country Code,Family Group,Category,Expected Members,Notes\nRahul Sharma,9811223344,+91,Sharma Family,Bride's family,4,Vegetarian only`}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E5C378] rounded-lg focus:outline-hidden"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleParseText}
                    disabled={!rawText.trim()}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#800020] hover:bg-[#6B081B] rounded-md disabled:opacity-50"
                  >
                    Parse & Validate Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Validation & Preview Table */}
          {hasParsed && (
            <div className="space-y-4">
              
              {/* Summary Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-lg border border-[#E5C378]">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-[#3D291F]">Parsed Rows: {parsedRows.length}</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    ✓ {validRows.length} Valid
                  </span>
                  {invalidRows.length > 0 && (
                    <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {invalidRows.length} Need Correction
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setHasParsed(false);
                    setParsedRows([]);
                  }}
                  className="text-xs text-[#800020] hover:underline font-semibold"
                >
                  Upload Different File
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto max-h-[300px] border border-[#E5C378] rounded-lg bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#800020] uppercase font-bold text-[10px] tracking-wider border-b border-[#E5C378]">
                    <tr>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Guest Name</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Family Group</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Party</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {parsedRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={row.isValid ? 'hover:bg-[#FAF7F2]' : 'bg-rose-50/60'}
                      >
                        <td className="py-2 px-3">
                          {row.isValid ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Ready
                            </span>
                          ) : (
                            <span
                              title={row.errors.join(', ')}
                              className="text-rose-700 font-bold flex items-center gap-1 text-[11px] cursor-help"
                            >
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              Fix ({row.errors[0]})
                            </span>
                          )}
                        </td>

                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => handleRowChange(idx, 'name', e.target.value)}
                            className="w-full px-1.5 py-0.5 border border-neutral-300 rounded text-xs font-semibold"
                          />
                        </td>

                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.phone}
                            onChange={(e) => handleRowChange(idx, 'phone', e.target.value)}
                            className="w-28 px-1.5 py-0.5 border border-neutral-300 rounded font-mono text-xs"
                          />
                        </td>

                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.familyName || ''}
                            onChange={(e) => handleRowChange(idx, 'familyName', e.target.value)}
                            className="w-28 px-1.5 py-0.5 border border-neutral-300 rounded text-xs"
                          />
                        </td>

                        <td className="py-2 px-3">
                          <select
                            value={row.category}
                            onChange={(e) => handleRowChange(idx, 'category', e.target.value)}
                            className="px-1.5 py-0.5 border border-neutral-300 rounded text-xs"
                          >
                            <option value="Bride's family">Bride's Family</option>
                            <option value="Groom's family">Groom's Family</option>
                            <option value="Friends">Friends</option>
                            <option value="Relatives">Relatives</option>
                            <option value="Colleagues">Colleagues</option>
                            <option value="Neighbours">Neighbours</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>

                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="1"
                            max="15"
                            value={row.expectedMembers}
                            onChange={(e) => handleRowChange(idx, 'expectedMembers', Number(e.target.value))}
                            className="w-12 px-1 py-0.5 border border-neutral-300 rounded font-mono text-center"
                          />
                        </td>

                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(idx)}
                            className="p-1 text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Confirm Import Action */}
              <div className="pt-3 border-t border-[#E5C378]/40 flex items-center justify-between">
                <span className="text-xs text-[#6B5E55]">
                  Only rows marked <strong>Ready</strong> will be imported.
                </span>

                <button
                  type="button"
                  disabled={validRows.length === 0}
                  onClick={handleConfirmImport}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 rounded-lg shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Import {validRows.length} Valid Guests</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
