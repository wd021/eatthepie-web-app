'use client'

import { FC, useState } from 'react'

import { Game as GameModal } from '@/components/modals'
import { useLotteryInfo } from '@/hooks'
import { Close } from '@/icons'
import { convertSecondsToShorthand } from '@/utils/helpers'

const CloseButton: FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className='ml-4 p-1 rounded-full hover:bg-green-600 transition-colors duration-200'
    aria-label='Close status bar'
  >
    <Close className='w-6 h-6' />
  </button>
)

const StatusInfo: FC<{ prizePool?: string | number; timeLeft: string }> = ({
  prizePool,
  timeLeft,
}) => (
  <div className='flex items-center space-x-4 text-black'>
    <span className='font-bold'>
      Prize Pool: {prizePool ? Number(prizePool).toFixed(1) : '-'} ETH
    </span>
    <span className='text-sm'>|</span>
    <span>Time Left: {timeLeft}</span>
  </div>
)

const StatusBar: FC<{
  isStatusBarVisible: boolean
  setIsStatusBarVisible: (value: boolean) => void
}> = ({ isStatusBarVisible, setIsStatusBarVisible }) => {
  const [isGameModalOpen, setIsGameModalOpen] = useState(false)
  const { lotteryInfo } = useLotteryInfo()

  if (!isStatusBarVisible) return null

  const timeLeft = convertSecondsToShorthand(lotteryInfo?.secondsUntilDraw || 0)

  const handleStatusBarClick = () => {
    setIsGameModalOpen(true)
  }

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsStatusBarVisible(false)
  }

  const handleGameModalClose = () => {
    setIsGameModalOpen(false)
  }

  return (
    <>
      <div
        className='z-10 bg-gradient-to-r from-green-400 to-green-600 fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-4 cursor-pointer transition-all duration-300 shadow-md'
        onClick={handleStatusBarClick}
      >
        <StatusInfo prizePool={lotteryInfo?.prizePool} timeLeft={timeLeft} />
        <CloseButton onClick={handleCloseClick} />
      </div>

      {isGameModalOpen && <GameModal onRequestClose={handleGameModalClose} />}
    </>
  )
}

export default StatusBar
