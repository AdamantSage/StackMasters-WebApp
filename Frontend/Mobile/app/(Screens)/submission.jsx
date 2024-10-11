import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from '../utils'; // Adjusted import path

const Submission = () => {
  const [submissions, setSubmissions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserIdAndSubmissions = async () => {
      try {
        const id = await getUserId();
        if (id) {
          setUserId(id);
          await fetchSubmissions(id);
          await fetchFeedbacks(id); // Fetch feedbacks based on user ID
        } else {
          Alert.alert('Error', 'User ID is missing. Please log in again.');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
        Alert.alert('Error', 'Failed to fetch user ID.');
      }
    };

    fetchUserIdAndSubmissions();
  }, []);

  const fetchSubmissions = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }

      const response = await axios.get(`http://192.168.48.58:5000/submissions?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched submissions:', response.data);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      Alert.alert('Error', 'Failed to fetch submissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeedbacks = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await axios.get(`http://192.168.48.58:5000/feedbacks?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched feedbacks:', response.data);
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      Alert.alert('Error', 'Failed to fetch feedbacks.');
    }
  };

  const handleShowSubmissions = () => {
    setShowSubmissions(prev => !prev);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Submissions and Feedback</Text>
      <TouchableOpacity style={styles.showButton} onPress={handleShowSubmissions}>
        <Text style={styles.buttonText}>Show Submissions</Text>
      </TouchableOpacity>

      {showSubmissions && (
        <FlatList
          data={submissions}
          keyExtractor={(item) => item.sub_id ? item.sub_id.toString() : Math.random().toString()}
          renderItem={({ item }) => {
            const feedbackForSubmission = feedbacks.filter(feedback => 
              feedback.assignment_id === item.assignment_id && 
              feedback.user_id === userId
            );

            return (
              <View style={styles.submissionContainer}>
                <Text style={styles.submissionText}>
                  Submission ID: {item.sub_id} - Date: {new Date(item.sub_date).toLocaleDateString()}
                </Text>

                {/* Display Feedback and Grade */}
                {feedbackForSubmission.map(feedback => (
                  <View key={feedback.feed_id} style={styles.feedbackContainer}>
                    <Text style={styles.feedbackText}>
                      Feedback: {feedback.description} - Grade: {feedback.grade.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  showButton: {
    backgroundColor: '#663399', // Purple color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  submissionContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  submissionText: {
    fontSize: 16,
  },
  feedbackContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  feedbackText: {
    fontSize: 14,
  },
});

export default Submission;
