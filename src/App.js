// App.js
import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import PresaleForm from './components/PresaleForm';
import SignUpForm from './components/SignUpForm';
import Header from './components/Header';

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check wallet connection when the component mounts
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const handleSignUp = (email) => {
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  return (
    <Container maxWidth="sm">
      <Header
        walletAddress={walletAddress}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onConnectWallet={connectWallet}
      />

      {!isAuthenticated ? (
        <SignUpForm onSignUp={handleSignUp} />
      ) : (
        <PresaleForm walletAddress={walletAddress} />
      )}
    </Container>
  );
}

export default App;