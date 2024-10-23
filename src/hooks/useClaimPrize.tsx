import { useCallback, useState } from 'react'
import { ContractFunctionExecutionError } from 'viem'
import { usePublicClient, useWriteContract } from 'wagmi'

import { CONTRACT_ADDRESS } from '@/utils/constants'
import lotteryABI from '@/contracts/LotteryABI.json'

export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error'

interface UseClaimPrizeReturn {
  handleClaim: (gameNumber: string) => Promise<void>
  status: TransactionStatus
  isConfirming: boolean
  isConfirmed: boolean
  hash: string | undefined
  error: Error | null
  reset: () => void
}

export default function useClaimPrize(): UseClaimPrizeReturn {
  const [status, setStatus] = useState<TransactionStatus>('idle')
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [hash, setHash] = useState<string>()
  const [error, setError] = useState<Error | null>(null)

  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const reset = useCallback(() => {
    setStatus('idle')
    setIsConfirming(false)
    setIsConfirmed(false)
    setHash(undefined)
    setError(null)
  }, [])

  const handleClaim = useCallback(
    async (gameNumber: string) => {
      if (!publicClient) return

      try {
        setStatus('pending')
        setError(null)

        const hash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: lotteryABI,
          functionName: 'claimPrize',
          args: [BigInt(gameNumber)],
        })
        setHash(hash)
        setStatus('success')
        setIsConfirming(true)

        // Wait for confirmation
        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        setIsConfirming(false)
        setIsConfirmed(true)
      } catch (err) {
        setStatus('error')
        setIsConfirming(false)
        setIsConfirmed(false)

        if (err instanceof ContractFunctionExecutionError) {
          const errorMessage = err.message.toLowerCase()
          if (errorMessage.includes('already claimed')) {
            setError(new Error('Prize has already been claimed'))
          } else if (errorMessage.includes('no prize')) {
            setError(new Error('No prize to claim for this game'))
          } else if (errorMessage.includes('draw not completed')) {
            setError(new Error('Game draw has not been completed yet'))
          } else if (errorMessage.includes('user denied transaction signature')) {
            setError(new Error('Transaction cancelled'))
          } else {
            setError(new Error('Failed to claim prize. Please try again'))
          }
        } else if (
          err instanceof Error &&
          err.message.includes('User denied transaction signature')
        ) {
          setError(new Error('Transaction cancelled'))
        } else {
          setError(new Error('Failed to claim prize. Please try again'))
        }
      }
    },
    [publicClient, writeContractAsync],
  )

  return {
    handleClaim,
    status,
    isConfirming,
    isConfirmed,
    hash,
    error,
    reset,
  }
}
