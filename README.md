# 🎨 NFT Minting DApp

A full-stack decentralized application (DApp) for minting and managing NFTs (Non-Fungible Tokens) built with **Hardhat**, **Next.js**, and **Ethereum**.
![WhatsApp Image 2025-07-28 at 20 10 15_ab7169b9](https://github.com/user-attachments/assets/ee2862a5-3309-4491-a6e1-efbfba20d0ee)

## ✨ Features

- **🔗 Wallet Integration**: Connect MetaMask wallet seamlessly
- **🎨 NFT Minting**: Create and mint unique NFTs with custom metadata
- **📁 File Upload**: Upload images and metadata to IPFS
- **👤 User Dashboard**: View and manage your owned NFTs
- **🔍 NFT Gallery**: Browse all minted NFTs
- **⚡ Real-time Updates**: Instant updates when NFTs are minted
- **🎯 Gas Optimization**: Efficient smart contract design
- **📱 Responsive Design**: Works on desktop and mobile devices

## 🏗️ Tech Stack

### Backend (Blockchain)
- **Hardhat**: Ethereum development environment
- **Solidity**: Smart contract language
- **OpenZeppelin**: Secure smart contract libraries
- **Ethers.js**: Ethereum library for JavaScript

### Frontend
- **Next.js 14**: React framework with App Router
- **React**: UI library
- **Tailwind CSS**: Styling framework
- **React Hot Toast**: Notifications
- **IPFS**: Decentralized file storage

## 📁 Project Structure

```
nft-minting-dapp/
├── contracts/           # Smart contracts
│   └── MyNFT.sol       # Main NFT contract
├── frontend/           # Next.js frontend
│   ├── src/
│   │   ├── app/        # Next.js app router
│   │   ├── components/ # React components
│   │   └── config/     # Contract configuration
│   └── public/         # Static assets
├── test/               # Smart contract tests
├── ignition/           # Deployment scripts
└── utils/              # Utility functions
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zain-imran-dev/Nft-minting-Dapp.git
   cd Nft-minting-Dapp
   ```

2. **Install dependencies**
   ```bash
   # Install Hardhat dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Deploy smart contract**
   ```bash
   # Start local Hardhat node
   npx hardhat node
   
   # In a new terminal, deploy the contract
   npx hardhat ignition deploy ./ignition/modules/MyNFT.js --network localhost
   ```

4. **Update contract address**
   - Copy the deployed contract address
   - Update `frontend/src/config/contract.js` with the new address

5. **Start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open the application**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Connect your MetaMask wallet
   - Start minting NFTs!

## 🎯 How to Use

### Connecting Wallet
1. Click "Connect Wallet" button
2. Approve MetaMask connection
3. Your wallet address will be displayed

### Minting an NFT
1. Fill in the NFT details:
   - **Name**: Your NFT's name
   - **Description**: Description of your NFT
   - **Image**: Upload an image file
2. Click "Mint NFT"
3. Confirm the transaction in MetaMask
4. Wait for confirmation
5. Your NFT will appear in your collection!

### Viewing NFTs
- **My NFTs**: View all NFTs you own
- **All NFTs**: Browse all minted NFTs in the collection

## 🔧 Development

### Smart Contract Development
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Deploy to local network
npx hardhat ignition deploy ./ignition/modules/MyNFT.js --network localhost
```

### Frontend Development
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Smart Contract

The main contract `MyNFT.sol` includes:

- **ERC721 Standard**: Compliant with OpenZeppelin's ERC721 implementation
- **Minting Function**: Create new NFTs with metadata
- **Token URI**: IPFS-based metadata storage
- **Owner Tracking**: Track NFT ownership
- **Batch Operations**: Efficient batch minting capabilities

## 🧪 Testing

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/MyNFT.test.js

# Run tests with coverage
npx hardhat coverage
```

## 🌐 Deployment

### Deploy to Testnet (Sepolia/Goerli)
1. Get testnet ETH from a faucet
2. Update `hardhat.config.js` with your private key
3. Deploy: `npx hardhat ignition deploy ./ignition/modules/MyNFT.js --network sepolia`

### Deploy to Mainnet
1. Ensure you have sufficient ETH for gas
2. Update configuration for mainnet
3. Deploy: `npx hardhat ignition deploy ./ignition/modules/MyNFT.js --network mainnet`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Hardhat](https://hardhat.org/) for Ethereum development environment
- [Next.js](https://nextjs.org/) for the React framework
- [IPFS](https://ipfs.io/) for decentralized file storage



⭐ **Star this repository if you found it helpful!**
