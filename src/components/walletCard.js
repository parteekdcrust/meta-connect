import React, { useState } from "react";

const WalletCard = () => {
  const [defaultAccount, setDefaultAccount] = useState(null);

  const connWalletHandler = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      const account = accounts[0];
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

  return (
    <div className="walletCard">
      <h1>Connect to Metamask with window ethereum </h1>
      <button onClick={connWalletHandler}>Connect Wallet</button>
      <div>
        <h2> Address:{defaultAccount}</h2>
      </div>
    </div>
  );
};

export default WalletCard;
