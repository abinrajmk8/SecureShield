import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { AlertCircle, Filter, Search } from 'lucide-react';
import FilterSidebar from "../../components/FilterSidebar"; // Assume this is a sidebar component for filtering

const reportData = [
  { id: 1, timestamp: "2025-03-09 14:23:11", type: "ARP Spoofing", severity: "Critical", status: "Unresolved" },
  { id: 2, timestamp: "2025-03-09 13:15:45", type: "Open Port Found", severity: "Medium", status: "Pending" },
  { id: 3, timestamp: "2025-03-09 12:45:10", type: "Suspicious Traffic", severity: "High", status: "Investigating" },
  { id: 4, timestamp: "2025-03-09 11:30:22", type: "Weak Encryption", severity: "Low", status: "Resolved" },
];

const severityColors = {
  Critical: "text-red-500",
  High: "text-orange-500",
  Medium: "text-blue-500",
  Low: "text-green-500",
};

const statusColors = {
  Unresolved: "text-red-500",
  Pending: "text-yellow-500",
  Investigating: "text-blue-500",
  Resolved: "text-green-500",
};

const ReportTable = () => {
  const [filters, setFilters] = useState({ type: "", severity: "", status: "", time: "" });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredData = reportData.filter(report => {
    return (
      (!filters.type || report.type === filters.type) &&
      (!filters.severity || report.severity === filters.severity) &&
      (!filters.status || report.status === filters.status)
    );
  });

  return (
    <div className="bg-gray-800 shadow-lg rounded-2xl p-6 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white flex items-center">
          <AlertCircle className="mr-3 text-red-500" /> Security Reports
        </h2>
        <div className="flex space-x-2">
          <button className="bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center">
            <Search className="mr-2" /> Search
          </button>
          <button
            className="bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="mr-2" /> Filter
          </button>
        </div>
      </div>

      <Table className="w-full border border-gray-600 rounded-lg overflow-hidden">
        <TableHeader className="bg-gray-900 text-gray-300">
          <TableRow>
            <TableHead className="p-4 font-bold">Timestamp</TableHead>
            <TableHead className="p-4 font-bold">Type</TableHead>
            <TableHead className="p-4 font-bold text-center">Severity</TableHead>
            <TableHead className="p-4 font-bold">Status</TableHead>
            <TableHead className="p-4 font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((report) => (
            <TableRow key={report.id} className="hover:bg-gray-700 transition">
              <TableCell className="p-4 text-white">{new Date(report.timestamp).toLocaleString()}</TableCell>
              <TableCell className="p-4 text-white">{report.type}</TableCell>
              <TableCell className={`p-4 text-center font-medium ${severityColors[report.severity]}`}>{report.severity}</TableCell>
              <TableCell className={`p-4 font-medium ${statusColors[report.status]}`}>{report.status}</TableCell>
              <TableCell className="p-4">
                <button className="bg-blue-500 text-white px-3 py-1 rounded">View</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isFilterOpen && <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setIsFilterOpen(false)} />}
    </div>
  );
};

export default ReportTable;
