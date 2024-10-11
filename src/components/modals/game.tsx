import React from 'react'
import Modal from 'react-modal'

import { Countdown } from '@/components'
import { useIsMobile, useLotteryInfo } from '@/hooks'
import { Close, EthereumCircle, TicketAlternative, Timer } from '@/icons'
import { getModalStyles } from '@/styles'

interface GameProps {
  onRequestClose: (showTicketModal: boolean) => void
}

interface LotteryInfo {
  gameNumber: number
  prizePool: number
  secondsUntilDraw: number
  ticketsSold: number
  ticketPrice: number
}

interface GridItemProps {
  icon: React.ElementType
  title: string
  value: React.ReactNode
}

const GridItem: React.FC<GridItemProps> = ({ icon: Icon, title, value }) => (
  <div className='bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center'>
    <Icon className='w-12 h-12 mb-2' />
    <h3 className='font-semibold mb-2 text-gray-600'>{title}</h3>
    <p className='text-2xl font-bold'>{value}</p>
  </div>
)

const Game: React.FC<GameProps> = ({ onRequestClose }) => {
  const isMobile = useIsMobile()
  const customStyles = getModalStyles(isMobile)
  const { lotteryInfo } = useLotteryInfo() as unknown as { lotteryInfo: LotteryInfo }

  return (
    <Modal
      id='react-modal'
      ariaHideApp={false}
      isOpen={true}
      onRequestClose={() => onRequestClose(false)}
      style={customStyles}
    >
      <div className='p-6 flex flex-col h-full'>
        <button
          onClick={() => onRequestClose(false)}
          className='absolute top-0 right-0 flex items-center justify-center h-20 w-20 text-gray-500 hover:text-gray-700'
        >
          <Close className='w-6 h-6' />
        </button>

        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
          Round #{lotteryInfo.gameNumber}
        </h2>

        <div className='grid grid-cols-2 gap-4 mb-6'>
          <GridItem
            icon={EthereumCircle}
            title='Prize Pool'
            value={`${lotteryInfo.prizePool} ETH`}
          />
          <GridItem
            icon={Timer}
            title='Countdown'
            value={<Countdown secondsUntilDraw={lotteryInfo.secondsUntilDraw} />}
          />
          <GridItem
            icon={TicketAlternative}
            title='Tickets Sold'
            value={lotteryInfo.ticketsSold}
          />
          <GridItem icon={TicketAlternative} title='My Tickets' value='0' />
        </div>

        <button
          onClick={() => onRequestClose(true)}
          className='mt-auto w-full py-4 bg-green-500 text-white font-semibold text-xl rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center'
        >
          Buy Ticket - {lotteryInfo.ticketPrice} ETH
        </button>
      </div>
    </Modal>
  )
}

export default Game
