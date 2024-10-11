'use client'

import { FC, useState } from 'react'

import { Game as GameModal, Ticket as TicketModal } from '@/components/modals'
import { useLotteryInfo } from '@/hooks'
import { Close } from '@/icons'

const StatusBar: FC<{
  isStatusBarVisible: boolean
  setIsStatusBarVisible: (value: boolean) => void
}> = ({ isStatusBarVisible, setIsStatusBarVisible }) => {
  const [modal, setModal] = useState<boolean | 'ticket' | 'game'>(false)
  const { lotteryInfo } = useLotteryInfo()

  return isStatusBarVisible ? (
    <>
      <div
        className='z-10 bg-[#22e523] fixed top-0 left-0 right-0 h-[70px] text-center flex flex-col items-center justify-center cursor-pointer'
        onClick={() => setModal('game')}
      >
        <div className='text-lg sm:text-2xl'>
          <span>Current Prize Pool - </span>
          <span className='ml-1.5 font-bold'>{lotteryInfo?.prizePool} ETH</span>
        </div>
        <button
          onClick={() => setIsStatusBarVisible(false)}
          className='absolute right-0 w-16 h-full flex items-center justify-center'
        >
          <Close className='w-7 h-7' />
        </button>
      </div>
      {modal === 'game' && (
        <GameModal
          onRequestClose={(showTicketModal) => {
            if (showTicketModal) {
              setModal('ticket')
            } else {
              setModal(false)
            }
          }}
        />
      )}
      {modal === 'ticket' && <TicketModal onRequestClose={() => setModal(false)} />}
    </>
  ) : null
}

export default StatusBar
