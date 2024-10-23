'use client'

import { FC, useState } from 'react'

import { Game as GameModal } from '@/components/modals'
import { useLotteryInfo } from '@/hooks'
import { Close } from '@/icons'
import { convertSecondsToShorthand } from '@/utils/helpers'

interface StatusBarProps {
  isStatusBarVisible: boolean
  setIsStatusBarVisible: (value: boolean) => void
}

interface CloseButtonProps {
  onClick: (e: React.MouseEvent) => void
}

interface StatusInfoProps {
  prizePool?: string | number
  timeLeft: string
}

const STYLES = {
  statusBar: {
    wrapper:
      'z-10 bg-gradient-to-r from-green-400 to-green-600 fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-4 cursor-pointer transition-all duration-300 shadow-md',
    infoContainer: 'flex items-center space-x-4 text-black',
  },
  closeButton:
    'ml-4 p-1 rounded-full hover:bg-green-600 transition-colors duration-200 text-white',
  divider: 'text-sm',
  prizePool: 'font-bold',
} as const

const CloseButton: FC<CloseButtonProps> = ({ onClick }) => (
  <button onClick={onClick} className={STYLES.closeButton} aria-label='Close status bar'>
    <Close className='w-6 h-6' />
  </button>
)

const StatusInfo: FC<StatusInfoProps> = ({ prizePool, timeLeft }) => (
  <div className={STYLES.statusBar.infoContainer}>
    <span className={STYLES.prizePool}>Prize Pool: {prizePool} ETH</span>
    <span className={STYLES.divider}>|</span>
    <span>Time Left: {timeLeft}</span>
  </div>
)

const StatusBar: FC<StatusBarProps> = ({ isStatusBarVisible, setIsStatusBarVisible }) => {
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
      <div className={STYLES.statusBar.wrapper} onClick={handleStatusBarClick}>
        <StatusInfo prizePool={lotteryInfo?.prizePool} timeLeft={timeLeft} />
        <CloseButton onClick={handleCloseClick} />
      </div>

      {isGameModalOpen && <GameModal onRequestClose={handleGameModalClose} />}
    </>
  )
}

export default StatusBar
