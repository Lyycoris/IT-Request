
import React, { useState } from 'react';
import { Status } from '../types';
import { useAuth } from '../context/AuthContext';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { SearchIcon, FilterXIcon, CalendarIcon } from './ui/Icons';
import { DatePicker } from './ui/DatePicker';

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: Status | 'All';
  setStatusFilter: (value: Status | 'All') => void;
  divisionFilter: string;
  setDivisionFilter: (value: string) => void;
  uniqueDivisions: string[];
  dateRange: { start: string; end: string };
  setDateRange: React.Dispatch<React.SetStateAction<{ start: string; end: string }>>;
  onReset: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  divisionFilter,
  setDivisionFilter,
  uniqueDivisions,
  dateRange,
  setDateRange,
  onReset,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const hasActiveFilters = searchTerm || statusFilter !== 'All' || (isAdmin && divisionFilter !== 'All') || dateRange.start || dateRange.end;

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    // Browser can parse YYYY-MM-DD as UTC, add T00:00:00 to treat as local
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };


  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Search */}
          <div className="flex-grow min-w-[200px]">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Cari (Nama/Masalah)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </span>
              <Input
                id="search"
                type="text"
                placeholder="cth: printer, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex-grow min-w-[150px]">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
            >
              <option value="All">Semua Status</option>
              {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          
          {/* Division Filter (Admin only) */}
          {isAdmin && (
            <div className="flex-grow min-w-[150px]">
              <label htmlFor="divisionFilter" className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
              <Select
                id="divisionFilter"
                value={divisionFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
              >
                <option value="All">Semua Divisi</option>
                {uniqueDivisions.map(d => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
          )}
          
          {/* Start Date */}
          <div className="flex-grow min-w-[150px] relative">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
            <button
                type="button"
                id="startDate"
                onClick={() => { setShowStartDatePicker(!showStartDatePicker); setShowEndDatePicker(false); }}
                className="w-full text-left bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/60"
              >
                <span className={dateRange.start ? 'text-gray-800' : 'text-gray-400'}>
                  {formatDateForDisplay(dateRange.start) || 'Pilih tanggal'}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none top-7">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </span>
            </button>
            {showStartDatePicker && (
                <DatePicker 
                  value={dateRange.start}
                  onChange={date => setDateRange(prev => ({ ...prev, start: date }))}
                  onClose={() => setShowStartDatePicker(false)}
                />
            )}
          </div>
          
          {/* End Date */}
          <div className="flex-grow min-w-[150px] relative">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
            <button
                type="button"
                id="endDate"
                onClick={() => { setShowEndDatePicker(!showEndDatePicker); setShowStartDatePicker(false); }}
                className="w-full text-left bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/60"
              >
                <span className={dateRange.end ? 'text-gray-800' : 'text-gray-400'}>
                  {formatDateForDisplay(dateRange.end) || 'Pilih tanggal'}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none top-7">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </span>
            </button>
            {showEndDatePicker && (
                <DatePicker 
                  value={dateRange.end}
                  onChange={date => setDateRange(prev => ({ ...prev, end: date }))}
                  onClose={() => setShowEndDatePicker(false)}
                />
            )}
          </div>
                    
          {/* Reset Button */}
          {hasActiveFilters &&
            <div>
              <Button onClick={onReset} variant="secondary" className="w-full">
                <FilterXIcon className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterControls;
