'use client'

import React from 'react'
import { formatEther } from 'viem'

import { useLotteryGameInfo } from '@/hooks'
import { Copy } from '@/icons'
import { useToast } from '@/providers/ToastProvider'
import { truncateString } from '@/utils/helpers'
import { GameDetailedInfo } from '@/utils/types'

const GameSection = ({
  title,
  emoji,
  children,
  className = '',
}: {
  title: string
  emoji: string
  children: React.ReactNode
  className?: string
}) => (
  <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
    <div className='px-5 py-3.5 border-b border-gray-100'>
      <div className='flex items-center space-x-2'>
        <span className='text-xl'>{emoji}</span>
        <h2 className='text-base font-semibold text-gray-900'>{title}</h2>
      </div>
    </div>
    <div className='p-5'>{children}</div>
  </div>
)

const GameProgressSection = ({ gameInfo }: { gameInfo: GameDetailedInfo }) => {
  const steps = [
    { label: 'Game Started', completed: true },
    { label: 'Drawing Initiated', completed: gameInfo.drawInitiatedBlock > 0n },
    { label: 'RANDAO Set', completed: gameInfo.randaoBlock > 0n },
  ]

  return (
    <GameSection title='Game Progress' emoji='📈'>
      <div className='relative'>
        <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200' />
        {steps.map((step, index) => (
          <div key={index} className='relative flex items-center mb-6 last:mb-0'>
            <div
              className={`absolute left-4 w-7 h-7 rounded-full flex items-center justify-center border-2 -ml-3.5 ${
                step.completed ? 'bg-green-500 border-green-400' : 'bg-white border-gray-300'
              }`}
            >
              {step.completed ? (
                <svg
                  className='w-4 h-4 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              ) : (
                <div className='w-2 h-2 bg-gray-300 rounded-full' />
              )}
            </div>
            <div className='ml-11'>
              <h4
                className={`text-sm font-semibold ${
                  step.completed ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {step.label}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </GameSection>
  )
}

const RandomNumberSection = ({
  gameInfo,
  showToast,
}: {
  gameInfo: GameDetailedInfo
  showToast: (message: string, duration?: number) => void
}) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast('✅ RANDAO value copied')
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        showToast('✅ RANDAO value copied')
      } catch (err) {
        console.error('Failed to copy RANDAO value:', text)
        showToast('⚠️ Error copying RANDAO value')
      }
      document.body.removeChild(textArea)
    }
  }

  const vdfSubmitted = gameInfo.winningNumbers[0] !== 0n
  const randaoBlock = gameInfo.randaoBlock !== 0n ? gameInfo.randaoBlock.toString() : '-'
  const randaoValue = gameInfo.randaoValue !== 0n ? gameInfo.randaoValue.toString() : '-'

  return (
    <GameSection title='Random Number Generation' emoji='🎲' className='mt-5'>
      <div className='space-y-3'>
        <div className='p-3 bg-gray-50 rounded'>
          <div className='flex justify-between items-center'>
            <span className='text-sm font-medium text-gray-900'>Block Number</span>
            <span className='font-mono text-sm text-blue-600 font-medium'>{randaoBlock}</span>
          </div>
        </div>
        <div className='p-3 bg-gray-50 rounded'>
          <div className='flex justify-between items-center'>
            <span className='text-sm font-medium text-gray-900'>RANDAO Value</span>
            <div className='flex items-center gap-2'>
              <span className='font-mono text-sm text-blue-600 font-medium'>
                {randaoValue !== '-' ? truncateString(randaoValue, 15) : '-'}
              </span>
              {randaoValue !== '-' && (
                <button
                  onClick={() => copyToClipboard(randaoValue)}
                  className='text-gray-500 hover:text-gray-700 transition-colors'
                  title='Copy full value'
                >
                  <Copy className='w-4 h-4' />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className='p-3 bg-gray-50 rounded'>
          <div className='flex justify-between items-center'>
            <span className='text-sm font-medium text-gray-900'>VDF Proof</span>
            {randaoBlock === '-' && randaoValue === '-' && (
              <span className='font-mono text-sm text-blue-600 font-medium'>-</span>
            )}
            {randaoBlock !== '-' && randaoValue !== '-' && (
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  vdfSubmitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {vdfSubmitted ? 'Submitted' : 'Waiting'}
              </span>
            )}
          </div>
        </div>
      </div>
    </GameSection>
  )
}

const GameInformationSection = ({ gameInfo }: { gameInfo: GameDetailedInfo }) => {
  const getStatusBadge = (status: number) => {
    const styles =
      {
        0: 'bg-blue-100 text-blue-800',
        1: 'bg-yellow-100 text-yellow-800',
        2: 'bg-green-100 text-green-800',
      }[status] || 'bg-gray-100 text-gray-800'

    const labels =
      {
        0: 'In Play',
        1: 'Drawing',
        2: 'Completed',
      }[status] || 'Unknown'

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles}`}>{labels}</span>
    )
  }

  console.log('gameInfo.winningNumbers', gameInfo.winningNumbers)

  return (
    <GameSection title='Game Information' emoji='ℹ️'>
      <div className='space-y-6'>
        {/* Winning Numbers & Status */}
        <div className='space-y-3'>
          <div className='flex justify-between items-center'>
            <h3 className='text-sm font-semibold text-gray-900'>Winning Numbers</h3>
            <div className='text-2xl font-bold'>
              {gameInfo.winningNumbers
                .map((number: bigint) => number.toString().padStart(2, '0'))
                .join(' - ')}
            </div>
          </div>
          <div className='p-3 bg-gray-50 rounded'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-900'>Status</span>
              {getStatusBadge(gameInfo.status)}
            </div>
          </div>
        </div>

        {/* Prize Pool & Total Winners */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='p-4 bg-gray-50 rounded-lg'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-500'>Total Prize Pool</span>
              <span className='text-2xl font-bold text-gray-900'>
                {formatEther(gameInfo.prizePool)} ETH
              </span>
            </div>
          </div>
          <div className='p-4 bg-gray-50 rounded-lg'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-500'>Total Winners</span>
              <span className='text-2xl font-bold text-gray-900'>
                {gameInfo.numberOfWinners.toString()}
              </span>
            </div>
          </div>
        </div>

        {/* Winner Distribution & Payouts */}
        <div>
          <h3 className='text-sm font-semibold text-gray-900 mb-3'>Winner Distribution</h3>
          <div className='space-y-3'>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <div className='font-semibold text-gray-900'>Jackpot (4 Numbers)</div>
                  <div className='text-sm text-gray-500'>
                    {gameInfo.jackpotWinners?.toString() || '0'} winners
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-gray-900'>10.5 ETH</div>
                  <div className='text-sm text-gray-500'>per winner</div>
                </div>
              </div>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <div className='font-semibold text-gray-900'>3 Numbers in a Row</div>
                  <div className='text-sm text-gray-500'>
                    {gameInfo.threeNumberWinners?.toString() || '0'} winners
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-gray-900'>5.25 ETH</div>
                  <div className='text-sm text-gray-500'>per winner</div>
                </div>
              </div>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <div className='font-semibold text-gray-900'>2 Numbers in a Row</div>
                  <div className='text-sm text-gray-500'>
                    {gameInfo.twoNumberWinners?.toString() || '0'} winners
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-gray-900'>2.1 ETH</div>
                  <div className='text-sm text-gray-500'>per winner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameSection>
  )
}

const GameDetailsPage = ({ params: { round } }: { params: { round: bigint } }) => {
  const { showToast } = useToast()
  const { gameInfo, isLoading, isError } = useLotteryGameInfo(round)

  if (isLoading) return <div className='text-center py-10'>Loading...</div>
  if (isError)
    return <div className='text-center py-10 text-red-600'>Error fetching game details</div>
  if (!gameInfo) return <div className='text-center py-10'>No game information available</div>

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      <h1 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
        <span>Game #{round.toString()}</span>
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>
        <div className='space-y-5'>
          <GameProgressSection gameInfo={gameInfo} />
          <RandomNumberSection gameInfo={gameInfo} showToast={showToast} />
        </div>
        <GameInformationSection gameInfo={gameInfo} />
      </div>
    </div>
  )
}

export default GameDetailsPage
