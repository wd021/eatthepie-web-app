'use client'

import { FC, useState } from 'react'

import { Game as GameModal } from '@/components/modals'
import { useLotteryInfo } from '@/hooks'
import { ChevronDown, Clock, EthereumWhite, Jackpot, WorldchainWhite } from '@/icons'
import { convertSecondsToShorthand } from '@/utils/helpers'

const networks = [
  {
    name: 'World Chain',
    url: 'https://world.eatthepie.xyz',
    icon: <WorldchainWhite className='w-4' />,
  },
  {
    name: 'Ethereum',
    url: 'https://ethereum.eatthepie.xyz',
    icon: <EthereumWhite className='w-4' />,
  },
]

const NetworkSelector: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const currentNetwork = networks[0]

  return (
    <div className='relative z-20'>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className='group flex items-center gap-2.5 bg-white/5 hover:bg-white/10 
                   px-4 py-2 rounded-xl transition-all duration-200'
      >
        <div className='flex items-center justify-center w-6 h-6'>
          <span className='text-base'>{currentNetwork.icon}</span>
        </div>
        <span className='text-sm font-medium text-white/90'>{currentNetwork.name}</span>
        <ChevronDown
          className={`w-4 h-4 text-white/50 transition-transform duration-300 
                     group-hover:text-white/70 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className='absolute top-full left-0 mt-2 bg-[#1A1A1A] rounded-xl shadow-xl 
                      border border-white/10 backdrop-blur-xl w-[180px] p-1'
        >
          {networks.map((network) => (
            <a
              key={network.name}
              href={network.url}
              onClick={(e) => e.stopPropagation()}
              className='flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 
                       transition-colors duration-200 rounded-lg group'
            >
              <div className='flex items-center justify-center w-6 h-6 bg-white/5 rounded-lg'>
                <span className='text-base'>{network.icon}</span>
              </div>
              <span className='text-sm font-medium text-white/90 group-hover:text-white'>
                {network.name}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

const PrizePool: FC<{ value?: string | number }> = ({ value }) => (
  <div className='flex items-center gap-2'>
    <div className='relative'>
      <Jackpot className='w-8 h-8 text-white/90' />
    </div>
    <div className='flex flex-col'>
      <span className='text-xs font-medium text-white/50'>Prize Pool</span>
      <span className='text-lg font-bold text-white'>
        {value ? Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 }) : '-'} WLD
      </span>
    </div>
  </div>
)

const TimeLeft: FC<{ value: string }> = ({ value }) => (
  <div className='items-center gap-2 hidden sm:flex'>
    <Clock className='w-6 h-6 text-white/90' />
    <div className='flex flex-col'>
      <span className='text-xs font-medium text-white/50'>Time Left</span>
      <span className='text-lg font-bold text-white'>{value}</span>
    </div>
  </div>
)

const StatusBar: FC<{
  isStatusBarVisible: boolean
  setIsStatusBarVisible: (value: boolean) => void
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}> = ({ isStatusBarVisible, setIsStatusBarVisible }) => {
  const [isGameModalOpen, setIsGameModalOpen] = useState(false)
  const { lotteryInfo } = useLotteryInfo()

  if (!isStatusBarVisible) return null

  const timeLeft = convertSecondsToShorthand(lotteryInfo?.secondsUntilDraw || 0)

  return (
    <>
      <div
        onClick={() => setIsGameModalOpen(true)}
        className='z-[11] fixed top-0 left-0 right-0 h-20 cursor-pointer
                  bg-[#0A0A0A]/95 backdrop-blur-md shadow-xl border-b border-white/5
                  hover:bg-[#1A1A1A]/95 transition-colors duration-200'
      >
        <div className='max-w-7xl mx-auto h-full px-4'>
          <div className='flex items-center justify-between h-full'>
            <NetworkSelector />

            <div className='flex items-center gap-8'>
              <PrizePool value={lotteryInfo?.prizePool} />
              <TimeLeft value={timeLeft} />
            </div>
          </div>
        </div>
      </div>

      {isGameModalOpen && <GameModal onRequestClose={() => setIsGameModalOpen(false)} />}
    </>
  )
}

export default StatusBar
