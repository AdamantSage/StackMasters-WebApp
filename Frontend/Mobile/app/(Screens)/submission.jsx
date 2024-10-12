import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from '../utils';
import FeedbackDisplay from '../comp/FeedbackDisplay';

const Submission = () => {
  const [submissions, setSubmissions] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ feedback: [], grade: null });

  useEffect(() => {
    const fetchUserIdAndSubmissions = async () => {
      try {
        const id = await getUserId();
        if (id) {
          setUserId(id);
          await fetchSubmissions(id);
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
      const response = await axios.get(`http://192.168.49.219:5000/submissions?userId=${userId}`, {
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

  const fetchFeedbacks = async (userId, subId) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await axios.get(`http://192.168.49.219:5000/feedback/${subId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const feedback = response.data.feedback || [];
      const grade = feedback.length > 0 && typeof feedback[0].grade === 'number' ? feedback[0].grade : null;

      setFeedbacks(prevFeedbacks => ({
        ...prevFeedbacks,
        [subId]: feedback
      }));

      setFeedbackData({ feedback, grade });
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      Alert.alert('Error', 'Failed to fetch feedbacks.');
    }
  };

  const handleShowSubmissions = () => {
    setShowSubmissions(prev => !prev);
  };

  const handleSubmissionSelect = async (submission) => {
    setSelectedSubmission(submission);
    const { sub_id } = submission;

    if (!feedbacks[sub_id]) {
      await fetchFeedbacks(userId, sub_id);
    } else {
      const selectedFeedback = feedbacks[sub_id] || [];
      const selectedGrade = selectedFeedback.length > 0 && typeof selectedFeedback[0].grade === 'number' ? selectedFeedback[0].grade : null;
      setFeedbackData({ feedback: selectedFeedback, grade: selectedGrade });
    }
  };

  const handleBack = () => {
    setSelectedSubmission(null);
    setFeedbackData({ feedback: [], grade: null });
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
      <FeedbackDisplay 
        submission={selectedSubmission} 
        feedback={feedbackData.feedback} 
        grade={feedbackData.grade} 
        onBack={handleBack} 
      />
    );
  }

  if (submissions.length === 0) {
    return <Text>No submissions available.</Text>;
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
          keyExtractor={(item) => item.sub_id.toString()}
          renderItem={({ item }) => {
            const feedbackForSubmission = feedbacks[item.sub_id] || [];
            return (
              <TouchableOpacity onPress={() => handleSubmissionSelect(item)} style={styles.submissionContainer}>
                <Text style={styles.submissionText}>
                  Submission ID: {item.sub_id} - Date: {new Date(item.sub_date).toLocaleDateString()}
                </Text>
                {feedbackForSubmission.length > 0 ? feedbackForSubmission.map((feedback, index) => {
                  const grade = feedback.grade != null ? Number(feedback.grade) : 'N/A';
                  const key = feedback.feed_id ? feedback.feed_id : `fallback-${index}`;
                  return (
                    <Text key={`${key}-${item.sub_id}`} style={styles.feedbackText}>
                      Feedback: {feedback.description} - Grade: {typeof grade === 'number' ? grade.toFixed(2) : grade}
                    </Text>
                  );
                }) : <Text>No feedback available.</Text>}
              </TouchableOpacity>
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
    backgroundColor: '#663399',
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
  feedbackText: {
    fontSize: 14,
    color: '#555',
  },
});

export default Submission;
