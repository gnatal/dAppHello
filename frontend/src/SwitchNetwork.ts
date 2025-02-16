async function switchToHardhatNetwork() {
  if (!window.ethereum) {
    alert("MetaMask is not installed!");
    return;
  }

  try {
    // First, try to switch to the Hardhat chain if MetaMask already knows about it
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x7A69" }], // 31337 in hex
    });
  } catch (switchError: any) {
    // If the chain has not been added to MetaMask, you'll receive an error code 4902.
    if (switchError.code === 4902) {
      try {
        // Prompt the user to add the Hardhat network as a custom chain in MetaMask
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x7A69",
              chainName: "Hardhat",
              nativeCurrency: {
                name: "Hardhat ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["http://127.0.0.1:8545"],
              blockExplorerUrls: [],
            },
          ],
        });
      } catch (addError) {
        console.error("User rejected adding network:", addError);
      }
    } else {
      console.error("Failed to switch network:", switchError);
    }
  }
}

export default switchToHardhatNetwork;
