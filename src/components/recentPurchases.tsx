'use client'

import React from 'react'

import { Ticket } from '@/icons'

const RecentPurchases: React.FC = () => {
  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <a
        href='https://www.eatthepie.xyz'
        target='_blank'
        rel='noopener noreferrer'
        className='group bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 rounded-full p-4 shadow-lg 
        transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-xl 
        border border-gray-700/30 backdrop-blur-sm hover:text-white'
      >
        <Ticket className='w-6 h-6 transition-transform group-hover:rotate-12' />
        <span className='text-sm font-medium'>Ticket Explorer</span>
      </a>
    </div>
  )
}

export default RecentPurchases
