// pages/api/ipn-handler.js
import crypto from 'crypto';
import { createStore } from 'redux';

const IPN_SECRET_KEY = 'BhhVWpgUwcP1ThMep4gMZdIRio6qwOXL'; // Replace with your actual IPN secret key

// Define the initial state
const initialState = {
  transactions: {},
};

// Define the reducer function
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_TRANSACTION_STATUS':
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [action.payload.paymentId]: action.payload.status,
        },
      };
    default:
      return state;
  }
}

// Create the Redux store
const store = createStore(reducer);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const ipnData = req.body;
    const signature = req.headers['x-nowpayments-sig'];

    try {
      // Verify the IPN signature
      const isValid = verifyIPNSignature(ipnData, signature);

      if (isValid) {
        // Process the IPN data and update the transaction status
        const { payment_status, payment_id } = ipnData;

        // Dispatch an action to update the transaction status in the Redux store
        store.dispatch({
          type: 'UPDATE_TRANSACTION_STATUS',
          payload: {
            paymentId: payment_id,
            status: payment_status,
          },
        });

        // Get the updated state from the Redux store
        const updatedState = store.getState();

        console.log('Updated Transaction Status:', updatedState.transactions[payment_id]);

        res.status(200).send('OK');
      } else {
        console.error('Invalid IPN signature');
        res.status(400).send('Invalid signature');
      }
    } catch (error) {
      console.error('Error processing IPN:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

// Function to verify the IPN signature
function verifyIPNSignature(ipnData, signature) {
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
}