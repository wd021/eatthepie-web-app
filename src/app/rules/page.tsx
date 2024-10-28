'use client'

import { FC, useState } from 'react'
import { motion } from 'framer-motion'

interface IconProps {
  name: keyof typeof ICONS
}

interface CardProps {
  title: string
  icon: IconProps['name']
  children: React.ReactNode
  color?: string
}

interface AccordionProps {
  title: string
  icon: IconProps['name']
  children: React.ReactNode
}

const ICONS = {
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
} as const

const RULES_CONTENT = {
  howToPlay: {
    title: 'How to Play',
    icon: 'pieChart' as const,
    color: 'bg-blue-50',
    steps: ['Buy a ticket', 'Pick 4 numbers', 'Wait for the draw', 'Check your results'],
  },
  drawSchedule: {
    title: 'Draw Schedule',
    icon: 'clock' as const,
    color: 'bg-green-50',
    conditions: ['One week has passed', 'The prize pool exceeds 500 ETH'],
  },
  prizePools: {
    title: 'Prize Pools',
    icon: 'ticket' as const,
    pools: [
      { name: 'Jackpot', condition: 'Match all 4 numbers', percentage: '60%' },
      { name: '3 in a row', condition: 'Match the first 3 numbers', percentage: '25%' },
      { name: '2 in a row', condition: 'Match the first 2 numbers', percentage: '14%' },
    ],
  },
  difficultyLevels: {
    title: 'Difficulty Levels',
    icon: 'alertCircle' as const,
    description: 'The lottery difficulty adjusts based on the rate of wins.',
    numberFormat: {
      main: 'First 3 numbers of your selection',
      etherball: 'Final (4th) number',
    },
    levels: [
      { name: 'Easy', mainRange: '1-25', etherballRange: '1-10' },
      { name: 'Medium', mainRange: '1-50', etherballRange: '1-10' },
      { name: 'Hard', mainRange: '1-75', etherballRange: '1-10' },
    ],
  },
  winningAndClaiming: {
    title: 'Winning and Claiming Prizes',
    icon: 'award' as const,
    steps: [
      'Random numbers are generated (this can take a few hours...).',
      'A proof is confirmed, revealing the numbers. Players can then claim their winnings.',
      'Jackpot winners can claim a unique NFT to commemorate their win.',
      "If there isn't a winner, the prize pool rolls over to the next game.",
    ],
  },
  ticketPricing: {
    title: 'Ticket Pricing and Fees',
    icon: 'coins' as const,
    color: 'bg-yellow-50',
    price: '0.1 ETH',
    distribution: ['99% goes to prize pool', '1% fee (capped at 100 ETH)'],
  },
} as const

const Icon: FC<IconProps> = ({ name }) => ICONS[name] || null

const Card: FC<CardProps> = ({ title, icon, children, color = 'bg-white' }) => (
  <motion.div
    className={`${color} rounded-lg shadow-md p-6 transition-shadow duration-300 hover:shadow-lg`}
    whileHover={{ scale: 1.02 }}
  >
    <h2 className='text-xl font-semibold mb-4 flex items-center'>
      <Icon name={icon} />
      <span className='ml-2'>{title}</span>
    </h2>
    <div className='leading-relaxed'>{children}</div>
  </motion.div>
)

const Accordion: FC<AccordionProps> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <motion.div
      className='border border-gray-200 bg-white rounded-lg mb-4 overflow-hidden transition-all duration-300 ease-in-out'
      whileHover={{ scale: 1.02 }}
    >
      <button
        className={`w-full text-left px-6 flex items-center justify-between focus:outline-none ${isOpen ? 'pt-4' : 'py-4'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='flex items-center'>
          <Icon name={icon} />
          <span className='ml-2 font-semibold'>{title}</span>
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
    </motion.div>
  )
}

const Rules: FC = () => {
  return (
    <div className='max-w-6xl mx-auto px-6 py-12'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <Card
          title={RULES_CONTENT.howToPlay.title}
          icon={RULES_CONTENT.howToPlay.icon}
          color={RULES_CONTENT.howToPlay.color}
        >
          <ol className='list-decimal pl-5 space-y-2'>
            {RULES_CONTENT.howToPlay.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </Card>

        <Card
          title={RULES_CONTENT.drawSchedule.title}
          icon={RULES_CONTENT.drawSchedule.icon}
          color={RULES_CONTENT.drawSchedule.color}
        >
          Draws occur when:
          <ul className='list-disc pl-5 mt-2 space-y-2'>
            {RULES_CONTENT.drawSchedule.conditions.map((condition, index) => (
              <li key={index}>
                {condition} <b>{index === 0 && 'AND'}</b>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className='space-y-4'>
        <Accordion title={RULES_CONTENT.prizePools.title} icon={RULES_CONTENT.prizePools.icon}>
          <div className='mb-4 leading-relaxed'>
            Each prize pool gets distributed amongst all the winners in the pool.
          </div>
          <ul className='list-disc pl-5 leading-relaxed flex flex-col gap-y-2'>
            {RULES_CONTENT.prizePools.pools.map((pool, index) => (
              <li key={index}>
                <strong>{pool.name}:</strong> {pool.condition} ({pool.percentage} of prize pool)
              </li>
            ))}
          </ul>
          <div className='mt-4 italic'>
            *When you win, you collect from all eligible prize pools - for example, hitting the
            jackpot means you win all three prize levels.
          </div>
        </Accordion>

        <Accordion
          title={RULES_CONTENT.difficultyLevels.title}
          icon={RULES_CONTENT.difficultyLevels.icon}
        >
          <div className='space-y-6'>
            <p>{RULES_CONTENT.difficultyLevels.description}</p>

            <div className='bg-gray-100 p-4 rounded-lg'>
              <div className='font-semibold mb-2'>Number Selection:</div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <span className='font-medium'>Main Numbers:</span>
                  <div className='text-gray-600'>
                    {RULES_CONTENT.difficultyLevels.numberFormat.main}
                  </div>
                </div>
                <div>
                  <span className='font-medium'>Etherball:</span>
                  <div className='text-gray-600'>
                    {RULES_CONTENT.difficultyLevels.numberFormat.etherball}
                  </div>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              {RULES_CONTENT.difficultyLevels.levels.map(
                ({ name, mainRange, etherballRange }) => (
                  <div key={name} className='border rounded-lg p-4'>
                    <div className='font-semibold mb-2'>{name}</div>
                    <div className='text-gray-600'>
                      <div>Main: {mainRange}</div>
                      <div>Etherball: {etherballRange}</div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </Accordion>

        <Accordion
          title={RULES_CONTENT.winningAndClaiming.title}
          icon={RULES_CONTENT.winningAndClaiming.icon}
        >
          <div className='mb-4 leading-relaxed'>Once a draw has been initiated:</div>
          <ul className='list-disc pl-5 leading-relaxed flex flex-col gap-y-2'>
            {RULES_CONTENT.winningAndClaiming.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </Accordion>
      </div>

      <div className='mt-8 mb-16'>
        <Card
          title={RULES_CONTENT.ticketPricing.title}
          icon={RULES_CONTENT.ticketPricing.icon}
          color={RULES_CONTENT.ticketPricing.color}
        >
          <p className='mb-2'>
            Ticket cost:{' '}
            <span className='font-bold text-xl'>{RULES_CONTENT.ticketPricing.price}</span>
          </p>
          <ul className='list-disc pl-5 space-y-2'>
            {RULES_CONTENT.ticketPricing.distribution.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default Rules
