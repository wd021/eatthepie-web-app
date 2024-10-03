export type GameInfo = [bigint, number, bigint, bigint, bigint];

export type LotteryInfo = {
  gameNumber: number;
  difficulty: string;
  prizePool: string;
  drawTime: string;
  timeUntilDraw: string;
  secondsUntilDraw: number;
  ticketPrice: string;
};
