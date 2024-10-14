'use client'

import { FC, useState } from 'react'

const Icon: React.FC<{ name: string }> = ({ name }) => {
  // Simple SVG icons
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
}> = ({ title, icon, children }) => (
  <div className='bg-white rounded-lg shadow-md p-6'>
    <h2 className='text-xl font-semibold mb-4 flex items-center'>
      <Icon name={icon} />
      <span className='ml-2'>{title}</span>
    </h2>
    {children}
  </div>
)

const Accordion: React.FC<{
  title: string
  icon: string
  children: React.ReactNode
}> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className='border-b border-gray-200'>
      <button
        className='w-full text-left py-4 flex items-center justify-between focus:outline-none'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='flex items-center'>
          <Icon name={icon} />
          <span className='ml-2 font-semibold text-lg'>{title}</span>
        </span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && <div className='pb-4'>{children}</div>}
    </div>
  )
}

const Rules: FC = () => {
  return (
    <div className='max-w-6xl mx-auto px-2 py-12'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <Card title='How to Play' icon='pieChart'>
          <div className='text-lg leading-relaxed'>
            Buy a ticket and pick 4 numbers. If you pick the correct numbers of the lottery, you
            win! There are multiple prize pools to win from (see below). If you match all
            numbers, you win the jackpot!
          </div>
        </Card>

        <Card title='Draw Schedule' icon='clock'>
          <div className='text-lg leading-relaxed'>
            Draws occur every week <b>AND</b> when the prize pool passes the minimum threshold
            of 500ETH. When these conditions are met, a drawing is triggered and the numbers are
            revealed.
          </div>
        </Card>
      </div>

      <div className='mb-8 px-6'>
        <Accordion title='Prize Pools' icon='ticket'>
          <div className='mb-4 text-lg leading-relaxed'>
            If there are multiple winners in any pool, the prize pool gets split between them.
          </div>
          <ul className='list-disc pl-5 text-lg leading-relaxed flex flex-col gap-y-2'>
            <li>
              <strong>Jackpot:</strong> Match all 4 numbers (65% of prize pool)
            </li>
            <li>
              <strong>3 in a row:</strong> Match the first 3 numbers (25% of prize pool)
            </li>
            <li>
              <strong>2 in a row:</strong> Match the first 2 numbers (9% of prize pool)
            </li>
          </ul>
        </Accordion>

        <Accordion title='Difficulty Levels' icon='alertCircle'>
          <div className='mb-4 text-lg leading-relaxed'>
            In order to keep the lottery fun, the game will automatically adjusts its
            difficulty. Whenever there&apos;s been 3 conseutive drawings without a jackpot
            winner, the difficulty level decreases. If there&apos;s been 3 consecutive jackpot
            winners, the difficulty level increases.
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
            <li>Random numbers are generated (can take a few hours due to VDF computation).</li>
            <li>
              Once numbers are finalized, players can claim their prizes on this site or by
              calling the smart contract.
            </li>
            <li>Jackpot winners receive a unique NFT to commemorate their win!</li>
            <li>
              If any prize pool doesn&apos;t have a winner, the prize pool rolls over to the
              next game.
            </li>
            <li>
              If any prizes are not claimed within 1 year, they&apos;ll get rolled over to the
              next prize pool.
            </li>
          </ul>
        </Accordion>
      </div>

      <Card title='Ticket Pricing and Fees' icon='coins'>
        <p>
          A ticket costs 0.1 ETH. A fee of 1% (capped at 100ETH) is deducted from each draw.
        </p>
      </Card>
    </div>
  )
}

export default Rules
