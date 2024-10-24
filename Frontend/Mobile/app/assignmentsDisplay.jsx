import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssignmentContext } from '@/components/assignmentContext';
import { getUserId } from './utils';
import * as DocumentPicker from 'expo-document-picker';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Camera } from 'expo-camera';

const AssignmentsDisplay = () => {
  const router = useRouter();
  const { assignmentId } = useAssignmentContext();
  const [assignment, setAssignment] = useState(null);
  const [userId, setUserId] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [videoType, setVideoType] = useState(null);
  const [videoName, setVideoName] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [moduleCode, setModuleCode] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadVideoApi = 'http://192.168.49.123:5000/routes/uploads';
  const compressVideoApi = 'http://192.168.49.123:5000/routes/test-compress';
  const createSubmissionApi = 'http://192.168.49.123:5000/submission';
  const createUserSubmission = 'http://192.168.49.123:5000/userSubmission';

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      if (id) {
        setUserId(id);
      } else {
        Alert.alert('Error', 'User ID is missing. Please log in again.');
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const response = await fetch(`http://192.168.49.123:5000/assignmentID/${assignmentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch assignment details');
        }
        const assignmentData = await response.json();
        if (assignmentData.length > 0) {
          setAssignment(assignmentData[0]);
          setModuleCode(assignmentData[0].module_code);
        } else {
          console.log('No assignment data available.');
        }
      } catch (error) {
        console.error('Error fetching assignment details:', error);
        Alert.alert('Error fetching assignment details');
      }
    };

    if (assignmentId) {
      fetchAssignmentDetails();
    }
  }, [assignmentId, userId]);

  if (!assignment) {
    return <Text style={styles.loadingText}>No assignment found.</Text>;
  }

  const chooseVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedVideo = result.assets[0];
        const videoUri = selectedVideo.uri;
        const videoType = selectedVideo.mime;
        const videoName = selectedVideo.name;

        setVideoUri(videoUri);
        setVideoType(videoType);
        setVideoName(videoName);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error picking video');
    }
  };

  const compressVideo = async (uri) => {
    const formData = new FormData();
    formData.append('video', {
      uri: uri,
      type: videoType,
      name: videoName,
    });

    try {
      const response = await fetch(compressVideoApi, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to compress video');
      }

      const compressedVideoResponse = await response.json();
      return compressedVideoResponse.compressedVideoUrl;
    } catch (error) {
      console.error('Error compressing video:', error);
      Alert.alert('Error compressing video');
      return null;
    }
  };

  const getMimeTypeFromUri = (uri) => {
    const extension = uri.split('.').pop();
    switch (extension) {
      case 'mp4':
        return 'video/mp4';
      case 'mov':
        return 'video/quicktime';
      case 'avi':
        return 'video/x-msvideo';
      case 'mkv':
        return 'video/x-matroska';
      default:
        return 'application/octet-stream';
    }
  };

  const uploadVideo = async (uri) => {
    const videoType = getMimeTypeFromUri(videoUri);

    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: videoType,
      name: videoName,
    });

    formData.append('filename', videoName);
    formData.append('mimetype', videoType);
    formData.append('size', '');
    formData.append('path', videoUri);
    formData.append('uploadAt', new Date().toISOString());
    formData.append('user_id', userId);

    try {
      const response = await fetch(uploadVideoApi, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      const uploadResponse = await response.json();
      return uploadResponse;
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert('Error uploading video');
      return null;
    }
  };

  const handleSubmit = async () => {
    if (isUploading) return; // Prevent multiple submissions

    setIsUploading(true); // Set uploading state to true
    setUploadProgress(0); // Reset upload progress

    try {
      const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const submissionData = {
        sub_date: formattedDate,
        assignment_id: assignmentId
      };

      const createSubmissionResponse = await fetch(createSubmissionApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!createSubmissionResponse.ok) {
        throw new Error('Failed to create submission');
      }

      const submissionResult = await createSubmissionResponse.json();
      const submissionId = submissionResult.sub_id;

      const userOnSubmissionData = {
        user_id: userId,
        sub_id: submissionId,
        module_code: moduleCode
      };

      const userSubmissionResponse = await fetch(createUserSubmission, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userOnSubmissionData),
      });

      if (!userSubmissionResponse.ok) {
        throw new Error('Failed to create user submission');
      }

      // Track upload progress
      const uploadResponse = await uploadVideo(videoUri);
      if (!uploadResponse) return;

      Alert.alert('Submission successful!');
    } catch (error) {
      console.error('Error during submission process:', error);
      Alert.alert('Error during submission process', error.message);
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  const startRecording = async () => {
    if (cameraRef) {
      try {
        const videoRecordPromise = cameraRef.recordAsync();
        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          setVideoUri(data.uri);
          setIsRecording(false);
        }
      } catch (error) {
        console.error('Error recording video:', error);
        Alert.alert('Error recording video');
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef) {
      cameraRef.stopRecording();
      setIsRecording(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.Heading}>{assignment?.assign_name}</Text>
        <Text style={styles.date}>Due Date:</Text>
        <Text style={styles.dateDisplay}>{assignment?.due_date}</Text>
        <Text style={styles.descHead}>Assignment Description:</Text>
        <Text style={styles.desc}>{assignment?.assign_desc}</Text>

        {videoUri && (
          <Text style={styles.Video}>
            Video Selected: {videoName ? videoName : `${videoUri.substring(0, 30)}...`}
          </Text>
        )}

        {isUploading && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Uploading: {uploadProgress}%</Text>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={chooseVideo}>
            <Entypo name="folder-video" size={50} color="#fff" />
            <Text style={styles.buttonText}>Choose Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsRecording(!isRecording);
              if (isRecording) {
                stopRecording();
              } else {
                startRecording();
              }
            }}
          >
            <AntDesign name="camera" size={50} color="#fff" />
            <Text style={styles.buttonText}>{isRecording ? 'Stop Recording' : 'Record'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit} 
          disabled={isUploading} // Disable while uploading
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  Heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateDisplay: {
    fontSize: 14,
    marginBottom: 10,
  },
  descHead: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 14,
    marginBottom: 20,
  },
  Video: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  progressContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
  },
});

export default AssignmentsDisplay;