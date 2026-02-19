import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  WalletIcon, 
  MagnifyingGlassIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useWallet } from '../components/WalletContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import WalletConnect from '../components/WalletConnect';
import CredentialCard, { CredentialCardSkeleton } from '../components/CredentialCard';
import { getStudentCredentials } from '../utils/algorand';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function StudentDashboard() {
  const { activeAddress, isActive } = useWallet();
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    if (isActive) {
      setLoading(true);
      getStudentCredentials(activeAddress)
        .then(setCredentials)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setCredentials([]);
    }
  }, [activeAddress, isActive]);

  const filteredCredentials = credentials.filter(cred => {
    const name = cred.params?.name || cred.name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCopyLink = (assetId) => {
    const url = `${window.location.origin}/verify/${assetId}`;
    navigator.clipboard.writeText(url);
  };

  if (!isActive) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
            <WalletIcon className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
          <p className="text-muted mb-6">
            Connect your wallet to view your credentials
          </p>
          <WalletConnect />
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header Stats */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <Card className="text-center py-6">
            <p className="text-3xl font-bold text-primary">{credentials.length}</p>
            <p className="text-muted">Total Credentials</p>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="text-center py-6">
            <p className="text-3xl font-bold text-success">
              {credentials.filter(c => c.params?.total === 1).length}
            </p>
            <p className="text-muted">Verified</p>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="text-center py-6">
            <p className="text-3xl font-bold text-primary3">
              {activeAddress ? `${activeAddress.slice(0, 4)}...${activeAddress.slice(-4)}` : 'N/A'}
            </p>
            <p className="text-muted">Wallet</p>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search Bar */}
      <Card className="mb-6">
        <div className="flex items-center gap-3">
          <MagnifyingGlassIcon className="w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Search credentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-dark placeholder-muted"
          />
        </div>
      </Card>

      {/* Credentials Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <CredentialCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCredentials.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-light rounded-full flex items-center justify-center">
            <DocumentTextIcon className="w-8 h-8 text-muted" />
          </div>
          <h3 className="font-semibold mb-2">
            {searchTerm ? 'No credentials found' : 'No credentials yet'}
          </h3>
          <p className="text-muted">
            {searchTerm 
              ? 'Try a different search term' 
              : 'Your issued credentials will appear here'}
          </p>
        </Card>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredCredentials.map((cred) => (
            <motion.div key={cred.index || cred.assetId} variants={itemVariants}>
              <CredentialCard
                credential={cred}
                onCopyLink={() => handleCopyLink(cred.index || cred.assetId)}
                onShowQR={(id) => setSelectedQR(id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* QR Modal */}
      <Modal
        isOpen={!!selectedQR}
        onClose={() => setSelectedQR(null)}
        title="Verification QR Code"
      >
        <div className="text-center">
          <div className="inline-block p-4 bg-white rounded-xl mb-4">
            <QRCodeSVG value={`${window.location.origin}/verify/${selectedQR}`} size={200} level="H" />
          </div>
          <p className="text-muted mb-4">
            Credential ID: <span className="font-mono">{selectedQR}</span>
          </p>
          <Button variant="secondary" onClick={() => setSelectedQR(null)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
