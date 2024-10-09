import { View, Text, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import React from 'react';
import { useRouter } from 'expo-router'; // Correct the import statement

const home = ({ loggedInUserId }) => {
  const router = useRouter();

  const goToProfile = () => {
    router.push(`/profile?userId=${loggedInUserId}`); // Correct the query string
  };

  return (
    <View>
      <TouchableOpacity onPress={goToProfile}>
        <Text>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default home; // Use PascalCase for component names
