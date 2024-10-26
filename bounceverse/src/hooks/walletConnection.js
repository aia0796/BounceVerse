// hooks/useWalletConnection.js
import { useState } from 'react';

export const useWalletConnection = () => {
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { account, connectWallet };
};
