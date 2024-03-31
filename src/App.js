// App.js
import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import PresaleForm from './components/PresaleForm';
import SignUpForm from './components/SignUpForm';
import Header from './components/Header';
import RandyBar from './components/RandyBar';


function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check wallet connection when the component mounts
    const checkWalletConnection = async () => {
      try {
        const { solana } = window;

        if (solana && solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log('Connected with Public Key:', response.publicKey.toString());
          setWalletAddress(response.publicKey.toString());
        } else {
          alert('Solana object not found! Get a Phantom Wallet 👻');
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    try {
      const { solana } = window;

      if (solana) {
        const response = await solana.connect();
        console.log('Connected with Public Key:', response.publicKey.toString());
        setWalletAddress(response.publicKey.toString());
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleSignUp = (email) => {
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleBuySuccess = (purchasedRandyAmount) => {
    // Handle the successful purchase of RANDY tokens
    console.log('Purchased RANDY amount:', purchasedRandyAmount);
  };

  return (
    <Container maxWidth="sm">
      <Header
        walletAddress={walletAddress}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onConnectWallet={connectWallet}
      />
      <RandyBar userEmail={userEmail} onBuySuccess={handleBuySuccess} />
      {!isAuthenticated ? (
        <SignUpForm onSignUp={handleSignUp} />
      ) : (
        <PresaleForm
          walletAddress={walletAddress}
          userEmail={userEmail}
          onBuySuccess={handleBuySuccess}
        />
      )}
    </Container>
  );
}

export default App;