import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure you import AsyncStorage

const submission = () => {
  const [sub_id, setSubId] = useState('');
  const [sub_date, setSubDate] = useState('');
  const [assignment_id, setAssignmentId] = useState('');
  const [user_id, setUserId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [feed_id, setFeedId] = useState('');
  const [grade, setGrade] = useState('');
  const [description, setDescription] = useState('');
  const [videoId, setVideoId] = useState(''); // For video streaming and downloading

  // Fetch all submissions on component mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('https://your-backend-url.com/submissions'); // Adjust the URL
      const data = await response.json();
      if (response.ok) {
        setSubmissions(data);
      } else {
        Alert.alert('Error', 'Failed to fetch submissions');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch submissions, please try again');
    }
  };

  const handleCreateSubmission = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await fetch('https://your-backend-url.com/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sub_id, sub_date, assignment_id }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Submission created successfully');
        fetchSubmissions(); // Refresh the submissions list
      } else {
        Alert.alert('Error', data.message || 'Failed to create submission');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to create submission, please try again');
    }
  };

  const handleUpdateSubmission = async (id) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await fetch(`https://your-backend-url.com/submissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sub_date }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Submission updated successfully');
        fetchSubmissions(); // Refresh the submissions list
      } else {
        Alert.alert('Error', data.message || 'Failed to update submission');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to update submission, please try again');
    }
  };

  const handleDeleteSubmission = async (id) => {
    Alert.alert('Confirm Deletion', 'Are you sure you want to delete this submission?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('jwt');
            const response = await fetch(`https://your-backend-url.com/submissions/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.ok) {
              Alert.alert('Success', 'Submission deleted successfully');
              fetchSubmissions(); // Refresh the submissions list
            } else {
              Alert.alert('Error', 'Failed to delete submission');
            }
          } catch (error) {
            Alert.alert('Error', 'Unable to delete submission, please try again');
          }
        },
      },
    ]);
  };

  const handleViewFeedback = async (id) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await fetch(`https://your-backend-url.com/feedback/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Feedback', data.feedback || 'No feedback available');
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch feedback');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch feedback, please try again');
    }
  };

  const handleStreamVideo = async (id) => {
    // Placeholder URL, replace with your video stream URL logic
    const videoUrl = `https://your-backend-url.com/videos/stream/${id}`;
    // Open the video stream in a browser or video player
    Alert.alert('Streaming Video', `Video will stream from: ${videoUrl}`);
    // Implement video streaming logic, e.g., using React Native Video player
  };

  const handleDownloadVideo = async (id) => {
    // Placeholder URL, replace with your video download URL logic
    const videoUrl = `https://your-backend-url.com/videos/download/${id}`;
    const response = await fetch(videoUrl);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submission_${id}.mp4`; // Assuming video format is mp4
      a.click();
      Alert.alert('Success', 'Video downloading...');
    } else {
      Alert.alert('Error', 'Failed to download video');
    }
  };

  const handleCreateFeedback = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await fetch('https://your-backend-url.com/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ feed_id, user_id, assignment_id, description, grade }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Feedback created successfully');
      } else {
        Alert.alert('Error', data.message || 'Failed to create feedback');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to create feedback, please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Submission Management</Text>

      <TextInput
        style={styles.input}
        placeholder="Submission ID"
        value={sub_id}
        onChangeText={setSubId}
      />
      <TextInput
        style={styles.input}
        placeholder="Submission Date"
        value={sub_date}
        onChangeText={setSubDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Assignment ID"
        value={assignment_id}
        onChangeText={setAssignmentId}
      />
      <Button title="Create Submission" onPress={handleCreateSubmission} />

      <FlatList
        data={submissions}
        keyExtractor={(item) => item.sub_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.submissionItem}>
            <Text>ID: {item.sub_id}</Text>
            <Text>Date: {item.sub_date}</Text>
            <Text>Assignment ID: {item.assignment_id}</Text>
            <Button title="Update" onPress={() => handleUpdateSubmission(item.sub_id)} />
            <Button title="Delete" onPress={() => handleDeleteSubmission(item.sub_id)} />
            <Button title="View Feedback" onPress={() => handleViewFeedback(item.sub_id)} />
            <Button title="Stream Video" onPress={() => handleStreamVideo(item.sub_id)} />
            <Button title="Download Video" onPress={() => handleDownloadVideo(item.sub_id)} />
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Feedback ID"
        value={feed_id}
        onChangeText={setFeedId}
      />
      <TextInput
        style={styles.input}
        placeholder="Grade"
        value={grade}
        onChangeText={setGrade}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Create Feedback" onPress={handleCreateFeedback} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  submissionItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius
    : 5,
  },
});

export default submission;
