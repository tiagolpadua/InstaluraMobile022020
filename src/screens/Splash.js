import AsyncStorage from '@react-native-community/async-storage';
import {CommonActions} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View, YellowBox} from 'react-native';

YellowBox.ignoreWarnings(['Require cycle:']);

export default function Splash(props) {
  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      const {navigation} = props;

      let initial;
      if (token) {
        initial = 'Feed';
      } else {
        initial = 'Login';
      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: initial}],
        }),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Instalura</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 26,
  },
});
