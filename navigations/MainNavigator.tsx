import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from '@expo/vector-icons'; 


import RegistroScreen from "../screens/RegistroScreen";
import LoginScreen from "../screens/LoginScreen";
import PerfilScreen from "../screens/PerfilScreen";
import HomeScreen from "../screens/HomeScreen";
import NuevoPedidoScreen from "../screens/NuevoPedidoScreen";
import GaleriaScreen from "../screens/GaleriaScreen";
import CatalogoScreen from "../screens/ProductosScreen"; 
import RestablecerScreen from "../screens/RestablecerScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function CatalogoTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Catalogo"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName: React.ComponentProps<typeof MaterialIcons>['name'];

                    if (route.name === 'Catalogo') {
                        iconName = 'storefront';
                    } else if (route.name === 'Perfil') {
                        iconName = 'person';
                    } else {
                        iconName = 'help'; 
                    }

                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#e67e22',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Catalogo" component={CatalogoScreen} options={{ title: 'Catálogo' }} />
            <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil' }} />
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
