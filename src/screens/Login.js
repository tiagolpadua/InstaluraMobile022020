import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {CommonActions} from '@react-navigation/native';
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
export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      usuario: 'rafael',
      senha: '123456',
      mensagem: '',
    };
  }

  efetuaLogin = () => {
    // Novidade aqui
    const {navigation} = this.props;

    const uri = 'https://instalura-api.herokuapp.com/api/public/login';
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({
        login: this.state.usuario,
        senha: this.state.senha,
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
        AsyncStorage.setItem('usuario', this.state.usuario);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Feed'}],
          }),
        );
      })
      .catch(error => this.setState({mensagem: error.message}));
  };

  logout = () => {
    AsyncStorage.removeItem('usuario');
    AsyncStorage.removeItem('token');
    // ir para a tela de logout
  };

  render() {
    const {mensagem} = this.state;
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Instalura</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder="Usuário..."
            onChangeText={texto => this.setState({usuario: texto})}
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            secureTextEntry
            placeholder="Senha..."
            onChangeText={texto => this.setState({senha: texto})}
          />
          <Button title="Login" onPress={this.efetuaLogin} />

          <View style={{marginTop: 50}}>
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
}

const styles = StyleSheet.create({
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
