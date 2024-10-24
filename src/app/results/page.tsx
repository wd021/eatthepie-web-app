'use client'

import { FC } from 'react'

import { LoadMoreButton, ResultsTable } from '@/components/results'
import { useLotteryResults } from '@/hooks'

const ResultsPage: FC = () => {
  const { games, hasMore, isLoading, loadMore } = useLotteryResults()

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Lottery Results</h1>
      <ResultsTable games={games} />
      <div className='mt-8 flex justify-center'>
        <LoadMoreButton isLoading={isLoading} hasMore={hasMore} onLoadMore={loadMore} />
      </div>
    </div>
  )
}

export default ResultsPage
