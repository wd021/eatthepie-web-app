'use client'

import { FC, useState } from 'react'

import { Game as GameModal } from '@/components/modals'
import { useLotteryInfo } from '@/hooks'
import { Close } from '@/icons'

interface StatusBarProps {
  isStatusBarVisible: boolean
  setIsStatusBarVisible: (value: boolean) => void
}

const PrizePoolDisplay: FC<{ prizePool: string | undefined }> = ({ prizePool }) => (
  <div className='text-lg sm:text-2xl'>
    <span>Current Prize Pool - </span>
    <span className='ml-1.5 font-bold'>{prizePool} ETH</span>
  </div>
)

const CloseButton: FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className='absolute right-0 w-16 h-full flex items-center justify-center'
  >
    <Close className='w-7 h-7' />
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
        className='z-10 bg-[#22e523] fixed top-0 left-0 right-0 h-[70px] text-center flex flex-col items-center justify-center cursor-pointer'
        onClick={handleStatusBarClick}
      >
        <PrizePoolDisplay prizePool={lotteryInfo?.prizePool} />
        <CloseButton onClick={handleCloseClick} />
      </div>
      {modal === 'game' && <GameModal onRequestClose={() => setModal(false)} />}
    </>
  )
}

export default StatusBar
