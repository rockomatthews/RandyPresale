// RandyBar.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import randyCoinImage from '../assets/randyCoin.png';

const TOTAL_RANDY_SUPPLY = 21000000;

function RandyBar({ userEmail, onBuySuccess }) {
  const [remainingRandy, setRemainingRandy] = useState(TOTAL_RANDY_SUPPLY);
  const [userRandyBalance, setUserRandyBalance] = useState(0);

  useEffect(() => {
    // Simulating fetching user's RANDY balance from the server
    const fetchUserRandyBalance = async () => {
      // Replace this with your actual API call to fetch the user's RANDY balance
      const response = await Promise.resolve({ balance: 1000 });
      setUserRandyBalance(response.balance);
    };

    if (userEmail) {
      fetchUserRandyBalance();
    }
  }, [userEmail]);

  useEffect(() => {
    if (onBuySuccess) {
      onBuySuccess((boughtRandy) => {
        setRemainingRandy((prevRemainingRandy) => prevRemainingRandy - boughtRandy);
        setUserRandyBalance((prevBalance) => prevBalance + boughtRandy);
      });
    }
  }, [onBuySuccess]);

  const remainingPercentage = (remainingRandy / TOTAL_RANDY_SUPPLY) * 100;

  return (
    <Box marginTop={4}>
      <Typography variant="h6" gutterBottom>
        RANDY Tokens Remaining: {remainingRandy.toLocaleString()} / {TOTAL_RANDY_SUPPLY.toLocaleString()}
      </Typography>
      <Box position="relative" width="100%">
        <LinearProgress variant="determinate" value={remainingPercentage} />
        <Box
          position="absolute"
          top="50%"
          left={`${remainingPercentage}%`}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <img
            src={randyCoinImage}
            alt="Progress Indicator"
            style={{ width: '100px', height: '100px' }}
          />
        </Box>
      </Box>
      <Typography variant="body1" gutterBottom>
        Your RANDY Balance: {userRandyBalance.toLocaleString()}
      </Typography>
    </Box>
  );
}

export default RandyBar;