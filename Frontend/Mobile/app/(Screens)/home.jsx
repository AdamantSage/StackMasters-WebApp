import { View, Text, TouchableOpacity,Alert, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const Home = ({ loggedInUserId }) => {
  const router = useRouter();

  const goToProfile = () => {
    router.push(`/profile?userId=${loggedInUserId}`);
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Home!</Text>
      <Text style={styles.subtitle}>What would you like to do?</Text>

      <TouchableOpacity style={styles.button} onPress={goToProfile}>
        <Text style={styles.buttonText}>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#afdde5', // Light background color
    padding: 20,
  },
  title: {
    fontSize: 30,
    color: '#003135', // Dark teal for title
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#003135', // Dark teal for subtitle
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#663399', // Purple button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#964734', // Brown button color for logout
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff', // White text for buttons
    fontSize: 16,
  },
});

export default Home; // Use PascalCase for component names
