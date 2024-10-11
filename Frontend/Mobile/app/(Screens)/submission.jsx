import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const Submission = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [videoUri, setVideoUri] = useState('');
  const [recordedVideoUri, setRecordedVideoUri] = useState('');
  const [showAssignments, setShowAssignments] = useState(false);
  const [streamingVideoUri, setStreamingVideoUri] = useState('');

  // Fetch assignments from backend on component mount
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if (showAssignments) {
          const response = await axios.get('http://192.168.48.58:5000/assignment');
          console.log('Fetched assignments:', response.data); // Log the fetched data
          setAssignments(response.data);
        }
      } catch (error) {
        console.error('Error fetching assignments', error);
      }
    };
    

    fetchAssignments();
  }, [showAssignments]);

  const handleAssignmentSelection = (id) => {
    setSelectedAssignmentId(id);
    setStreamingVideoUri(`http://192.168.48.58:5000/videos/${id}/stream`);
  };

  const handleUpload = () => {
    if (videoUri && selectedAssignmentId) {
      const formData = new FormData();
      formData.append('assignmentId', selectedAssignmentId);
      formData.append('video', {
        uri: videoUri,
        type: 'video/mp4',
        name: `assignment_${selectedAssignmentId}.mp4`,
      });

      axios.post(`http://192.168.48.58:5000/assignment/${selectedAssignmentId}/videos`, formData)
        .then(response => Alert.alert('Success', 'Video uploaded successfully'))
        .catch(error => console.error('Error uploading video', error));
    } else {
      Alert.alert('Error', 'Please select an assignment and a video file.');
    }
  };

  const handleDownload = async () => {
    if (selectedAssignmentId) {
      try {
        const res = await axios.get(`http://192.168.48.58:5000/assignments/${selectedAssignmentId}/videos`, { responseType: 'blob' });
        const videoPath = `${FileSystem.documentDirectory}assignment_${selectedAssignmentId}.mp4`;

        await FileSystem.writeAsStringAsync(videoPath, res.data, { encoding: FileSystem.EncodingType.Base64 });
        Alert.alert('Success', 'Video downloaded successfully');
      } catch (error) {
        console.error('Error downloading video', error);
        Alert.alert('Error', 'Failed to download the video.');
      }
    } else {
      Alert.alert('Error', 'Please select an assignment.');
    }
  };

  const handleRecordVideo = () => {
    launchCamera(
      {
        mediaType: 'video',
        videoQuality: 'high',
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled video recording');
        } else if (response.errorCode) {
          console.log('Video recording error:', response.errorMessage);
        } else {
          setRecordedVideoUri(response.assets[0].uri);
        }
      },
    );
  };

  const handlePickVideo = () => {
    launchImageLibrary(
      {
        mediaType: 'video',
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled video picker');
        } else if (response.errorCode) {
          console.log('Video picker error:', response.errorMessage);
        } else {
          setVideoUri(response.assets[0].uri);
        }
      },
    );
  };

  const handleShowAssignments = () => {
    setShowAssignments((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Upload & Download</Text>

      {/* Button to show/hide assignments */}
      <Button title="Show Assignments" onPress={handleShowAssignments} />

      {/* Assignment selection */}
      {showAssignments && (
        <FlatList
        data={assignments}
        keyExtractor={(item) => item.assignment_id ? item.assignment_id.toString() : Math.random().toString()} // Use assignment_id for the key
        renderItem={({ item }) => {
          if (!item) return null; // Check if item is undefined
      
          return (
            <TouchableOpacity
              style={[styles.assignmentButton, selectedAssignmentId === item.assignment_id && styles.selectedAssignment]}
              onPress={() => handleAssignmentSelection(item.assignment_id)}
            >
              <Text style={styles.assignmentText}>
                Assignment: {item.assignment_id ? item.assignment_id.toString() : 'Unnamed Assignment'} {/* Use assignment_id directly */}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      )}

      {/* Display recorded video */}
      {recordedVideoUri ? (
        <View>
          <Text style={styles.subtitle}>Recorded Video:</Text>
          <Video
            source={{ uri: recordedVideoUri }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
        </View>
      ) : null}

      {/* Display streaming video */}
      {streamingVideoUri ? (
        <View>
          <Text style={styles.subtitle}>Streaming Video:</Text>
          <Video
            source={{ uri: streamingVideoUri }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            isLooping
            onError={(error) => {
              console.error('Error playing video:', error);
              Alert.alert('Error', 'Failed to load the streaming video.');
            }}
          />
        </View>
      ) : null}

      {/* Footer with action icons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton} onPress={handlePickVideo}>
          <Icon name="image" size={30} color="#007AFF" />
          <Text style={styles.iconLabel}>Pick</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleUpload}>
          <Icon name="cloud-upload" size={30} color="#007AFF" />
          <Text style={styles.iconLabel}>Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleDownload}>
          <Icon name="cloud-download" size={30} color="#007AFF" />
          <Text style={styles.iconLabel}>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleRecordVideo}>
          <Icon name="videocam" size={30} color="#007AFF" />
          <Text style={styles.iconLabel}>Record</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  assignmentButton: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  selectedAssignment: {
    backgroundColor: '#007AFF',
  },
  assignmentText: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: 'black',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconLabel: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default Submission;
