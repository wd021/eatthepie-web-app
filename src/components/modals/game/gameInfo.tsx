import { useMemo } from 'react'
import { motion } from 'framer-motion'

import { Countdown } from '@/components'
import { Ethereum, Timer } from '@/icons'
import { LotteryInfo } from '@/utils/types'

const GameInfo: React.FC<{
  lotteryInfo: LotteryInfo | undefined
  isExpanded: boolean
  onToggle: () => void
}> = ({ lotteryInfo, isExpanded, onToggle }) => {
  const prizePoolProgress = useMemo(() => {
    const currentPrizePool = parseFloat(lotteryInfo?.prizePool || '0')
    return Math.min((currentPrizePool / 100000) * 100, 100)
  }, [lotteryInfo?.prizePool])

  const countdownProgress = useMemo(() => {
    const totalSeconds = 7 * 24 * 60 * 60
    const remainingSeconds = lotteryInfo?.secondsUntilDraw || 0
    return Math.max(0, Math.min(((totalSeconds - remainingSeconds) / totalSeconds) * 100, 100))
  }, [lotteryInfo?.secondsUntilDraw])

  return (
    <div className='bg-gray-100 p-4 rounded-lg'>
      <motion.div
        onClick={onToggle}
        className='flex items-center justify-between cursor-pointer'
      >
        <div className='flex items-center'>
          <svg
            className='w-6 h-6 mr-2 text-gray-600'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <span className='font-semibold text-gray-700'>Game Information</span>
        </div>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className='w-5 h-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </motion.svg>
      </motion.div>

      {isExpanded && (
        <div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4'>
            <div className='bg-white rounded-lg p-3 flex flex-col justify-between border border-gray-200'>
              <div className='flex items-center'>
                <Timer className='w-6 h-6 mr-2' />
                <div>
                  <h4 className='text-xs font-semibold text-gray-600'>Countdown</h4>
                  <p className='font-bold text-gray-800'>
                    <Countdown secondsUntilDraw={lotteryInfo?.secondsUntilDraw} />
                  </p>
                </div>
              </div>
              <div className='mt-2 bg-gray-200 rounded-full h-1.5'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${countdownProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className='bg-blue-500 h-1.5 rounded-full'
                />
              </div>
            </div>

            <div className='bg-white rounded-lg p-3 flex flex-col justify-between border border-gray-200'>
              <div className='flex items-center'>
                <Ethereum className='w-6 h-6 mr-2' />
                <div>
                  <h4 className='text-xs font-semibold text-gray-600'>Current Prize Pool</h4>
                  <p className='font-bold text-gray-800'>
                    {Number(lotteryInfo?.prizePool).toLocaleString() || '0'} WLD
                  </p>
                </div>
              </div>
              <div className='mt-2 bg-gray-200 rounded-full h-1.5'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${prizePoolProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className='bg-green-500 h-1.5 rounded-full'
                />
              </div>
            </div>
          </div>
          <div className='text-xs text-center text-gray-600'>
            Drawing starts when countdown reaches 0 and the prize pool reaches 100,000 WLD
          </div>
        </div>
      )}
    </div>
  )
}

export default GameInfo
