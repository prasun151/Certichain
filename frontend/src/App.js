import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { useEffect } from 'react';
import { WalletProvider } from './components/WalletContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Verify from './pages/Verify';
import './index.css';

export const deflyWallet = new DeflyWalletConnect({
  chainId: 416002  // TestNet
});

function App() {
  useEffect(() => {
    deflyWallet.reconnectSession().catch(() => {});
  }, []);

  return (
    <WalletProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={
                <div className="max-w-6xl mx-auto px-4 py-8">
                  <AdminDashboard />
                </div>
              } />
              <Route path="/dashboard" element={
                <div className="max-w-6xl mx-auto px-4 py-8">
                  <StudentDashboard />
                </div>
              } />
              <Route path="/verify" element={
                <div className="max-w-6xl mx-auto px-4 py-8">
                  <Verify />
                </div>
              } />
              <Route path="/verify/:assetId" element={
                <div className="max-w-6xl mx-auto px-4 py-8">
                  <Verify />
                </div>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
