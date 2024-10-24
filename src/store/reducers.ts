// src/store/reducers.ts
import { combineReducers } from 'redux';

// Define action types
const SET_TRIP_ID = 'SET_TRIP_ID';
const SET_USER_EMAIL = 'SET_USER_EMAIL';
const SET_FIREBASE_TOKEN = 'SET_FIREBASE_TOKEN';

// Initial state type
interface TripState {
  tripId: string | null;
}

interface UserState {
  email: string | null;
  firebaseToken: string;
}

// Action creator for setting trip_id
export const setTripId = (tripId: string | null) => ({
  type: SET_TRIP_ID,
  payload: tripId,
});

// Action creator for setting user email
export const setUserEmail = (email: string | null) => ({
  type: SET_USER_EMAIL,
  payload: email,
});

export const setFirebaseToken = (token: string | null) => ({
  type: SET_FIREBASE_TOKEN,
  payload: token,
});

// Initial state
const initialTripState: TripState = {
  tripId: null, // tripId should start as null
};

const initialUserState: UserState = {
  email: null,
  firebaseToken: '',
};

// Trip reducer
const tripReducer = (
  state = initialTripState,
  action: { type: string; payload?: string | null },
): TripState => {
  switch (action.type) {
    case SET_TRIP_ID:
      return { ...state, tripId: action.payload ?? null }; // Update tripId
    default:
      return state; // Always return the current state if no action matches
  }
};

// User reducer
const userReducer = (
  state = initialUserState,
  action: { type: string; payload?: string | null },
): UserState => {
  switch (action.type) {
    case SET_USER_EMAIL:
      return { ...state, email: action.payload ?? null }; // Update user email
    case SET_FIREBASE_TOKEN: // Handle the new action
      return { ...state, firebaseToken: action.payload ?? '' }; // Update firebase token
    default:
      return state; // Always return the current state if no action matches
  }
};

// Combine reducers
const rootReducer = combineReducers({
  trip: tripReducer,
  user: userReducer,
});

export default rootReducer;
