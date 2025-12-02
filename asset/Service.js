import axios from 'axios';
import { BASE_URL } from 'react-native-dotenv';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export const fetchData = async () => {
  try {
    const response = await api.get('');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
