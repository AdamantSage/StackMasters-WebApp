import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from '../utils';
import FeedbackDisplay from '../comp/FeedbackDisplay'; // Adjust the path as necessary

const Submission = () => {
  const [submissions, setSubmissions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null); // State to hold the selected submission

  useEffect(() => {
    const fetchUserIdAndSubmissions = async () => {
      try {
        const id = await getUserId();
        if (id) {
          setUserId(id);
          await fetchSubmissions(id);
          await fetchFeedbacks(id);
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
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      Alert.alert('Error', 'Failed to fetch feedbacks.');
    }
  };

  const handleShowSubmissions = () => {
    setShowSubmissions(prev => !prev);
  };

  const handleSubmissionSelect = (submission) => {
    setSelectedSubmission(submission);
  };

  const handleBack = () => {
    setSelectedSubmission(null); // Reset selected submission to show submissions list
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (selectedSubmission) {
    return (
      <FeedbackDisplay submission={selectedSubmission} onBack={handleBack} />
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
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSubmissionSelect(item)} style={styles.submissionContainer}>
              <Text style={styles.submissionText}>
                Submission ID: {item.sub_id} - Date: {new Date(item.sub_date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
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
});

export default Submission;
