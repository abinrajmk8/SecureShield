import React, { useState } from 'react';
import { Search, Eye, Download, Filter, ChevronDown } from 'lucide-react';
import ReportView from './ReportView';
import FilterSidebar from '../FilterSidebar';

const ReportTable = ({ reports, loading, isAdmin, setReports }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editedSeverity, setEditedSeverity] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    severity: '',
    status: '',
    time: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [editedStatus, setEditedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  const isWithinTimeRange = (timestamp, filterValue) => {
    const reportDate = new Date(timestamp);
    const now = new Date();

    if (filterValue === "Last 24 Hours") {
      return reportDate >= new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    if (filterValue === "Last 7 Days") {
      return reportDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    if (filterValue === "Last 30 Days") {
      return reportDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    if (filterValue === "Last 6 Months") {
      return reportDate >= new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
    }
    if (filterValue === "This Year") {
      return reportDate.getFullYear() === now.getFullYear();
    }

    return true;
  };

  const filteredReports = reports
  .filter(report =>
    report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) 
  .filter(report =>
    (filters.type === '' || report.type === filters.type) &&
    (filters.severity === '' || report.severity === filters.severity) &&
    (filters.status === '' || report.status === filters.status) &&
    (filters.time === '' || isWithinTimeRange(report.timestamp, filters.time))
  );


  const indexOfLastReport = currentPage * rowsPerPage;
  const indexOfFirstReport = indexOfLastReport - rowsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  const handleDownloadAll = (format) => {
    setShowDownloadOptions(false);
    if (format === 'brief') {
      alert('Brief download functionality will be implemented here.');
    } else if (format === 'detailed') {
      alert('Detailed download functionality will be implemented here.');
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setEditedStatus(report.status);
    setEditedSeverity(report.severity);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/securityreports/${editingReport._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editedStatus,
          severity: editedSeverity,
        }),
      });

      if (!response.ok) throw new Error('Failed to update report');

      const updatedReports = reports.map(report =>
        report._id === editingReport._id ? { ...report, status: editedStatus, severity: editedSeverity } : report
      );
      setReports(updatedReports);
      setEditingReport(null);
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
            ) : currentReports.length === 0 ? (
              <tr>
                <td colSpan='6' className='py-4 text-center text-gray-300'>No reports found.</td>
              </tr>
            ) : (
              currentReports.map((report, index) => (
                <tr key={report._id} className='hover:bg-gray-600'>
                  <td className='py-2 px-4 border-b border-gray-600 border-r text-center'>{indexOfFirstReport + index + 1}</td>
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

      {/* Pagination Controls */}
      <div className='flex justify-center items-center mt-4'>
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className='bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-4 rounded-l'
        >
          First
        </button>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className='bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-4'
        >
          Prev
        </button>
        <span className='mx-4 text-gray-100'>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className='bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-4'
        >
          Next
        </button>
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className='bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-4 rounded-r'
        >
          Last
        </button>
      </div>

      {/* Report View Popup */}
      {selectedReport && (
        <ReportView report={selectedReport} onClose={() => setSelectedReport(null)} isAdmin={isAdmin} />
      )}

      {/* Edit Report Popup */}
      {editingReport && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto'>
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
              <div className='mb-4'>
                <label className='block text-gray-100 mb-2'>Severity</label>
                <select
                  value={editedSeverity}
                  onChange={(e) => setEditedSeverity(e.target.value)}
                  className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
                >
                  <option value='Low'>Low</option>
                  <option value='Medium'>Medium</option>
                  <option value='High'>High</option>
                  <option value='Critical'>Critical</option>
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