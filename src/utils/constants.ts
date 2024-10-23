if (!process.env.NEXT_PUBLIC_LOTTERY_ADDRESS) {
  throw new Error('NEXT_PUBLIC_LOTTERY_ADDRESS is not set in environment variables')
}

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS as `0x${string}`

export const NETWORK_NAMES = {
  mainnet: 'Ethereum Mainnet',
  sepolia: 'Sepolia',
  anvil: 'Anvil',
}

export const BLOCK_EXPLORER_LINKS = {
  mainnet: 'https://www.etherscan.io/',
  sepolia: 'https://sepolia.etherscan.io/',
  anvil: 'https://www.etherscan.io/',
}

export const LOTTERY_NUMBERS_RANGE = {
  Easy: {
    min: 1,
    max: 50,
    etherball_max: 5,
  },
  Medium: {
    min: 1,
    max: 100,
    etherball_max: 10,
  },
  Hard: {
    min: 1,
    max: 150,
    etherball_max: 15,
  },
}

export const BATCH_SIZE_FOR_FETCHING = 2000n
export const MAX_TICKETS_TO_DISPLAY = 500
