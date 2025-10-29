import React from 'react';

const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px 40px',
  border: '1px solid #ccc',
  zIndex: 1000,
  minWidth: '400px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 999,
};

export default function Modal({ show, onClose, children, title }) {
  if (!show) {
    return null;
  }

  return (
    <>
      <div style={overlayStyle} onClick={onClose}></div>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{title}</h2>
          <button type="button" onClick={onClose} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            &times;
          </button>
        </div>
        <div style={{ marginTop: '15px' }}>
          {children}
        </div>
      </div>
    </>
  );
}