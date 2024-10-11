import { Address } from 'viem'

type ContractAddresses = {
  [chainId: number]: {
    lottery: Address
  }
}

export const CONTRACT_ADDRESSES: ContractAddresses = {
  1: {
    // Mainnet
    lottery: '0x...' as Address,
  },
  11155111: {
    // Sepolia
    lottery: '0x...' as Address,
  },
  31337: {
    // Anvil
    lottery: '0x...' as Address, // This will be set dynamically in your simulation script
  },
}
