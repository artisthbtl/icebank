import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import RegisterModal from './RegisterModal';
import SuccessModal from './SuccessModal';
import AuthModal from './AuthModal';

const NavLink = ({ href, children }) => (
  <Link href={href} style={{ padding: '0 8px' }}>
    {children}
  </Link>
);

export default function Navbar() {
  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#features', label: 'Features' },
    { href: '#contact', label: 'Contact' },
  ];

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleRegistrationSuccess = () => {
    setShowRegisterModal(false);
    setShowSuccessModal(true);
  };

  return (
    <>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '16px' }}>Icebank</span>
          <div>
            {navLinks.map((link) => (
              <NavLink key={link.label} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <button type="button" style={{ marginRight: '8px' }} onClick={() => setShowAuthModal(true)}>
            Login
          </button>
          
          <button type="button" onClick={() => setShowRegisterModal(true)}>
            Sign Up
          </button>
        </div>
      </nav>

      <RegisterModal
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Registration Successful"
      >
        Please check your email for email verification.
      </SuccessModal>

      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}