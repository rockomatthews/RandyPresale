// TransactionStatus.js
import React from 'react';
import { Box, Typography } from '@mui/material';

function TransactionStatus({ status }) {
  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      padding={2}
      bgcolor="primary.main"
      color="primary.contrastText"
      textAlign="center"
    >
      <Typography variant="body1">{status}</Typography>
    </Box>
  );
}

export default TransactionStatus;