import axios from 'axios';
import { BASE_URL } from 'react-native-dotenv';

const api = axios.create({
  baseURL: `http//192.168.100.5:8000/api`,
});

export const fetchData = async () => {
  try {
    const response = await api.get('');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
