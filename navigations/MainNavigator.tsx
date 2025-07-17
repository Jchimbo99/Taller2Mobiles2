import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 


import RegistroScreen from "../screens/RegistroScreen";
import LoginScreen from "../screens/LoginScreen";
import PerfilScreen from "../screens/PerfilScreen";
import HomeScreen from "../screens/HomeScreen";
import NuevoPedidoScreen from "../screens/NuevoPedidoScreen";
import GaleriaScreen from "../screens/GaleriaScreen";
import CatalogoScreen from "../screens/ProductosScreen"; 
import RestablecerScreen from "../screens/RestablecerScreen";
import MapaScreen from "../screens/MapaScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function CatalogoTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Catalogo"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Catalogo') {
                        return (
                            <MaterialIcons
                                name="storefront"
                                size={size}
                                color={color}
                            />
                        );
                    } else if (route.name === 'Perfil') {
                        return (
                            <MaterialIcons
                                name="person"
                                size={size}
                                color={color}
                            />
                        );
                    } else if (route.name === 'Ubicación') {
                        return (
                            <MaterialCommunityIcons
                                name="google-maps"
                                size={size}
                                color={color}
                            />
                        );
                    } else {
                        return (
                            <MaterialIcons
                                name="help"
                                size={size}
                                color={color}
                            />
                        );
                    }
                },
                tabBarActiveTintColor: '#e67e22',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Catalogo" component={CatalogoScreen} options={{ title: 'Catálogo' }} />
            <Tab.Screen name="Perfil" component={GaleriaScreen} options={{ title: 'Perfil' }} />
            <Tab.Screen name="Ubicación" component={MapaScreen} options={{ title: 'Ubicación' }} />
        </Tab.Navigator>
    );
}

function MyStack() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Inicio" }}
            />
            <Stack.Screen
                name="Registro"
                component={RegistroScreen}
                options={{ title: "Registro" }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: "Iniciar Sesión" }}
            />
            
            <Stack.Screen
                name="Productos"
                component={CatalogoTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Pedidos"
                component={NuevoPedidoScreen}
                options={{ title: "Pedidos" }}
            />
            <Stack.Screen
                name="Restablecer"
                component={RestablecerScreen}
                options={{ title: "Restablecer" }}
            />
            
        </Stack.Navigator>
    );
}

export default function NavegadorPrincipal() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}
