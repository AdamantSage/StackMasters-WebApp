import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';

export default function App() {
    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [recordedVideoUri, setRecordedVideoUri] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const videoRef = useRef(null);
    const [status, setStatus] = useState({});
    const [type, setType] = useState(Camera.Constants ? Camera.Constants.Type.back : null); // Handle potential undefined

    useEffect(() => {
        const requestPermissions = async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const audioStatus = await Camera.requestMicrophonePermissionsAsync();
            setHasAudioPermission(audioStatus.status === 'granted');
        };

        requestPermissions();
    }, []);

    const takeVideo = async () => {
        if (camera) {
            setIsRecording(true);
            const data = await camera.recordAsync({
                maxDuration: 10,
            });
            setRecordedVideoUri(data.uri);
            console.log(data.uri);
            setIsRecording(false); // Reset recording state after video is taken
        }
    };

    const stopVideo = async () => {
        if (camera) {
            camera.stopRecording();
        }
    };

    if (hasCameraPermission === null || hasAudioPermission === null) {
        return <View><Text>Requesting permissions...</Text></View>;
    }

    if (!hasCameraPermission || !hasAudioPermission) {
        return (
            <View style={styles.container}>
                <Text>No access to camera</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.cameraContainer}>
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={type}
                    ratio={'4:3'}
                />
            </View>

            {recordedVideoUri && (
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{ uri: recordedVideoUri }}
                    useNativeControls
                    resizeMode='contain'
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            )}
            <View style={styles.buttons}>
                <Button
                    title={status.isPlaying ? 'Pause' : 'Play'}
                    onPress={() =>
                        status.isPlaying ? videoRef.current.pauseAsync() : videoRef.current.playAsync()
                    }
                />
            </View>
            <Button
                title="Flip Video"
                onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
                    );
                }}
            />
            <Button title={isRecording ? "Stop Video" : "Take Video"} onPress={isRecording ? stopVideo : takeVideo} />
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    fixedRatio: {
        flex: 1,
        flexDirection: 'row',
    },
    video: {
        alignSelf: 'center',
        width: 350,
        height: 220,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});