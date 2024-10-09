import { View, Text, Button, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { RNCamera } from 'react-native-camera';
import * as DocumentPicker from 'expo-document-picker';

const assignmentsDisplay = () => {
  const router = useRouter();
  const { assignmentId, assignName, dueDate, assignDesc } = router.query || {};

  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null); 

  const uploadVideoApi = 'https://yourapi.com/upload-video'; 
  const createSubmissionApi = 'https://yourapi.com/create-submission';
  const createuserOnSubmission ='https://your-backend-url.com/userSubmission';

  const handleRecordVideo = async () => {
    if (cameraRef.current) {
      const options = { quality: RNCamera.Constants.VideoQuality["480p"] };
      try {
        const data = await cameraRef.current.recordAsync(options);
        console.log('Video recorded:', data.uri);
        setVideoUri(data.uri); // Set recorded video URI for later use
      } catch (error) {
        console.error(error);
        Alert.alert('Error recording video');
      }
    }
  };

  const handleStopVideo = async () => {
    if (cameraRef.current) {
      await cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const uploadVideo = async () => {
    if (!videoUri) return;

    const formData = new FormData();
    formData.append('video', {
      uri: videoUri,
      type: 'video/mp4', // Adjust if necessary
      name: 'video.mp4',
    });

    try {
      const response = await fetch(uploadVideoApi, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      const uploadResponse = await response.json();
      console.log('Video upload response:', uploadResponse);
      return uploadResponse; // Return the response for submission
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert('Error uploading video');
      return null; // Return null on failure
    }
  };

  const handleChooseVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
      });
      if (result.type === 'success') {
        console.log('Video selected:', result.uri);
        setVideoUri(result.uri); // Set selected video URI
      } else {
        console.log('User canceled video picker');
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error picking video');
    }
  };  

  const handleSubmit = async () => {
    const uploadResponse = await uploadVideo();
    if (!uploadResponse) return; // Stop if the upload failed

    // Example data for creating a submission (adjust as needed)
    const submissionData = {
      userId: 'your-user-id', // Replace with actual user ID
      assignmentId: assignmentId,
      videoUrl: uploadResponse.videoUrl, // Adjust based on upload response
    };

    try {
      const response = await fetch(createSubmissionApi, createuserOnSubmission, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create submission');
      }

      const submissionResponse = await response.json();
      console.log('Submission response:', submissionResponse);
      Alert.alert('Submission successful!');
    } catch (error) {
      console.error('Error creating submission:', error);
      Alert.alert('Error creating submission');
    }
  };

  return (
    <View>
      <Text>Assignment Name: {decodeURIComponent(assignName)}</Text>
      <Text>Due Date: {decodeURIComponent(dueDate)}</Text>
      <Text>Assignment Description: {decodeURIComponent(assignDesc)}</Text>

      <View style={{ flex: 1 }}>
        <RNCamera
          ref={cameraRef}
          style={{ flex: 1 }}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          onCameraReady={() => console.log('Camera ready')}
          captureAudio={true}
        />
      </View>

      <Button
        title={isRecording ? "Stop Recording" : "Record Video"}
        onPress={isRecording ? handleStopVideo : () => {
          setIsRecording(true);
          handleRecordVideo();
        }}
      />

      <Button
        title="Choose Video from Gallery"
        onPress={handleChooseVideo}
      />

      <Button
        title="Submit Video"
        onPress={handleSubmit}
      />
    </View>
  )
}

export default assignmentsDisplay