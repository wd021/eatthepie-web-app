![Eat The Pie](https://github.com/eatthepie/docs/blob/main/static/img/header.png)

# Eat The Pie DApp

Frontend interface where users can participate in Eat The Pie, the world lottery on Ethereum.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18.0.0 or higher)
- npm or yarn
- MetaMask or another Web3 wallet
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/eatthepie/web-app.git
cd web-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_NETWORK_NAME=mainnet,seploia
NEXT_PUBLIC_LOTTERY_ADDRESS=0x....
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Smart Contract Integration

The application interacts with an Ethereum smart contract deployed at `NEXT_PUBLIC_LOTTERY_ADDRESS`. The contract handles:

- Ticket purchases
- Claiming prizes
- Viewing game state

## License

This project is licensed under the MIT License
