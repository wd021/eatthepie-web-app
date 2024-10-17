'use client'

import React, { useEffect, useState } from 'react'
import { formatEther } from 'viem'
import { usePublicClient } from 'wagmi'

import { CONTRACT_ADDRESSES } from '@/config/chainConfig'
import lotteryABI from '@/contracts/LotteryABI.json'
import { useLotteryGameInfo } from '@/hooks'

interface PrizeClaim {
  gameNumber: bigint
  winner: string
  amount: bigint
  timestamp: number
}

const GameDetailsComponent = ({ gameId }: { gameId: bigint }) => {
  const { gameInfo, isLoading, isError } = useLotteryGameInfo(gameId)

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching game details</div>
  if (!gameInfo) return <div>No game information available</div>

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

  const renderWinningNumbers = () => {
    // if (gameInfo.status !== 2 || gameInfo.winningNumbers.length === 0) return null

    // const [main, etherball] = [
    //   gameInfo.winningNumbers.slice(0, -1),
    //   gameInfo.winningNumbers.slice(-1),
    // ]
    return (
      <div className='mt-6'>
        <h3 className='text-xl font-semibold mb-2'>Winning Numbers</h3>
        <div className='flex justify-center space-x-4'>
          {[4, 3, 5].map((num, index) => (
            <div
              key={index}
              className='bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-semibold'
            >
              {num.toString()}
            </div>
          ))}
          <div className='bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-semibold'>
            {'4'.toString()}
          </div>
        </div>
      </div>
    )
  }

  const renderGameProgress = () => {
    const steps = [
      { label: 'Game Started', completed: true },
      { label: 'Drawing Initiated', completed: gameInfo.drawInitiatedBlock > 0n },
      { label: 'RANDAO Set', completed: gameInfo.randaoBlock > 0n },
      { label: 'Numbers Revealed', completed: gameInfo.status === 2 },
    ]

    return (
      <div className='mt-8'>
        <h3 className='text-xl font-semibold mb-4'>Game Progress</h3>
        <div className='flex justify-between items-center'>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div
                className={`flex flex-col items-center ${step.completed ? 'text-green-600' : 'text-gray-400'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full ${step.completed ? 'bg-green-600' : 'bg-gray-300'} flex items-center justify-center text-white font-bold`}
                >
                  {index + 1}
                </div>
                <span className='mt-2 text-sm'>{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 ${step.completed ? 'bg-green-600' : 'bg-gray-300'}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h2 className='text-4xl font-bold text-center mb-8'>
        Round #{gameInfo.gameId.toString()}
      </h2>

      {renderWinningNumbers()}
      {renderGameProgress()}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
        <div className='bg-white shadow rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-2'>Game Details</h3>
          <p>
            <strong>Status:</strong> {getStatusString(gameInfo.status)}
          </p>
          <p>
            <strong>Difficulty:</strong> {gameInfo.difficulty}
          </p>
          <p>
            <strong>Prize Pool:</strong> {formatEther(gameInfo.prizePool)} ETH
          </p>
          <p>
            <strong>Total Winners:</strong> {gameInfo.numberOfWinners.toString()}
          </p>
        </div>

        <div className='bg-white shadow rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-2'>RANDAO Information</h3>
          <p>
            <strong>RANDAO Block:</strong> {gameInfo.randaoBlock.toString()}
          </p>
          <p>
            <strong>RANDAO Value:</strong> {gameInfo.randaoValue.toString()}
          </p>
        </div>

        <div className='bg-white shadow rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-2'>Payout Information</h3>
          {/* <p>
            <strong>Gold:</strong> {formatEther(gameInfo.payouts.gold)} ETH
          </p>
          <p>
            <strong>Silver:</strong> {formatEther(gameInfo.payouts.silver)} ETH
          </p>
          <p>
            <strong>Bronze:</strong> {formatEther(gameInfo.payouts.bronze)} ETH
          </p> */}
        </div>
      </div>
    </div>
  )
}

const PrizeClaimsComponent = ({ gameId }: { gameId: bigint }) => {
  const [claims, setClaims] = useState<PrizeClaim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const publicClient = usePublicClient()

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
          args: {
            gameNumber: gameId,
          },
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

  if (isLoading) return <div>Loading prize claims...</div>

  return (
    <div className='mt-8'>
      <h3 className='text-2xl font-semibold mb-4'>Prize Claims</h3>
      {claims.length === 0 ? (
        <p>No prizes claimed yet for this game.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white'>
            <thead className='bg-gray-100'>
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
            <tbody className='divide-y divide-gray-200'>
              {claims.map((claim, index) => (
                <tr key={index}>
                  <td className='px-6 py-4 whitespace-nowrap'>{claim.winner}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {formatEther(claim.amount)} ETH
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {new Date(claim.timestamp * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const GameDetailsPage = ({ params: { round } }: { params: { round: bigint } }) => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <GameDetailsComponent gameId={round} />
      <PrizeClaimsComponent gameId={round} />
    </div>
  )
}

export default GameDetailsPage
