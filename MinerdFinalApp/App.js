import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import RegisterIncidenceScreen from "./screens/RegisterIncidenceScreen";
import ViewIncidenceScreen from "./screens/ViewIncidenceScreen";
import IncidenceDetailScreen from "./screens/IncidenceDetailScreen";
import AboutScreen from "./screens/AboutScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import TechMenu from "./screens/TechMenu";
import RegisterVisit from "./screens/RegisterVisitScreen";
import ViewVisitsScreen from "./screens/ViewVisitsScreen";
import VisitDetailScreen from "./screens/VisitDetailScreen";

const StackNav = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StackNav.Navigator initialRouteName="Home">
        <StackNav.Screen
          options={{ headerBackVisible: false }}
          name="Home"
          component={HomeScreen}
        />
        <StackNav.Screen
          options={{ headerBackVisible: true }}
          name="TechMenu"
          component={TechMenu}
        />
        <StackNav.Screen
          name="RegisterIncidents"
          component={RegisterIncidenceScreen}
        />
        <StackNav.Screen 
        name="ViewIncidents" 
        component={ViewIncidenceScreen} />

        <StackNav.Screen
          name="incidentsDetail"
          component={IncidenceDetailScreen}
        />
        <StackNav.Screen 
        name="Register" 
        component={RegisterScreen} />

        <StackNav.Screen 
        name="RegisterVisit" 
        component={RegisterVisit} />

        <StackNav.Screen 
        name="ViewVisits" 
        component={ViewVisitsScreen} />

        <StackNav.Screen 
        name="VisitDetail" 
        component={VisitDetailScreen} />

        <StackNav.Screen name="Login" 
        component={LoginScreen} 
          options={{ headerBackVisible: false }}
          />

        <StackNav.Screen 
        name="About" 
        component={AboutScreen} />
      </StackNav.Navigator>
    </NavigationContainer>
  );
}