import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletIcon, ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useWallet } from './WalletContext';

export default function WalletConnect({ simplified = false }) {
  const { account, connecting, connect, disconnect, isActive } = useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const truncatedAddress = account 
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : '';

  if (!isActive) {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={connect}
        disabled={connecting}
        className={`
          flex items-center gap-2 px-4 py-2.5 bg-primary
          text-white font-medium rounded-xl hover:bg-primary2
          transition-all duration-200 disabled:opacity-50
          ${simplified ? 'text-sm px-3 py-2' : ''}
        `}
      >
        {connecting ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <WalletIcon className="w-5 h-5" />
        )}
        <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </motion.button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20
          text-success font-medium rounded-xl hover:bg-success/20 transition-all duration-200
          ${simplified ? 'text-sm px-3 py-2' : ''}
        `}
      >
        <span className="font-mono">{truncatedAddress}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50"
          >
            <div className="p-3 border-b border-border">
              <p className="text-xs text-muted">Connected Wallet</p>
              <p className="font-mono text-sm mt-1 break-all">{account}</p>
            </div>
            <button
              onClick={() => {
                disconnect();
                setDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-error hover:bg-error/5 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Disconnect</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
