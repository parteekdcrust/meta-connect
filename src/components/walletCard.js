import React, { useState } from "react";

const WalletCard = () => {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [defaultNetwork, setDefaultNetwork] = useState(null);

  const connWalletHandler = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      const account = accounts[0];
      const response = await fetch("https://chainid.network/chains.json"); //fetched details of all networks
      const data = await response.json();
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      // console.log(chainId);
      const networkDetails = data.find((network) => {
        // eslint-disable-next-line
        return network.chainId == chainId;
      });
      console.log(networkDetails);
      setDefaultNetwork(networkDetails.name);
      setDefaultAccount(account);
    } catch (error) {
      console.log(error);
    }
  };

  const accChangedHandler = (accounts) => {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
    } else {
      setDefaultAccount(accounts[0]);
    }
  };
  window.ethereum.on("accountsChanged", accChangedHandler);

  const handleNetworkSwitch = async (networkName) => {
    if (window.ethereum) {
      try {
        const response = await fetch("https://chainid.network/chains.json"); //fetched details of all networks
        const data = await response.json();
        const networkDetails = data.find((network) => {
          return network.name === networkName;
        });
        console.log(networkDetails);
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${Number(networkDetails.chainId).toString(16)}`, //changed chainId to hexadecimal
              chainName: networkDetails.name,
              rpcUrls: [...networkDetails.rpc],
              nativeCurrency: networkDetails.nativeCurrency,
            },
          ],
        });
        setDefaultNetwork(networkDetails.name);
        // Network switched successfully
      } catch (error) {
        // Error while switching network
        console.log(error);
      }
    } else {
      // MetaMask is not connected
      console.log("Metamask is not connected");
    }
  };

  return (
    <div className="walletCard">
      <h1>Connect to Metamask with window ethereum </h1>
      <button onClick={connWalletHandler}>Connect Wallet</button>
      <div>
        <h2>Current Address: {defaultAccount}</h2>
      </div>
      <div>
        <h2>Current Network: {defaultNetwork} </h2>
      </div>
      <div>
        <button onClick={() => handleNetworkSwitch("BNB Smart Chain Mainnet")}>
          Switch to BSC
        </button>
      </div>
      <div>
        <button onClick={() => handleNetworkSwitch("Polygon Mainnet")}>
          Switch to Polygon Mainnet
        </button>
      </div>
      <div>
        <button onClick={() => handleNetworkSwitch("Arbitrum One")}>
          Switch to Arbitrum One
        </button>
      </div>
    </div>
  );
};

export default WalletCard;
