import { useState } from "react";
import { ethers } from "ethers";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Shield,
  User,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import "./App.css";

// ===================================
// Smart Contract Configuration
// ===================================
const CONTRACT_ADDRESS = "0xD78057aA23676CbFabc57cbA2d40908263b69942";

// Contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
  {
    type: "function",
    name: "balance",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "receive",
    stateMutability: "payable",
  },
];

function App() {
  // ===================================
  // State Management
  // ===================================
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState("");
  const [depositAmount, setDepositAmount] = useState("0.1");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ===================================
  // Connect to MetaMask Wallet
  // ===================================
  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus("MetaMask not detected! Please install MetaMask extension.");
      return;
    }

    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setStatus("Wallet connected successfully!");
      await loadContractData(accounts[0]);
    } catch (error) {
      console.error("Connection error:", error);
      setStatus("Connection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ===================================
  // Load Contract Data (Balance & Owner)
  // ===================================
  const loadContractData = async (userAccount) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      const contractBalance = await contract.balance();
      const contractOwner = await contract.owner();

      // Convert Wei to BNB for display
      setBalance(ethers.formatEther(contractBalance));
      setOwner(contractOwner);
      setStatus("Contract data loaded successfully!");
    } catch (error) {
      console.error("Error loading contract data:", error);
      setStatus("Error reading contract data.");
    }
  };

  // ===================================
  // Deposit BNB to Contract
  // ===================================
  const deposit = async () => {
    if (!account) {
      setStatus("Please connect your wallet first!");
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setStatus("Please enter a valid amount!");
      return;
    }

    setIsLoading(true);
    setStatus("Sending transaction...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Send BNB to contract address
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: ethers.parseEther(depositAmount),
      });

      await tx.wait();
      setStatus(`Successfully deposited ${depositAmount} BNB!`);
      await loadContractData(account);
    } catch (error) {
      console.error("Deposit error:", error);
      if (error.code === "ACTION_REJECTED") {
        setStatus("Transaction rejected by user.");
      } else {
        setStatus("Deposit failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ===================================
  // Withdraw BNB from Contract
  // ===================================
  const withdraw = async () => {
    if (!account) {
      setStatus("Please connect your wallet first!");
      return;
    }

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setStatus("Please enter a valid withdrawal amount!");
      return;
    }

    setIsLoading(true);
    setStatus("Processing withdrawal...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      // Convert input amount from BNB to Wei
      const amountInWei = ethers.parseEther(withdrawAmount);

      const tx = await contract.withdraw(amountInWei);
      await tx.wait();

      setStatus(`Successfully withdrew ${withdrawAmount} BNB!`);
      setWithdrawAmount("");
      await loadContractData(account);
    } catch (error) {
      console.error("Withdrawal error:", error);

      // Handle specific error messages
      if (error.message.includes("Insufficient balance")) {
        setStatus("Error: Insufficient contract balance!");
      } else if (error.message.includes("Only owner")) {
        setStatus("Error: Only the contract owner can withdraw!");
      } else if (error.code === "ACTION_REJECTED") {
        setStatus("Transaction rejected by user.");
      } else {
        setStatus("Withdrawal failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ===================================
  // Check if connected account is owner
  // ===================================
  const isOwner =
    account && owner && account.toLowerCase() === owner.toLowerCase();

  // ===================================
  // Get status icon based on message
  // ===================================
  const getStatusIcon = () => {
    if (status.includes("successfully") || status.includes("Successfully")) {
      return (
        <CheckCircle
          size={18}
          style={{
            display: "inline",
            marginRight: "0.5rem",
            verticalAlign: "middle",
          }}
        />
      );
    } else if (
      status.includes("Error") ||
      status.includes("failed") ||
      status.includes("not detected")
    ) {
      return (
        <XCircle
          size={18}
          style={{
            display: "inline",
            marginRight: "0.5rem",
            verticalAlign: "middle",
          }}
        />
      );
    } else if (status.includes("rejected") || status.includes("Please")) {
      return (
        <AlertCircle
          size={18}
          style={{
            display: "inline",
            marginRight: "0.5rem",
            verticalAlign: "middle",
          }}
        />
      );
    }
    return null;
  };

  // ===================================
  // Render UI
  // ===================================
  return (
    <div className="app-container">
      {/* Header Section */}
      <div className="header">
        <h1>Smart Wallet</h1>
        <p>Secure, Transparent & Decentralized</p>
      </div>

      {/* Connection Card */}
      <div className="glass-card">
        <div className="status-bar">
          <p>
            {getStatusIcon()}
            <strong>Status:</strong> {status || "No action taken yet"}
          </p>
        </div>

        <button
          onClick={connectWallet}
          className="connect-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner"></span>
          ) : account ? (
            <>
              <Wallet size={20} />
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </>
          ) : (
            <>
              <Wallet size={20} />
              Connect MetaMask
            </>
          )}
        </button>
      </div>

      {/* Contract Information */}
      {account && (
        <>
          <div className="info-grid">
            <div className="info-item">
              <h3>
                <Shield size={18} />
                Contract Balance
              </h3>
              <p>{balance} BNB</p>
            </div>
            <div className="info-item">
              <h3>
                <User size={18} />
                Contract Owner
              </h3>
              <p style={{ fontSize: "1rem" }}>
                {owner.slice(0, 10)}...{owner.slice(-8)}
              </p>
              <div className={`owner-badge ${isOwner ? "yes" : "no"}`}>
                {isOwner ? (
                  <>
                    <CheckCircle size={16} />
                    You are the owner
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    You are not the owner
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="glass-card action-section">
            <h2 className="section-title">
              <Zap size={28} />
              Operations
            </h2>

            {/* Deposit Form */}
            <div className="input-group">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Amount in BNB (e.g., 0.1)"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={isLoading}
              />
              <button
                onClick={deposit}
                className="action-btn deposit"
                disabled={isLoading}
              >
                <ArrowDownCircle size={20} />
                Deposit
              </button>
            </div>

            {/* Withdraw Form */}
            <div className="input-group">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Amount in BNB (e.g., 0.05)"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                disabled={isLoading}
              />
              <button
                onClick={withdraw}
                className="action-btn withdraw"
                disabled={isLoading}
              >
                <ArrowUpCircle size={20} />
                Withdraw
              </button>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="footer">
        <p>
          Built with React, Ethers.js & Foundry |
          <a
            href="https://github.com/Elvatar2/Wallet-Contract"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{
                display: "inline",
                marginRight: "0.3rem",
                verticalAlign: "middle",
              }}
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
