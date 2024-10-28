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

export const DISCORD_URL = 'https://discord.gg/yourdiscord'

export const LOTTERY_NUMBERS_RANGE = {
  Easy: {
    min: 1,
    max: 25,
    etherball_max: 10,
  },
  Medium: {
    min: 1,
    max: 50,
    etherball_max: 10,
  },
  Hard: {
    min: 1,
    max: 75,
    etherball_max: 10,
  },
}

export const BATCH_SIZE_FOR_FETCHING = 2000n
export const MAX_TICKETS_TO_DISPLAY = 500
export const RESULTS_PAGE_SIZE = 10n

export const TIME_FORMAT = {
  PADDING: 2,
  SEPARATOR: ':',
  COMPLETED_TEXT: 'Completed!',
} as const

export const SECONDS_PER_DAY = 3600 * 24
export const SECONDS_PER_HOUR = 3600
export const SECONDS_PER_MINUTE = 60

export enum Difficulty {
  Easy = 0,
  Medium = 1,
  Hard = 2,
}
