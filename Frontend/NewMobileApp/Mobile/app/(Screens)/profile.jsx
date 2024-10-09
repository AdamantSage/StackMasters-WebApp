import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure you import AsyncStorage

const profile = ({ userId }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('jwt'); // Retrieve the JWT
        console.log('Token retrieved from AsyncStorage:', token); // Log the token

        if (!token) {
          Alert.alert('Error', 'No token found. Please log in again.');
          return; // Exit if no token
        }

        const response = await fetch(`https://your-backend-url.com/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT in the headers
          },
        });
        const data = await response.json();
        console.log('User data:', data); // Log user data

        if (response.ok) {
          setUsername(data.username);
          setEmail(data.email);
          setRole(data.role);
        } else {
          Alert.alert('Error', data.message || 'Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error); // Log the error
        Alert.alert('Error', 'Unable to fetch user data, please try again');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('jwt'); // Retrieve the JWT
      const response = await fetch(`https://your-backend-url.com/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the JWT in the headers
        },
        body: JSON.stringify({
          username,
          email,
          password, // Include new password if provided
          role, // Allow role update
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully');
        router.push('/(Screens)/home'); // Redirect to home after update
      } else {
        Alert.alert('Error', data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error); // Log the error
      Alert.alert('Error', 'Unable to update profile, please try again');
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('jwt'); // Retrieve the JWT
              const response = await fetch(`https://your-backend-url.com/users/${userId}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`, // Include the JWT in the headers
                },
              });

              if (response.ok) {
                Alert.alert('Success', 'User deleted successfully');
                router.push('/(Screens)/login'); // Redirect to login screen after deletion
              } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to delete user');
              }
            } catch (error) {
              console.error('Error deleting user:', error); // Log the error
              Alert.alert('Error', 'Unable to delete user, please try again');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.Header}>Profile</Text>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="New Password"
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

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteUser}>
          <Text style={styles.buttonText}>Delete User</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 12,
  },
  Header: {
    fontSize: 25,
  },
  updateButton: {
    backgroundColor: '#663399',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    borderWidth: 1,
    borderColor: '#f8f8ff',
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    color: '#000',
  },
  toggleText: {
    color: '#663399',
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginLeft: 12,
    marginTop: 10,
  },
  buttonText: {
    color: '#f8f8ff',
    fontSize: 16,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 12,
  },
});

export default profile;
