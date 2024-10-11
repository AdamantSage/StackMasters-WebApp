import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const FeedbackDisplay = ({ submission, onBack }) => {
  const [feedback, setFeedback] = useState([]);
  const [grade, setGrade] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`https://your-backend-url/api/feedback/${submission.sub_id}`);
        const feedbackData = response.data;
        setFeedback(feedbackData.feedback);
        setGrade(feedbackData.grade);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, [submission]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Feedback for Submission ID: {submission.sub_id}</Text>
      {feedback.length > 0 ? (
        <FlatList
          data={feedback}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.feedbackItem}>
              <Text>{item.comment}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No feedback available</Text>
      )}
      <View style={styles.gradeContainer}>
        <Text style={styles.gradeText}>
          Grade: {grade !== null ? grade : "Not graded yet"}
        </Text>
      </View>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Submissions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  feedbackItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  gradeContainer: { marginTop: 20, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
  gradeText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  backButton: { marginTop: 20, padding: 10, backgroundColor: '#663399', borderRadius: 5, alignItems: 'center' },
  backButtonText: { color: '#fff', fontSize: 16 },
});

export default FeedbackDisplay;