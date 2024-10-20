// App.tsx
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import BookingForm from './components/BookingForm';
import Login from './components/Login';
import NotFound from './components/NotFound';
import { AuthProvider, useAuth } from './AuthContext';

const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { user, loading } = useAuth();
  const tripId = new URLSearchParams(window.location.search).get('trip_id'); // Get trip_id from URL

  if (loading) return <div>Loading...</div>; // Show loading state

  return user ? element : <Navigate to={`/login?trip_id=${tripId || ''}`} />; // Redirect with trip_id
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AuthProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/login" element={<LoginWrapper />} />
              <Route
                path="/booking"
                element={<ProtectedRoute element={<Home />} />}
              />
              <Route
                path="/booking/:type"
                element={<ProtectedRoute element={<BookingForm />} />}
              />
              {/* More protected routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </Router>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
};

const LoginWrapper: React.FC = () => {
  const { user } = useAuth(); // Get user from AuthContext

  // If user is logged in, redirect to /booking
  if (user) {
    return <Navigate to="/booking" />;
  }

  return <Login />; // Render the Login component if not logged in
};

export default App;
