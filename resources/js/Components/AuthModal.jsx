import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

const FormInput = ({ label, name, type = 'text', value, onChange, error }) => (
  <div style={{ marginBottom: '10px' }}>
    <label htmlFor={name}>{label}:</label>
    <input
      id={name} name={name} type={type} value={value}
      onChange={onChange} style={{ width: '100%', boxSizing: 'border-box' }}
    />
    {error && <div style={{ color: 'red', fontSize: '0.8rem' }}>{error}</div>}
  </div>
);

const LoginStep = ({ onLoginSuccess, onRequiresVerification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });

      if (response.status === 200) {
        onLoginSuccess(response.data.userId);
      } else if (response.status === 201) {
        onRequiresVerification(response.data.pollToken);
      }

    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 422)) {
        setError(err.response.data.error || 'Invalid credentials.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <FormInput label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <button type="submit" disabled={processing} style={{ width: '100%' }}>
        {processing ? 'Logging In...' : 'Login'}
      </button>
    </form>
  );
};

const OtpStep = ({ userId }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/verify-otp', { userId, otp });
      
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);

      window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;

      window.location.href = '/home';

    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError(err.response.data.error || 'Invalid or expired OTP.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>An OTP has been sent to your email.</p>
      <FormInput label="OTP" name="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} error={error} />
      <button type="submit" disabled={processing} style={{ width: '100%' }}>
        {processing ? 'Verifying...' : 'Verify'}
      </button>
    </form>
  );
};

const VerifyEmailStep = ({ pollToken, onVerified }) => {
  const [status, setStatus] = useState('Please check your email to verify your account.');

  useEffect(() => {
    const pollUrl = `/api/auth/check-verification/${pollToken}`;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(pollUrl);
        if (response.data.verified === true) {
          clearInterval(interval);
          setStatus('Verification successful! You can now log in.');
          setTimeout(onVerified, 2000); 
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [pollToken, onVerified]);

  return (
    <div>
      <h4>Verify Your Email</h4>
      <p>{status}</p>
      <p>A new verification link has been sent. We will check for updates every 10 seconds.</p>
    </div>
  );
};

export default function AuthModal({ show, onClose }) {
  const [step, setStep] = useState('login');
  const [userId, setUserId] = useState(null);
  const [pollToken, setPollToken] = useState(null);

  const handleClose = () => {
    setStep('login');
    setUserId(null);
    setPollToken(null);
    onClose();
  };

  const handleLoginSuccess = (uid) => {
    setUserId(uid);
    setStep('otp');
  };

  const handleRequiresVerification = (token) => {
    setPollToken(token);
    setStep('verifyEmail');
  };
  
  const handleVerified = () => {
    setPollToken(null);
    setStep('login');
  };

  const getTitle = () => {
    if (step === 'otp') return 'Enter Your One-Time Password';
    if (step === 'verifyEmail') return 'Email Verification Required';
    return 'Login to Icebank';
  };

  return (
    <Modal show={show} onClose={handleClose} title={getTitle()}>
      {step === 'login' && (
        <LoginStep
          onLoginSuccess={handleLoginSuccess}
          onRequiresVerification={handleRequiresVerification}
        />
      )}
      {step === 'otp' && <OtpStep userId={userId} />}
      {step === 'verifyEmail' && (
        <VerifyEmailStep pollToken={pollToken} onVerified={handleVerified} />
      )}
    </Modal>
  );
}