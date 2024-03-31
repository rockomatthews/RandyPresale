// IPNHandler.js
import { useEffect } from 'react';
import axios from 'axios';
import crypto from 'crypto';

const IPN_SECRET_KEY = 'BhhVWpgUwcP1ThMep4gMZdIRio6qwOXL'; // Replace with your actual IPN secret key

function IPNHandler({ onPaymentStatusChange }) {
  useEffect(() => {
    const handleIPN = async (request, response) => {
      try {
        const ipnData = request.body;
        const signature = request.headers['x-nowpayments-sig'];

        // Verify the IPN signature
        const isValid = verifyIPNSignature(ipnData, signature);

        if (isValid) {
          // Process the IPN data and update the transaction status
          const { payment_status, payment_id } = ipnData;

          // Update your transaction status based on the received payment_status
          onPaymentStatusChange(payment_id, payment_status);

          // Send a 200 OK response to acknowledge the IPN
          response.status(200).send('OK');
        } else {
          console.error('Invalid IPN signature');
          response.status(400).send('Invalid signature');
        }
      } catch (error) {
        console.error('Error processing IPN:', error);
        response.status(500).send('Internal Server Error');
      }
    };

    // Set up the API route for handling IPN callbacks
    const apiRoute = '/api/ipn-handler';

    // Register the IPN handler with your server or serverless function
    axios.post(apiRoute, handleIPN);

    // Clean up the route on component unmount
    return () => {
      // Remove the IPN handler from your server or serverless function
      axios.delete(apiRoute);
    };
  }, [onPaymentStatusChange]);

  // Function to verify the IPN signature
  const verifyIPNSignature = (ipnData, signature) => {
    // Sort the IPN data by keys
    const sortedData = Object.keys(ipnData)
      .sort()
      .reduce((obj, key) => {
        obj[key] = ipnData[key];
        return obj;
      }, {});

    // Convert the sorted data to a string
    const sortedDataString = JSON.stringify(sortedData);

    // Create a HMAC SHA512 hash using the IPN secret key
    const hmac = crypto.createHmac('sha512', IPN_SECRET_KEY);
    hmac.update(sortedDataString);
    const calculatedSignature = hmac.digest('hex');

    // Compare the calculated signature with the received signature
    return calculatedSignature === signature;
  };

  return null;
}

export default IPNHandler;