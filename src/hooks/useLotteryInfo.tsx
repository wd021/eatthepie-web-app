import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES } from "../config/chainConfig";
import lotteryABI from "../contracts/LotteryABI.json";

// Define the structure of the lottery info
interface LotteryInfo {
  gameNumber: bigint;
  difficulty: number;
  prizePool: bigint;
  drawTime: bigint;
  timeUntilDraw: bigint;
  ticketPrice: bigint;
}

export default function useLotteryInfo() {
  const {
    data: gameInfo,
    isError: isGameInfoError,
    isLoading: isGameInfoLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY,
    abi: lotteryABI,
    functionName: "getCurrentGameInfo",
  });

  console.log("lottery address", CONTRACT_ADDRESSES.LOTTERY);
  console.log("gameInfo", gameInfo);

  const {
    data: ticketPrice,
    isError: isTicketPriceError,
    isLoading: isTicketPriceLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY,
    abi: lotteryABI,
    functionName: "ticketPrice",
  });

  const isLoading = isGameInfoLoading || isTicketPriceLoading;
  const isError = isGameInfoError || isTicketPriceError;

  let lotteryInfo: LotteryInfo | undefined;

  if (gameInfo && ticketPrice) {
    lotteryInfo = {
      gameNumber: gameInfo[0],
      difficulty: gameInfo[1],
      prizePool: gameInfo[2],
      drawTime: gameInfo[3],
      timeUntilDraw: gameInfo[4],
      ticketPrice: ticketPrice,
    };
  }

  return {
    lotteryInfo,
    isLoading,
    isError,
  };
}
