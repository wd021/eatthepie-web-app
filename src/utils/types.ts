import { Abi, Log } from 'viem'

export type GameInfo = [bigint, number, bigint, bigint, bigint]

export type LotteryInfo = {
  gameNumber: number
  difficulty: string
  prizePool: string
  drawTime: string
  timeUntilDraw: string
  secondsUntilDraw: number
  ticketPrice: string
  ticketsSold: string
}

export type GameDetailedInfo = {
  gameId: bigint
  status: number
  prizePool: bigint
  numberOfWinners: bigint
  goldWinners: bigint
  silverWinners: bigint
  bronzeWinners: bigint
  winningNumbers: bigint[]
  difficulty: number
  drawInitiatedBlock: bigint
  randaoBlock: bigint
  randaoValue: bigint
  payouts: bigint[]
}

export type Ticket = {
  player: string
  gameNumber: number
  numbers: number[]
  blockNumber: bigint
  transactionHash: `0x${string}`
}

export type BasicTicket = Omit<Ticket, 'timestamp' | 'blockNumber'>

export type WinningInfo = {
  goldWin: boolean
  silverWin: boolean
  bronzeWin: boolean
  totalPrize: string
  claimed: boolean
}

export type ContractWinningsResult = [boolean, boolean, boolean, bigint, boolean]

export type UseWinningInfoParams = {
  gameNumber: string
  walletAddress: string
  shouldFetch: boolean
}

export type UseWinningInfoResult = {
  winningInfo: WinningInfo | undefined
  isError: boolean
  isLoading: boolean
}

export type TicketPurchasedEvent = {
  player: string
  gameNumber: bigint
  numbers: readonly bigint[]
  etherball: bigint
}

export type TicketPurchasedLog = Log<bigint, number, false, undefined, true, Abi> & {
  args: TicketPurchasedEvent
}

export type GameBasicInfo = {
  gameId: bigint
  status: number
  prizePool: bigint
  numberOfWinners: bigint
  winningNumbers: bigint[]
}

export type UseLotteryResultsReturn = {
  games: GameBasicInfo[]
  hasMore: boolean
  isLoading: boolean
  loadMore: () => void
  error: string | null
}

export type TimeParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export type UseContractResult<T> = {
  data: T | undefined
  isError: boolean
  isLoading: boolean
}

export type UseLotteryInfoResult = {
  lotteryInfo: LotteryInfo | undefined
  isLoading: boolean
  isError: boolean
}

export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error'

export type UseClaimPrizeReturn = {
  handleClaim: (gameNumber: string) => Promise<void>
  status: TransactionStatus
  isConfirming: boolean
  isConfirmed: boolean
  hash: string | undefined
  error: Error | null
  reset: () => void
}
