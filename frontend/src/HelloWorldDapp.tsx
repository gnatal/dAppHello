import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import switchToHardhatNetwork from "./SwitchNetwork";

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_initialMessage",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "message",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_newMessage",
        type: "string",
      },
    ],
    name: "updateMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "extra",
        type: "string",
      },
    ],
    name: "appendMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const HelloWorldDapp: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [appendMessage, setAppendMessage] = useState<string>("");
  const [currentAccount, setCurrentAccount] = useState<string>("");

  // This state will hold our contract instance.
  const [contract, setContract] = useState<any>(null);

  // Initialize connection to MetaMask and the contract.
  useEffect(() => {
    const init = async () => {
      // Check if MetaMask is installed.
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      // Create an ethers provider from MetaMask.
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request account access if needed.
      await provider.send("eth_requestAccounts", []);

      // Get the signer.
      const signer = await provider.getSigner();

      // Create an instance of the contract.
      const helloWorldContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      setContract(helloWorldContract);

      // Read the initial message from the contract.
      const message = await helloWorldContract.message();
      setCurrentMessage(message);
    };

    init();
  }, []);

  // Function to update the message on the blockchain.
  const updateBlockchainMessage = async () => {
    if (!contract || !newMessage) return;

    try {
      // Send the transaction to update the message.
      const tx = await contract.updateMessage(newMessage);
      // Wait for the transaction to be mined.
      await tx.wait();
      // Read and update the displayed message.
      const updatedMessage = await contract.message();
      setCurrentMessage(updatedMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const updateBlockchainMessageWithExtra = async () => {
    if (!contract || !appendMessage) return;

    try {
      // Send the transaction to update the message.
      const tx = await contract.appendMessage(appendMessage);
      // Wait for the transaction to be mined.
      await tx.wait();
      // Read and update the displayed message.
      const updatedMessage = await contract.message();
      setCurrentMessage(updatedMessage);
      setAppendMessage("");
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        console.log("Accounts changed:", accounts);
        // Update your state or UI with the new account:
        setCurrentAccount(accounts[0]);
      });
    }
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  const handleSelectAccount = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      console.log("Selected account:", accounts[0]);
    } catch (error) {
      console.error("Error selecting account:", error);
    }
  };

  // In your JSX:

  return (
    <div style={{ padding: "2rem" }}>
      <h1>HelloWorld dApp</h1>

      <button onClick={handleSelectAccount}>Select Account</button>
      <button onClick={switchToHardhatNetwork}>
        Switch to Hardhat Network
      </button>

      <p>
        <strong>Current Message:</strong> {currentMessage}
      </p>
      <input
        type="text"
        placeholder="Enter new message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={updateBlockchainMessage}>Update Message</button>
      <div>
        <input
          type="text"
          placeholder="Enter the append message"
          value={appendMessage}
          onChange={(e) => setAppendMessage(e.target.value)}
        />
        <button onClick={updateBlockchainMessageWithExtra}>Append Message</button>
      </div>
    </div>
  );
};

export default HelloWorldDapp;
