import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
} from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setTripId } from '../store/reducers';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import googleLogo from '../assets/google-logo.png';
import { RootState, AppDispatch } from '../store';
import Modal from './Modal'; // Import the Modal component

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const tripIdFromUrl = new URLSearchParams(useLocation().search).get(
    'trip_id',
  );
  const tripId = useSelector((state: RootState) => state.trip.tripId);

  useEffect(() => {
    if (tripIdFromUrl) {
      dispatch(setTripId(tripIdFromUrl));
      console.log('Trip ID from URL:', tripIdFromUrl);
    }
  }, [dispatch, tripIdFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        if (password !== reenterPassword) {
          setError('Passwords do not match!');
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;

        if (user) {
          await sendEmailVerification(user);
          console.log('User signed up:', user.email);
        }

        alert(
          'Sign-up successful! Please verify your email before logging in.',
        );
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in:', email);

        // Show modal on successful login
        setShowModal(true);

        // Redirect to the booking page with trip_id after a short delay
        setTimeout(() => {
          const redirectPath = `/booking?trip_id=${tripIdFromUrl || ''}`;
          navigate(redirectPath);
        }, 1500); // 1.5 seconds delay
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Login error:', err);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log('Google login successful!');

      // Show modal on successful Google login
      setShowModal(true);

      // Redirect to the booking page with trip_id after a short delay
      setTimeout(() => {
        const redirectPath = `/booking?trip_id=${tripIdFromUrl || ''}`;
        navigate(redirectPath);
      }, 1500); // 1.5 seconds delay
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred during Google login',
      );
      console.error('Google login error:', err);
    }
  };

  return (
    <div className="login-container">
      {showModal && (
        <Modal
          message="Yay!! You are successfully logged in! 🔥"
          onClose={() => setShowModal(false)}
        />
      )}
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {isSignUp && (
          <input
            type="password"
            placeholder="Re-enter Password"
            value={reenterPassword}
            onChange={(e) => setReenterPassword(e.target.value)}
            required
          />
        )}
        {isSignUp && (
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        )}
        <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
      </form>

      {!isSignUp && (
        <div className="google-login">
          <button onClick={handleGoogleLogin}>
            <img src={googleLogo} alt="Google logo" className="google-logo" />
            Sign in with Google
          </button>
        </div>
      )}

      <p>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Login' : 'Sign Up'}
        </button>
      </p>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
