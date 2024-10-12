import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssignmentContext } from '@/components/assignmentContext';
import { getUserId } from './utils';
import VideoRecorder from './videoRecorder';
import * as DocumentPicker from 'expo-document-picker';

const AssignmentsDisplay = () => {
  const router = useRouter();
  const { assignmentId } = useAssignmentContext(); // Get assignmentId from context
  const [assignment, setAssignment] = useState(null);
  const [userId, setUserId] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

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


  // Fetch assignment details based on assignmentId
  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const response = await fetch(`http://192.168.0.23:5000/assignments/${assignmentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch assignment details');
        }
        const assignmentData = await response.json();
        console.log('Fetched assignment data:', assignmentData);
        
        // Access the first assignment in the array
        if (assignmentData.length > 0) {
          const assignment = assignmentData[0];
          console.log('Assignment fields:', assignment.assign_name, assignment.due_date, assignment.assign_desc);
          setAssignment(assignment); // Set the first assignment object to state
        } else {
          console.log('No assignment data available.');
        }
      } catch (error) {
        console.error('Error fetching assignment details:', error);
        Alert.alert('Error fetching assignment details');
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

  const handleRecordingComplete = (uri) => {
    setVideoUri(uri); // Set the video URI after recording
    setIsRecording(false); // Hide VideoRecorder
  };

  // Function to start recording
  const startRecording = () => {
    setIsRecording(true); // Show VideoRecorder
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
    try {
      console.log('Submit button pressed');
      // Step 1: Upload the video
      const uploadResponse = await uploadVideo();
      if (!uploadResponse){ 
        console.log('Video upload failed or returned no response');
        return; // Stop if the video upload failed
      }
      // Step 2: Create the submission
      const submissionData = {
        assignmentId: assignmentId, // Get the assignment ID from context
        subDate: new Date().toISOString(), // Current date as the submission date
      };

      console.log('Submission data:', submissionData);

      const createSubmissionResponse = await fetch(createSubmissionApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!createSubmissionResponse.ok) {
        console.error('Failed to create submission', createSubmissionResponse.status);
        throw new Error('Failed to create submission');
      }

      const submissionResult = await createSubmissionResponse.json();
      const submissionId = submissionResult.sub_id; // Get the created submission ID
      console.log('Submission created:', submissionResult);

      // Step 3: Associate the user with the submission
      const userOnSubmissionData = {
        userId: userId, // Replace with actual user ID
        subId: submissionId, // Use the submission ID from previous API call
        moduleCode: assignment.module_code, // Use the module code from the assignment
      };

      console.log('User submission data:', userOnSubmissionData);

      const userSubmissionResponse = await fetch(createUserSubmission, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userOnSubmissionData),
      });


      if (!userSubmissionResponse.ok) {
        console.error('Failed to create user submission', userSubmissionResponse.status);
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

  const chooseVideo = async () => {
    console.log('Opening video picker...'); // Debugging log
  
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        multiple: false,
      });
  
      console.log('Video picker result:', result); // Debugging log
  
      // Check if the user canceled the picker
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Get the URI of the selected video
        const videoUri = result.assets[0].uri;
        setVideoUri(videoUri);
        console.log('Video URI:', videoUri); // Log the selected video URI
      } else {
        console.log('User cancelled video picker');
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error picking video');
    }
  };  

  return (
    <View>
      <Text>Assignment Name: {assignment?.assign_name}</Text>
      <Text>Due Date: {assignment?.due_date}</Text>
      <Text>Assignment Description: {assignment?.assign_desc}</Text>

      <Button title="Choose Video" onPress={chooseVideo} />
      <Button title="Record Video" onPress={startRecording} />
      {videoUri && <Text>Video Selected: {videoUri}</Text>}

      {isRecording && (
        <VideoRecorder onRecordingComplete={handleRecordingComplete} />
      )}

      <Button title="Submit Video" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  
})

export default AssignmentsDisplay;
