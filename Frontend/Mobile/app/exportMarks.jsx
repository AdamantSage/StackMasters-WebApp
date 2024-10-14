import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ExportMarks = () => {
  const [loading, setLoading] = useState(false); // To show loading indicator during export

  const handleExport = async () => {
    setLoading(true); // Show loading spinner
    try {
      const response = await fetch('http://192.168.58.188:5000/exportMarks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Convert response to Blob for download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'marks.xlsx'; // File name
        document.body.appendChild(a);
        a.click();
        a.remove();

        Alert.alert('Success', 'Marks exported successfully!');
      } else {
        Alert.alert('Error', 'Failed to export marks');
      }
    } catch (error) {
      console.error('Error exporting marks:', error);
      Alert.alert('Error', 'An error occurred while exporting marks.');
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Export Marks</Text>

      <Text style={styles.description}>
        Click the button below to export marks data to an Excel file. The file will be downloaded automatically.
      </Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleExport}
        disabled={loading} // Disable button when loading
      >
        <View style={styles.buttonContent}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="download-outline" size={24} color="white" />
          )}
          <Text style={styles.buttonText}>
            {loading ? 'Exporting...' : 'Export to Excel'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8ff', // Light background color
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#663399',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#663399',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10, // Spacing between icon and text
  },
});

export default ExportMarks;
