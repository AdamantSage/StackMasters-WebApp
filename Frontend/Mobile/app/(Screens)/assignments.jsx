import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { useAssignmentContext } from '@/components/assignmentContext';

const Assignments = () => {
  const [moduleCode, setModuleCode] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const router = useRouter();
  const { setAssignmentId } = useAssignmentContext();

  useEffect(() => {
    fetch('http://192.168.58.188:5000/module').then(response => response.json()).then((data) => {
      const FormatedModule = data.map(module => ({
        label: module.module_code,
        value: module.module_code
      }));
      setModuleCode(FormatedModule)
    }).catch((error) => {
      console.error('Error fetching modules:', error);
    });
  }, []);

  useEffect(() => {
    if(selectedModule){
      fetch(`http://192.168.58.188:5000/assignment/${selectedModule}`).then(response => response.json()).then((data) =>{
        console.log('Fetched assignments:', data);
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
        onValueChange={(value) =>{ 
          console.log('Selected Module:', value);
          setSelectedModule(value)}}
        items={moduleCode} 
        placeholder={{ label: 'Choose a module', value: null }}
        style={pickerSelectStyles}
      />
    {selectedModule && assignments.length > 0 ?(
      <FlatList
        data={assignments}
        keyExtractor={(item) => item.assignment_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.assignmentItem}>
            <TouchableOpacity
              onPress={() => {
                console.log(`Setting assignment ID: ${item.assignment_id}`);
                setAssignmentId(item.assignment_id); // Set the assignment ID in context
                console.log(`Navigating to AssignmentDisplay with ID: ${item.assignment_id}`);
                router.push('../../assignmentsDisplay'); // Navigate to assignmentsDisplay without query
              }}
            >
            <Text>Assignment Name: {item.assign_name}</Text>
          </TouchableOpacity>
          </View>
        )}
      />
    ): (
      selectedModule && <Text>No assignments found for this module.</Text>
  )}
    <Link href={'../../assignmentsDisplay'}>
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