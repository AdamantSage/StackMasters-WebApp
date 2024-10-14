import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
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
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State for confirm password visibility

  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://192.168.58.188:5000/users/create/', {
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

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Registration successful');
        router.push('/(Screens)/home');
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to register, please try again');
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
            secureTextEntry={!passwordVisible} // Toggle password visibility
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
            secureTextEntry={!confirmPasswordVisible} // Toggle confirm password visibility
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Text style={styles.toggleText}>
              {confirmPasswordVisible ? 'Hide' : 'Show'}
            </Text>
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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
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
    color: '#000', // Change to fit your design
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
