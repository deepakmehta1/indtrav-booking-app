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
import { setTripId, setUserEmail, setFirebaseToken } from '../store/reducers';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import googleLogo from '../assets/google-logo.png';
import { RootState, AppDispatch } from '../store';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State for modal message

  const dispatch = useDispatch<AppDispatch>();
  const tripId = useSelector((state: RootState) => state.trip.tripId);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tripIdFromUrl = params.get('trip_id');
    if (tripIdFromUrl) {
      dispatch(setTripId(tripIdFromUrl));
      console.log('Trip ID from URL:', tripIdFromUrl); // Debugging line
    }
  }, [dispatch]);

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
          console.log('User signed up:', user.email); // Debugging line
          dispatch(setUserEmail(user.email)); // Dispatch user email to Redux store
          dispatch(setFirebaseToken(await user.getIdToken())); // Dispatch the Firebase token
          setModalMessage(
            'Yay!! You are successfully signed up! Please verify your email before logging in.',
          );
          setShowModal(true); // Show modal on signup success
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;
        console.log('User logged in:', email); // Debugging line
        dispatch(setUserEmail(email)); // Dispatch user email to Redux store
        dispatch(setFirebaseToken(await user.getIdToken())); // Dispatch the Firebase token

        // Redirect to the booking page with trip_id
        const redirectPath = `/booking?trip_id=${tripId || ''}`;
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Login error:', err); // Debugging line
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // Get the user info
      console.log('Google login successful!'); // Debugging line

      // Dispatch user email to Redux store
      dispatch(setUserEmail(user.email || null));
      dispatch(setFirebaseToken(await user.getIdToken())); // Dispatch the Firebase token

      // Redirect to the booking page with trip_id
      const redirectPath = `/booking?trip_id=${tripId || ''}`;
      navigate(redirectPath);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred during Google login',
      );
      console.error('Google login error:', err); // Debugging line
    }
  };

  return (
    <div className="login-container">
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

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <p style={{ color: 'green' }}>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
