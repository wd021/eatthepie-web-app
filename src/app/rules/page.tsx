'use client'

import { FC, useState } from 'react'
import { motion } from 'framer-motion'

const Icon: React.FC<{ name: string }> = ({ name }) => {
  const icons: { [key: string]: JSX.Element } = {
    pieChart: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='32'
        height='32'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M21.21 15.89A10 10 0 1 1 8 2.83'></path>
        <path d='M22 12A10 10 0 0 0 12 2v10z'></path>
      </svg>
    ),
    clock: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='32'
        height='32'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='12' cy='12' r='10'></circle>
        <polyline points='12 6 12 12 16 14'></polyline>
      </svg>
    ),
    ticket: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='32'
        height='32'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z'></path>
        <path d='M13 5v2'></path>
        <path d='M13 17v2'></path>
        <path d='M13 11v2'></path>
      </svg>
    ),
    alertCircle: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='32'
        height='32'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='12' cy='12' r='10'></circle>
        <line x1='12' y1='8' x2='12' y2='12'></line>
        <line x1='12' y1='16' x2='12.01' y2='16'></line>
      </svg>
    ),
    award: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='32'
        height='32'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='12' cy='8' r='7'></circle>
        <polyline points='8.21 13.89 7 23 12 20 17 23 15.79 13.88'></polyline>
      </svg>
    ),
    coins: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='32'
        height='32'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='8' cy='8' r='7'></circle>
        <path d='M19.5 9.5c.5-1.2 0-2.7-1.1-3.8C17.3 4.6 15.9 4 14.7 4.5'></path>
        <path d='M14.7 14.5c1.2.5 2.6.1 3.7-1.1 1.1-1.1 1.6-2.6 1.1-3.8'></path>
      </svg>
    ),
  }

  return icons[name] || null
}

const Card: React.FC<{
  title: string
  icon: string
  children: React.ReactNode
  color?: string
}> = ({ title, icon, children, color = 'bg-white' }) => (
  <motion.div
    className={`${color} rounded-lg shadow-md p-6 transition-shadow duration-300 hover:shadow-lg`}
    whileHover={{ scale: 1.02 }}
  >
    <h2 className='text-xl font-semibold mb-4 flex items-center'>
      <Icon name={icon} />
      <span className='ml-2'>{title}</span>
    </h2>
    <div className='text-lg leading-relaxed'>{children}</div>
  </motion.div>
)

const Accordion: React.FC<{
  title: string
  icon: string
  children: React.ReactNode
}> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className='border border-gray-200 bg-white rounded-lg mb-4 overflow-hidden'>
      <button
        className='w-full text-left py-4 px-6 flex items-center justify-between focus:outline-none'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='flex items-center'>
          <Icon name={icon} />
          <span className='ml-2 font-semibold text-lg'>{title}</span>
        </span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          ▼
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className='overflow-hidden'
      >
        <div className='p-6'>{children}</div>
      </motion.div>
    </div>
  )
}

const Rules: FC = () => {
  return (
    <div className='max-w-6xl mx-auto px-2 py-12'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <Card title='How to Play' icon='pieChart' color='bg-blue-50'>
          <ol className='list-decimal pl-5 space-y-2'>
            <li>Buy a ticket</li>
            <li>Pick 4 numbers</li>
            <li>Wait for the draw</li>
            <li>Check your results</li>
          </ol>
        </Card>

        <Card title='Draw Schedule' icon='clock' color='bg-green-50'>
          Draws occur when:
          <ul className='list-disc pl-5 mt-2 space-y-2'>
            <li>
              A week has passed <b>AND</b>
            </li>
            <li>
              The prize pool passes <b>500ETH</b>
            </li>
          </ul>
        </Card>
      </div>

      <div className='space-y-4'>
        <Accordion title='Prize Pools' icon='ticket'>
          <div className='mb-4 text-lg leading-relaxed'>
            Each prize pool gets distributed amongst all the winners in the pool.
          </div>
          <ul className='list-disc pl-5 text-lg leading-relaxed flex flex-col gap-y-2'>
            <li>
              <strong>Jackpot:</strong> Match all 4 numbers (60% of prize pool)
            </li>
            <li>
              <strong>3 in a row:</strong> Match the first 3 numbers (25% of prize pool)
            </li>
            <li>
              <strong>2 in a row:</strong> Match the first 2 numbers (14% of prize pool)
            </li>
          </ul>
          <div className='mt-4 italic'>
            *Each ticket is eligible for each pool. So a jackpot winner would collect in all 3
            pools, a 3 in-a-row winner would also win 2 in-a-row.
          </div>
        </Accordion>
        <Accordion title='Difficulty Levels' icon='alertCircle'>
          <div className='mb-4 text-lg leading-relaxed'>
            In order to keep the lottery fun, the game difficulty adjusts based on frequency of
            jackpots. Whenever there&apos;s been 3 conseutive drawings without a jackpot winner,
            the difficulty level decreases. If there&apos;s been 3 consecutive jackpot winners,
            the difficulty level increases.
          </div>
          <ul className='list-disc pl-5 text-lg leading-relaxed flex flex-col gap-y-2'>
            <li>
              <strong>Easy:</strong> Choose from 1-50 for main numbers, 1-5 for Etherball
            </li>
            <li>
              <strong>Medium:</strong> Choose from 1-100 for main numbers, 1-10 for Etherball
            </li>
            <li>
              <strong>Hard:</strong> Choose from 1-150 for main numbers, 1-15 for Etherball
            </li>
          </ul>
        </Accordion>
        <Accordion title='Winning and Claiming Prizes' icon='award'>
          <div className='mb-4 text-lg leading-relaxed'>Once a draw has been initiated:</div>
          <ul className='list-disc pl-5 text-lg leading-relaxed flex flex-col gap-y-2'>
            <li>Random numbers are generated (can take a few hours for VDF computation).</li>
            <li>Once generated, players can view and claim prizes on the results tab.</li>
            <li>Jackpot winners receive a unique NFT to commemorate their win!</li>
            <li>If there isn&apos;t a winner, the prize pool rolls over to the next game.</li>
          </ul>
        </Accordion>
      </div>

      <div className='mt-8 mb-16'>
        <Card title='Ticket Pricing and Fees' icon='coins' color='bg-yellow-50'>
          <p className='mb-2'>
            Ticket cost: <span className='font-bold text-xl'>0.1 ETH</span>
          </p>
          <ul className='list-disc pl-5 space-y-2'>
            <li>99% goes to prize pool</li>
            <li>1% fee (capped at 100ETH)</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default Rules
