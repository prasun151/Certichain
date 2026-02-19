import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { PageLoader } from '../components/Loader';
import { getCredentialByAssetId } from '../utils/algorand';
import { toHTTP } from '../utils/ipfs';

export default function Verify() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [credential, setCredential] = useState(null);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    if (assetId) {
      setLoading(true);
      setError(false);
      getCredentialByAssetId(Number(assetId))
        .then((data) => {
          setCredential(data);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, [assetId]);

  const handleSearch = () => {
    if (searchId) {
      navigate(`/verify/${searchId}`);
    }
  };

  if (!assetId) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="text-center py-12 px-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
            <MagnifyingGlassIcon className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-3">Verify a Credential</h2>
          <p className="text-muted mb-6">
            Enter a credential ID to verify its authenticity on the blockchain
          </p>
          
          <div className="space-y-4">
            <Input
              label="Credential ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter asset ID"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={!searchId} className="w-full">
              Verify Credential
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <PageLoader />;
  }

  if (error || !credential) {
    return (
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-error/10 rounded-2xl flex items-center justify-center">
              <ExclamationTriangleIcon className="w-10 h-10 text-error" />
            </div>
            <h2 className="text-2xl font-bold text-error mb-3">Credential Not Found</h2>
            <p className="text-muted mb-6">
              This credential does not exist or has been revoked
            </p>
            
            <div className="p-4 bg-light rounded-xl mb-6">
              <p className="text-sm text-muted">Searched Asset ID</p>
              <p className="font-mono font-semibold">{assetId}</p>
            </div>

            <Button variant="secondary" onClick={() => navigate('/verify')}>
              Try Another ID
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  const params = credential.asset?.params || {};
  const ipfsUrl = params.url?.replace('ipfs://', '');
  const explorerUrl = `https://testnet.explorer.perawallet.app/asset/${assetId}`;

  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-20 h-20 mx-auto mb-4 bg-success/10 rounded-2xl flex items-center justify-center"
            >
              <ShieldCheckIcon className="w-10 h-10 text-success" />
            </motion.div>
            <h2 className="text-2xl font-bold text-success">Credential Verified</h2>
            <p className="text-muted text-sm mt-1">
              Permanently recorded on Algorand blockchain
            </p>
          </div>

          {/* Credential Details */}
          <div className="space-y-4 border-t border-b border-border py-6 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-muted">Certificate</span>
              <span className="font-semibold text-right max-w-[60%]">{params.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Asset ID</span>
              <span className="font-mono text-sm">{assetId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Unit</span>
              <span className="font-medium">{params['unit-name'] || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Issuer</span>
              <span className="font-mono text-sm">
                {params.creator 
                  ? `${params.creator.slice(0, 6)}...${params.creator.slice(-4)}` 
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Total Supply</span>
              <span className="font-medium">
                {params.total === 1 ? '1 (Unique NFT)' : params.total}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary2 transition-colors"
            >
              View on Explorer
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </a>
            
            {ipfsUrl && (
              <a
                href={toHTTP(ipfsUrl)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full px-5 py-3 border-2 border-border rounded-xl font-medium hover:border-primary hover:text-primary transition-colors"
              >
                <DocumentTextIcon className="w-5 h-5" />
                View Certificate
              </a>
            )}

            <Button 
              variant="ghost" 
              onClick={() => navigate('/verify')}
              className="w-full"
            >
              Verify Another
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
