import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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

  const uploadVideoApi = 'http://192.168.0.23:5000/routes/uploads';
  const compressVideoApi = 'http://192.168.0.23:5000/routes/test-compress';
  const createSubmissionApi = 'http://192.168.0.23:5000/submission';
  const createUserSubmission = 'http://192.168.0.23:5000/userSubmission';

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
        const response = await fetch(`http://192.168.0.23:5000/assignments/${assignmentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch assignment details');
        }
        const assignmentData = await response.json();
        if (assignmentData.length > 0) {
          setAssignment(assignmentData[0]);
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

  // 2. Compress Video
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

  // 3. Upload Video
  const uploadVideo = async (uri) => {
    const formData = new FormData();
    formData.append('video', {
      uri: uri,
      type: videoType,
      name: videoName,
    });

    console.log('Uploading video with FormData:', formData);

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
    try {
      const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const submissionData = {
        sub_date: formattedDate,
        assignment_id: assignmentId,
      };

    console.log("Creating submission with data:", submissionData);
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
    console.log("Submission Result:", submissionResult);
    const submissionId = submissionResult.sub_id;

    const userOnSubmissionData = {
      user_id: userId,
      sub_id: submissionId,
    };

    console.log("Creating user submission with data:", userOnSubmissionData);
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

    // Now upload the video after user submission is created
    const uploadResponse = await uploadVideo(videoUri);
    if (!uploadResponse) return;

    // Then compress the video after upload
    const compressedVideoUrl = await compressVideo(videoUri);
    if (compressedVideoUrl) {
      setCompressedVideoUrl(compressedVideoUrl); // Store the compressed video URL if needed
    }

      Alert.alert('Submission successful!');
    } catch (error) {
      console.error('Error during submission process:', error);
      Alert.alert('Error during submission process', error.message);
    }
  };

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

  const startRecording = async () => {
    if (cameraRef) {
      try {
        const videoRecordPromise = cameraRef.recordAsync();
        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          setVideoUri(data.uri); // Get the video URI from the recorded video
          setIsRecording(false); // Stop recording
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

        {videoUri && <Text style={styles.Video}>Video Selected: {videoUri}</Text>}

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
            <AntDesign name="videocamera" size={50} color="#fff" />
            <Text style={styles.buttonText}>{isRecording ? 'Stop Recording' : 'Record Video'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <AntDesign name="checksquare" size={50} color="#fff" />
            <Text style={styles.buttonText}>Submit Video</Text>
          </TouchableOpacity>
        </View>

        {isRecording && (
          <Camera
            style={styles.camera}
            ref={(ref) => setCameraRef(ref)}
            type={Camera.Constants.Type.back}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'blue', // Change background color to blue
    padding: 20,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  Heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginVertical: 5,
  },
  dateDisplay: {
    fontSize: 16,
    color: '#777',
    marginBottom: 15,
  },
  descHead: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  desc: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
  },
  Video: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#3b5998',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  camera: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginTop: 20,
  },
  loadingText: {
    fontSize: 20,
    color: '#555',
  },
});


export default AssignmentsDisplay;
