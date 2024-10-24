import { AnimatePresence, motion } from 'framer-motion'

import { Close } from '@/icons'
import { BLOCK_EXPLORER_LINKS } from '@/utils/constants'

const Transaction: React.FC<{
  ticketCount: number
  status: string
  isConfirming: boolean
  isConfirmed: boolean
  hash: `0x${string}` | undefined
  error: Error | null
  onRequestClose: () => void
  onReset: () => void
}> = ({
  ticketCount,
  status,
  isConfirming,
  isConfirmed,
  hash,
  error,
  onRequestClose,
  onReset,
}) => {
  if (status === 'idle') return null

  const networkName = process.env.NEXT_PUBLIC_NETWORK_NAME as keyof typeof BLOCK_EXPLORER_LINKS
  const blockExplorer = BLOCK_EXPLORER_LINKS[networkName]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className='absolute inset-0 bg-white flex flex-col items-center justify-center z-50 p-6 rounded-[15px]'
      >
        <button
          onClick={onRequestClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors'
        >
          <Close className='w-6 h-6' />
        </button>

        {status === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center'
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className='rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6'
            />
            <h2 className='text-2xl font-bold'>Purchasing your tickets</h2>
            <p className='text-lg'>Please confirm the transaction in your wallet</p>
          </motion.div>
        )}

        {status === 'success' && isConfirming && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center'
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className='rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6'
            />
            <h2 className='text-2xl font-bold'>Transaction Sent</h2>
            <p className='text-lg'>Waiting for confirmation...</p>
            {hash && (
              <a
                href={`${blockExplorer}/tx/${hash}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 hover:underline mt-2 inline-block'
              >
                View on Etherscan
              </a>
            )}
          </motion.div>
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
                href={`${blockExplorer}/tx/${hash}`}
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
      </motion.div>
    </AnimatePresence>
  )
}

export default Transaction
