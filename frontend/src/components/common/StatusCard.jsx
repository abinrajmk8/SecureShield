import React from 'react'
import { motion } from 'framer-motion'

const StatusCard = ({ title, value, color, icon: Icon }) => {
  return (
    <div
    className='bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl p-1 border border-gray-700'
    >
        <div className='px-3 py-4 sm:p-5 '>
            <span className='flex items-center text-sm font-medium text-gray-400'>
                <Icon
                size={22}
                className="mr-2"
                style={{color}}
                 />
                 {title}
            </span>
            <p className='mt-1 text-3xl font-semibold text-gray-100'>
                {value}
            </p>
        </div>





    </div>
   

  )
}

export default StatusCard