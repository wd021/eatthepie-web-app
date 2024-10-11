if (!process.env.NEXT_PUBLIC_LOTTERY_ADDRESS) {
  throw new Error('NEXT_PUBLIC_LOTTERY_ADDRESS is not set in environment variables')
}

export const CONTRACT_ADDRESSES = {
  LOTTERY: process.env.NEXT_PUBLIC_LOTTERY_ADDRESS as `0x${string}`,
}
