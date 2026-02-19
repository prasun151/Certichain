import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useWallet } from '../components/WalletContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import WalletConnect from '../components/WalletConnect';
import { uploadFileToPinata, uploadJSONToPinata } from '../utils/ipfs';
import { mintCredentialNFT, isContractDeployed, getAppId, getContractInfo } from '../utils/algorand';

const credentialTypes = ['Degree', 'Certificate', 'Award', 'Course Completion', 'Hackathon'];

export default function AdminDashboard() {
  const { activeAddress, signTransactions, isActive } = useWallet();
  const [contractStatus, setContractStatus] = useState({ deployed: false, appId: null, loading: true });
  const [form, setForm] = useState({
    studentWallet: '',
    studentName: '',
    course: '',
    grade: '',
    credentialType: 'Degree',
  });
  const [file, setFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkContract = async () => {
      try {
        const deployed = isContractDeployed();
        const appId = getAppId();
        if (deployed && appId > 0) {
          const info = await getContractInfo();
          setContractStatus({ deployed: true, appId, info });
        } else {
          setContractStatus({ deployed: false, appId: 0, loading: false });
        }
      } catch (e) {
        setContractStatus({ deployed: false, appId: null, loading: false });
      }
    };
    checkContract();
  }, []);

  const steps = contractStatus.deployed
    ? [
        { key: 'upload', label: 'Uploading to IPFS', icon: CloudArrowUpIcon },
        { key: 'metadata', label: 'Creating Metadata', icon: DocumentTextIcon },
        { key: 'contract', label: 'Smart Contract Call', icon: ArrowPathIcon },
        { key: 'mint', label: 'Minting NFT', icon: CheckCircleIcon },
      ]
    : [
        { key: 'upload', label: 'Uploading to IPFS', icon: CloudArrowUpIcon },
        { key: 'metadata', label: 'Creating Metadata', icon: DocumentTextIcon },
        { key: 'mint', label: 'Minting NFT (Direct ASA)', icon: ArrowPathIcon },
      ];

  const handleIssue = async () => {
    if (!activeAddress || !file || !form.studentWallet || !form.course) {
      setError('Please fill all fields and upload a file');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      setCurrentStep('upload');
      const pdfHash = await uploadFileToPinata(file);

      setCurrentStep('metadata');
      const metadataHash = await uploadJSONToPinata({
        name: form.course,
        description: `${form.credentialType} credential`,
        image: `ipfs://${pdfHash}`,
        properties: {
          student_name: form.studentName,
          student_wallet: form.studentWallet,
          course: form.course,
          grade: form.grade,
          issue_date: new Date().toISOString().split('T')[0],
          credential_type: form.credentialType,
          institution_wallet: activeAddress,
        },
      });

      const metadataUrl = `ipfs://${metadataHash}`;
      
      if (contractStatus.deployed) {
        setCurrentStep('contract');
      }
      
      setCurrentStep('mint');
      const { assetId, txId } = await mintCredentialNFT(
        activeAddress,
        form.studentWallet,
        form.course,
        metadataUrl,
        signTransactions
      );

      setResult({ assetId, txId, method: contractStatus.deployed ? 'smart_contract' : 'direct_asa' });
    } catch (err) {
      setError(err.message || 'Failed to issue credential');
    }
    
    setLoading(false);
    setCurrentStep(null);
  };

  const copyVerificationLink = () => {
    if (result) {
      navigator.clipboard.writeText(`${window.location.origin}/verify/${result.assetId}`);
    }
  };

  if (!isActive) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-2xl flex items-center justify-center">
            <ExclamationTriangleIcon className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
          <p className="text-muted mb-6">
            Connect your institution wallet to issue credentials
          </p>
          <WalletConnect />
        </Card>
      </div>
    );
  }

  const renderContractStatus = () => {
    if (contractStatus.loading) {
      return (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl flex items-center gap-3">
          <ArrowPathIcon className="w-5 h-5 text-muted animate-spin" />
          <span className="text-sm text-muted">Checking contract status...</span>
        </div>
      );
    }
    
    if (contractStatus.deployed) {
      return (
        <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-xl flex items-center gap-3">
          <CheckCircleIcon className="w-5 h-5 text-success" />
          <div>
            <p className="text-sm font-medium text-success">Smart Contract Active</p>
            <p className="text-xs text-muted">App ID: {contractStatus.appId}</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
        <InformationCircleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800">Using Direct ASA Creation</p>
          <p className="text-xs text-yellow-600 mt-1">
            Deploy the CredentialVerifier contract to use smart contract-based issuance.
            Set REACT_APP_APP_ID in .env after deployment.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Issue Form */}
      <div>
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-dark">Issue Credential</h2>
            <WalletConnect simplified />
          </div>

          {renderContractStatus()}

          <div className="space-y-4">
            <Input
              label="Student Wallet Address"
              value={form.studentWallet}
              onChange={(e) => setForm({ ...form, studentWallet: e.target.value })}
              placeholder="Enter Algorand wallet address"
              required
            />
            
            <Input
              label="Student Full Name"
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
              placeholder="Enter student name"
              required
            />
            
            <Input
              label="Course / Achievement"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              placeholder="e.g., B.Tech Computer Science"
              required
            />
            
            <Input
              label="Grade / Score"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              placeholder="e.g., First Class with Distinction"
            />

            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Credential Type <span className="text-error">*</span>
              </label>
              <select
                value={form.credentialType}
                onChange={(e) => setForm({ ...form, credentialType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary outline-none transition-colors"
              >
                {credentialTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Certificate PDF <span className="text-error">*</span>
              </label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {file ? (
                    <div className="flex items-center justify-center gap-2">
                      <DocumentTextIcon className="w-8 h-8 text-primary" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <CloudArrowUpIcon className="w-10 h-10 mx-auto text-muted mb-2" />
                      <p className="text-muted">Click to upload PDF</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleIssue}
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Processing...' : 'Issue Credential'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Stepper Panel */}
      <div>
        {!result ? (
          <Card className="h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-6 text-dark">Issuance Progress</h3>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const isActiveStep = currentStep === step.key;
                  const isComplete = result || (currentStep && steps.findIndex(s => s.key === currentStep) > index);
                  
                  return (
                    <div
                      key={step.key}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                        isActiveStep ? 'bg-primary/10 border-primary' : 
                        isComplete ? 'border-success' : 'border-border'
                      }`}
                    >
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${isComplete ? 'bg-success text-white' : 
                          isActiveStep ? 'bg-primary text-white' : 'bg-gray-100 text-muted'}
                      `}>
                        {isComplete ? (
                          <CheckCircleIcon className="w-6 h-6" />
                        ) : isActiveStep ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <step.icon className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`
                        font-medium 
                        ${isActiveStep ? 'text-primary' : 
                          isComplete ? 'text-success' : 'text-muted'}
                      `}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {!currentStep && !result && (
                <p className="text-center text-muted mt-8">
                  Fill the form and click "Issue Credential" to begin
                </p>
              )}
            </div>
          </Card>
        ) : (
          <Card>
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 mx-auto mb-4 bg-success/10 rounded-full flex items-center justify-center"
              >
                <CheckCircleIcon className="w-10 h-10 text-success" />
              </motion.div>
              <h3 className="text-xl font-semibold text-success">Credential Issued!</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-light rounded-xl">
                <p className="text-sm text-muted mb-1">Asset ID</p>
                <p className="font-mono font-semibold">{result.assetId}</p>
              </div>
              
              <div className="p-4 bg-light rounded-xl">
                <p className="text-sm text-muted mb-1">Transaction ID</p>
                <p className="font-mono text-xs break-all">{result.txId}</p>
              </div>

              <div className="p-3 bg-light rounded-xl">
                <p className="text-sm text-muted mb-1">Issuance Method</p>
                <p className="font-medium text-sm">
                  {result.method === 'smart_contract' ? (
                    <span className="text-success flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4" />
                      Smart Contract
                    </span>
                  ) : (
                    <span className="text-yellow-600 flex items-center gap-1">
                      <InformationCircleIcon className="w-4 h-4" />
                      Direct ASA
                    </span>
                  )}
                </p>
              </div>

              <Button
                variant="secondary"
                onClick={copyVerificationLink}
                className="w-full flex items-center justify-center gap-2"
              >
                <ClipboardDocumentIcon className="w-5 h-5" />
                Copy Verification Link
              </Button>

              <a
                href={`/verify/${result.assetId}`}
                className="block text-center text-primary hover:underline"
              >
                View Verification Page
              </a>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
