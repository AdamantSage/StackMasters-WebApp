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
          keyExtractor={(item) => (item.feed_id ? item.feed_id.toString() : `fallback-${Math.random()}`)}
          renderItem={({ item }) => (
            <View style={styles.feedbackItem}>
              <Text style={styles.feedbackText}>{item.description}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noFeedbackText}>No feedback available</Text>
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#afdde5', // Light background color
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003135', // Dark color for the heading
  },
  feedbackItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff', // White background for feedback item
    borderRadius: 15, // Rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackText: {
    color: '#024950', // Dark teal for feedback description
  },
  gradeContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#0fa4af', // Teal background for grade
    borderRadius: 15, // Rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  gradeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text for grade
  },
  noFeedbackText: {
    fontSize: 16,
    color: '#964734', // Brownish color for "No feedback" message
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#663399', // Purple back button
    borderRadius: 25, // More pronounced rounded corners
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonText: {
    color: '#fff', // White text for the back button
    fontSize: 16,
  },
});

export default FeedbackDisplay;
