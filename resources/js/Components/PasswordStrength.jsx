import React from 'react';

const checkPasswordComplexity = (password) => {
  const checks = {
    length: password.length >= 8,
    mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  return checks;
};

const CheckItem = ({ label, met }) => (
  <li style={{ color: met ? 'green' : 'red', listStyleType: 'none' }}>
    {met ? '✔' : '✘'} {label}
  </li>
);

export default function PasswordStrength({ password }) {
  const checks = checkPasswordComplexity(password);

  return (
    <ul style={{ paddingLeft: 0, fontSize: '0.8rem', marginTop: 0 }}>
      <CheckItem label="At least 8 characters" met={checks.length} />
      <CheckItem label="Mixed upper and lower case" met={checks.mixedCase} />
      <CheckItem label="At least one number" met={checks.number} />
      <CheckItem label="At least one symbol" met={checks.symbol} />
    </ul>
  );
}