import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Link } from 'expo-router';

const Assignments = () => {
  const [moduleCode, setModuleCode] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetch('https://your-backend-url.com/module').then(response => response.json()).then((data) => {
      const FormatedModule = data.map(module => ({
        label: module.moduleCode,
        value: module.moduleCode
      }));
      setModuleCode(FormatedModule)
    }).catch((error) => {
      console.error('Error fetching modules:', error);
    });
  }, []);

  useEffect(() => {
    if(selectedModule){
      fetch('https://your-backend-url.com/assignment').then(response => response.json()).then((data) =>{
        setAssignments(data);
      }).catch((error) => {
        console.error('Error finding assignments', error);
      });
    }
  }, [selectedModule]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Module</Text>

      <RNPickerSelect
        onValueChange={(value) => setSelectedModule(value)} 
        items={moduleCode} 
        placeholder={{ label: 'Choose a module', value: null }}
        style={pickerSelectStyles}
      />
    {selectedModule && (
      <FlatList
        data={assignments}
        keyExtractor={(item) => item.assignment_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.assignmentItem}>
            <Link href={'../../assignmentsDisplay?assignmentId=${item.assignment_id}&assignName=${encodeURIComponent(item.assign_name)}&dueDate=${encodeURIComponent(item.due_date)}&assignDesc=${encodeURIComponent(item.assign_desc)}'}>
              <Text>Assignment Name: {item.assign_name}</Text>
            </Link>
          </View>
        )}
      />
    )}
    <Link href={'../../assignmentsDisplay?assignmentId=${item.assignment_id}&assignName=${encodeURIComponent(item.assign_name)}&dueDate=${encodeURIComponent(item.due_date)}&assignDesc=${encodeURIComponent(item.assign_desc)}'}>
      <Text style={styles.display}>
        AssignmentDisplay
      </Text>
    </Link>
  </View>
  );
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 20,
      marginBottom: 10,
    },
    assignmentItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 15,
    },
    display:{
      fontSize: 20,
      color: 'black'
    }
  });
  
  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30,
      marginBottom: 20,
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30,
      marginBottom: 20,
    },
  });

export default Assignments