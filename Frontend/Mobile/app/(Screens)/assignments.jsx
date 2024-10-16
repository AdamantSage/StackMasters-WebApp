import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { useAssignmentContext } from '@/components/assignmentContext';
import { FontAwesome } from '@expo/vector-icons';

const Assignments = () => {
  const [moduleCode, setModuleCode] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAssignmentId } = useAssignmentContext();

  useEffect(() => {
    setLoading(true);
    fetch('https://hmsstackmasters-hvfcb8drb4d0egf8.southafricanorth-01.azurewebsites.net/module')
      .then(response => response.json())
      .then(data => {
        const formattedModule = data.map(module => ({
          label: module.module_code,
          value: module.module_code
        }));
        setModuleCode(formattedModule);
      })
      .catch(error => console.error('Error fetching modules:', error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedModule) {
      setLoading(true);
      fetch(`https://hmsstackmasters-hvfcb8drb4d0egf8.southafricanorth-01.azurewebsites.net/assignmentModule/${selectedModule}`)
        .then(response => response.json())
        .then(data => {
          setAssignments(data);
        })
        .catch(error => console.error('Error finding assignments', error))
        .finally(() => setLoading(false));
    }
  }, [selectedModule]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Module</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#663399" />
      ) : (
        <RNPickerSelect
          onValueChange={value => setSelectedModule(value)}
          items={moduleCode}
          placeholder={{ label: 'Choose a module', value: null }}
          style={pickerSelectStyles}
        />
      )}

      {selectedModule && (
        <Text style={styles.selectedModule}>
          Selected Module: {selectedModule}
        </Text>
      )}

      {assignments.length > 0 ? (
        <FlatList
          data={assignments}
          keyExtractor={item => item.assignment_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.assignmentItem}>
              <TouchableOpacity
                onPress={() => {
                  setAssignmentId(item.assignment_id);
                  router.push('../../assignmentsDisplay');
                }}
              >
                <FontAwesome name="file-text" size={20} color="#663399" style={styles.icon} />
                <Text style={styles.assignmentText}>Assignment Name: {item.assign_name}</Text>
                <Text style={styles.dueDate}>Due Date: {item.due_date || 'No due date'}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        selectedModule && <Text style={styles.noAssignmentsText}>No assignments found for this module.</Text>
      )}

      <Link href={'../../assignmentsDisplay'}>
        <Text style={styles.display}>View Assignment Display</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eaf4f7',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003135',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectedModule: {
    fontSize: 18,
    color: '#003135',
    marginVertical: 10, // Space between picker and assignments
    textAlign: 'center',
  },
  assignmentItem: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignmentText: {
    fontSize: 16,
    color: '#003135',
    marginLeft: 10,
  },
  dueDate: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  noAssignmentsText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  display: {
    fontSize: 18,
    color: '#663399',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  icon: {
    marginRight: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#663399',
    borderRadius: 8,
    color: 'black',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#663399',
    borderRadius: 8,
    color: 'black',
    marginBottom: 20,
    backgroundColor: 'white',
  },
});

export default Assignments;
