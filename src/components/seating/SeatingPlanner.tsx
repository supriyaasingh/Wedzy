import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  UserCheck,
  ChevronRight,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { SeatingTable, Guest, GuestCategory } from '../../types/wedding';
import { DiyaIcon, SacredKalash } from '../illustrations/IndianWeddingDecorations';

export const SeatingPlanner: React.FC = () => {
  const {
    currentWedding,
    guests,
    seatingTables,
    addTable,
    updateTable,
    deleteTable,
    assignGuestToTable,
  } = useWedding();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(8);

  // Stats
  const totalCapacity = useMemo(() => {
    return seatingTables.reduce((acc, t) => acc + t.capacity, 0);
  }, [seatingTables]);

  const assignedGuestIdsSet = useMemo(() => {
    const set = new Set<string>();
    seatingTables.forEach((t) => {
      t.assignedGuestIds.forEach((id) => set.add(id));
    });
    return set;
  }, [seatingTables]);

  const totalAssignedGuests = assignedGuestIdsSet.size;
  const unassignedGuests = useMemo(() => {
    return guests.filter((g) => {
      const isUnassigned = !assignedGuestIdsSet.has(g.guestId);
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.familyName && g.familyName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = categoryFilter === 'all' || g.category === categoryFilter;
      return isUnassigned && matchesSearch && matchesCat;
    });
  }, [guests, assignedGuestIdsSet, searchQuery, categoryFilter]);

  const handleAddTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName) return;
    addTable(newTableName, newTableCapacity);
    setNewTableName('');
    setNewTableCapacity(8);
    setIsAddTableOpen(false);
  };

  const handlePrintSeating = () => {
    window.print();
  };

  const handleExportSeatingCsv = () => {
    const headers = ['Table Name', 'Capacity', 'Occupancy', 'Assigned Guest', 'Family', 'Phone', 'Category'];
    const rows: string[] = [];

    seatingTables.forEach((table) => {
      if (table.assignedGuestIds.length === 0) {
        rows.push([`"${table.tableName}"`, table.capacity, 0, '"(Empty)"', '""', '""', '""'].join(','));
      } else {
        table.assignedGuestIds.forEach((guestId) => {
          const g = guests.find((item) => item.guestId === guestId);
          if (g) {
            rows.push([
              `"${table.tableName}"`,
              table.capacity,
              table.assignedGuestIds.length,
              `"${g.name}"`,
              `"${g.familyName || ''}"`,
              `"${g.phone}"`,
              `"${g.category}"`,
            ].join(','));
          }
        });
      }
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding-seating-chart-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5C378]/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF0D4] border border-[#E5C378] flex items-center justify-center text-[#800020] shadow-2xs shrink-0">
            <Users className="w-6 h-6 text-[#800020]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
                Royal Seating & Hospitality
              </span>
              <span className="text-[11px] text-[#8C7A70]">·</span>
              <span className="text-[11px] text-[#5C4D43] font-medium">
                {seatingTables.length} Tables Configured
              </span>
            </div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#800020]">
              Banquet Seating & Table Allocations
            </h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Organize family courts, VIP stage lounges, friends pavilions, and ensure every guest feels royally honored.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddTableOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#800020] to-[#990000] hover:from-[#6B081B] hover:to-[#800020] rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#FDE047]" />
            <span>Add New Table</span>
          </button>

          <button
            onClick={handlePrintSeating}
            className="px-3.5 py-2 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Chart</span>
          </button>

          <button
            onClick={handleExportSeatingCsv}
            className="px-3.5 py-2 text-xs font-semibold text-[#5C4D43] hover:text-[#800020] bg-white hover:bg-[#FAF7F2] border border-[#E5C378] rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs">
          <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
            Configured Tables
          </span>
          <div className="font-mono text-2xl font-bold text-[#3D291F] mt-1 tabular-nums">
            {seatingTables.length}
          </div>
          <span className="text-[10px] text-[#5C4D43]">Banquet floor plan</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs">
          <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
            Total Seating Capacity
          </span>
          <div className="font-mono text-2xl font-bold text-[#800020] mt-1 tabular-nums">
            {totalCapacity}
          </div>
          <span className="text-[10px] text-[#5C4D43]">Chairs allocated</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
            Assigned Guests
          </span>
          <div className="font-mono text-2xl font-bold text-emerald-900 mt-1 tabular-nums">
            {totalAssignedGuests}
          </div>
          <span className="text-[10px] text-emerald-700">
            {totalCapacity ? Math.round((totalAssignedGuests / totalCapacity) * 100) : 0}% capacity filled
          </span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
            Unassigned Guests
          </span>
          <div className="font-mono text-2xl font-bold text-amber-900 mt-1 tabular-nums">
            {unassignedGuests.length}
          </div>
          <span className="text-[10px] text-amber-700">Awaiting table placement</span>
        </div>
      </div>

      {/* 2-Column Layout: Tables Grid on Left (8 cols) vs Unassigned Guest Drawer on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Seating Tables Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury text-base font-bold text-[#800020] flex items-center gap-2">
              <DiyaIcon className="w-4 h-4 text-[#800020]" />
              <span>Table Layout & Occupancy</span>
            </h3>
            <span className="text-xs text-[#786C64]">
              Assign guests directly to tables below
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seatingTables.map((table) => {
              const assignedGuests = table.assignedGuestIds
                .map((id) => guests.find((g) => g.guestId === id))
                .filter(Boolean) as Guest[];

              const isFull = assignedGuests.length >= table.capacity;
              const fillPct = Math.min(100, Math.round((assignedGuests.length / table.capacity) * 100));

              return (
                <div
                  key={table.tableId}
                  className="bg-white rounded-2xl border-2 border-[#E5C378]/70 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-[#800020]/60 transition-all"
                >
                  <div>
                    {/* Table Title Bar */}
                    <div className="flex items-start justify-between gap-2 border-b border-[#E5C378]/40 pb-2.5">
                      <div>
                        <h4 className="font-bold text-sm text-[#3D291F]">
                          {table.tableName}
                        </h4>
                        <span className="text-[11px] text-[#786C64]">
                          Capacity: {table.capacity} Seats
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          isFull
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-[#FAF0D4] text-[#800020] border border-[#E5C378]'
                        }`}>
                          {assignedGuests.length} / {table.capacity}
                        </span>

                        <button
                          onClick={() => deleteTable(table.tableId)}
                          className="p-1 text-[#8C7A70] hover:text-rose-600 rounded"
                          title="Delete Table"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="mt-2.5 space-y-1">
                      <div className="h-1.5 w-full bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E5C378]/40">
                        <div
                          style={{ width: `${fillPct}%` }}
                          className={`h-full transition-all duration-300 ${
                            isFull ? 'bg-rose-600' : 'bg-emerald-600'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Assigned Guests List */}
                    <div className="mt-3 space-y-1.5 min-h-[90px]">
                      {assignedGuests.length === 0 ? (
                        <div className="text-center py-6 text-xs text-[#8C7A70] bg-[#FAF7F2] rounded-xl border border-dashed border-[#E5C378]">
                          No guests assigned yet.
                        </div>
                      ) : (
                        assignedGuests.map((g) => (
                          <div
                            key={g.guestId}
                            className="p-2 bg-[#FAF7F2] rounded-lg border border-[#E5C378]/50 flex items-center justify-between text-xs group"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-semibold text-[#3D291F] block truncate">
                                {g.name}
                              </span>
                              <span className="text-[10px] text-[#786C64] truncate block">
                                {g.familyName || 'Family Unit'} · {g.category}
                              </span>
                            </div>

                            <button
                              onClick={() => assignGuestToTable(g.guestId, null)}
                              className="text-[10px] text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors shrink-0"
                              title="Remove from this table"
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Assign Guest Dropdown */}
                  {!isFull && unassignedGuests.length > 0 && (
                    <div className="pt-2 border-t border-[#E5C378]/40 text-xs">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            assignGuestToTable(e.target.value, table.tableId);
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                        className="w-full p-2 bg-[#FAF7F2] border border-[#E5C378] rounded-lg text-xs text-[#3D291F] focus:outline-hidden focus:border-[#800020]"
                      >
                        <option value="" disabled>
                          + Assign an unassigned guest...
                        </option>
                        {unassignedGuests.map((ug) => (
                          <option key={ug.guestId} value={ug.guestId}>
                            {ug.name} ({ug.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Unassigned Guests Drawer */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5C378]/70 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5C378]/40 pb-2.5">
            <h3 className="font-serif-luxury text-sm font-bold text-[#800020] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#800020]" />
              <span>Unassigned Guests ({unassignedGuests.length})</span>
            </h3>
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8C7A70] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search unassigned..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-[#FAF7F2] border border-[#E5C378] rounded-lg text-xs focus:outline-hidden focus:border-[#800020]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E5C378] rounded-lg text-xs font-semibold text-[#3D291F] focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              <option value="Bride's family">Bride's Family</option>
              <option value="Groom's family">Groom's Family</option>
              <option value="Friends">Friends</option>
              <option value="Relatives">Relatives</option>
              <option value="Colleagues">Colleagues</option>
            </select>
          </div>

          {/* List of Unassigned Guests with 1-click Table Assigner */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {unassignedGuests.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8C7A70] bg-[#FAF7F2] rounded-xl border border-[#E5C378]/40">
                All guests have been successfully placed at tables!
              </div>
            ) : (
              unassignedGuests.map((g) => (
                <div
                  key={g.guestId}
                  className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E5C378]/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-[#3D291F] block">{g.name}</strong>
                      <span className="text-[10px] text-[#786C64]">
                        {g.category} · ~{g.expectedMembers} members
                      </span>
                    </div>
                  </div>

                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        assignGuestToTable(g.guestId, e.target.value);
                      }
                    }}
                    defaultValue=""
                    className="w-full px-2 py-1 bg-white border border-[#E5C378] rounded text-[11px] text-[#800020] font-semibold focus:outline-hidden"
                  >
                    <option value="" disabled>
                      Assign to Table →
                    </option>
                    {seatingTables.map((tbl) => {
                      const isFull = tbl.assignedGuestIds.length >= tbl.capacity;
                      return (
                        <option
                          key={tbl.tableId}
                          value={tbl.tableId}
                          disabled={isFull}
                        >
                          {tbl.tableName} ({tbl.assignedGuestIds.length}/{tbl.capacity}{isFull ? ' - Full' : ''})
                        </option>
                      );
                    })}
                  </select>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Add Table Modal */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-2xl border-2 border-[#E5C378] shadow-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsAddTableOpen(false)}
              className="absolute top-4 right-4 p-1 text-[#6B5E55] hover:text-[#800020]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-luxury text-lg font-bold text-[#800020] mb-4">
              Add New Banquet Table
            </h3>
            <form onSubmit={handleAddTableSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">
                  Table Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 7: Sangeet Dance Troupe Lounge"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-lg text-xs focus:outline-hidden focus:border-[#800020]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">
                  Seating Capacity (Chairs) *
                </label>
                <input
                  type="number"
                  min="2"
                  max="25"
                  required
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-lg text-xs font-mono focus:outline-hidden focus:border-[#800020]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#800020] hover:bg-[#6B081B] text-white font-bold rounded-lg shadow-sm"
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
