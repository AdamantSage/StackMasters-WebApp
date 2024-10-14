import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from '../utils'; // Adjusted import path

const Profile = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user ID and user data on mount
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      if (id) {
        setUserId(id);
        fetchUserData(id);
      } else {
        Alert.alert('Error', 'User ID is missing. Please log in again.');
        router.push('/sign-in');
      }
    };
    
    fetchUserId();
  }, []);

  // Fetch user data when userId is available
  const fetchUserData = async (userId) => {
    console.log('Fetching user data for User ID:', userId);
    setIsLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        router.push('/sign-in');
        return;
      }

      const response = await fetch(`http://192.168.58.188:5000/users/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        Alert.alert('Error', errorData || 'Failed to fetch user data');
        throw new Error(errorData);
      }

      const data = await response.json();
      setName(data.name);
      setEmail(data.email);
      setRole(data.role);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Unable to fetch user data, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwt'); // Remove the JWT token
      await AsyncStorage.removeItem('userId'); // Remove the user ID
      router.push('/sign-in');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Unable to log out, please try again.');
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem('jwt');
    if (!userId || !token) {
      Alert.alert('Error', 'User ID or token not found. Please log in again.');
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Prepare update data (excluding userId)
    const updateData = { name, email };
    if (password) {
      updateData.password = password;
    }

    try {
      const response = await fetch(`http://192.168.58.188:5000/users/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully');
        // Reset fields
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        fetchUserData(userId);
      } else {
        Alert.alert('Error', data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Unable to update profile, please try again');
    }
  }; 

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Profile</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#afdde5" // Placeholder color
          onChangeText={setName}
          value={name}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#afdde5"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="New Password"
            placeholderTextColor="#afdde5"
            secureTextEntry={!passwordVisible}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Text style={styles.toggleText}>
              {passwordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#afdde5"
            secureTextEntry={!confirmPasswordVisible}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Text style={styles.toggleText}>
              {confirmPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Role: {role}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#afdde5', // Light background color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#003135', // Darker text for loading message
    fontSize: 18,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
  },
  header: {
    fontSize: 25,
    color: '#003135', // Dark teal for header text
  },
  buttonContainer: {
    flexDirection: 'row', // Align buttons in a row
  },
  updateButton: {
    backgroundColor: '#663399', // Updated button color
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25, // Rounded corners for button
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#964734', // Brown color for logout
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25, // Rounded corners for button
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#afdde5', // Soft border color
    borderRadius: 25, // More pronounced rounded corners
    padding: 10,
    margin: 12,
    backgroundColor: '#fff', // White background for inputs
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#afdde5', // Soft border color
    borderRadius: 25, // More pronounced rounded corners
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  toggleText: {
    color: '#0fa4af', // Teal color for toggle text
  },
  label: {
    fontSize: 16,
    margin: 12,
    color: '#003135', // Dark teal for label text
  },
});

export default Profile;
