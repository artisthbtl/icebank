import React from 'react';
import Modal from './Modal';

export default function SuccessModal({ show, onClose, title, children }) {
  return (
    <Modal show={show} onClose={onClose} title={title}>
      <p>{children}</p>
      <button type="button" onClick={onClose} style={{ width: '100%', padding: '8px', marginTop: '10px' }}>
        Close
      </button>
    </Modal>
  );
}