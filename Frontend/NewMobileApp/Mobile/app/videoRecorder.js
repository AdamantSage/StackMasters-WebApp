import React, { useRef, useEffect, useState } from 'react';
import { View, Button, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';

const VideoRecorder = ({ onRecordingComplete }) => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

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
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} ratio="16:9">
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Button
              title={isRecording ? "Stop" : "Record"}
              onPress={isRecording ? stopRecording : startRecording}
            />
          )}
        </View>
      </Camera>
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
});

export default VideoRecorder;

