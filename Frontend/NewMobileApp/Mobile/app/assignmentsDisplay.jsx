import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { RNCamera } from 'react-native-camera';
import { useAssignmentContext } from '@/components/assignmentContext';;
import { getUserId } from './utils';

const AssignmentsDisplay = () => {
  const router = useRouter();
  const { assignmentId } = useAssignmentContext(); // Get assignmentId from context
  const [assignment, setAssignment] = useState(null);
  const [userId, setUserId] = useState(null);
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);

  console.log('Current assignmentId:', assignmentId);

  const uploadVideoApi = 'http://192.168.0.23:5000/uploads';
  const createSubmissionApi = 'http://192.168.0.23:5000/submission';
  const createUserSubmission = 'http://192.168.0.23:5000/userSubmission';

  /*useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      if (id) {
        setUserId(id);
      } else {
        Alert.alert('Error', 'User ID is missing. Please log in again.');
      }
    };
    
    fetchUserId();
  }, []);*/

  // Fetch assignment details based on assignmentId and userId
  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const response = await fetch(`http://192.168.0.23:5000/assignment/${assignmentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch assignment details');
        }
        const assignmentData = await response.json();
        setAssignment(assignmentData);
      } catch (error) {
        console.error('Error fetching assignment details:', error);
        Alert.alert ? Alert.alert('Error fetching assignment details') : window.alert('Error fetching assignment details');
      }
    };
  
    if (assignmentId) {
      fetchAssignmentDetails(); // Fetch assignment details if assignmentId is available
    }
  }, [assignmentId]);
  

  // If assignment data is not available, handle it gracefully
  if (!assignment) {
    return <Text>No assignment found.</Text>;
  }

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
    if (!videoUri) return null; // If there's no video URI, stop execution

    const formData = new FormData();
    formData.append('video', {
      uri: videoUri,
      type: 'video/mp4', // Ensure this matches the expected MIME type
      name: 'video.mp4', // You can generate a unique name if needed
    });

    try {
      const response = await fetch(uploadVideoApi, {
        method: 'POST',
        body: formData,
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

  const handleSubmit = async () => {
    try {
      // Step 1: Upload the video
      const uploadResponse = await uploadVideo();
      if (!uploadResponse) return; // Stop if the video upload failed

      // Step 2: Create the submission
      const submissionData = {
        assignmentId: assignmentId, // Get the assignment ID from context
        subDate: new Date().toISOString(), // Current date as the submission date
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
      const submissionId = submissionResult.sub_id; // Get the created submission ID

      // Step 3: Associate the user with the submission
      const userOnSubmissionData = {
        userId: userId, // Replace with actual user ID
        subId: submissionId, // Use the submission ID from previous API call
        moduleCode: assignment.module_code, // Use the module code from the assignment
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

      const userSubmissionResult = await userSubmissionResponse.json();
      console.log('User submission created:', userSubmissionResult);

      Alert.alert('Submission successful!');
    } catch (error) {
      console.error('Error during submission process:', error);
      Alert.alert('Error during submission process');
    }
  };

  return (
    <View>
      <Text>Assignment Name: {assignment.assign_name}</Text>
      <Text>Due Date: {assignment.due_date}</Text>
      <Text>Assignment Description: {assignment.assign_desc}</Text>

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
        title="Submit Video"
        onPress={handleSubmit}
      />
    </View>
  );
};

export default AssignmentsDisplay;
