import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Modal from 'react-modal'
import { animated, useSpring } from 'react-spring'
import { useModal } from 'connectkit'
import { ContractFunctionExecutionError, parseEther } from 'viem'
import { useAccount, usePublicClient, useWriteContract } from 'wagmi'

import { Countdown } from '@/components'
import lotteryABI from '@/contracts/LotteryABI.json'
import { useIsMobile, useLotteryInfo, useTicketInfo } from '@/hooks'
import { Calculator, Close, EthereumCircle, Ticket, Timer } from '@/icons'
import { useToast } from '@/providers/ToastProvider'
import { getModalStyles } from '@/styles'
import { LOTTERY_NUMBERS_RANGE } from '@/utils/constants'

interface GameInfoCardProps {
  icon: React.ElementType
  title: string
  value: React.ReactNode
  bgColor: string
  borderColor: string
  textColor: string
}

const GameInfoCard: React.FC<GameInfoCardProps> = ({ icon: Icon, title, value, bgColor }) => (
  <div className={`${bgColor} rounded-lg p-4 flex items-center`}>
    <Icon className={`w-10 h-10 text-white mr-3`} />
    <div>
      <h3 className={`text-sm font-semibold text-white`}>{title}</h3>
      <p className={`text-xl font-bold text-white`}>{value}</p>
    </div>
  </div>
)

interface NumberRange {
  min: number
  max: number
  etherball_max: number
}

interface TicketNumberInputProps {
  ticket: number[]
  ticketIndex: number
  numberRange: NumberRange
  handleNumberChange: (ticketIndex: number, numberIndex: number, value: number) => void
}

