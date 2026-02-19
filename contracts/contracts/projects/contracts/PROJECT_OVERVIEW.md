# 🎓 Decentralized Academic Credential Verifier

> Build a system where academic achievements are issued as NFTs on Algorand

## Project Overview

A decentralized platform for issuing, managing, and verifying academic credentials as NFTs. Students can share verifiable credentials with employers without relying on institutions to respond to verification requests.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│              Frontend (React)                       │
│  ┌──────────────┬──────────────┬─────────────────┐ │
│  │ Institution  │   Student    │   Verifier      │ │
│  │ Dashboard    │   Wallet     │   Portal        │ │
│  └──────────────┴──────────────┴─────────────────┘ │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│  Algorand SDK & Smart Contracts                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ CredentialVerifier Contract                  │  │
│  │ - Issue credentials (NFT minting)            │  │
│  │ - Verify credentials                         │  │
│  │ - Store metadata                             │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│  IPFS & Web3 Services                              │
│  ┌──────────────┬──────────────┬─────────────────┐ │
│  │    IPFS      │   NFT ARC-3  │   Metadata      │ │
│  │  Documents   │   Storage    │   Storage       │ │
│  └──────────────┴──────────────┴─────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## 📋 Features

### Phase 1: MVP (Week 1-2)
- ✅ Smart Contract for credential issuance
- ✅ Institution dashboard to issue credentials
- ✅ Student wallet view
- ✅ Basic verification page
- ✅ QR code generation

### Phase 2: Enhanced (Week 2-3)
- IPFS document storage
- Full NFT metadata (ARC-3/19)
- Document viewer
- Shareable credential links
- Public verification system

### Phase 3: Production (Week 3-4)
- Testnet deployment
- Advanced verification UI
- Analytics dashboard
- Email notifications
- Resume integration

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, TypeScript, Tailwind CSS |
| **Blockchain** | Algorand, AlgoPy, AlgoKit |
| **Smart Contracts** | AlgoPy (Python) |
| **Storage** | IPFS, Pinata API |
| **NFT Standard** | ARC-3 (Fungible) or ARC-19 (Non-Fungible) |
| **QR Codes** | qrcode.react |
| **Document Viewer** | react-pdf, pdfjs-dist |
| **State Management** | Redux or Zustand |
| **Testing** | Jest, React Testing Library |

## 📁 Project Structure

```
contracts/
├── smart_contracts/
│   ├── credential_verifier/
│   │   ├── contract.py          # ✅ Core contract
│   │   └── deploy_config.py     # LocalNet deployment
│   └── artifacts/               # Compiled contracts
│
├── frontend/                     # 🆕 React app (to create)
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API & blockchain calls
│   │   ├── hooks/               # Custom hooks
│   │   └── utils/               # Helper functions
│   └── package.json
│
└── docs/                         # Documentation
    ├── SETUP.md                 # Setup guide
    ├── API.md                   # API documentation
    └── DEPLOYMENT.md            # Deployment guide
```

## 🚀 Quick Start

### Prerequisites
- Python 3.12+ (✅ Already setup)
- Node.js 18+ 
- npm or yarn
- AlgoKit (✅ Already installed)

### 1. Smart Contract (Already Done ✅)

```bash
cd contracts
source .venv/bin/activate
python -m smart_contracts build
python hackathon_demo.py
```

### 2. Setup Frontend (Next Step 🆕)

```bash
# Create React app
npx create-react-app frontend
cd frontend

# Install dependencies
npm install @algorand-foundation/algokit-utils
npm install qrcode.react
npm install react-pdf pdfjs-dist
npm install axios
```

### 3. Environment Setup

Create `frontend/.env`:
```
REACT_APP_ALGOD_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
REACT_APP_ALGOD_SERVER=http://localhost:4001
REACT_APP_INDEXER_SERVER=http://localhost:8980
REACT_APP_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

## 📚 Learning Path

1. **Week 1**: Smart Contract + Basic Frontend
2. **Week 2**: IPFS Integration + NFT Minting
3. **Week 3**: Verification System + QR Codes
4. **Week 4**: Polish + Testing + Deployment

## 🎯 Key Learnings

- ✅ Creating ARC-3/ARC-19 NFTs
- ✅ Decentralized identity concepts
- ✅ IPFS file storage
- ✅ Smart contract interaction from frontend
- ✅ Verification systems
- ✅ QR code generation & scanning

## 📖 Documentation

- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Smart Contract Docs](smart_contracts/credential_verifier/README.md)

## 🔗 Useful Links

- [Algorand Developer Docs](https://developer.algorand.org/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [ARC-3 Standard](https://arc.algorandfoundation.org/ARCs/arc-0003)
- [ARC-19 Standard](https://arc.algorandfoundation.org/ARCs/arc-0019)
- [AlgoKit Documentation](https://algorandfoundation.github.io/algokit-cli/)

## 🎓 Current Status

- ✅ Smart contract complete & tested on LocalNet
- ✅ Contract compiles successfully
- ✅ Demo script shows everything working
- 🔄 Ready for frontend integration

## 🚀 Next Steps

1. Create React frontend
2. Connect to Algorand SDK
3. Implement credential issuance UI
4. Setup IPFS storage
5. Deploy to Testnet

---

**Ready to build? Let's go! 🚀**
