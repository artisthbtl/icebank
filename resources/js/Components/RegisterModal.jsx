import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import PasswordStrength from './PasswordStrength';

const FormInput = ({ label, name, type = 'text', value, onChange, error }) => (
  <div style={{ marginBottom: '10px' }}>
    <label htmlFor={name}>{label}:</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      style={{ width: '100%', boxSizing: 'border-box' }}
    />
    {error && <div style={{ color: 'red', fontSize: '0.8rem' }}>{error}</div>}
  </div>
);

const initialState = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  city: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

export default function RegisterModal({ show, onClose, onRegistrationSuccess }) {
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const reset = () => {
    setData(initialState);
    setErrors({});
    setProcessing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing) return;

    setProcessing(true);
    setErrors({});

    try {
      const response = await axios.post('/api/auth/register', data);

      reset();
      onRegistrationSuccess();

    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal show={show} onClose={handleClose} title="Create Your Account">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="First Name"
          name="firstName"
          value={data.firstName}
          onChange={handleChange}
          error={errors.firstName ? errors.firstName[0] : null} // Show first error
        />
        <FormInput
          label="Last Name"
          name="lastName"
          value={data.lastName}
          onChange={handleChange}
          error={errors.lastName ? errors.lastName[0] : null}
        />
        <FormInput
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={data.dateOfBirth}
          onChange={handleChange}
          error={errors.dateOfBirth ? errors.dateOfBirth[0] : null}
        />
        <FormInput
          label="City"
          name="city"
          value={data.city}
          onChange={handleChange}
          error={errors.city ? errors.city[0] : null}
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          error={errors.email ? errors.email[0] : null}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={data.password}
          onChange={handleChange}
          error={errors.password ? errors.password[0] : null}
        />
        
        {data.password && <PasswordStrength password={data.password} />}

        <FormInput
          label="Confirm Password"
          name="passwordConfirmation" // Must match the state key
          type="password"
          value={data.passwordConfirmation}
          onChange={handleChange}
          error={errors.passwordConfirmation ? errors.passwordConfirmation[0] : null}
        />
        
        <button type="submit" disabled={processing} style={{ width: '100%', padding: '8px' }}>
          {processing ? 'Registering...' : 'Register'}
        </button>
      </form>
    </Modal>
  );
}