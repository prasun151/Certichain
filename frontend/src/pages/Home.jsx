import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon, 
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Card from '../components/Card';
import WalletConnect from '../components/WalletConnect';

const features = [
  {
    icon: BuildingOfficeIcon,
    title: 'Issue Credentials',
    description: 'Institutions can mint academic credentials as NFTs on the Algorand blockchain.',
  },
  {
    icon: AcademicCapIcon,
    title: 'Own Your Records',
    description: 'Students receive credentials directly in their wallets with full ownership.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Instant Verification',
    description: 'Anyone can verify credentials instantly without contacting the institution.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [verifyId, setVerifyId] = useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-[#6C63FF] rounded-3xl mb-8 shadow-lg">
              <span className="text-white font-bold text-4xl">C</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-[#1a1a2e] mb-6 leading-tight">
              Simply the best way to<br />
              verify academic credentials
            </h1>
            
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
              Issue, own, and verify academic credentials on the Algorand blockchain.
            </p>

            {/* Quick Verify */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="flex items-center gap-2 p-2 bg-white border-2 border-gray-200 rounded-2xl shadow-sm">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 ml-3" />
                <input
                  type="text"
                  placeholder="Enter Credential ID..."
                  value={verifyId}
                  onChange={(e) => setVerifyId(e.target.value)}
                  className="flex-1 px-3 py-2 outline-none text-gray-700"
                  onKeyPress={(e) => e.key === 'Enter' && verifyId && navigate(`/verify/${verifyId}`)}
                />
                <Button 
                  onClick={() => verifyId && navigate(`/verify/${verifyId}`)}
                  disabled={!verifyId}
                >
                  Verify
                </Button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WalletConnect />
              <Button 
                variant="secondary" 
                onClick={() => navigate('/verify')}
                className="flex items-center gap-2"
              >
                <DocumentCheckIcon className="w-5 h-5" />
                Verify Credential
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Role Selection Cards */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1a1a2e]">
            Choose your path
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Institution Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => navigate('/admin')}
            >
              <Card className="h-full p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-[#6C63FF]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <BuildingOfficeIcon className="w-8 h-8 text-[#6C63FF]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">Institution</h3>
                    <p className="text-gray-500 mb-4">
                      Issue tamper-proof academic credentials as NFTs on the blockchain.
                    </p>
                    <div className="flex items-center text-[#6C63FF] font-medium">
                      Issue Credentials
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Student Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <Card className="h-full p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <AcademicCapIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">Student</h3>
                    <p className="text-gray-500 mb-4">
                      Own your credentials forever and share them with anyone instantly.
                    </p>
                    <div className="flex items-center text-[#6C63FF] font-medium">
                      View Credentials
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-[#1a1a2e]">
            Built for the academic community
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#6C63FF]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-[#6C63FF]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-500 mb-8">
            Join institutions and students already using CertiChain
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => navigate('/admin')}>
              Issue a Credential
            </Button>
            <Button variant="secondary" onClick={() => navigate('/verify')}>
              Verify a Credential
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6C63FF] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="font-bold text-lg text-[#1a1a2e]">CertiChain</span>
            </div>
            
            <p className="text-gray-500 text-sm">
              Built on Algorand Blockchain
            </p>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-[#6C63FF] transition-colors text-sm">Support</a>
              <a href="#" className="text-gray-500 hover:text-[#6C63FF] transition-colors text-sm">Terms</a>
              <a href="#" className="text-gray-500 hover:text-[#6C63FF] transition-colors text-sm">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
