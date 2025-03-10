import React from 'react';
import Header from "../components/common/Header";
import StatusCard from "../components/common/StatusCard";
import { FileText, ShieldAlert, CheckCircle, Clock } from "lucide-react";
import ReportTable from "../components/Tables/ReportTable";

const Report = () => {
  const statusData = [
    { title: "Total Reports Generated", value: "120", color: "blue", icon: FileText },
    { title: "Critical Issues Logged", value: "45", color: "red", icon: ShieldAlert },
    { title: "Resolved Reports", value: "70", color: "green", icon: CheckCircle },
    { title: "Pending Investigations", value: "25", color: "yellow", icon: Clock },
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
        <ReportTable />
      </main>
    </div>
  );
};

export default Report;
