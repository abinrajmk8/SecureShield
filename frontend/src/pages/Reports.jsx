import React, { useEffect, useState } from 'react';
import Header from "../components/common/Header";
import StatusCard from "../components/common/StatusCard";
import { FileText, ShieldAlert, CheckCircle, Clock } from "lucide-react";
import ReportTable from "../components/Tables/ReportTable";

const Report = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin

  // Fetch reports from the backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/securityreports');
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
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

  // Fetch the current user's role to determine if they are an admin
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from local storage
        if (!token) throw new Error('No token found');

        const response = await fetch('http://localhost:3000/api/currentUser', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Attach token
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setIsAdmin(data.role === 'admin'); // Set isAdmin based on the user's role
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Calculate status card values
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

  return (
    <div className='flex-1 overflow-auto relative z-10'>
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
        <ReportTable reports={reports} loading={loading} isAdmin={isAdmin} setReports={setReports} />
      </main>
    </div>
  );
};

export default Report;