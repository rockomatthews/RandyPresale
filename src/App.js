import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import PresaleForm from './components/PresaleForm';
import SignUpForm from './components/SignUpForm';
import Header from './components/Header';
import RandyBar from './components/RandyBar';
import Spline from '@splinetool/react-spline';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const TOTAL_RANDY_SUPPLY = 21000000;

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userMetadata, setUserMetadata] = useState({});
  const [remainingRandy, setRemainingRandy] = useState(18000000);

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

  useEffect(() => {
    const fetchUserMetadata = async () => {
      if (userEmail) {
        try {
          const db = getFirestore();
          const userRef = doc(db, 'users', userEmail);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUserMetadata(userData);
          } else {
            // If user document doesn't exist, create a new one with initial metadata
            const initialMetadata = {
              totalSupply: TOTAL_RANDY_SUPPLY,
              Randy_Balance: 0,
            };
            await setDoc(userRef, initialMetadata);
            setUserMetadata(initialMetadata);
          }
        } catch (error) {
          console.error('Error fetching user metadata:', error);
        }
      }
    };

    fetchUserMetadata();
  }, [userEmail]);

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

  const handleBuySuccess = async (userEmail, purchasedRandyAmount) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', userEmail);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const updatedRandyBalance = (userData.Randy_Balance || 0) + purchasedRandyAmount;
        const updatedRemainingSupply = userData.totalSupply - purchasedRandyAmount;

        await setDoc(userRef, {
          ...userData,
          Randy_Balance: updatedRandyBalance,
          totalSupply: updatedRemainingSupply,
          walletAddress: walletAddress,
        });

        setUserMetadata((prevUserMetadata) => ({
          ...prevUserMetadata,
          Randy_Balance: updatedRandyBalance,
          totalSupply: updatedRemainingSupply,
        }));

        setRemainingRandy((prevRemainingRandy) => prevRemainingRandy - purchasedRandyAmount);
      } else {
        console.error('User document does not exist');
      }
    } catch (error) {
      console.error('Error updating user metadata:', error);
    }
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
        <Box
          width="100%"
          flexGrow={1}
          marginTop={4}
        >
          <Spline scene="https://prod.spline.design/oaDQ0P-eu17gfqBy/scene.splinecode" />
        </Box>
        <RandyBar
          userEmail={userEmail}
          remainingRandy={remainingRandy}
          setRemainingRandy={setRemainingRandy}
          userMetadata={userMetadata}
          setUserMetadata={setUserMetadata}
          walletAddress={walletAddress}
          onBuySuccess={handleBuySuccess}
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
    </Box>
  );
}

export default App;