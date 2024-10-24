import { FC } from 'react'

const LoadMoreButton: FC<{
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
}> = ({ isLoading, hasMore, onLoadMore }) => {
  if (isLoading) {
    return (
      <div className='flex items-center'>
        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500'></div>
        <span className='ml-2 text-sm text-gray-600'>Loading...</span>
      </div>
    )
  }

  if (!hasMore) {
    return <p className='text-gray-500'>No more results to load.</p>
  }

  return (
    <button
      className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center'
      onClick={onLoadMore}
      disabled={isLoading}
    >
      Load More
      <svg
        className='ml-2 w-5 h-5'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
      </svg>
    </button>
  )
}

export default LoadMoreButton
