// RandyBar.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const COUNTDOWN_DATE = new Date('June 4, 2024 00:00:00').getTime();
const TOTAL_RANDY_SUPPLY = 21000000;

function RandyBar({ userEmail, remainingRandy, userMetadata, onBuySuccess }) {
  const userRandyBalance = userMetadata && userMetadata[userEmail] ? userMetadata[userEmail].Randy_Balance || 0 : 0;
  const remainingPercentage = (remainingRandy / TOTAL_RANDY_SUPPLY) * 100;
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = COUNTDOWN_DATE - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <Box marginTop={4}>
      <Typography variant="h5" gutterBottom fontWeight="bold" align="center">
        Days left to buy $RANDY
      </Typography>
      <Typography variant="h5" gutterBottom fontWeight="bold" align="center">
        {countdown.days} Days {countdown.hours} Hours {countdown.minutes} Minutes {countdown.seconds} Seconds
      </Typography>
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
            src="https://firebasestorage.googleapis.com/v0/b/randy-presale.appspot.com/o/randyCoin.png?alt=media&token=3c5c1a86-4bbd-4a70-9ad7-020f05be4e22"
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