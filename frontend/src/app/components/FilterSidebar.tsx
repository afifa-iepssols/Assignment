'use client';
import { useState } from 'react';

type Props = {
  onFilterChange: (filters: any) => void;
};

export default function FilterSidebar({ onFilterChange }: Props) {
  const defaultFilters = {
    category: '',
    username: '',
    state: '',
    address: '',
  };

  const [filters, setFilters] = useState(defaultFilters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const categories = [
    'Retail', 'Manufacturing', 'Services', 'Technology', 'Agriculture',
    'Healthcare', 'Finance', 'Real Estate', 'Logistics', 'Hospitality', 'Other'
  ];
  
  const handleClear = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="w-full flex flex-wrap items-end gap-4 text-neutral-50">
      {/* Category */}
      <div className="flex flex-col">
        <label className="text-sm font-medium ">Category</label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="p-2 border rounded min-w-[150px] bg-neutral-950 text-neutral-50 "
        >
          <option value="" className='text-neutal-950'>All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Username */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Owner Username</label>
        <input
          name="username"
          value={filters.username}
          onChange={handleChange}
          className="p-2 border rounded min-w-[150px]"
        />
      </div>

      {/* State */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">State</label>
        <input
          name="state"
          value={filters.state}
          onChange={handleChange}
          className="p-2 border rounded min-w-[150px]"
        />
      </div>

      {/* Address */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Address</label>
        <input
          name="address"
          value={filters.address}
          onChange={handleChange}
          className="p-2 border rounded min-w-[150px]"
        />
      </div>
      <button
        onClick={handleClear}
        className="mt-2 px-4 py-2 bg-neutral-50 text-neutral-950 rounded hover:bg-zinc-600 "
      >
        Clear Filters
      </button>
    </div>
  );
}
