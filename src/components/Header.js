// Header.js
import React from 'react';
import { Button, Typography, Box } from '@mui/material';

function Header({ walletAddress, isAuthenticated, userEmail, onConnectWallet }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2} marginBottom={4}>
      <Typography variant="body1">
        {isAuthenticated ? `Signed in as: ${userEmail}` : 'Not Signed In'}
      </Typography>
      <Button variant="contained" onClick={onConnectWallet}>
        {walletAddress ? (
          <span>Connected: {walletAddress.substring(0, 4)}...{walletAddress.substring(walletAddress.length - 4)}</span>
        ) : (
          <span>Connect to Phantom</span>
        )}
      </Button>
    </Box>
  );
}

export default Header;