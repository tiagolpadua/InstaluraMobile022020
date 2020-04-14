import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function InputComentario(props) {
  const {comentarioCallback, idFoto} = props;
  const [valorComentario, setValorComentario] = useState('');
  let inputComentario;

  return (
    <View style={styles.novoComentario}>
      <TextInput
        style={styles.input}
        placeholder="Adicione um comentário..."
        ref={input => (inputComentario = input)}
        onChangeText={texto => setValorComentario(texto)}
        underlineColorAndroid="transparent"
      />
      <TouchableOpacity
        onPress={() => {
          comentarioCallback(idFoto, valorComentario, inputComentario);
          setValorComentario('');
        }}>
        <Image
          style={styles.icone}
          source={require('../../resources/img/send.png')}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  novoComentario: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
  },
  icone: {
    width: 30,
    height: 30,
  },
});
