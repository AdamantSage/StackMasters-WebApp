import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const FeedbackDisplay = ({ submission, feedback, grade, onBack }) => {
  // Convert grade to a number and set a default
  const numericGrade = Number(grade) || 0;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Feedback for Submission ID: {submission.sub_id}</Text>
      {feedback.length > 0 ? (
        <FlatList
          data={feedback}
          keyExtractor={(item) => (item.feed_id ? item.feed_id.toString() : `fallback-${Math.random()}`)} // Fallback for undefined feed_id
          renderItem={({ item }) => (
            <View style={styles.feedbackItem}>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No feedback available</Text>
      )}
      <View style={styles.gradeContainer}>
        <Text style={styles.gradeText}>
          Grade: {typeof numericGrade === 'number' && !isNaN(numericGrade) ? numericGrade.toFixed(2) : "Not graded yet"}
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
