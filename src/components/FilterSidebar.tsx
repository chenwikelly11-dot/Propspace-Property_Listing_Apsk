import React from 'react';
import { Search, MapPin, DollarSign, Home, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { SearchFilters, PropertyType } from '../types.js';

interface FilterSidebarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
}: FilterSidebarProps) {
  
  const handleChange = (key: keyof SearchFilters, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const propertyTypes: (PropertyType | 'All')[] = ['All', 'Apartment', 'House', 'Studio'];

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-150 pb-4 mb-4">
        <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span>Search Filters</span>
        </h3>
        <button
          onClick={onResetFilters}
          className="text-xs text-slate-400 hover:text-blue-600 transition-colors flex items-center space-x-1 font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Keywords */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
            Keywords
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Cozy Cozy Apartment..."
              value={filters.searchQuery}
              onChange={(e) => handleChange('searchQuery', e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-800 bg-white"
            />
          </div>
        </div>

        {/* City/Location */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
            City / Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. London, Toronto..."
              value={filters.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-800 bg-white"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleChange('propertyType', type)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all text-center ${
                  filters.propertyType === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price Bound Ranges */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
            Price Range ($)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-2.5 top-2 text-xs font-semibold text-slate-400">$</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full pl-6 pr-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none bg-white text-slate-800"
              />
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-2 text-xs font-semibold text-slate-400">$</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full pl-6 pr-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none bg-white text-slate-800"
              />
            </div>
          </div>
        </div>

        <button
          onClick={onApplyFilters}
          className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow active:scale-[0.98] transition-all"
        >
          Search Properties
        </button>
      </div>
    </div>
  );
}
