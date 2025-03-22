import React, { useState, useEffect } from 'react';
import Header from "../components/common/Header";
import StatusCard from "../components/common/StatusCard";
import { FileText, ShieldAlert, CheckCircle, Clock } from "lucide-react";
import ReportTable from "../components/Tables/ReportTable";
import ReportView from "../components/Tables/ReportView";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingReport, setEditingReport] = useState(null); // State for editing report
  const [selectedReport, setSelectedReport] = useState(null); // State for viewing report

  // Fetch reports and user role (existing code)
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/securityreports');
        if (!response.ok) throw new Error('Failed to fetch reports');
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch('http://localhost:3000/api/currentUser', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setIsAdmin(data.role === 'admin');
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Calculate status card values (existing code)
  const totalReports = reports.length;
  const criticalIssues = reports.filter(report => report.severity === 'Critical').length;
  const resolvedReports = reports.filter(report => report.status === 'Resolved').length;
  const pendingInvestigations = reports.filter(report => report.status === 'Pending' || report.status === 'Investigating').length;

  const statusData = [
    { title: "Total Reports Generated", value: totalReports.toString(), color: "blue", icon: FileText },
    { title: "Critical Issues Logged", value: criticalIssues.toString(), color: "red", icon: ShieldAlert },
    { title: "Resolved Reports", value: resolvedReports.toString(), color: "green", icon: CheckCircle },
    { title: "Pending Investigations", value: pendingInvestigations.toString(), color: "yellow", icon: Clock },
  ];

  // Handle edit report
  const handleEdit = (report, event) => {
    const rowRect = event.currentTarget.closest('tr').getBoundingClientRect(); // Get row position
    setEditingReport({
      ...report,
      position: { x: rowRect.left + window.scrollX, y: rowRect.top + window.scrollY }, // Store row position
    });
  };

  // Handle view report
  const handleView = (report, event) => {
    const rowRect = event.currentTarget.closest('tr').getBoundingClientRect(); // Get row position
    setSelectedReport({
      ...report,
      position: { x: rowRect.left + window.scrollX, y: rowRect.top + window.scrollY }, // Store row position
    });
  };

  return (
    <div className='flex-1 overflow-auto relative z-10 scrollbar-hide'>
      <Header title="Reports" />
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
          {statusData.map((status, index) => (
            <StatusCard
              key={index}
              title={status.title}
              value={status.value}
              color={status.color}
              icon={status.icon}
            />
          ))}
        </div>
        <ReportTable
          reports={reports}
          loading={loading}
          isAdmin={isAdmin}
          setReports={setReports}
          onEdit={handleEdit} // Pass handleEdit to ReportTable
          onView={handleView} // Pass handleView to ReportTable
        />
      </main>

      {/* Edit Report Popup */}
      {editingReport && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-50'
          onClick={() => setEditingReport(null)}
        >
          <div
            className='absolute bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto'
            style={{
              top: editingReport.position.y,
              left: editingReport.position.x,
              transform: 'translateY(-50%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>Edit Report</h2>
            {/* Edit Report Form */}
          </div>
        </div>
      )}

      {/* Report View Popup */}
      {selectedReport && (
        <ReportView
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          position={selectedReport.position}
        />
      )}
    </div>
  );
};

export default Reports;