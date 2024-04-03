// SignUpForm.js
import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAf3BBaZDK7JS9QoPpsoc0YAXSj0IRy510",
  authDomain: "randy-presale.firebaseapp.com",
  projectId: "randy-presale",
  storageBucket: "randy-presale.appspot.com",
  messagingSenderId: "211476736203",
  appId: "1:211476736203:web:acc7640478be8bbdd6534e",
  measurementId: "G-P50XX80XPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

function SignUpForm({ onSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailSignUp = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up with email:', userCredential.user);
      onSignUp(userCredential.user.email);
    } catch (error) {
      console.error('Error signing up with email:', error);
      setError(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User signed up with Google:', result.user);
      onSignUp(result.user.email);
    } catch (error) {
      console.error('Error signing up with Google:', error);
      if (error.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please allow pop-ups from this site to sign in with Google.');
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <Box marginTop={4}>
      <Typography variant="h5" gutterBottom>
        Sign Up
      </Typography>
      {error && (
      <Typography color="error" gutterBottom>
        {error}
      </Typography>
      )}
      <form onSubmit={handleEmailSignUp}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign Up with Email
        </Button>
      </form>
      <Box marginTop={2}>
        <Button variant="contained" color="secondary" fullWidth onClick={handleGoogleSignUp}>
          Sign Up with Google
        </Button>
      </Box>
    </Box>
  );
}

export default SignUpForm;