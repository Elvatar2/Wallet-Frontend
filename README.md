# 🏦 Smart Wallet (BNB Testnet)

A secure, transparent, and decentralized smart wallet built with React and Solidity, deployed on the BNB Smart Chain Testnet. This project demonstrates fundamental Web3 concepts including smart contract interaction, state management, and secure access control.

## 🌐 Live Demo
🔗 **[View Live Application](https://elvatar2.github.io/Wallet-Frontend/)**

---

## 📂 Repositories
This project is split into two repositories for better architecture:
- 🎨 **Frontend (React + Vite):** [Elvatar2/Wallet-Frontend](https://github.com/Elvatar2/Wallet-Frontend) *(You are here)*
- ⛓️ **Smart Contract (Solidity + Foundry):** [Elvatar2/Wallet-Contract](https://github.com/Elvatar2/Wallet-Contract)

---

## ✨ Features
- **🔗 Wallet Connection:** Seamless integration with MetaMask using `ethers.js` v6.
- **📊 Real-time Data:** Fetches and displays the contract's balance and owner address dynamically.
- **💰 Deposit Functionality:** Allows any user to deposit testnet BNB into the smart contract.
- **🔒 Secure Withdrawal:** Implements strict access control (`require(msg.sender == owner)`), ensuring only the contract deployer can withdraw funds.
- **🎨 Modern UI:** Built with a sleek, responsive, dark-themed Glassmorphism design using pure CSS and Lucide React icons.
- **⚡ Fast & Lightweight:** Powered by Vite for instant local development and optimized production builds.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, JavaScript (ES6+) |
| **Web3 Integration** | Ethers.js (v6.17.0) |
| **Styling** | Custom CSS3, Glassmorphism, Responsive Design |
| **Icons** | Lucide React |
| **Smart Contract** | Solidity (^0.8.19), Foundry (Forge) |
| **Network** | BNB Smart Chain Testnet (Chain ID: 97) |

---

## 📜 Smart Contract Details

The core logic of this application is governed by a verified smart contract on the BNB Testnet.

- **Contract Address:** `0xD78057aA23676CbFabc57cbA2d40908263b69942`
- **Network:** BNB Smart Chain Testnet (Chapel)
- **🔍 Verify on BscScan:** [View Contract on Testnet BscScan](https://testnet.bscscan.com/address/0xD78057aA23676CbFabc57cbA2d40908263b69942)

---

## 🚀 Getting Started (Local Development)

To run this project locally on your machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MetaMask](https://metamask.io/) browser extension installed
- Some testnet BNB (tBNB) in your MetaMask wallet (get it from the [BNB Faucet](https://testnet.bnbchain.org/faucet-smart))

### Installation

1. **Clone the repository:**
    git clone https://github.com/Elvatar2/Wallet-Frontend.git
    cd Wallet-Frontend

2. **Install dependencies:**
    npm install

3. **Start the development server:**
    npm run dev

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 🛡️ Security & Access Control

The smart contract implements a robust owner-only withdrawal mechanism:

    function withdraw(uint amount) external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(amount <= balance, "Insufficient balance");
        // ... transfer logic
    }

Note: Anyone can deposit funds into the contract, but only the address that deployed the contract (`owner`) can execute the `withdraw` function.

---

## ⚠️ Disclaimer
> This project is built for **educational and demonstration purposes only**. It operates exclusively on the **BNB Smart Chain Testnet**. No real funds (Mainnet BNB) are involved or should be sent to this contract. The developer is not responsible for any loss of testnet tokens.

---

## 🤝 Contributing & Contact
Feel free to fork this repository, open issues, or submit pull requests. For questions or collaborations, reach out via GitHub.

**Built with ❤️ by [Elvatar2](https://github.com/Elvatar2)**