import { Prize } from '@/icons'

const SearchContainer: React.FC<{
  walletAddress: string
  setWalletAddress: (address: string) => void
  gameNumber: string
  setGameNumber: (number: string) => void
  handleSearch: () => void
  isLoading: boolean
}> = ({
  walletAddress,
  setWalletAddress,
  gameNumber,
  setGameNumber,
  handleSearch,
  isLoading,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden mb-8'>
      <div className='border-b border-gray-100 px-6 py-4'>
        <div className='flex items-center space-x-3'>
          <Prize className='w-6 h-6' />
          <h2 className='text-xl font-semibold text-gray-900'>Did I Win</h2>
        </div>
      </div>
      <div className='p-6'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='wallet' className='text-sm font-medium text-gray-700 block'>
              Wallet Address
            </label>
            <div className='relative'>
              <input
                id='wallet'
                type='text'
                placeholder='0x...'
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-4 pr-10 disabled:bg-gray-50 disabled:text-gray-500'
                disabled={isLoading}
              />
              {walletAddress && (
                <button
                  onClick={() => setWalletAddress('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className='flex space-x-4'>
            <div className='flex-1'>
              <label htmlFor='game' className='text-sm font-medium text-gray-700 block'>
                Game Number
              </label>
              <input
                id='game'
                type='text'
                placeholder='Enter game number'
                value={gameNumber}
                onChange={(e) => setGameNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className='w-full mt-2 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500'
                disabled={isLoading}
              />
            </div>
            <div className='flex items-end'>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className='flex items-center justify-center min-w-[120px] p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                <svg
                  className='h-5 w-5 mr-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchContainer
