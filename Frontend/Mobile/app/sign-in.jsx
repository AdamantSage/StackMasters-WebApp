import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signInLoading, setSignInLoading] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both email and password!');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address!');
            return;
        }

        setSignInLoading(true);

        try {
            const response = await fetch('http://192.168.58.188:5000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.userId) {
                    await AsyncStorage.setItem('jwt', data.token);
                    await AsyncStorage.setItem('userId', JSON.stringify(data.userId));
                    router.push('/(Screens)/home');
                } else {
                    Alert.alert('Error', 'User ID is not available.');
                }
            } else {
                Alert.alert('Error', data.message || 'Invalid email or password');
            }
        } catch (error) {
            if (error.message === 'Network request failed') {
                Alert.alert('Network Error', 'Unable to connect. Please check your internet connection and try again.');
            } else {
                Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
            }
        } finally {
            setSignInLoading(false);
        }
    };

    const handleRegisterPress = () => {
        setRegisterLoading(true);
        router.push('/register');
        setTimeout(() => {
            setRegisterLoading(false);
        }, 500);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <Text style={styles.header}>Sign-In</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={setEmail}
                    value={email}
                    editable={!signInLoading && !registerLoading}
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={!showPassword}
                        editable={!signInLoading && !registerLoading}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Text style={styles.togglePassword}>
                            {showPassword ? 'Hide' : 'Show'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleSignIn} 
                    disabled={signInLoading || registerLoading}
                >
                    {signInLoading ? (
                        <ActivityIndicator color="#f8f8ff" />
                    ) : (
                        <Text style={styles.buttonText}>Sign In</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleRegisterPress} 
                    disabled={signInLoading || registerLoading}
                >
                    {registerLoading ? (
                        <ActivityIndicator color="#f8f8ff" />
                    ) : (
                        <Text style={styles.buttonText}>Register</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.quickNavButton} 
                    onPress={() => router.push('/(Screens)/home')}
                    disabled={signInLoading || registerLoading}
                >
                    <Text style={styles.buttonText}>Go to Home (Quick Nav)</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#afdde5', // Light background
    },
    header: {
        fontSize: 25,
        textAlign: 'center',
        marginVertical: 20,
        color: '#003135', // Dark teal for header
    },
    input: {
        height: 45,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: '#024950', // Darker teal border
        borderRadius: 25, // Rounded corners
        backgroundColor: '#fff', // White background for input
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // For Android shadow
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 12,
    },
    togglePassword: {
        color: '#003135', // Dark teal for toggle text
    },
    button: {
        backgroundColor: '#663399', 
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25, // Rounded corners
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // For Android shadow
    },
    buttonText: {
        color: '#f8f8ff', // Light text for button
        fontSize: 16,
        textAlign: 'center',
    },
});

export default SignIn;
