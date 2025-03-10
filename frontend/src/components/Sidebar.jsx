
import {  House, Menu, ScrollText, User, UserRoundCog, Wifi, Wrench } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'


const  SIDEBAR_ITEMS = [
    {
        name:"Home", icon:House, color:"#6366f1" ,href:"/Home"
    },
    {
        name:"Network", icon:Wifi, color:"#10b981" ,href:"/Network"
    },
    {
        name:"Users", icon:UserRoundCog, color:"#f59e0b" ,href:"/Users"
    },
    {
        name:"Report", icon:ScrollText , color:"#3b82f6" ,href:"/Reports"
    },
   
    {
        name:"Settings", icon:Wrench, color:"#ef4444" ,href:"/Settings"
    }

       
]

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  return (
    <div className={`relative z-10 flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>

        <div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700 '>
            <button 
            className='hover:bg-gray-700  p-2 rounded-full max-w-fit '
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <Menu size={24} />                { /* icon */ }
            </button>
            <nav className='margin-top-8 flex-grow'>
                {SIDEBAR_ITEMS.map((item, index) => (
                    <Link key={item.href} to={item.href}>
                       <div
                       className='flex itemss-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 mb-2'
                       >
                        <item.icon size={20} style={{color: item.color , minWidth : "20px"}}  />
                        {isSidebarOpen && (
                            <span className='ml-4 whitespace-nowrap'>{item.name}</span>
                        )}


                        </div> 
                    </Link>
                   
                ))}

            </nav>

        </div>
    </div>
  )
}

export default Sidebar