import { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, ClipboardIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';

const iconMap = {
  Degree: '🎓',
  Certificate: '📜',
  Award: '🏆',
  'Course Completion': '📚',
  Hackathon: '💻',
};

export default function CredentialCard({ credential, onCopyLink, onShowQR }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typeIcon = iconMap[credential.type] || '📄';
  const assetId = credential.assetId || credential.index || 'N/A';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="text-4xl">{typeIcon}</div>
          <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
            Verified
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {credential.name || credential.params?.name || 'Credential'}
        </h3>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Asset ID: <span className="font-mono text-gray-700 dark:text-gray-300">{assetId}</span>
          </p>
          {credential.params?.['unit-name'] && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Type: <span className="text-gray-700 dark:text-gray-300">{credential.params['unit-name']}</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors"
          >
            <ClipboardIcon className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={() => onShowQR(assetId)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:border-primary hover:text-primary transition-colors"
          >
            <QrCodeIcon className="w-4 h-4" />
            QR Code
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function CredentialCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="space-y-3 mb-4">
        <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  );
}
