import AsyncStorage from '@react-native-community/async-storage';
import {CommonActions} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// https://github.com/react-native-community/react-native-async-storage
// https://github.com/facebook/react-native/issues/20841#issuecomment-427289537

const {width} = Dimensions.get('screen');

export default function Login(props) {
  const [usuario, setUsuario] = useState('rafael');
  const [senha, setSenha] = useState('123456');
  const [mensagem, setMensagem] = useState('');

  const {navigation} = props;

  const efetuaLogin = () => {
    // Novidade aqui

    const uri = 'https://instalura-api.herokuapp.com/api/public/login';
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({
        login: usuario,
        senha: senha,
      }),
      headers: new Headers({
        'Content-type': 'application/json',
      }),
    };

    fetch(uri, requestInfo)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        throw new Error('Não foi possível efetuar login');
      })
      .then(token => {
        AsyncStorage.setItem('token', token);
        AsyncStorage.setItem('usuario', usuario);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Feed'}],
          }),
        );
      })
      .catch(error => setMensagem(error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Instalura</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder="Usuário..."
          onChangeText={texto => setUsuario(texto)}
        />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          secureTextEntry
          placeholder="Senha..."
          onChangeText={texto => setSenha(texto)}
        />
        <Button title="Login" onPress={efetuaLogin} />

        <View style={styles.novidade}>
          <Button
            title="Temos uma novidade!"
            onPress={() => navigation.navigate('AluraLingua')}
          />
        </View>
      </View>
      <Text style={styles.mensagem}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  novidade: {
    marginTop: 50,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: width * 0.8,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 26,
  },
  mensagem: {
    marginTop: 15,
    color: '#e74c3c',
  },
});
