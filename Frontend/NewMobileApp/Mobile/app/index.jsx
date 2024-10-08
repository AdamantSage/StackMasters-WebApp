import { Text, View, StyleSheet, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from 'expo-router';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../assets/images/NWU-P.png')}
          style={styles.image}
        />
        <Text style={styles.text}>
          Welcome to the North West University HMS project 
        </Text>
        <Link href="/sign-in" style={styles.button}>
          <Text style={styles.buttonText}>
            Go to sign in screen
          </Text>
        </Link>

        <Link href="/register" style={styles.button}>
          <Text style={styles.buttonText}>
            New User? Register
          </Text>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#000000',
  }, 
  scrollContent: {
    flexGrow: 1,                  // Ensure the content takes the available space
    justifyContent: 'center',      // Center the content vertically
    alignItems: 'center'         // Center the content horizontally
  },
  image:{
    width: 250,
    height: 250,
    marginBottom: 20,
    marginLeft: 40
  },
  text:{
    color: '#f8f8ff',
    fontSize: 16,                 
    textAlign: 'center'
  },
  button:{
    backgroundColor: '#663399',
    paddingVertical: 10,        
    paddingHorizontal: 20,        
    borderRadius: 5,             
    marginTop: 20
  },
  buttonText: {
    color: '#f8f8ff',          
    fontSize: 16,                 
    textAlign: 'center'
  }
});