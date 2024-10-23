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
  winningNumbers: bigint[]
  difficulty: number
  drawInitiatedBlock: bigint
  randaoBlock: bigint
  randaoValue: bigint
  payouts: {
    gold: bigint
    silver: bigint
    bronze: bigint
  }
}
