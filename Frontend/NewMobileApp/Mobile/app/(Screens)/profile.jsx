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

      const response = await fetch(`http://192.168.58.28:5000/users/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text(); // Read response as text
        Alert.alert('Error', errorData || 'Failed to fetch user data');
        throw new Error(errorData); // Throw an error to handle it in the catch block
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

      // Navigate the user to the login screen
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
        updateData.password = password; // Only include password if it's set
    }

    try {
        const response = await fetch(`http://192.168.58.28:5000/users/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
        });

        // Check if the response is OK and parse JSON
        const data = await response.json(); // Directly parse as JSON

        if (response.ok) {
            Alert.alert('Success', 'Profile updated successfully');
            // Reset fields
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            fetchUserData(userId); // Refresh user data after update
        } else {
            Alert.alert('Error', data.message || 'Update failed');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Unable to update profile, please try again');
    }
};

  

  // Handle user deletion
  const handleDeleteUser = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account? This action cannot be undone.',
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
              const token = await AsyncStorage.getItem('jwt');
              if (!token) {
                Alert.alert('Error', 'You need to log in to delete your account.');
                return;
              }
  
              const response = await fetch(`http://192.168.58.28:5000/users/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json', // Ensure content type is set
                  Authorization: `Bearer ${token}`,
                },
              });
  
              if (response.ok) {
                Alert.alert('Success', 'User deleted successfully');
                router.push('/sign-in'); // Redirect to login after deletion
              } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to delete user');
              }
            } catch (error) {
              console.error('Error deleting user:', error);
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
          onChangeText={setName}
          value={name}
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
  buttonContainer: {
    flexDirection: 'row', // Align buttons in a row
  },
  updateButton: {
    backgroundColor: '#663399',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10, // Space between buttons
  },
  logoutButton: {
    backgroundColor: '#d9534f', // Example red color for logout
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    margin: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  toggleText: {
    color: '#663399',
  },
  label: {
    fontSize: 16,
    margin: 12,
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
    margin: 12,
  },
});

export default Profile;