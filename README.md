# Polls Dapp

A decentralized voting application built on Algorand blockchain.

<img src="https://raw.githubusercontent.com/osmannyildiz/AlgorandPollsDapp/main/_meta/ss01.png" alt="Screenshot" height="720">

## Features

- Create polls with 2-5 customizable options
- One vote per wallet address
- On-chain poll storage using Algorand box storage
- Wallet integration (Pera, Defly, Lute)

## Prerequisites

- [Docker](https://www.docker.com/) - Required for local Algorand node
- [AlgoKit](https://github.com/algorandfoundation/algokit-cli#install) - Algorand development toolkit
- [Node.js](https://nodejs.org/) >= 20.0
- [Python](https://www.python.org/) >= 3.10

## Project Structure

- `projects/polls-dapp-contracts/` - Python smart contracts using AlgoPy
- `projects/polls-dapp-frontend/` - React frontend with Vite and Tailwind CSS
- `projects/polls-dapp-frontend/src/contracts/` - Auto-generated TypeScript clients for smart contracts

## Setup

1. Start localnet node
   ```bash
   algokit localnet start
   ```

2. Clone the repository
   ```bash
   git clone <repository-url>
   cd polls-dapp
   ```

3. Bootstrap the project
   ```bash
   algokit project bootstrap all
   ```

4. Generate environment files for contracts project
   ```bash
   cd projects/polls-dapp-contracts
   algokit generate env-file -a target_network localnet
   cd ../..
   ```

5. Build all projects
   ```bash
   algokit project run build
   ```

6. Deploy contract to localnet
   ```bash
   algokit project deploy localnet
   ```

7. Update `POLL_MANAGER_CREATOR_ADDRESS` value in `projects/polls-dapp-frontend/src/contracts/config.ts`

8. Generate environment files for frontend project
   ```bash
   cd ../polls-dapp-frontend
   cp .env.template .env
   ```

9. Start the frontend development server
   ```bash
   npm run dev
   ```

## Tips

- Lute Wallet is the best for development.
- Instead of using `algokit project run build` to build all projects (including frontend, which can take a long time), you can use `algokit project run build -t contract` to build only the contracts.
- You can use `algokit localnet console` to interact with the localnet node running on Docker. Inside it, you can use the `goal` command for various tasks.
  - `goal wallet list`: Lists wallets on the localnet.
  - `goal account list -w DEPLOYER`: Gives the address of the default deployer wallet.
  - `goal account balance -a <ADDRESS>`: Shows the balance of an account.
- On localnet, you can fund your new accounts from the explorer's [Fund page](https://lora.algokit.io/localnet/fund).
- Use `algokit localnet reset` to erase and restart the localnet node.
- Algorand's docs kinda suck, but they have a chatbot developed by kapa.ai which is actually useful for finding answers to your questions. You can access it using the "Ask AI" button on the bottom right of the [docs page](https://dev.algorand.co/getting-started/introduction/).
