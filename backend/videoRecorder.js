import React, { useRef, useState } from 'react';// used to reference the camera component and manages the recording state
import { View, Button, StyleSheet } from 'react-native';// can be used for the button and style sheet component
import { RNCamera } from 'react-native-camera';// used to access the device's cemera for recording

//function fro recording
const VideoRecorder = () => {
  const cameraRef = useRef(null);// initialise refernce for camera component(cam interaction) 
  const [isRecording, setIsRecording] = useState(false);// state keep track of whether the camera is currently recording , and updates state.

  const startRecording = async () => {
    //checks cam component is available, if yes starts recording
    if (cameraRef.current) {
      setIsRecording(true);
      const options = { quality: RNCamera.Constants.VideoQuality['480p'] };// sets video quality
      const data = await cameraRef.current.recordAsync(options);//stores recorded video file info + url
      console.log('Video recorded at: ', data.uri);//logs url to the console
      // Use the recorded video URI for upload
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };
// react's syntax for defining UI conponents specifically for videoRecorder component 
  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}//specifies back camera should be used(can be changed to front cam ".front")
        captureAudio={true} // Ensure audio is captured with the video
      />
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopRecording : startRecording}
      />
    </View>
  );
};

//For styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
});
// allows the code to be used in other files
export default VideoRecorder;
//basically like this:
//import VideoRecorder from './path/to/VideoRecorder';