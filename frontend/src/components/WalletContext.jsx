import { useState, createContext, useContext, useEffect } from 'react';
import { deflyWallet } from '../App';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('walletAddress');
    if (saved) setAccount(saved);

    deflyWallet.reconnectSession().then((accounts) => {
      if (accounts.length) {
        setAccount(accounts[0]);
        sessionStorage.setItem('walletAddress', accounts[0]);
      }
    }).catch(() => {});
  }, []);

  const connect = async () => {
    setConnecting(true);
    try {
      const accounts = await deflyWallet.connect();
      setAccount(accounts[0]);
      sessionStorage.setItem('walletAddress', accounts[0]);
    } catch (err) {
      console.error('Connection error:', err);
    }
    setConnecting(false);
  };

  const disconnect = () => {
    deflyWallet.disconnect();
    sessionStorage.removeItem('walletAddress');
    setAccount(null);
  };

  const signTransactions = async (txns) => {
    return await deflyWallet.signTransaction(txns);
  };

  return (
    <WalletContext.Provider value={{ 
      account, 
      activeAddress: account,
      connecting, 
      connect, 
      disconnect, 
      signTransactions, 
      isActive: !!account 
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