const TicketNumberInput: React.FC<TicketNumberInputProps> = ({
  ticket,
  ticketIndex,
  numberRange,
  handleNumberChange,
}) => (
  <div className='bg-gray-100 p-4 rounded-lg mb-4'>
    <h4 className='text-sm font-semibold mb-2'>Ticket {ticketIndex + 1}</h4>
    <div className='grid grid-cols-4 gap-2'>
      {ticket.map((number, numberIndex) => (
        <input
          key={numberIndex}
          type='number'
          min={numberRange.min}
          max={numberIndex === 3 ? numberRange.etherball_max : numberRange.max}
          value={number || ''}
          onChange={(e) =>
            handleNumberChange(ticketIndex, numberIndex, parseInt(e.target.value))
          }
          className='w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder={`${numberRange.min}-${
            numberIndex === 3 ? numberRange.etherball_max : numberRange.max
          }`}
        />
      ))}
    </div>
  </div>
)

interface TransactionFeedbackProps {
  status: WriteContractResult['status']
  error: Error | null
  onRequestClose: () => void
  onReset: () => void
}

const TransactionFeedback: React.FC<TransactionFeedbackProps> = ({
  status,
  error,
  onRequestClose,
  onReset,
}) => {
  const fadeIn = useSpring({
    opacity: status !== 'idle' ? 1 : 0,
    config: { duration: 200 },
  })

  if (status === 'idle') return null

  return (
    <animated.div
      style={fadeIn}
      className='absolute inset-0 bg-white flex flex-col items-center justify-center z-50 p-6 rounded-[15px]'
    >
      {status === 'pending' && (
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6'></div>
          <h2 className='text-2xl font-bold mb-4'>Purchasing your tickets</h2>
          <p className='text-lg'>Hold on tight, luck is on its way!</p>
        </div>
      )}
      {status === 'success' && (
        <div className='text-center'>
          <div className='text-7xl mb-6'>🎟️</div>
          <h2 className='text-3xl font-bold mb-4'>Tickets Secured!</h2>
          <p className='text-xl mb-2'>You&apos;re officially in the game.</p>
          <p className='text-lg mb-8'>May fortune smile upon you!</p>
          <button
            onClick={onRequestClose}
            className='px-6 py-3 bg-green-500 text-white text-lg rounded-lg hover:bg-green-600 transition-colors duration-200'
          >
            Back to Game
          </button>
        </div>
      )}
      {status === 'error' && (
        <div className='text-center max-w-md w-full'>
          <div className='text-7xl mb-6'>😕</div>
          <h2 className='text-3xl font-bold mb-4'>Oops! A slight hiccup.</h2>
          <div className='mb-8 max-h-40 overflow-y-auto bg-gray-100 rounded-lg p-4'>
            <p className='text-lg'>
              {error?.message || "We couldn't process your ticket purchase. Want to try again?"}
            </p>
          </div>
          <button
            onClick={onReset}
            className='px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition-colors duration-200'
          >
            Give it Another Shot
          </button>
        </div>
      )}
    </animated.div>
  )
}

interface GameModalProps {
  onRequestClose: () => void
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS as `0x${string}`

const Game: React.FC<GameModalProps> = ({ onRequestClose }) => {
  const isMobile = useIsMobile()
  const customStyles = getModalStyles(isMobile)
  const { showToast } = useToast()

  const { setOpen } = useModal()
  const { address, isConnected } = useAccount()
  const { lotteryInfo } = useLotteryInfo()
  const { ticketCount: purchasedTickets } = useTicketInfo(lotteryInfo?.gameNumber ?? 0)

  const publicClient = usePublicClient()

  const [ticketCount, setTicketCount] = useState(1)
  const [isAutoGenerated, setIsAutoGenerated] = useState(true)
  const [manualNumbers, setManualNumbers] = useState<number[][]>([])
  const [isInfoCollapsed, setIsInfoCollapsed] = useState(false)

  const { writeContract, status: transactionStatus, reset, error } = useWriteContract()

  const difficulty = (lotteryInfo?.difficulty || 'Easy') as keyof typeof LOTTERY_NUMBERS_RANGE
  const numberRange = LOTTERY_NUMBERS_RANGE[difficulty]

  useEffect(() => {
    setManualNumbers(Array(ticketCount).fill(Array(4).fill(0)))
  }, [ticketCount])

  const generateRandomNumbers = () => {
    return [
      Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min,
      Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min,
      Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min,
      Math.floor(Math.random() * (numberRange.etherball_max - numberRange.min + 1)) +
        numberRange.min,
    ]
  }

  const handleTicketCountChange = (value: string) => {
    const count = parseInt(value)
    if (!isNaN(count) && count >= 1 && count <= 100) {
      setTicketCount(count)
    }
  }

  const handleNumberChange = (ticketIndex: number, numberIndex: number, value: number) => {
    const newManualNumbers = [...manualNumbers]
    newManualNumbers[ticketIndex] = [...newManualNumbers[ticketIndex]]
    newManualNumbers[ticketIndex][numberIndex] = value
    setManualNumbers(newManualNumbers)
  }

  const handlePurchase = useCallback(async () => {
    if (!lotteryInfo?.ticketPrice || !address || !publicClient) return

    const ticketPrice = Number(lotteryInfo.ticketPrice)
    const value = parseEther((ticketPrice * ticketCount).toString())

    const tickets = isAutoGenerated
      ? Array(ticketCount)
          .fill(0)
          .map(() => generateRandomNumbers())
      : manualNumbers

    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: lotteryABI,
        functionName: 'buyTickets',
        args: [tickets],
        value,
        account: address,
      })
      writeContract(request)
    } catch (err) {
      if (err instanceof ContractFunctionExecutionError) {
        const errorMessage = err.message.toLowerCase()
        if (errorMessage.includes('invalid numbers')) {
          showToast('⚠️ Invalid ticket numbers', 2500)
        } else if (errorMessage.includes('insufficient funds')) {
          showToast('⚠️ insufficient funds', 2500)
        } else if (errorMessage.includes('ticket count')) {
          showToast('⚠️ Max 100 tickets per purchase', 2500)
        } else {
          showToast('⚠️ Transaction failed. Please try again', 2500)
        }
      } else {
        showToast('⚠️ Transaction failed. Please try again', 2500)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    address,
    lotteryInfo,
    isAutoGenerated,
    manualNumbers,
    publicClient,
    ticketCount,
    writeContract,
  ])

  const buttonAnimation = useSpring({
    scale: transactionStatus === 'pending' ? 1.05 : 1,
    config: { tension: 300, friction: 10 },
  })

  const gameInfo = useMemo(
    () => [
      {
        icon: Timer,
        title: 'Countdown',
        value: <Countdown secondsUntilDraw={lotteryInfo?.secondsUntilDraw} />,
        bgColor: 'bg-[#f38181]',
      },
      {
        icon: EthereumCircle,
        title: 'Current Prize Pool',
        value: `${lotteryInfo?.prizePool || '0'} ETH`,
        bgColor: 'bg-[#17a34a]',
      },
      {
        icon: Calculator,
        title: 'Difficulty',
        value: lotteryInfo?.difficulty || '-',
        bgColor: 'bg-[#a31795]',
      },
      {
        icon: Ticket,
        title: 'My Tickets',
        value: purchasedTickets,
        bgColor: 'bg-[#2663eb]',
      },
    ],
    [lotteryInfo, purchasedTickets],
  )

  return (
    <Modal
      id='react-modal'
      ariaHideApp={false}
      isOpen={true}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      <div className='flex flex-col h-full overflow-hidden'>
        <div className='p-6 flex-shrink-0 border-b border-gray-200'>
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

        <div className='flex-grow overflow-y-auto px-6 py-4'>
          <div className='mb-6'>
            <button
              onClick={() => setIsInfoCollapsed(!isInfoCollapsed)}
              className='w-full flex items-center justify-between py-5 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              <span className='font-semibold text-gray-800'>Game Information</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  isInfoCollapsed ? 'rotate-180' : ''
                }`}
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
              </svg>
            </button>
          </div>

          {!isInfoCollapsed && (
            <div className='grid grid-cols-2 gap-4 mb-6'>
              {gameInfo.map((info, index) => (
                <GameInfoCard key={index} {...info} />
              ))}
            </div>
          )}

          <div className='space-y-6'>
            <div className='flex bg-gray-100 p-4 rounded-lg'>
              <div className='flex flex-col'>
                <div className='flex items-center'>
                  <Ticket className='w-6 h-6 mr-2 text-gray-600' />
                  <span className='font-semibold text-gray-700'>Number of tickets:</span>
                </div>
                <p className='text-sm text-gray-500 italic'>Max 100 tickets per purchase</p>
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
                <span className='font-semibold text-gray-700'>Auto-generate numbers:</span>
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

        <div className='p-6 flex-shrink-0 border-t border-gray-200'>
          <div className='mb-4 text-center'>
            <span className='text-lg font-semibold text-gray-700'>
              Total cost: {(ticketCount * Number(lotteryInfo?.ticketPrice || 0)).toFixed(2)} ETH
            </span>
          </div>
          <animated.button
            style={buttonAnimation}
            onClick={() => {
              !isConnected ? setOpen(true) : handlePurchase()
            }}
            disabled={transactionStatus === 'pending'}
            className='w-full py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-xl rounded-lg hover:from-green-500 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {!isConnected ? (
              <>Connect Wallet</>
            ) : (
              <>{transactionStatus === 'pending' ? 'Processing...' : 'Purchase Tickets'}</>
            )}
          </animated.button>
        </div>
      </div>
      <TransactionFeedback
        status={transactionStatus}
        error={error}
        onRequestClose={onRequestClose}
        onReset={reset}
      />
    </Modal>
  )
}

export default Game
