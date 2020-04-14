import React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const {width} = Dimensions.get('screen');

function abreURL(url) {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.log('Não é possível abrir a URL: ' + url);
    }
  });
}

export default function AluraLingua() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../resources/img/aluralingua.png')}
        style={styles.image}
      />
      <TouchableOpacity
        style={styles.botao}
        title="Aprenda Inglês"
        onPress={() => abreURL('https://www.aluralingua.com.br/')}>
        <Text style={styles.texto}>Aprenda Inglês</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width,
  },
  botao: {
    backgroundColor: 'white',
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'red',
    width: width * 0.7,
  },
  texto: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'red',
  },
});
