import { FC } from 'react'
import Modal from 'react-modal'

import { Countdown } from '@/components'
import { useIsMobile, useLotteryInfo } from '@/hooks'
import { Close, EthereumCircle, Ticket, TicketAlternative, Timer } from '@/icons'
import { getModalStyles } from '@/styles'

interface CurrentGameModalProps {
  onRequestClose: (showTicketModal: boolean) => void
}

const Game: FC<CurrentGameModalProps> = ({ onRequestClose }) => {
  const isMobile = useIsMobile()
  const customStyles = getModalStyles(isMobile)
  const { lotteryInfo } = useLotteryInfo()

  return (
    <Modal
      id='react-modal'
      ariaHideApp={false}
      isOpen={true}
      onRequestClose={() => onRequestClose(false)}
      style={customStyles}
    >
      <button
        onClick={() => onRequestClose(false)}
        className='absolute top-0 right-0 h-[75px] w-[75px] flex items-center justify-center'
      >
        <Close className='w-6 h-6' />
      </button>
      <div className='p-5 flex flex-col h-full overflow-hidden'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Round #{lotteryInfo?.gameNumber}
        </h2>

        <div className='h-full flex flex-col overflow-y-auto hide-scrollbar'>
          <div className='flex flex-col mx-6 gap-y-8 mb-8'>
            {/* Prize Pool */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <EthereumCircle className='w-12 h-12' />
                <span className='ml-2.5 text-lg font-semibold'>Current Prize Pool</span>
              </div>
              <span className='text-2xl font-bold'>{lotteryInfo?.prizePool} ETH</span>
            </div>

            {/* Time Left */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <Timer className='w-12 h-12' />
                <div className='ml-2.5 text-lg font-semibold'>Time Left</div>
              </div>
              <div className='font-bold text-2xl'>
                <Countdown secondsUntilDraw={lotteryInfo?.secondsUntilDraw} />
              </div>
            </div>

            {/* Tickets Sold */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <Ticket className='w-12 h-12 text-[#cd37cb]' />
                <span className='ml-2.5 text-lg font-semibold'>Tickets Sold</span>
              </div>
              <span className='text-2xl font-bold'>{lotteryInfo?.ticketsSold}</span>
            </div>

            {/* My Tickets */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <TicketAlternative className='w-12 h-12' />
                <span className='ml-2.5 text-lg font-semibold'>My Tickets</span>
              </div>
              <span className='text-2xl font-bold'>0</span>
            </div>
          </div>

          {/* Buy Tickets Button */}
          <button
            onClick={() => onRequestClose(true)}
            className='mt-auto w-full py-4 bg-[#22e523] font-semibold text-2xl rounded-xl flex items-center justify-center'
          >
            Buy Ticket - {lotteryInfo?.ticketPrice}ETH
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default Game
