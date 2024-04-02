import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import PresaleForm from './components/PresaleForm';
import SignUpForm from './components/SignUpForm';
import Header from './components/Header';
import RandyBar from './components/RandyBar';
import Spline from '@splinetool/react-spline';

const TOTAL_RANDY_SUPPLY = 21000000;

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userMetadata, setUserMetadata] = useState({});
  const [remainingRandy, setRemainingRandy] = useState(TOTAL_RANDY_SUPPLY);

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

  const handleBuySuccess = (userEmail, purchasedRandyAmount) => {
    // Update the user's metadata
    const updatedUserMetadata = {
      ...userMetadata,
      [userEmail]: {
        ...userMetadata[userEmail],
        Randy_Balance: (userMetadata[userEmail]?.Randy_Balance || 0) + purchasedRandyAmount,
      },
    };
    setUserMetadata(updatedUserMetadata);

    // Update the global "Amount of Randy Left"
    setRemainingRandy((prevRemainingRandy) => prevRemainingRandy - purchasedRandyAmount);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
    >
      <Container maxWidth="sm">
        <Header
          walletAddress={walletAddress}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
          onConnectWallet={connectWallet}
        />
        <RandyBar
          userEmail={userEmail}
          remainingRandy={remainingRandy}
          userMetadata={userMetadata}
        />
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
      <Box
        width="100%"
        flexGrow={1}
        marginTop={4}
      >
        <Spline scene="https://prod.spline.design/oaDQ0P-eu17gfqBy/scene.splinecode" />
      </Box>
    </Box>
  );
}

export default App;