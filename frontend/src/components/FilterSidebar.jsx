import React, { useState } from "react";

const FilterSidebar = ({ filters, setFilters, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const resetFilters = () => {
    setLocalFilters({ type: "", severity: "", status: "", time: "" });
    setFilters({ type: "", severity: "", status: "", time: "" });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-64 bg-gray-900 text-white p-4 shadow-lg z-50 transition-transform transform translate-x-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter Reports</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      {/* Type Filter */}
      <label className="block text-sm text-gray-300 mb-1">Type</label>
      <select
        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        value={localFilters.type}
        onChange={(e) => handleFilterChange("type", e.target.value)}
      >
        <option value="">All</option>
        <option value="ARP Spoofing">ARP Spoofing</option>
        <option value="Open Port Found">Open Port Found</option>
        <option value="Suspicious Traffic">Suspicious Traffic</option>
        <option value="Weak Encryption">Weak Encryption</option>
      </select>

      {/* Severity Filter */}
      <label className="block text-sm text-gray-300 mt-4 mb-1">Severity</label>
      <select
        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        value={localFilters.severity}
        onChange={(e) => handleFilterChange("severity", e.target.value)}
      >
        <option value="">All</option>
        <option value="Critical">Critical</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      {/* Status Filter */}
      <label className="block text-sm text-gray-300 mt-4 mb-1">Status</label>
      <select
        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        value={localFilters.status}
        onChange={(e) => handleFilterChange("status", e.target.value)}
      >
        <option value="">All</option>
        <option value="Unresolved">Unresolved</option>
        <option value="Pending">Pending</option>
        <option value="Investigating">Investigating</option>
        <option value="Resolved">Resolved</option>
      </select>

      {/* Time Filter */}
      <label className="block text-sm text-gray-300 mt-4 mb-1">Time Period</label>
      <select
        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        value={localFilters.time}
        onChange={(e) => handleFilterChange("time", e.target.value)}
      >
        <option value="">All</option>
        <option value="Last 24 Hours">Last 24 Hours</option>
        <option value="Last 7 Days">Last 7 Days</option>
        <option value="Last 30 Days">Last 30 Days</option>
      </select>

      {/* Buttons */}
      <div className="mt-6 flex justify-between">
        <button onClick={resetFilters} className="bg-gray-600 px-3 py-2 rounded">Reset</button>
        <button onClick={applyFilters} className="bg-blue-500 px-3 py-2 rounded">Apply</button>
      </div>
    </div>
  );
};

export default FilterSidebar;
