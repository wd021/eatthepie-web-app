import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Modal from 'react-modal'
import { animated, useSpring } from 'react-spring'
import { useModal } from 'connectkit'
import { ContractFunctionExecutionError, parseEther } from 'viem'
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { Countdown } from '@/components'
import lotteryABI from '@/contracts/LotteryABI.json'
import { useIsMobile, useLotteryInfo } from '@/hooks'
import { Close, Ethereum, Ticket, Timer } from '@/icons'
import { useToast } from '@/providers/ToastProvider'
import { getModalStyles } from '@/styles'
import { LOTTERY_NUMBERS_RANGE } from '@/utils/constants'

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

interface TransactionFeedbackProps {
  ticketCount: number
  status: string
  isConfirming: boolean
  isConfirmed: boolean
  hash: `0x${string}` | undefined
  error: Error | null
  onRequestClose: () => void
  onReset: () => void
}

interface GameModalProps {
  onRequestClose: () => void
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

const TransactionFeedback: React.FC<TransactionFeedbackProps> = ({
  ticketCount,
  status,
  isConfirming,
  isConfirmed,
  hash,
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
      <button
        onClick={onRequestClose}
        className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors'
      >
        <Close className='w-6 h-6' />
      </button>
      {status === 'pending' && (
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6'></div>
          <h2 className='text-2xl font-bold'>Purchasing your tickets</h2>
          <p className='text-lg'>Please confirm the transaction in your wallet</p>
        </div>
      )}
      {status === 'success' && isConfirming && (
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6'></div>
          <h2 className='text-2xl font-bold'>Transaction Sent</h2>
          <p className='text-lg'>Waiting for confirmation...</p>
          {hash && (
            <a
              href={`https://etherscan.io/tx/${hash}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 hover:underline mt-2 inline-block'
            >
              View on Etherscan
            </a>
          )}
        </div>
      )}
      {status === 'success' && isConfirmed && (
        <div className='flex flex-col text-center'>
          <div className='text-7xl mb-6'>🎟️</div>
          <h2 className='text-3xl font-bold mb-4'>
            {ticketCount} Ticket{ticketCount > 1 ? 's' : ''} Secured!
          </h2>
          <p className='text-xl'>You&apos;re officially in the game.</p>
          <p className='text-lg mb-4'>May fortune smile upon you!</p>
          {hash && (
            <a
              href={`https://etherscan.io/tx/${hash}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-lg font-semibold text-blue-500 hover:underline mb-4 inline-block'
            >
              View on Etherscan
            </a>
          )}
          <button
            onClick={onRequestClose}
            className='px-6 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition-colors duration-200'
          >
            Done
          </button>
        </div>
      )}
      {(status === 'error' || (status === 'success' && !isConfirmed && !isConfirming)) && (
        <div className='text-center max-w-md w-full'>
          <div className='text-7xl mb-6'>😕</div>
          <h2 className='text-3xl font-bold mb-4'>
            {error?.message.includes('User denied transaction signature')
              ? 'Transaction Cancelled'
              : 'Oops! A slight hiccup.'}
          </h2>
          <div className='mb-8 max-h-40 overflow-y-auto bg-gray-100 rounded-lg p-4'>
            <p className='text-lg'>
              {error?.message.includes('User denied transaction signature')
                ? "No worries! You've cancelled the transaction. Feel free to try again when you're ready."
                : error?.message ||
                  "We couldn't process your ticket purchase. Want to try again?"}
            </p>
          </div>
          <button
            onClick={onReset}
            className='px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition-colors duration-200'
          >
            {error?.message.includes('User denied transaction signature')
              ? 'Back to Purchase'
              : 'Give it Another Shot'}
          </button>
        </div>
      )}
    </animated.div>
  )
}

const GameInformation: React.FC<{
  lotteryInfo: any
  isExpanded: boolean
  onToggle: () => void
}> = ({ lotteryInfo, isExpanded, onToggle }) => {
  const prizePoolProgress = useMemo(() => {
    const currentPrizePool = parseFloat(lotteryInfo?.prizePool || '0')
    return Math.min((currentPrizePool / 500) * 100, 100)
  }, [lotteryInfo?.prizePool])

  const countdownProgress = useMemo(() => {
    const totalSeconds = 7 * 24 * 60 * 60 // 1 week in seconds
    const remainingSeconds = lotteryInfo?.secondsUntilDraw || 0
    return Math.max(0, Math.min(((totalSeconds - remainingSeconds) / totalSeconds) * 100, 100))
  }, [lotteryInfo?.secondsUntilDraw])

  return (
    <div className='bg-gray-100 p-4 rounded-lg'>
      <div
        className={`flex items-center justify-between cursor-pointer ${isExpanded ? 'mb-4' : ''}`}
        onClick={onToggle}
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
        <svg
          className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
      </div>
      {isExpanded && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
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
                <div
                  className='bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out'
                  style={{ width: `${countdownProgress}%` }}
                ></div>
              </div>
            </div>
            <div className='bg-white rounded-lg p-3 flex flex-col justify-between border border-gray-200'>
              <div className='flex items-center'>
                <Ethereum className='w-6 h-6 mr-2' />
                <div>
                  <h4 className='text-xs font-semibold text-gray-600'>Current Prize Pool</h4>
                  <p className='font-bold text-gray-800'>{lotteryInfo?.prizePool || '0'} ETH</p>
                </div>
              </div>
              <div className='mt-2 bg-gray-200 rounded-full h-1.5'>
                <div
                  className='bg-green-500 h-1.5 rounded-full transition-all duration-500 ease-out'
                  style={{ width: `${prizePoolProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className='text-xs text-center text-gray-600'>
            Drawing starts when countdown reaches 0 and prize pool reaches 500 ETH
          </div>
        </>
      )}
    </div>
  )
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS as `0x${string}`

const Game: React.FC<GameModalProps> = ({ onRequestClose }) => {
  const isMobile = useIsMobile()
  const customStyles = getModalStyles(isMobile)
  const { showToast } = useToast()
  const { setOpen } = useModal()
  const { address, isConnected } = useAccount()
  const { lotteryInfo } = useLotteryInfo()
  const publicClient = usePublicClient()

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
    writeContract,
    data: hash,
    status: transactionStatus,
    error: writeError,
    reset,
  } = useWriteContract()

  const {
    data: txReceipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash })

  const handlePurchase = useCallback(async () => {
    if (!lotteryInfo?.ticketPrice || !address || !publicClient) return

    const ticketPrice = Number(lotteryInfo.ticketPrice)
    const value = parseEther((ticketPrice * ticketCount).toString())

    const tickets = isAutoGenerated
      ? Array(ticketCount).fill(0).map(generateRandomNumbers)
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
          showToast('⚠️ Invalid ticket numbers')
        } else if (errorMessage.includes('insufficient funds')) {
          showToast('⚠️ Insufficient funds')
        } else if (errorMessage.includes('ticket count')) {
          showToast('⚠️ Max 100 tickets per purchase')
        } else if (errorMessage.includes('user denied transaction signature')) {
          showToast('⚠️ Transaction cancelled')
        } else {
          showToast('⚠️ Transaction failed. Please try again')
        }
      } else if (
        err instanceof Error &&
        err.message.includes('User denied transaction signature')
      ) {
        showToast('⚠️ Transaction cancelled')
      } else {
        showToast('⚠️ Transaction failed. Please try again')
      }
    }
  }, [
    address,
    lotteryInfo,
    isAutoGenerated,
    manualNumbers,
    publicClient,
    ticketCount,
    writeContract,
    generateRandomNumbers,
    showToast,
  ])

  const buttonAnimation = useSpring({
    scale: transactionStatus === 'pending' ? 1.05 : 1,
    config: { tension: 300, friction: 10 },
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
            <GameInformation
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
        ticketCount={ticketCount}
        status={transactionStatus}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        hash={hash}
        error={writeError || confirmError}
        onRequestClose={onRequestClose}
        onReset={reset}
      />
    </Modal>
  )
}

export default Game
