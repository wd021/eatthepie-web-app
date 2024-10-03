/*
import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  encodeFunctionData,
  PublicClient,
  WalletClient,
  Address,
  Hash,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains";

// Import your contract ABIs and bytecode
import LotteryABI from "../../src/contracts/LotteryABI.json";
import LotteryBytecode from "../../src/contracts/LotteryBytecode.json";

// Anvil pre-funded account private key
const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

const publicClient: PublicClient = createPublicClient({
  chain: foundry,
  transport: http(),
});

const walletClient: WalletClient = createWalletClient({
  chain: foundry,
  transport: http(),
});

async function main() {
  console.log("Deploying contracts...");
  const VDF = await deployContract("VDFPietrzak", []);
  const NFTPrize = await deployContract("NFTPrize", []);
  const Lottery = await deployContract("Lottery", [
    VDF.address,
    NFTPrize.address,
    account.address,
  ]);

  console.log("Lottery deployed at:", Lottery.address);

  // Simulate mass ticket purchase
  console.log("Simulating mass ticket purchase...");
  const numPlayers = 1000;
  const ticketPrice = (await publicClient.readContract({
    address: Lottery.address,
    abi: LotteryABI,
    functionName: "ticketPrice",
  })) as bigint;

  for (let i = 0; i < numPlayers; i++) {
    const playerAccount = privateKeyToAccount(randomPrivateKey());

    // Fund the player
    await walletClient.sendTransaction({
      account,
      to: playerAccount.address,
      value: ticketPrice,
    });

    // Buy ticket
    await walletClient.writeContract({
      account: playerAccount,
      address: Lottery.address,
      abi: LotteryABI,
      functionName: "buyTicket",
      args: [
        [
          BigInt((i % 50) + 1),
          BigInt(((i + 1) % 50) + 1),
          BigInt(((i + 2) % 50) + 1),
        ],
        BigInt((i % 5) + 1),
      ],
      value: ticketPrice,
    });
  }

  // Fast forward time
  console.log("Fast forwarding time...");
  await publicClient.request({
    method: "evm_increaseTime",
    params: [7 * 24 * 60 * 60], // 1 week
  });
  await publicClient.request({ method: "evm_mine" });

  // Initiate draw
  console.log("Initiating draw...");
  await walletClient.writeContract({
    account,
    address: Lottery.address,
    abi: LotteryABI,
    functionName: "initiateDraw",
  });

  // Fast forward blocks
  console.log("Fast forwarding blocks...");
  for (let i = 0; i < 129; i++) {
    await publicClient.request({ method: "evm_mine" });
  }

  // Set random
  console.log("Setting random number...");
  const currentGame = (await publicClient.readContract({
    address: Lottery.address,
    abi: LotteryABI,
    functionName: "currentGameNumber",
  })) as bigint;
  await walletClient.writeContract({
    account,
    address: Lottery.address,
    abi: LotteryABI,
    functionName: "setRandom",
    args: [currentGame - 1n],
  });

  // Submit VDF proof (mocked for this simulation)
  console.log("Submitting VDF proof...");
  const v = [
    "0x0000000000000000000000000000000000000000000000000000000000000001",
  ];
  const y =
    "0x0000000000000000000000000000000000000000000000000000000000000002";
  await walletClient.writeContract({
    account,
    address: Lottery.address,
    abi: LotteryABI,
    functionName: "submitVDFProof",
    args: [currentGame - 1n, v, y],
  });

  // Calculate payouts
  console.log("Calculating payouts...");
  await walletClient.writeContract({
    account,
    address: Lottery.address,
    abi: LotteryABI,
    functionName: "calculatePayouts",
    args: [currentGame - 1n],
  });

  console.log(
    "Simulation complete. Your local Anvil chain is now set up with a full lottery cycle."
  );
  console.log(
    "You can now interact with the Lottery contract at:",
    Lottery.address
  );
}

async function deployContract(
  name: string,
  args: any[]
): Promise<{ address: Address }> {
  const deploymentData = encodeFunctionData({
    abi: parseAbi(["function constructor()"]),
    args: args,
  });

  const hash = await walletClient.deployContract({
    account,
    abi: LotteryABI,
    bytecode: `0x${LotteryBytecode}` as `0x${string}`,
    args,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  return { address: receipt.contractAddress as Address };
}

function randomPrivateKey(): `0x${string}` {
  return ("0x" +
    [...Array(64)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("")) as `0x${string}`;
}

main().catch(console.error);
*/
