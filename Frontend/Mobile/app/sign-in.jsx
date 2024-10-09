import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const SignIn = () => {
    const [email, setEmail] = useState('email');
    const [password, setPassword] = useState('Password');
    const router = useRouter();

    const handleSignIn = async () => {
        await AsyncStorage.clear();

        try {
            const response = await fetch('http://192.168.57.168:5000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                await AsyncStorage.setItem('jwt', data.token);
                await AsyncStorage.setItem('userId', data.userId); // Store userId
    
                 router.push('/(Screens)/home');
            } else {
                Alert.alert('Error', data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('SignIn error:', error);
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
                    placeholder="email"
                    onChangeText={setEmail}
                    value={email}
                    onFocus={() => setEmail('')}
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
    );
};

const styles = StyleSheet.create({
    Header: {
        fontSize: 25,
    },
    input: {
        height: 40,
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
    },
    buttonText: {
        color: '#f8f8ff',          
        fontSize: 16,                 
        textAlign: 'center',
    },
});

export default SignIn;
