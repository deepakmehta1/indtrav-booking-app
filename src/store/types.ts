// src/store/types.ts
import store from './index'; // Import the store from the index file

export interface TripState {
  tripId: string | null;
}

export interface UserState {
  email: string | null; // Define user email state
  firebaseToken: string;
}

export interface RootState {
  trip: TripState; // Define the shape of trip state
  user: UserState; // Define the shape of user state
}

export type AppDispatch = typeof store.dispatch; // Define AppDispatch type based on the store
