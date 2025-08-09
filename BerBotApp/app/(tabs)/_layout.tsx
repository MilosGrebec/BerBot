import { Ionicons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import React from 'react';
export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:"#D4AA00",
        headerStyle:{
          backgroundColor:'#25292e'
        },
        headerShadowVisible:false,
        headerTintColor:'#fff',
        tabBarStyle:{
          backgroundColor:'#25292e'
        }
        
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused?'home-sharp':'home-outline'} color={color} size={28}/>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Connect',
          tabBarIcon: ({ color,focused }) => <Ionicons name={focused?'bluetooth-sharp':'bluetooth-outline'} color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}
