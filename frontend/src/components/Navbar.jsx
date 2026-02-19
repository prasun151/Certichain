import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentCheckIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import WalletConnect from './WalletConnect';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Verify', href: '/verify', icon: DocumentCheckIcon },
  { name: 'Student', href: '/dashboard', icon: AcademicCapIcon },
  { name: 'Institution', href: '/admin', icon: BuildingOfficeIcon },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-semibold text-dark">
              CertiChain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted hover:text-dark hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* Wallet Connect */}
            <div className="hidden sm:block">
              <WalletConnect />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-muted hover:bg-gray-100"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <Transition show={mobileMenuOpen} as="div">
            <Dialog onClose={setMobileMenuOpen} className="relative z-50 md:hidden">
              <TransitionChild
                enter="ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/40" />
              </TransitionChild>

              <TransitionChild
                enter="ease-out duration-200"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="ease-in duration-150"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <span className="font-semibold">Menu</span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                          location.pathname === item.href
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                    <WalletConnect />
                  </div>
                </DialogPanel>
              </TransitionChild>
            </Dialog>
          </Transition>
        )}
      </AnimatePresence>
    </nav>
  );
}
