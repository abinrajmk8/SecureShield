import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import StatusCard from '../components/common/StatusCard';
import { AlertCircle, Bell, FileText, ShieldAlert } from 'lucide-react';
import VulnerabilityChart from '../components/charts/Home/VulnerabilityChart';
import ThreatCharts from '../components/charts/Home/ThreatCharts';
import AlertChart from '../components/charts/Home/AlertChart';
import FilterDock from '../components/filterDocker';

const Home = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filter, setFilter] = useState('This Month'); // Default filter

  const [statusData, setStatusData] = useState([
    { title: 'Vulnerabilities', value: '0', color: 'red', icon: AlertCircle },
    { title: 'Scan Reports', value: '0', color: 'blue', icon: FileText },
    { title: 'Threats Detected', value: '0', color: 'yellow', icon: ShieldAlert },
    { title: 'Pending Cases', value: '0', color: 'green', icon: Bell },
  ]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/securityreports');
        const data = await response.json();
        setReports(data);
        applyFilter(data, filter);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    applyFilter(reports, filter);
  }, [filter, reports]);

  // Function to filter reports based on time range
  const applyFilter = (data, selectedFilter) => {
    const now = new Date();
    let filteredData = data.filter(report => {
      const reportDate = new Date(report.timestamp); // Ensure timestamp exists in the API data

      switch (selectedFilter) {
        case 'Today':
          return reportDate.toDateString() === now.toDateString();
        case 'This Week':
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          return reportDate >= oneWeekAgo;
        case 'This Month':
          return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
        case 'Last 2 Months':
          const twoMonthsAgo = new Date();
          twoMonthsAgo.setMonth(now.getMonth() - 2);
          return reportDate >= twoMonthsAgo;
        default:
          return true;
      }
    });

    setFilteredReports(filteredData);
    updateStatusCards(filteredData);
  };

  // Function to update status card values
  const updateStatusCards = (data) => {
    const totalReports = data.length;
    const activeAlerts = data.filter(report => report.status === 'Pending').length;
    const threatsDetected = data.filter(report => report.type === 'ARP Spoofing').length;
    const vulnerabilities = data.filter(report => report.severity === 'Critical').length;

    setStatusData([
      { title: 'Vulnerabilities', value: vulnerabilities, color: 'red', icon: AlertCircle },
      { title: 'Scan Reports', value: totalReports, color: 'blue', icon: FileText },
      { title: 'Threats Detected', value: threatsDetected, color: 'yellow', icon: ShieldAlert },
      { title: 'Pending Cases', value: activeAlerts, color: 'green', icon: Bell },
    ]);
  };

  return (
    <div className='flex-1 overflow-auto relative z-10 scrollbar-hide'>
      <Header title="Overview" />
      <FilterDock filter={filter} setFilter={setFilter} />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>




        {/* Status Cards */}
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
          {statusData.map((status, index) => (
            <StatusCard
              key={index}
              title={status.title}
              value={status.value.toString()} // Ensure it's displayed as text
              color={status.color}
              icon={status.icon}
            />
          ))}
        </div>

        {/* Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <VulnerabilityChart reports={filteredReports} />
          <AlertChart reports={filteredReports} />
          <ThreatCharts reports={filteredReports} />
        </div>

      </main>
    </div>
  );
};

export default Home;
