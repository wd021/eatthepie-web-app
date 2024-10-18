'use client'

import React, { FC, useState } from 'react'

import { Game as GameModal } from '@/components/modals'
import { useLotteryInfo } from '@/hooks'
import { Close } from '@/icons'
import { convertSecondsToShorthand } from '@/utils/helpers'

interface StatusBarProps {
  isStatusBarVisible: boolean
  setIsStatusBarVisible: (value: boolean) => void
}

const CloseButton: FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className='ml-4 p-1 rounded-full hover:bg-green-600 transition-colors duration-200 text-white'
    aria-label='Close'
  >
    <Close className='w-6 h-6' />
  </button>
)

const StatusBar: FC<StatusBarProps> = ({ isStatusBarVisible, setIsStatusBarVisible }) => {
  const [modal, setModal] = useState<boolean | 'ticket' | 'game'>(false)
  const { lotteryInfo } = useLotteryInfo()

  if (!isStatusBarVisible) return null

  const handleStatusBarClick = () => setModal('game')
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsStatusBarVisible(false)
  }

  return (
    <>
      <div
        className='z-10 bg-gradient-to-r from-green-400 to-green-600 fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-4 cursor-pointer transition-all duration-300 shadow-md'
        onClick={handleStatusBarClick}
      >
        <div className='flex items-center space-x-4 text-black'>
          <span className='font-bold'>Prize Pool: {lotteryInfo?.prizePool} ETH</span>
          <span className='text-sm'>|</span>
          <span>
            Time Left: {convertSecondsToShorthand(lotteryInfo?.secondsUntilDraw || 0)}
          </span>
        </div>
        <CloseButton onClick={handleCloseClick} />
      </div>
      {modal === 'game' && <GameModal onRequestClose={() => setModal(false)} />}
    </>
  )
}

export default StatusBar
