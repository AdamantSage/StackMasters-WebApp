import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const VideoUploadDownloadPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [videoUri, setVideoUri] = useState('');
  const [recordedVideoUri, setRecordedVideoUri] = useState('');

  // Fetch assignments from backend on component mount
  useEffect(() => {
    axios.get('/api/assignments')
      .then(response => setAssignments(response.data))
      .catch(error => console.error('Error fetching assignments', error));
  }, []);

  const handleAssignmentSelection = (id) => {
    setSelectedAssignmentId(id);
  };

  const handleUpload = () => {
    if (videoUri && selectedAssignmentId) {
      const formData = new FormData();
      formData.append('assignmentId', selectedAssignmentId);
      formData.append('video', {
        uri: videoUri,
        type: 'video/mp4', // Adjust the MIME type based on the actual file type
        name: `assignment_${selectedAssignmentId}.mp4`,
      });

      axios.post('/api/uploadVideo', formData)
        .then(response => Alert.alert('Success', 'Video uploaded successfully'))
        .catch(error => console.error('Error uploading video', error));
    } else {
      Alert.alert('Error', 'Please select an assignment and a video file.');
    }
  };

  const handleDownload = async () => {
    if (selectedAssignmentId) {
      try {
        const res = await axios.get(`/api/downloadVideo/${selectedAssignmentId}`, { responseType: 'blob' });
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Upload & Download</Text>

      {/* Assignment selection */}
      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.assignmentButton,
              selectedAssignmentId === item.id && styles.selectedAssignment,
            ]}
            onPress={() => handleAssignmentSelection(item.id)}
          >
            <Text style={styles.assignmentText}>Assignment {item.id}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Video Upload */}
      <TouchableOpacity style={styles.button} onPress={handlePickVideo}>
        <Text style={styles.buttonText}>Pick Video</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Text style={styles.buttonText}>Upload Video</Text>
      </TouchableOpacity>

      {/* Video Download */}
      <TouchableOpacity style={styles.button} onPress={handleDownload}>
        <Text style={styles.buttonText}>Download Video</Text>
      </TouchableOpacity>

      {/* Video Recording */}
      <TouchableOpacity style={styles.button} onPress={handleRecordVideo}>
        <Text style={styles.buttonText}>Record Video</Text>
      </TouchableOpacity>

      {/* Display recorded video */}
      {recordedVideoUri ? (
        <View>
          <Text style={styles.subtitle}>Recorded Video:</Text>
          <Video
            source={{ uri: recordedVideoUri }}
            style={styles.video}
            controls
          />
        </View>
      ) : null}
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
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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
});

export default VideoUploadDownloadPage;
