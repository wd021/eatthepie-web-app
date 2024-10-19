'use client'

import React, { useEffect, useState } from 'react'
import { formatEther } from 'viem'
import { useAccount, usePublicClient } from 'wagmi'

import { CONTRACT_ADDRESSES } from '@/config/chainConfig'
import lotteryABI from '@/contracts/LotteryABI.json'
import { useLotteryGameInfo } from '@/hooks'

interface PrizeClaim {
  gameNumber: bigint
  winner: string
  amount: bigint
  timestamp: number
}

const GameProgressSection = ({ gameInfo }: { gameInfo: any }) => {
  const steps = [
    { label: 'Game Started', completed: true, timestamp: Number(gameInfo.startTime) },
    {
      label: 'Drawing Initiated',
      completed: gameInfo.drawInitiatedBlock > 0n,
      timestamp: gameInfo.drawInitiatedBlock > 0n ? Number(gameInfo.drawInitiatedBlock) : null,
    },
    {
      label: 'RANDAO Set',
      completed: gameInfo.randaoBlock > 0n,
      timestamp: gameInfo.randaoBlock > 0n ? Number(gameInfo.randaoBlock) : null,
    },
    {
      label: 'Numbers Revealed',
      completed: gameInfo.status === 2,
      timestamp: Number(gameInfo.endTime),
    },
  ]

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm'>
      <h2 className='text-xl font-semibold mb-4'>Game Progress</h2>
      <div className='relative'>
        <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200'></div>
        {steps.map((step, index) => (
          <div key={index} className='relative flex items-center mb-8 last:mb-0'>
            <div
              className={`absolute left-4 w-8 h-8 rounded-full flex items-center justify-center border-2 -ml-4 ${
                step.completed ? 'bg-green-500 border-green-300' : 'bg-white border-gray-300'
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
                <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
              )}
            </div>
            <div className='ml-12'>
              <h4
                className={`text-sm font-semibold ${step.completed ? 'text-green-600' : 'text-gray-600'}`}
              >
                {step.label}
              </h4>
              {step.timestamp && (
                <p className='text-xs text-gray-400 mt-1'>
                  {new Date(step.timestamp * 1000).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MainInfoSection = ({ gameInfo }: { gameInfo: any }) => {
  const getStatusString = (status: number) => {
    switch (status) {
      case 0:
        return 'In Play'
      case 1:
        return 'Drawing'
      case 2:
        return 'Completed'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return 'bg-blue-100 text-blue-800'
      case 1:
        return 'bg-yellow-100 text-yellow-800'
      case 2:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm'>
      <h2 className='text-xl font-semibold mb-4'>Game Information</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <h3 className='text-lg font-semibold mb-3'>Winning Numbers</h3>
          <div className='flex space-x-3 mb-4'>
            {gameInfo.winningNumbers.map((number: number, index: number) => (
              <div
                key={index}
                className='w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-500 text-white text-lg font-bold rounded-md shadow-sm'
              >
                {number}
              </div>
            ))}
          </div>
        </div>
        <div className='space-y-4'>
          <div className='flex items-center'>
            <span className='text-sm font-medium text-gray-500 w-24'>Status:</span>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(gameInfo.status)}`}
            >
              {getStatusString(gameInfo.status)}
            </span>
          </div>
          <div className='flex items-center'>
            <span className='text-sm font-medium text-gray-500 w-24'>Prize Pool:</span>
            <span className='text-sm text-gray-900 font-semibold'>
              {formatEther(gameInfo.prizePool)} ETH
            </span>
          </div>
          <div className='flex items-center'>
            <span className='text-sm font-medium text-gray-500 w-24'>Total Winners:</span>
            <span className='text-sm text-gray-900 font-semibold'>
              {gameInfo.numberOfWinners.toString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const AdditionalInfoSection = ({ gameInfo }: { gameInfo: any }) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-sm'>
      <h2 className='text-xl font-semibold mb-4'>Additional Information</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <h3 className='text-lg font-semibold mb-2 text-blue-600'>RANDAO Information</h3>
          <p className='text-sm'>
            <span className='font-medium text-gray-500'>Block:</span>{' '}
            <span className='text-gray-900'>{gameInfo.randaoBlock.toString()}</span>
          </p>
          <p className='text-sm mt-1'>
            <span className='font-medium text-gray-500'>Value:</span>{' '}
            <span className='text-gray-900'>{gameInfo.randaoValue.toString()}</span>
          </p>
        </div>
        <div>
          <h3 className='text-lg font-semibold mb-2 text-blue-600'>Game Details</h3>
          <p className='text-sm'>
            <span className='font-medium text-gray-500'>Difficulty:</span>{' '}
            <span className='text-gray-900'>{gameInfo.difficulty}</span>
          </p>
          {/* Add more details as needed */}
        </div>
      </div>
    </div>
  )
}

const PrizeClaimsSection = ({ gameId }: { gameId: bigint }) => {
  const [claims, setClaims] = useState<PrizeClaim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userWinningStatus, setUserWinningStatus] = useState<string | null>(null)
  const publicClient = usePublicClient()
  const { address, isConnected } = useAccount()

  useEffect(() => {
    const fetchPrizeClaims = async () => {
      setIsLoading(true)
      try {
        const events = await publicClient.getContractEvents({
          address: CONTRACT_ADDRESSES.LOTTERY,
          abi: lotteryABI,
          eventName: 'PrizeClaimed',
          fromBlock: 'earliest',
          toBlock: 'latest',
          args: { gameNumber: gameId },
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
        setIsLoading(false)
      }
    }

    fetchPrizeClaims()
  }, [gameId, publicClient])

  const checkUserWinningStatus = async () => {
    if (!isConnected || !address) {
      setUserWinningStatus('Please connect your wallet to check if you won.')
      return
    }

    try {
      // This is a placeholder. You'll need to implement the actual contract call to check if the user won.
      const userWon = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.LOTTERY,
        abi: lotteryABI,
        functionName: 'checkWinningStatus',
        args: [gameId, address],
      })

      setUserWinningStatus(
        userWon ? 'Congratulations! You won this game!' : 'Sorry, you did not win this game.',
      )
    } catch (error) {
      console.error('Error checking winning status:', error)
      setUserWinningStatus('An error occurred while checking your winning status.')
    }
  }

  return (
    <div className='mt-8 bg-white shadow-md rounded-lg overflow-hidden'>
      <div className='px-6 py-4 bg-gray-50 border-b border-gray-200'>
        <h3 className='text-xl font-semibold text-gray-800'>Prize Claims</h3>
      </div>
      <div className='p-6'>
        <button
          onClick={checkUserWinningStatus}
          className='mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
        >
          Check If You Won
        </button>
        {userWinningStatus && (
          <p className='mb-4 text-sm font-medium text-blue-600'>{userWinningStatus}</p>
        )}
        {isLoading ? (
          <p className='text-center py-4'>Loading prize claims...</p>
        ) : claims.length === 0 ? (
          <p className='text-gray-500 italic'>No prizes claimed yet for this game.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Winner
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Amount
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Claimed At
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {claims.map((claim, index) => (
                  <tr
                    key={index}
                    className='hover:bg-gray-50 transition-colors duration-150 ease-in-out'
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {claim.winner}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatEther(claim.amount)} ETH
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(claim.timestamp * 1000).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const GameDetailsPage = ({ params: { round } }: { params: { round: bigint } }) => {
  const { gameInfo, isLoading, isError } = useLotteryGameInfo(round)

  if (isLoading) return <div className='text-center py-8'>Loading...</div>
  if (isError)
    return <div className='text-center py-8 text-red-600'>Error fetching game details</div>
  if (!gameInfo) return <div className='text-center py-8'>No game information available</div>

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Game #{round.toString()}</h1>
      </div>
      <div className='space-y-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <GameProgressSection gameInfo={gameInfo} />
          <MainInfoSection gameInfo={gameInfo} />
        </div>
        <AdditionalInfoSection gameInfo={gameInfo} />
        <PrizeClaimsSection gameId={round} />
      </div>
    </div>
  )
}

export default GameDetailsPage
