import {
  createPublicClient,
  createTestClient,
  createWalletClient,
  encodeFunctionData,
  http,
  parseEther,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { foundry } from 'viem/chains'
import { localhost } from 'viem/chains'
// Import your contract ABIs and bytecode
// import LotteryABI from '../../src/contracts/LotteryABI.json'
// import LotteryBytecode from '../../src/contracts/LotteryBytecode.json'

const LotteryABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_vdfContractAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_nftPrizeAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_feeRecipient',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'receive',
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'BLOCKS_PER_YEAR',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'BRONZE_PLACE_PERCENTAGE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'DRAW_DELAY_SECURITY_BUFFER',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'DRAW_MIN_PRIZE_POOL',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'DRAW_MIN_TIME_PERIOD',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'EASY_ETHERBALL_MAX',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'EASY_MAX',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'FEE_MAX_IN_ETH',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'FEE_PERCENTAGE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'GOLD_PERCENTAGE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'HARD_ETHERBALL_MAX',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'HARD_MAX',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'LOYALTY_PERCENTAGE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MEDIUM_ETHERBALL_MAX',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MEDIUM_MAX',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'SILVER_PLACE_PERCENTAGE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'bronzeTicketCounts',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'bronzeTicketOwners',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'buyBulkTickets',
    inputs: [
      {
        name: 'tickets',
        type: 'uint256[4][]',
        internalType: 'uint256[4][]',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'buyTicket',
    inputs: [
      {
        name: 'numbers',
        type: 'uint256[3]',
        internalType: 'uint256[3]',
      },
      {
        name: 'etherball',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'calculatePayouts',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'changeDifficulty',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimPrize',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'consecutiveJackpots',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'consecutiveNoJackpots',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'currentGameNumber',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'distributeLoyaltyPrize',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'addresses',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'feeRecipient',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'gameDifficulty',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'enum Lottery.Difficulty',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'gameDrawCompleted',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'gameDrawInitiated',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'gameDrawnBlock',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'gameJackpotWon',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'gamePayouts',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'gamePrizePool',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'gameRandomBlock',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'gameRandomValue',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'gameVDFValid',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'gameWinningNumbers',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getCurrentGameInfo',
    inputs: [],
    outputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'difficulty',
        type: 'uint8',
        internalType: 'enum Lottery.Difficulty',
      },
      {
        name: 'prizePool',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'drawTime',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'timeUntilDraw',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'goldTicketCounts',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'goldTicketOwners',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hasClaimedNFT',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initiateDraw',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'lastDifficultyChangeGame',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'lastDrawTime',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'mintWinningNFT',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'newDifficulty',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'enum Lottery.Difficulty',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'newDifficultyGame',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'newTicketPrice',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'newTicketPriceGameNumber',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'newVDFContract',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'newVDFContractGameNumber',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nftPrize',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract NFTPrize',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'playerLoyaltyCount',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'prizesClaimed',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'prizesLoyaltyDistributed',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'releaseUnclaimedPrizes',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setFeeRecipient',
    inputs: [
      {
        name: '_newFeeRecipient',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setNewVDFContract',
    inputs: [
      {
        name: '_newVDFContract',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setRandom',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setTicketPrice',
    inputs: [
      {
        name: '_newPrice',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'silverTicketCounts',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'silverTicketOwners',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'submitVDFProof',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'v',
        type: 'tuple[]',
        internalType: 'struct BigNumber[]',
        components: [
          {
            name: 'val',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'bitlen',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'y',
        type: 'tuple',
        internalType: 'struct BigNumber',
        components: [
          {
            name: 'val',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'bitlen',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'ticketPrice',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'vdfContract',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract VDFPietrzak',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'verifyPastGameVDF',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'v',
        type: 'tuple[]',
        internalType: 'struct BigNumber[]',
        components: [
          {
            name: 'val',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'bitlen',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'y',
        type: 'tuple',
        internalType: 'struct BigNumber',
        components: [
          {
            name: 'val',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'bitlen',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'calculatedNumbers',
        type: 'uint256[4]',
        internalType: 'uint256[4]',
      },
      {
        name: 'isValid',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'DifficultyChanged',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'newDifficulty',
        type: 'uint8',
        indexed: false,
        internalType: 'enum Lottery.Difficulty',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'DrawInitiated',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'targetSetBlock',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'FeeRecipientChanged',
    inputs: [
      {
        name: 'newFeeRecipient',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GamePrizePayoutInfo',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'goldPrize',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'silverPrize',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'bronzePrize',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'loyaltyPrize',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LoyaltyPrizeDistributed',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'winners',
        type: 'address[]',
        indexed: false,
        internalType: 'address[]',
      },
      {
        name: 'prizePerWinner',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'NFTMinted',
    inputs: [
      {
        name: 'winner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'gameNumber',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PrizeClaimed',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'player',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PrizesDistributed',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RandomSet',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'random',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TicketPriceChangeScheduled',
    inputs: [
      {
        name: 'newPrice',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'effectiveGameNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TicketPurchased',
    inputs: [
      {
        name: 'player',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'gameNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'numbers',
        type: 'uint256[3]',
        indexed: false,
        internalType: 'uint256[3]',
      },
      {
        name: 'etherball',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TicketsPurchased',
    inputs: [
      {
        name: 'player',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'gameNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'ticketCount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UnclaimedPrizeTransferred',
    inputs: [
      {
        name: 'fromGame',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'toGame',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UnclaimedPrizesReleased',
    inputs: [
      {
        name: 'fromGame',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'toGame',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'VDFProofSubmitted',
    inputs: [
      {
        name: 'submitter',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'gameNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WinningNumbersSet',
    inputs: [
      {
        name: 'gameNumber',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'number1',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'number2',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'number3',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'etherball',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ReentrancyGuardReentrantCall',
    inputs: [],
  },
]

// Setup clients
const publicClient = createPublicClient({
  chain: foundry,
  mode: 'anvil',
  transport: http(),
})

export const testClient = createTestClient({
  chain: foundry,
  mode: 'anvil',
  transport: http(),
})

// Replace with your private key
const PRIVATE_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
const account = privateKeyToAccount(PRIVATE_KEY)
const walletClient = createWalletClient({
  account,
  chain: foundry,
  mode: 'anvil',
  transport: http(),
})

// Replace with your deployed lottery contract address
const LOTTERY_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

const TICKET_PRICE = parseEther('0.1')

async function buyTicket(numbers, etherball) {
  try {
    const balance = await publicClient.getBalance({ address: account.address })
    console.log(`Account balance: ${balance}`)
    console.log(`Ticket price: ${TICKET_PRICE}`)

    const gasEstimate = await publicClient.estimateGas({
      account: account.address,
      to: LOTTERY_ADDRESS,
      value: TICKET_PRICE,
      data: encodeFunctionData({
        abi: LotteryABI,
        functionName: 'buyTicket',
        args: [numbers, etherball],
      }),
    })
    console.log(`Estimated gas: ${gasEstimate}`)

    const { request } = await publicClient.simulateContract({
      account: account.address,
      address: LOTTERY_ADDRESS,
      abi: LotteryABI,
      functionName: 'buyTicket',
      args: [numbers, etherball],
      value: TICKET_PRICE,
    })

    const hash = await walletClient.writeContract(request)
    console.log(`Ticket bought. Transaction hash: ${hash}`)
    return hash
  } catch (error) {
    console.error('Error buying ticket:', error)
    throw error
  }
}

async function advanceTime(seconds) {
  await testClient.increaseTime({ seconds })
  console.log(`Advanced time by ${seconds} seconds`)
}

async function advanceBlocks(blocks) {
  await testClient.mine({ blocks })
  console.log(`Mined ${blocks} new blocks`)
}

async function initiateDraw() {
  const { request } = await publicClient.simulateContract({
    address: LOTTERY_ADDRESS,
    abi: LotteryABI,
    functionName: 'initiateDraw',
  })
  const hash = await walletClient.writeContract(request)
  console.log(`Draw initiated. Transaction hash: ${hash}`)
}

async function setRandom(gameNumber) {
  const { request } = await publicClient.simulateContract({
    address: LOTTERY_ADDRESS,
    abi: LotteryABI,
    functionName: 'setRandom',
    args: [gameNumber],
  })
  const hash = await walletClient.writeContract(request)
  console.log(`Random number set for game ${gameNumber}. Transaction hash: ${hash}`)
}

async function submitVDFProof(gameNumber, v, y) {
  const { request } = await publicClient.simulateContract({
    address: LOTTERY_ADDRESS,
    abi: LotteryABI,
    functionName: 'submitVDFProof',
    args: [gameNumber, v, y],
  })
  const hash = await walletClient.writeContract(request)
  console.log(`VDF proof submitted for game ${gameNumber}. Transaction hash: ${hash}`)
}

async function calculatePayouts(gameNumber) {
  const { request } = await publicClient.simulateContract({
    address: LOTTERY_ADDRESS,
    abi: LotteryABI,
    functionName: 'calculatePayouts',
    args: [gameNumber],
  })
  const hash = await walletClient.writeContract(request)
  console.log(`Payouts calculated for game ${gameNumber}. Transaction hash: ${hash}`)
}

async function claimPrize(gameNumber) {
  const { request } = await publicClient.simulateContract({
    address: LOTTERY_ADDRESS,
    abi: LotteryABI,
    functionName: 'claimPrize',
    args: [gameNumber],
  })
  const hash = await walletClient.writeContract(request)
  console.log(`Prize claimed for game ${gameNumber}. Transaction hash: ${hash}`)
}

async function distributeLoyaltyPrize(gameNumber, bronzeWinners) {
  const { request } = await publicClient.simulateContract({
    address: LOTTERY_ADDRESS,
    abi: LotteryABI,
    functionName: 'distributeLoyaltyPrize',
    args: [gameNumber, bronzeWinners],
  })
  const hash = await walletClient.writeContract(request)
  console.log(`Loyalty prize distributed for game ${gameNumber}. Transaction hash: ${hash}`)
}

// Main execution
// async function main() {
//   const args = process.argv.slice(2)
//   const command = args[0]

//   switch (command) {
//     case 'buyTicket':
//       await buyTicket([Number(args[1]), Number(args[2]), Number(args[3])], Number(args[4]))
//       break
//     case 'advanceTime':
//       await advanceTime(Number(args[1]))
//       break
//     case 'advanceBlocks':
//       await advanceBlocks(Number(args[1]))
//       break
//     case 'initiateDraw':
//       await initiateDraw()
//       break
//     case 'setRandom':
//       await setRandom(BigInt(args[1]))
//       break
//     case 'submitVDFProof':
//       await submitVDFProof(BigInt(args[1]), args[2].split(','), args[3])
//       break
//     case 'calculatePayouts':
//       await calculatePayouts(BigInt(args[1]))
//       break
//     case 'claimPrize':
//       await claimPrize(BigInt(args[1]))
//       break
//     case 'distributeLoyaltyPrize':
//       await distributeLoyaltyPrize(BigInt(args[1]), args[2].split(','))
//       break
//     default:
//       console.log('Unknown command')
//   }
// }

// main().catch(console.error)

// Buy Ticket
buyTicket([1, 2, 3], 4)
  .then((hash) => console.log('Transaction successful:', hash))
  .catch((error) => console.error('Transaction failed:', error))
