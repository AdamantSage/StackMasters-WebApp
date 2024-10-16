import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwt');
      await AsyncStorage.removeItem('userId');
      router.push('/sign-in');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Unable to log out, please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <Text style={styles.logo}>HMS-StackMasters</Text>
        <TouchableOpacity style={styles.sidebarButton} onPress={goToProfile}>
          <Text style={styles.sidebarButtonText}>Profile</Text>
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
        <Image source={{ uri: 'https://img.freepik.com/free-vector/multi-ethnic-group-school-students-kids_3446-667.jpg?t=st=1729092255~exp=1729095855~hmac=e5f2132e5c4d023c8865289d02fbffd187989a0fe9a0d77253963e13f78473b2&w=740' }} style={styles.profilePic} />
        <Text style={styles.subtitle}>Designed by Michael, Tintswalo, Charmaine, and Marco</Text>
        <Text style={styles.subtitle}>What would you like to do today?</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#eaf4f7', // Light background color
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#003135',
    padding: 20,
    justifyContent: 'flex-start',
  },
  logo: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sidebarButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#663399',
  },
  sidebarButtonText: {
    color: '#fff',
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
    color: '#003135',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#003135',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default Home;
