import axios from 'axios';

// Set your API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const initializeBooking = async (data: {
  mobile: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  age: string;
}) => {
  const response = await axios.post(
    `${API_URL}/bookings/api/init-booking/`,
    data,
  );
  return response.data; // Return the response data
};
