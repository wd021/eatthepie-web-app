import React, { useCallback, useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useModal } from 'connectkit'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'

import { useIsMobile, useLotteryInfo } from '@/hooks'
import { useLotteryPurchase } from '@/hooks'
import { Close, Ticket } from '@/icons'
import { useToast } from '@/providers/ToastProvider'
import { getModalStyles } from '@/styles'
import { LOTTERY_NUMBERS_RANGE } from '@/utils/constants'

import GameInfo from './gameInfo'
import TicketNumberInput from './ticketInput'
import Transaction from './transaction'

const Game: React.FC<{ onRequestClose: () => void }> = ({ onRequestClose }) => {
  const isMobile = useIsMobile()
  const customStyles = getModalStyles(isMobile)
  const { showToast } = useToast()
  const { setOpen } = useModal()
  const { address, isConnected } = useAccount()
  const { lotteryInfo } = useLotteryInfo()

  const [ticketCount, setTicketCount] = useState(1)
  const [isAutoGenerated, setIsAutoGenerated] = useState(true)
  const [manualNumbers, setManualNumbers] = useState<number[][]>([])
  const [isInfoExpanded, setIsInfoExpanded] = useState(false)

  const difficulty = (lotteryInfo?.difficulty || 'Easy') as keyof typeof LOTTERY_NUMBERS_RANGE
  const numberRange = LOTTERY_NUMBERS_RANGE[difficulty]

  useEffect(() => {
    setManualNumbers(Array(ticketCount).fill(Array(4).fill(0)))
  }, [ticketCount])

  const generateRandomNumbers = useCallback(() => {
    return Array(4)
      .fill(0)
      .map(
        (_, index) =>
          Math.floor(
            Math.random() * (index === 3 ? numberRange.etherball_max : numberRange.max) -
              numberRange.min +
              1,
          ) + numberRange.min,
      )
  }, [numberRange])

  const handleTicketCountChange = useCallback((value: string) => {
    const count = parseInt(value)
    if (!isNaN(count) && count >= 1 && count <= 100) {
      setTicketCount(count)
    }
  }, [])

  const handleNumberChange = useCallback(
    (ticketIndex: number, numberIndex: number, value: number) => {
      setManualNumbers((prev) =>
        prev.map((ticket, tIndex) =>
          tIndex === ticketIndex
            ? ticket.map((num, nIndex) => (nIndex === numberIndex ? value : num))
            : ticket,
        ),
      )
    },
    [],
  )

  const {
    handlePurchase,
    transactionStatus,
    isConfirming,
    isConfirmed,
    transactionHash,
    error,
    reset,
  } = useLotteryPurchase({
    address,
    ticketCount,
    isAutoGenerated,
    manualNumbers,
    lotteryInfo,
    generateRandomNumbers,
    showToast,
  })

  return (
    <Modal
      id='react-modal'
      ariaHideApp={false}
      isOpen={true}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      <div className='flex flex-col h-full overflow-hidden'>
        <div className='p-4 flex-shrink-0 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold text-gray-800'>
              Buy Tickets - Round #{lotteryInfo?.gameNumber}
            </h2>
            <button
              onClick={onRequestClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <Close className='w-6 h-6' />
            </button>
          </div>
        </div>

        <div className='flex-grow overflow-y-auto p-4'>
          <div className='space-y-4'>
            <GameInfo
              lotteryInfo={lotteryInfo}
              isExpanded={isInfoExpanded}
              onToggle={() => setIsInfoExpanded(!isInfoExpanded)}
            />

            <div className='flex bg-gray-100 p-4 rounded-lg'>
              <div className='flex flex-col'>
                <div className='flex items-center'>
                  <Ticket className='w-6 h-6 mr-2 text-gray-600' />
                  <span className='font-semibold text-gray-700'>Tickets to buy</span>
                </div>
                <p className='text-sm text-gray-500 mt-1'>Max 100 tickets per purchase</p>
              </div>
              <input
                type='number'
                min='1'
                max='100'
                value={ticketCount}
                onChange={(e) => handleTicketCountChange(e.target.value)}
                className='ml-auto w-20 px-3 py-2 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div className='flex items-center justify-between bg-gray-100 p-4 rounded-lg'>
              <div className='flex items-center'>
                <svg
                  className='w-6 h-6 mr-2 text-gray-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
                </svg>
                <span className='font-semibold text-gray-700'>Auto-generate numbers</span>
              </div>
              <label className='flex items-center cursor-pointer'>
                <div className='relative'>
                  <input
                    type='checkbox'
                    className='sr-only'
                    checked={isAutoGenerated}
                    onChange={() => setIsAutoGenerated(!isAutoGenerated)}
                  />
                  <div
                    className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
                      isAutoGenerated ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
                      isAutoGenerated ? 'transform translate-x-6' : ''
                    }`}
                  ></div>
                </div>
              </label>
            </div>
            {!isAutoGenerated &&
              manualNumbers.map((ticket, index) => (
                <TicketNumberInput
                  key={index}
                  ticket={ticket}
                  ticketIndex={index}
                  numberRange={numberRange}
                  handleNumberChange={handleNumberChange}
                />
              ))}
          </div>
        </div>

        <div className='p-4 flex-shrink-0 border-t border-gray-200'>
          <div className='mb-4 text-center'>
            <span className='text-lg font-semibold text-gray-700'>
              Total cost: {(ticketCount * Number(lotteryInfo?.ticketPrice || 0)).toFixed(2)} ETH
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              !isConnected ? setOpen(true) : handlePurchase()
            }}
            disabled={transactionStatus === 'pending'}
            className='w-full py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-xl rounded-lg hover:from-green-500 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {!isConnected
              ? 'Connect Wallet'
              : transactionStatus === 'pending'
                ? 'Processing...'
                : 'Purchase Tickets'}
          </motion.button>
        </div>
      </div>
      <Transaction
        ticketCount={ticketCount}
        status={transactionStatus}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        hash={transactionHash as `0x${string}` | undefined}
        error={error as Error | null}
        onRequestClose={onRequestClose}
        onReset={reset}
      />
    </Modal>
  )
}

export default Game
