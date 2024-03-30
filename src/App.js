import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, Select, MenuItem, TextField, Container, Box } from '@mui/material';

const API_URL = 'https://api.nowpayments.io/v1';
const API_KEY = '9BTTTGS-3S0M680-P3TMZJK-4HA6C3N'; // Replace with your actual API key

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [minimumAmount, setMinimumAmount] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [paymentCreated, setPaymentCreated] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    // Get available currencies
    axios.get(`${API_URL}/currencies`, {
      headers: {
        'x-api-key': API_KEY
      }
    })
      .then(response => {
        const sortedCurrencies = response.data.currencies.sort();
        setCurrencies(sortedCurrencies);
      })
      .catch(error => {
        console.error('Error fetching currencies:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCurrency) {
      // Get minimum payment amount
      axios.get(`${API_URL}/min-amount`, {
        headers: {
          'x-api-key': API_KEY
        },
        params: {
          currency_from: selectedCurrency,
          currency_to: 'usd'
        }
      })
        .then(response => {
          const minAmount = response.data.min_amount;
          setMinimumAmount(minAmount);
        })
        .catch(error => {
          console.error('Error fetching minimum payment amount:', error);
        });
    }
  }, [selectedCurrency]);

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

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handlePreviewClick = () => {
    if (selectedCurrency && amount && parseFloat(amount) >= parseFloat(minimumAmount)) {
      // Get estimated price
      axios.get(`${API_URL}/estimate`, {
        headers: {
          'x-api-key': API_KEY
        },
        params: {
          amount: amount,
          currency_from: selectedCurrency,
          currency_to: 'usd'
        }
      })
        .then(response => {
          const estimatedAmount = response.data.estimated_amount;
          setEstimatedPrice(estimatedAmount);
          setShowPreview(true);
        })
        .catch(error => {
          console.error('Error fetching estimated price:', error);
        });
    } else {
      setEstimatedPrice(null);
      setShowPreview(false);
    }
  };

  const handleBuyClick = () => {
    if (selectedCurrency && amount && parseFloat(amount) >= parseFloat(minimumAmount)) {
      // Create payment
      axios.post(`${API_URL}/payment`, {
        price_amount: estimatedPrice,
        price_currency: 'usd',
        pay_currency: selectedCurrency,
        ipn_callback_url: 'https://your-callback-url.com/ipn', // Replace with your actual callback URL
        order_id: 'YOUR_UNIQUE_ORDER_ID', // Replace with your own unique order ID
        order_description: 'Purchase of RANDY tokens',
        success_url: 'https://your-success-url.com', // Replace with your own success URL
        cancel_url: 'https://your-cancel-url.com' // Replace with your own cancel URL
      }, {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          setPaymentCreated(true);
          setPaymentData(response.data);
        })
        .catch(error => {
          console.error('Error creating payment:', error);
        });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="flex-end" marginTop={2} marginRight={2}>
        <Button variant="contained" onClick={connectWallet}>
          {walletAddress ? (
            <span>Connected: {walletAddress.substring(0, 4)}...{walletAddress.substring(walletAddress.length - 4)}</span>
          ) : (
            <span>Connect to Phantom</span>
          )}
        </Button>
      </Box>

      <Typography variant="h4" align="center" gutterBottom>
        A $Randy Presale
      </Typography>

      <Typography variant="body1" align="center" gutterBottom>
        Welcome to the $Randy Coin Presale. Use any listed crypto to buy yourself some $RANDY. Right now it costs 0.05 dollars per $RANDY but there is a minimum for each currency. Get $RANDY and buy some.
      </Typography>

      <Box border={1} borderRadius={4} padding={2} marginTop={4}>
        <Typography variant="h6" gutterBottom>
          Select Payment Currency
        </Typography>
        <Select
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">Select currency</MenuItem>
          {currencies.map(currency => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>

        {selectedCurrency && (
          <Box marginTop={2}>
            {minimumAmount && (
              <Typography variant="body1" gutterBottom>
                Minimum amount required: {minimumAmount} {selectedCurrency}
              </Typography>
            )}

            <Typography variant="h6" gutterBottom>
              Enter Amount
            </Typography>
            <TextField
              type="number"
              value={amount}
              onChange={handleAmountChange}
              fullWidth
              margin="normal"
            />

            <Button
              variant="contained"
              onClick={handlePreviewClick}
              fullWidth
              style={{ marginTop: '16px' }}
            >
              Preview
            </Button>

            {showPreview && estimatedPrice && (
              <Box marginTop={2}>
                <Typography variant="body1" gutterBottom>
                  Estimated Amount: ${estimatedPrice} USD
                </Typography>
                <Typography variant="body1" gutterBottom>
                  You will receive: {(estimatedPrice / 0.05).toFixed(2)} RANDY
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBuyClick}
                  fullWidth
                  style={{ marginTop: '16px' }}
                >
                  BUY $RANDY
                </Button>
              </Box>
            )}

            {paymentCreated && paymentData && (
              <Box marginTop={2}>
                <Typography variant="h6" gutterBottom>
                  Payment Created
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Payment ID: {paymentData.payment_id}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Deposit Address: {paymentData.pay_address}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Amount to Send: {paymentData.pay_amount} {paymentData.pay_currency}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;