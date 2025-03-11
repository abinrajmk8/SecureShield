import React, { useState } from 'react';
import { Search, Eye, Download, Filter, ChevronDown } from 'lucide-react';
import ReportView from './ReportView';
import FilterSidebar from '../FilterSidebar';

const ReportTable = ({ reports, loading, isAdmin, setReports }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    severity: '',
    status: '',
    time: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [editingReport, setEditingReport] = useState(null); // Track which report is being edited
  const [editedStatus, setEditedStatus] = useState(''); // Edited status value

  // Filter reports based on search query and filters
  const filteredReports = reports
    .filter(report =>
      (report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
       report.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(report =>
      (filters.type === '' || report.type === filters.type) &&
      (filters.severity === '' || report.severity === filters.severity) &&
      (filters.status === '' || report.status === filters.status) &&
      (filters.time === '' || {
        'Last 24 Hours': new Date(report.timestamp) > new Date(new Date().setDate(new Date().getDate() - 1)),
        'Last 7 Days': new Date(report.timestamp) > new Date(new Date().setDate(new Date().getDate() - 7)),
        'Last 30 Days': new Date(report.timestamp) > new Date(new Date().setDate(new Date().getDate() - 30)),
      }[filters.time] || true)
    );

  // Handle download all reports as PDF
  const handleDownloadAll = (format) => {
    setShowDownloadOptions(false); // Close the dropdown
    if (format === 'brief') {
      alert('Brief download functionality will be implemented here.');
    } else if (format === 'detailed') {
      alert('Detailed download functionality will be implemented here.');
    }
  };

  // Handle editing a report
  const handleEdit = (report) => {
    setEditingReport(report);
    setEditedStatus(report.status); // Initialize editedStatus with the current status
  };

  // Save edited changes
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/securityreports/${editingReport._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editedStatus, // Only send the status field
        }),
      });

      if (!response.ok) throw new Error('Failed to update report');

      // Update the local state
      const updatedReports = reports.map(report =>
        report._id === editingReport._id ? { ...report, status: editedStatus } : report
      );
      setReports(updatedReports); // Update the reports state
      setEditingReport(null); // Close the edit popup
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  return (
    <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'>
      {/* Search Bar and Actions */}
      <div className='flex justify-between items-center mb-6'>
        <div className='relative w-full max-w-md'>
          <input
            type='text'
            placeholder='Search reports...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
        </div>
        <div className='flex items-center space-x-4'>
          <button
            onClick={() => setShowFilters(true)}
            className='bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center'
          >
            <Filter className='mr-2' size={16} /> Filters
          </button>
          <div className='relative'>
            <button
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center'
            >
              <Download className='mr-2' size={16} /> Download All
              <ChevronDown className='ml-2' size={16} />
            </button>
            {showDownloadOptions && (
              <div className='absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-50'>
                <button
                  onClick={() => handleDownloadAll('brief')}
                  className='w-full px-4 py-2 text-gray-100 hover:bg-gray-600 rounded-t-lg'
                >
                  Brief Report
                </button>
                <button
                  onClick={() => handleDownloadAll('detailed')}
                  className='w-full px-4 py-2 text-gray-100 hover:bg-gray-600 rounded-b-lg'
                >
                  Detailed Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters Sidebar */}
      {showFilters && (
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Reports Table */}
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-gray-700 text-gray-100'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>#</th>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>Type</th>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>Severity</th>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>Status</th>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>Timestamp</th>
              <th className='py-2 px-4 border-b border-gray-800 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='6' className='py-4 text-center text-gray-300'>Loading reports...</td>
              </tr>
            ) : filteredReports.length === 0 ? (
              <tr>
                <td colSpan='6' className='py-4 text-center text-gray-300'>No reports found.</td>
              </tr>
            ) : (
              filteredReports.map((report, index) => (
                <tr key={report._id} className='hover:bg-gray-600'>
                  <td className='py-2 px-4 border-b border-gray-600 border-r text-center'>{index + 1}</td>
                  <td className='py-2 px-4 border-b border-gray-600 border-r text-center'>{report.type}</td>
                  <td className={`py-2 px-4 border-b border-gray-600 border-r text-center ${
                    report.severity === 'Critical' ? 'text-red-500' :
                    report.severity === 'High' ? 'text-orange-500' :
                    report.severity === 'Medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {report.severity}
                  </td>
                  <td className={`py-2 px-4 border-b border-gray-600 border-r text-center ${
                    report.status === 'Resolved' ? 'text-green-500' :
                    report.status === 'Unresolved' ? 'text-red-500' :
                    report.status === 'Pending' ? 'text-yellow-500' :
                    report.status === 'Investigating' ? 'text-blue-500' :
                    'text-gray-500'
                  }`}>
                    {report.status}
                  </td>
                  <td className='py-2 px-4 border-b border-gray-600 border-r text-center'>
                    {new Date(report.timestamp).toLocaleString()}
                  </td>
                  <td className='py-2 px-4 border-b border-gray-600 text-center'>
                    {isAdmin && (
                      <button
                        onClick={() => handleEdit(report)}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2'
                        title='Edit Report'
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedReport(report)}
                      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'
                      title='View Report'
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Report View Popup */}
      {selectedReport && (
        <ReportView report={selectedReport} onClose={() => setSelectedReport(null)} isAdmin={isAdmin} />
      )}

      {/* Edit Report Popup */}
      {editingReport && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>Edit Report</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className='mb-4'>
                <label className='block text-gray-100 mb-2'>Status</label>
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
                >
                  <option value='Unresolved'>Unresolved</option>
                  <option value='Pending'>Pending</option>
                  <option value='Investigating'>Investigating</option>
                  <option value='Resolved'>Resolved</option>
                </select>
              </div>
              <div className='flex justify-end'>
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className='bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded mr-2'
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded'
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTable;