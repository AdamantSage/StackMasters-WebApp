import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email is valid
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.58.28:5000/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
          passwordConfirm: confirmPassword,
          role,
        }),
      });

      const text = await response.text();
      console.log('Response Text:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error('JSON Parse Error:', error);
        Alert.alert('Error', 'Failed to parse server response');
        setLoading(false);
        return;
      }

      if (response.ok) {
        Alert.alert('Success', 'Registration successful');
        router.push('/sign-in');
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Unable to register, please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={styles.Header}>Register</Text>

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
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Text style={styles.toggleText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
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
            <Text style={styles.toggleText}>{confirmPasswordVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Select Role</Text>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="Lecturer" value="lecturer" />
          <Picker.Item label="Student" value="student" />
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#f8f8ff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/sign-in')}>
          <Text style={styles.buttonText}>Log-In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Header: {
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 20,
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
  picker: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#663399',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 12,
  },
  buttonText: {
    color: '#f8f8ff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Register;
