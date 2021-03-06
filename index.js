import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppRegistry, Button} from 'react-native';
import 'react-native-gesture-handler';
import Feed from './src/components/Feed';
import Login from './src/screens/Login';
import Splash from './src/screens/Splash';
import AluraLingua from './src/components/AluraLingua';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{title: 'Splash', headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AluraLingua"
          component={AluraLingua}
          options={{title: 'Novidade para você'}}
        />
        <Stack.Screen
          name="Feed"
          component={Feed}
          options={({navigation}) => ({
            title: 'Instalura',
            headerRight: () => (
              <Button
                title="Logout"
                onPress={() => {
                  AsyncStorage.removeItem('usuario');
                  AsyncStorage.removeItem('token');
                  navigation.navigate('Login');
                }}
              />
            ),
          })}
        />
        <Stack.Screen
          name="PerfilUsuario"
          component={Feed}
          options={({route}) => ({
            title: route.params.usuario,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent('InstaluraMobile022020', () => App);
