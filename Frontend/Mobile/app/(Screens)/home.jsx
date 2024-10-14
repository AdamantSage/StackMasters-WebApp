import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const Home = ({ loggedInUserId }) => {
  const router = useRouter();

  const goToProfile = () => {
    router.push(`/profile?userId=${loggedInUserId}`);
  };

  const goToAssignments = () => {
    router.push('/assignments');
  };

  const goToSubmissions = () => {
    router.push('/submission');
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Logout",
        onPress: () => router.push('/sign-in') // Adjust according to your routing
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <TouchableOpacity style={styles.sidebarButton} onPress={goToProfile}>
          <Text style={styles.sidebarButtonText}>Go to Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarButton} onPress={goToAssignments}>
          <Text style={styles.sidebarButtonText}>Assignments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarButton} onPress={goToSubmissions}>
          <Text style={styles.sidebarButtonText}>Submissions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarButton} onPress={handleLogout}>
          <Text style={styles.sidebarButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.title}>Welcome Home!</Text>
        <Text style={styles.subtitle}>Designed by Michael, Tintswalo, Charmaine, and Marco</Text>
        <Text style={styles.subtitle}>What would you like to do?</Text>
        {/* Removed the Go to Profile button from here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#afdde5', // Light background color
  },
  sidebar: {
    width: '30%', // Adjust width as needed
    backgroundColor: '#003135', // Dark teal for sidebar
    padding: 20,
    justifyContent: 'flex-start',
  },
  sidebarButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#663399', // Purple button color for sidebar
  },
  sidebarButtonText: {
    color: '#fff', // White text for sidebar buttons
    fontSize: 16,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonText: {
    color: '#fff', // White text for buttons
    fontSize: 16,
  },
});

export default Home; // Use PascalCase for component names
