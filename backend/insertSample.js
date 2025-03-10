import Device from "./models/Device.js";
import express from "express";
import connectDB from "./db.js";


const DEVICE_INFO = [
    { id: 1, name: 'Device 1', ip: '192.168.29.1', mac: '00:00:00:00:00:00', status: 'High', netId: '192.168.29' },
    { id: 2, name: 'Device 2', ip: '192.168.1.1', mac: '00:00:00:00:00:00', status: 'Low', netId: '192.168.1' },
    { id: 3, name: 'Device 3', ip: '192.168.29.4', mac: '00:00:00:00:00:00', status: 'High', netId: '192.168.29' },
    { id: 4, name: 'Device 4', ip: '172.16.0.10', mac: '00:00:00:00:00:00', status: 'Low', netId: '172.16.0' },
  ];

connectDB();
  const insertSample = async () =>{
    try {
        await Device.insertMany(DEVICE_INFO);
        console.log('sample inserted successfully');
        
    } catch (error) {
        
        console.log(error);
    }
  };

  insertSample();


