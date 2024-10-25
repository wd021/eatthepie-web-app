import { BLOCK_EXPLORER_LINKS } from '@/utils/constants'
import { TransactionStatus } from '@/utils/types'

interface ClaimFeedbackProps {
  status: TransactionStatus
  isConfirming: boolean
  isConfirmed: boolean
  hash?: string
  error: Error | null
  onReset: () => void
}

const ClaimFeedback: React.FC<ClaimFeedbackProps> = ({
  status,
  isConfirming,
  isConfirmed,
  hash,
  error,
  onReset,
}) => {
  if (status === 'idle') return null

  const networkName = process.env
    .NEXT_PUBLIC_LOTTERY_NETWORK as keyof typeof BLOCK_EXPLORER_LINKS
  const blockExplorer = BLOCK_EXPLORER_LINKS[networkName]

  const renderEtherscanLink = () =>
    hash && (
      <a
        href={`${blockExplorer}/tx/${hash}`}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors mt-2'
      >
        <span>View on Etherscan</span>
        <svg className='w-4 h-4 ml-1' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
          <path
            d='M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path d='M15 3h6v6' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
          <path d='M10 14L21 3' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </a>
    )

  return (
    <div className='mt-4 p-4 rounded-lg border bg-white'>
      <div className={`${status === 'success' && isConfirmed ? 'text-center' : ''}`}>
        {status === 'pending' && (
          <>
            <h3 className='flex items-center text-lg font-semibold'>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3'></div>
              Waiting for Confirmation
            </h3>
            <p className='mt-2 text-gray-600'>Please confirm the transaction in your wallet</p>
          </>
        )}

        {status === 'success' && isConfirming && (
          <>
            <h3 className='flex items-center text-lg font-semibold'>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3'></div>
              Transaction in Progress
            </h3>
            <div className='mt-2'>
              <p>Your transaction has been submitted</p>
              {renderEtherscanLink()}
            </div>
          </>
        )}

        {status === 'success' && isConfirmed && (
          <div className='text-center'>
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3'>
              <svg
                className='w-6 h-6 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-green-600'>
              Prize Successfully Claimed!
            </h3>
            <div>{renderEtherscanLink()}</div>
          </div>
        )}

        {(status === 'error' || (status === 'success' && !isConfirmed && !isConfirming)) && (
          <>
            <h3 className='text-lg font-semibold text-red-600 mb-2'>
              {error?.message.includes('Transaction cancelled')
                ? 'Transaction Cancelled'
                : 'Failed to Claim Prize'}
            </h3>
            <p className='text-gray-600 mb-4'>
              Make sure you&apos;ve connected the right wallet and network
            </p>
            <button
              onClick={onReset}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                        transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ClaimFeedback
