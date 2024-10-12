import React from 'react'
import { Tabs } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';


const _layout = () => {
  return (
      <Tabs  screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
        backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
        backgroundColor: '#25292e',
        },
      }}
      >
        <Tabs.Screen name="home" options={{ title: 'Home',  tabBarIcon: ({ color, size }) => (<Entypo name="home" size={size} color={color} />), }}/>
        <Tabs.Screen name="assignments" options={{ title: 'Assignment', tabBarIcon: ({ color, size }) => (<AntDesign name="profile" size={size} color={color} />) }}/>
        <Tabs.Screen name="submission" options={{ title: 'Submission', tabBarIcon: ({ color, size }) => (<AntDesign name="book" size={size} color={color} />) }}/>
        <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => (<AntDesign name="user" size={size} color={color} />) }}/>
      </Tabs>
  )
}

export default _layout