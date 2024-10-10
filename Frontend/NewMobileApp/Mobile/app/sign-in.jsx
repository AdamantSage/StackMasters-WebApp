import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React from 'react'
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            const response = await fetch('http://192.168.0.23:5000/users/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                password: password,
              }),
            });
            const data = await response.json();

        if (response.ok) {
            Alert.alert('Success', 'Login successful');
            router.push('/(Screens)/home');  
        } else {
            Alert.alert('Error', data.message || 'Invalid credentials');
        }
        } catch (error) {
            Alert.alert('Error', 'Unable to log in, please try again');
        }
    };

    return (
    <SafeAreaView>
        <ScrollView>
            <Text style={styles.Header}>
                Sign-In
            </Text>
            <TextInput
            style={styles.input}
            placeholder="username"
            onChangeText={setUsername}
            value={username}
            onFocus={() => setUsername('')}
            />
            <TextInput
            style={styles.input}
            placeholder="password"
            onChangeText={setPassword}
            value={password}
            onFocus={() => setPassword('')}
            />
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>
                    Sign In
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.quickNavButton} 
                onPress={() => router.push('/(Screens)/home')}>
                <Text style={styles.buttonText}>Go to Home (Quick Nav)</Text>
                </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    Header:{
        fontSize: 25
    },
    input:{
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10
    },
    button:{
        backgroundColor: '#663399',
        paddingVertical: 10,        
        paddingHorizontal: 20,        
        borderRadius: 5,             
        marginTop: 20
      },
      buttonText: {
        color: '#f8f8ff',          
        fontSize: 16,                 
        textAlign: 'center'
      }
});

export default SignIn