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
  const [loadingFeedback, setLoadingFeedback] = useState(false); // New state for loading feedback

  useEffect(() => {
    const fetchUserIdAndSubmissions = async () => {
      try {
        const id = await getUserId(); // Replace with your user ID fetching logic
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
      const response = await axios.get(`http://192.168.48.255:5000/submissions?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      Alert.alert('Error', 'Failed to fetch submissions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeedbacks = async (subId) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await axios.get(`http://192.168.48.255:5000/feedback/${subId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Log the response to see its structure
      console.log('Feedback response:', response.data);
  
      if (response.data) {
        // Access feedback from the response data
        const feedback = response.data.feedback; // Accessing feedback array
  
        // Ensure feedback is an array before proceeding
        if (Array.isArray(feedback) && feedback.length > 0) {
          // Get the first feedback item
          const firstFeedback = feedback[0];
          
          // Extract grade
          const grade = firstFeedback.grade !== null ? firstFeedback.grade : null;
  
          // Set feedback state (only first feedback)
          setFeedbacks(prevFeedbacks => ({
            ...prevFeedbacks,
            [subId]: [firstFeedback], // Store only the first feedback
          }));
  
          // Assuming submissionData is available here
          setSelectedSubmission({ ...submissionData, feedback: firstFeedback, grade });
        } else {
          Alert.alert('Error', 'No feedback available.');
          console.error('Expected feedback array but got:', feedback);
        }
      } else {
        Alert.alert('Notice', 'No feedback available for this submission.');
        setFeedbacks(prevFeedbacks => ({
          ...prevFeedbacks,
          [subId]: [],
        }));
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch feedbacks. Please try again later.');
    }
  };
  
  
  
  

  const handleShowSubmissions = () => {
    setShowSubmissions(prev => !prev);
  };

  const handleSubmissionSelect = async (submission) => {
    setSelectedSubmission(submission);
    const { sub_id } = submission;

    if (!feedbacks[sub_id]) {
      await fetchFeedbacks(sub_id);
    } else {
      const selectedFeedback = feedbacks[sub_id] || [];
      const grades = selectedFeedback.map(fb => fb.grade).filter(grade => grade != null);
      const selectedGrade = grades.length > 0 ? grades[0] : null;
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
                {loadingFeedback ? (
                  <Text>Loading feedback...</Text> // Show loading text while feedback is being fetched
                ) : feedbackForSubmission.length > 0 ? (
                  feedbackForSubmission.map((feedback, index) => {
                    const grade = feedback.grade != null ? Number(feedback.grade) : 'N/A';
                    const key = feedback.feed_id ? feedback.feed_id : `fallback-${index}`;
                    return (
                      <Text key={`${key}-${item.sub_id}`} style={styles.feedbackText}>
                        Feedback: {feedback.description} - Grade: {typeof grade === 'number' ? grade.toFixed(2) : grade}
                      </Text>
                    );
                  })
                ) : (
                  <Text>No feedback available.</Text> // Show message if no feedback
                )}
              </TouchableOpacity>
            );
          }}
          showsVerticalScrollIndicator={true}
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#afdde5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003135',
    marginBottom: 20,
    textAlign: 'center',
  },
  showButton: {
    backgroundColor: '#0fa4af',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  submissionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#024950',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  submissionText: {
    fontSize: 16,
    color: '#fff',
  },
  feedbackText: {
    fontSize: 14,
    color: 'white',
  },
});

export default Submission;