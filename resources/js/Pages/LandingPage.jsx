import React from 'react';
import Navbar from '../Components/Navbar';

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <h1 style={{ fontSize: '5rem', fontWeight: 'bold' }}>
          icebank
        </h1>
      </div>
    </div>
  );
}