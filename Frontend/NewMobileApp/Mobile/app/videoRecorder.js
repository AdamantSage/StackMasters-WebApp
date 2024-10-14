import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'; // Using CameraView and useCameraPermissions

const VideoRecorder = ({ onRecordingComplete }) => {
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<CameraType>('back'); // State to control camera facing
  const [permission, requestPermission] = useCameraPermissions(); // useCameraPermissions to manage permissions

  // Check if permissions are granted
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      setLoading(true); // Show loading indicator
      
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
        
        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          onRecordingComplete(data.uri); // Pass the video URI back to the parent component
        }
      } catch (error) {
        Alert.alert("Recording failed", error.message); // Handle any errors
      } finally {
        setIsRecording(false);
        setLoading(false); // Hide loading indicator
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const toggleCameraFacing = () => {
    setCameraFacing((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={cameraFacing} // Handle front/back camera toggle
        ratio="16:9"
      >
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Button
              title={isRecording ? "Stop" : "Record"}
              onPress={isRecording ? stopRecording : startRecording}
            />
          )}
          <Button title="Flip Camera" onPress={toggleCameraFacing} />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 20, // Add some padding
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
});

export default VideoRecorder;

