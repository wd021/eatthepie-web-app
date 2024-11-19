import { WinningInfo } from '@/utils/types'

interface ResultsSectionProps {
  winningInfo: WinningInfo
  handleClaim: () => Promise<void>
}

const ClaimResults: React.FC<ResultsSectionProps> = ({ winningInfo, handleClaim }) => {
  if (!winningInfo) return null

  const { goldWin, silverWin, bronzeWin, totalPrize, claimed } = winningInfo
  const hasWon = goldWin || silverWin || bronzeWin

  const PrizeRow = ({ type, won }: { type: 'gold' | 'silver' | 'bronze'; won: boolean }) => {
    const styles = {
      gold: {
        icon: '🏆',
        title: 'Gold',
        description: 'All numbers matched',
      },
      silver: {
        icon: '🥈',
        title: 'Silver',
        description: '3 in-a-row',
      },
      bronze: {
        icon: '🥉',
        title: 'Bronze',
        description: '2 in-a-row',
      },
    }

    return (
      <div
        className={`flex items-center p-4 border rounded-lg transition-all duration-200 ${
          won ? 'bg-green-50 border-green-200 shadow-sm' : 'border-gray-100'
        }`}
      >
        <div className='flex items-center flex-1'>
          <span className='text-2xl mr-3'>{styles[type].icon}</span>
          <div>
            <span className={`font-medium block ${won ? 'text-gray-900' : 'text-gray-400'}`}>
              {styles[type].title}
            </span>
            <span className={`text-sm ${won ? 'text-gray-600' : 'text-gray-400'}`}>
              {styles[type].description}
            </span>
          </div>
        </div>
        {won && (
          <div className='flex items-center text-green-600'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div className='border-b border-gray-100 px-6 py-4'>
        <div className='flex items-center space-x-2'>
          <svg
            className='w-6 h-6 text-green-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <h2 className='text-xl font-semibold text-gray-900'>Results</h2>
        </div>
      </div>

      {hasWon ? (
        <div>
          <div className='p-6 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <div className='flex items-center space-x-2'>
                  <span className='text-2xl'>🎉</span>
                  <h3 className='text-lg font-medium text-gray-900'>Congratulations!</h3>
                </div>
                <div className='mt-1 flex items-baseline space-x-2'>
                  <span className='text-2xl font-bold text-green-600'>
                    {Number(totalPrize).toLocaleString()} WLD
                  </span>
                  <span className='text-sm text-gray-500'>Prize Value</span>
                </div>
              </div>

              <div className='flex items-center'>
                {claimed ? (
                  <div className='px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium inline-flex items-center'>
                    <svg
                      className='w-4 h-4 mr-1.5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    Prize Claimed
                  </div>
                ) : (
                  <button
                    onClick={handleClaim}
                    className='inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg
                             hover:bg-green-700 transition-colors duration-150
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                  >
                    <span>Claim Prize</span>
                    <svg
                      className='ml-2 w-4 h-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 7l5 5m0 0l-5 5m5-5H6'
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='p-6'>
            <div className='mb-4'>
              <h4 className='text-sm font-medium text-gray-500'>Prize Breakdown</h4>
            </div>
            <div className='space-y-3'>
              <PrizeRow type='gold' won={goldWin} />
              <PrizeRow type='silver' won={silverWin} />
              <PrizeRow type='bronze' won={bronzeWin} />
            </div>
          </div>
        </div>
      ) : (
        <div className='px-6 py-12 text-center'>
          <div className='w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4'>
            <svg
              className='w-6 h-6 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-1'>No Prizes Found</h3>
          <p className='text-gray-500'>
            We couldn&apos;t find any prizes for this wallet and game number
          </p>
        </div>
      )}
    </div>
  )
}

export default ClaimResults
