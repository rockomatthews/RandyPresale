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
      <Box position="relative" width="100%" height="50px">
        <LinearProgress
          variant="determinate"
          value={remainingPercentage}
          style={{ height: '100%', borderRadius: '4px' }}
        />
        <Box
          position="absolute"
          top="50%"
          left={`${remainingPercentage}%`}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <img
            src={randyCoinImage}
            alt="Progress Indicator"
            style={{ width: '75px', height: '75px' }}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="green"
        padding={2}
        borderRadius={4}
        marginTop={2}
      >
        <Typography variant="body1" fontWeight="bold" color="white">
          Your $RANDY Balance: {userRandyBalance.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}

export default RandyBar;