'use client'

import React, { useEffect, useState } from 'react'
import { formatEther } from 'viem'
import { useAccount, usePublicClient } from 'wagmi'

import { CONTRACT_ADDRESSES } from '@/config/chainConfig'
import lotteryABI from '@/contracts/LotteryABI.json'
import { useLotteryGameInfo } from '@/hooks'

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

const GameProgressSection = ({ gameInfo }: { gameInfo: any }) => {
  const steps = [
    { label: 'Game Started', completed: true },
    { label: 'Drawing Initiated', completed: gameInfo.drawInitiatedBlock > 0n },
    { label: 'RANDAO Set', completed: gameInfo.randaoBlock > 0n },
  ]

  return (
    <GameSection title='Game Progress' emoji='📈'>
      <div className='relative pt-2'>
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
                className={`text-sm font-medium ${
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

const RandomNumberSection = ({ gameInfo }: { gameInfo: any }) => (
  <GameSection title='Random Number Generation' emoji='🎲' className='mt-5'>
    <div className='space-y-3'>
      <div className='p-3 bg-gray-50 rounded'>
        <div className='flex justify-between items-center'>
          <span className='text-sm font-medium text-gray-900'>Block Number</span>
          <span className='font-mono text-sm text-blue-600 font-medium'>
            {gameInfo.randaoBlock.toString()}
          </span>
        </div>
      </div>
      <div className='p-3 bg-gray-50 rounded'>
        <div className='flex justify-between items-center'>
          <span className='text-sm font-medium text-gray-900'>RANDAO Value</span>
          <span className='font-mono text-sm text-blue-600 font-medium'>
            {gameInfo.randaoValue.toString()}
          </span>
        </div>
      </div>
      <div className='p-3 bg-gray-50 rounded'>
        <div className='flex justify-between items-center'>
          <span className='text-sm font-medium text-gray-900'>VDF Proof</span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              gameInfo.vdfProofSubmitted
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {gameInfo.vdfProofSubmitted ? 'Submitted' : 'Waiting...'}
          </span>
        </div>
      </div>
    </div>
  </GameSection>
)

const WinningNumber = ({ number }: { number: number }) => (
  <div
    className='w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 
    flex items-center justify-center text-white text-xl font-bold shadow-sm 
    transition-transform hover:scale-105'
  >
    {number}
  </div>
)

const GameInformationSection = ({ gameInfo }: { gameInfo: any }) => {
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

  return (
    <GameSection title='Game Information' emoji='ℹ️'>
      <div className='space-y-6'>
        <div>
          <h3 className='text-sm font-semibold text-gray-900 mb-3'>Winning Numbers</h3>
          <div className='flex space-x-2.5'>
            {gameInfo.winningNumbers.map((number: number, index: number) => (
              <WinningNumber key={index} number={number} />
            ))}
          </div>
        </div>

        <div className='space-y-3'>
          <div className='p-3 bg-gray-50 rounded'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-900'>Status</span>
              {getStatusBadge(gameInfo.status)}
            </div>
          </div>
          <div className='p-3 bg-gray-50 rounded'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-900'>Prize Pool</span>
              <span className='text-sm font-bold text-gray-900'>
                {formatEther(gameInfo.prizePool)} ETH
              </span>
            </div>
          </div>
          <div className='p-3 bg-gray-50 rounded'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-900'>Total Winners</span>
              <span className='text-sm font-bold text-gray-900'>
                {gameInfo.numberOfWinners.toString()}
              </span>
            </div>
          </div>
        </div>

        <div className='space-y-3'>
          <h3 className='text-sm font-semibold text-gray-900'>Payouts</h3>
          <div className='p-3 bg-gray-50 rounded'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-900'>Jackpot</span>
              <span className='text-sm font-bold text-gray-900'>10.5 ETH</span>
            </div>
          </div>
          <div className='p-3 bg-gray-50 rounded'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-900'>3 in a row</span>
              <span className='text-sm font-bold text-gray-900'>5.25 ETH</span>
            </div>
          </div>
          <div className='p-3 bg-gray-50 rounded'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-900'>2 in a row</span>
              <span className='text-sm font-bold text-gray-900'>2.1 ETH</span>
            </div>
          </div>
        </div>
      </div>
    </GameSection>
  )
}

const PrizeClaimsSection = ({
  claims,
  isLoading,
  userWinningStatus,
  onCheckWinning,
}: {
  claims: any[]
  isLoading: boolean
  userWinningStatus: string | null
  onCheckWinning: () => void
}) => (
  <GameSection title='Prize Claims' emoji='🏆'>
    <div>
      <button
        onClick={onCheckWinning}
        className='mb-5 px-5 py-2 bg-blue-600 text-sm font-medium text-white rounded-lg 
          hover:bg-blue-700 transition-colors shadow-sm'
      >
        Check If You Won
      </button>

      {userWinningStatus && (
        <div className='mb-5 p-4 bg-blue-50 border border-blue-100 rounded-lg'>
          <p className='text-sm font-medium text-blue-900'>{userWinningStatus}</p>
        </div>
      )}

      {isLoading ? (
        <div className='text-center py-6'>
          <div className='animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600 mx-auto' />
        </div>
      ) : claims.length === 0 ? (
        <p className='text-center text-sm text-gray-500 py-6'>
          No prizes claimed yet for this game
        </p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Winner
                </th>
                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Amount
                </th>
                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Claimed At
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {claims.map((claim, index) => (
                <tr key={index} className='hover:bg-gray-50'>
                  <td className='px-5 py-3 text-sm font-medium text-gray-900'>
                    {claim.winner}
                  </td>
                  <td className='px-5 py-3 text-sm text-gray-900'>
                    {formatEther(claim.amount)} ETH
                  </td>
                  <td className='px-5 py-3 text-sm text-gray-500'>
                    {new Date(claim.timestamp * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </GameSection>
)

const GameDetailsPage = ({ params: { round } }: { params: { round: bigint } }) => {
  const { gameInfo, isLoading, isError } = useLotteryGameInfo(round)
  const [claims, setClaims] = useState<any[]>([])
  const [claimsLoading, setClaimsLoading] = useState(true)
  const [userWinningStatus, setUserWinningStatus] = useState<string | null>(null)

  const publicClient = usePublicClient()
  const { address, isConnected } = useAccount()

  useEffect(() => {
    const fetchPrizeClaims = async () => {
      setClaimsLoading(true)
      try {
        const events = await publicClient.getContractEvents({
          address: CONTRACT_ADDRESSES.LOTTERY,
          abi: lotteryABI,
          eventName: 'PrizeClaimed',
          fromBlock: 'earliest',
          toBlock: 'latest',
          args: { gameNumber: round },
        })

        const claimsWithTimestamp = await Promise.all(
          events.map(async (event) => {
            const block = await publicClient.getBlock({ blockNumber: event.blockNumber })
            return {
              gameNumber: event.args.gameNumber,
              winner: event.args.winner,
              amount: event.args.amount,
              timestamp: Number(block.timestamp),
            }
          }),
        )

        setClaims(claimsWithTimestamp)
      } catch (error) {
        console.error('Error fetching prize claims:', error)
      } finally {
        setClaimsLoading(false)
      }
    }

    fetchPrizeClaims()
  }, [round, publicClient])

  const checkUserWinningStatus = async () => {
    if (!isConnected || !address) {
      setUserWinningStatus('Please connect your wallet to check if you won.')
      return
    }

    try {
      const userWon = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.LOTTERY,
        abi: lotteryABI,
        functionName: 'checkWinningStatus',
        args: [round, address],
      })

      setUserWinningStatus(
        userWon ? 'Congratulations! You won this game!' : 'Sorry, you did not win this game.',
      )
    } catch (error) {
      console.error('Error checking winning status:', error)
      setUserWinningStatus('An error occurred while checking your winning status.')
    }
  }

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
          <RandomNumberSection gameInfo={gameInfo} />
        </div>
        <GameInformationSection gameInfo={gameInfo} />
      </div>

      <PrizeClaimsSection
        claims={claims}
        isLoading={claimsLoading}
        userWinningStatus={userWinningStatus}
        onCheckWinning={checkUserWinningStatus}
      />
    </div>
  )
}

export default GameDetailsPage
