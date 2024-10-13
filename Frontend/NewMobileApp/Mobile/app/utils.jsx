// utils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    return userId ? JSON.parse(userId) : null; // Assuming userId is stored as a JSON string
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    return null;
  }
};