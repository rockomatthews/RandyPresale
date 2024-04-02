// RandyBar.js
import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import randyCoinImage from '../assets/randyCoin.png';

const TOTAL_RANDY_SUPPLY = 21000000;

function RandyBar({ userEmail, remainingRandy, userMetadata }) {
  const userRandyBalance = userMetadata[userEmail]?.Randy_Balance || 0;
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
        Your $RANDY Balance: {userRandyBalance.toLocaleString()}
      </Typography>
    </Box>
  );
}

export default RandyBar;  