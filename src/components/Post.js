import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import InputComentario from './InputComentario';
import Likes from './Likes';

const width = Dimensions.get('screen').width;

function exibeLegenda(foto) {
  if (foto.comentario === '') {
    return;
  }
  return (
    <View style={styles.comentario}>
      <Text style={styles.tituloComentario}>{foto.loginUsuario}</Text>
      <Text>{foto.comentario}</Text>
    </View>
  );
}

export default function Post(props) {
  const {foto, verPerfilCallback} = props;

  return (
    <View>
      <TouchableOpacity
        style={styles.cabecalho}
        onPress={() => verPerfilCallback(foto.id)}>
        <Image source={{uri: foto.urlPerfil}} style={styles.fotoDePerfil} />
        <Text>{foto.loginUsuario}</Text>
      </TouchableOpacity>
      <Image source={{uri: foto.urlFoto}} style={styles.foto} />
      <View style={styles.rodape}>
        <Likes foto={foto} />
        {exibeLegenda(foto)}
        {foto.comentarios.map(comentario => (
          <View style={styles.comentario} key={comentario.id}>
            <Text style={styles.tituloComentario}>{comentario.login}</Text>
            <Text>{comentario.texto}</Text>
          </View>
        ))}
        <InputComentario idFoto={foto.id} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fotoDePerfil: {
    marginRight: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  foto: {
    width: width,
    height: width,
  },
  rodape: {
    margin: 10,
  },
  botaoDeLike: {
    height: 40,
    width: 40,
  },
  likes: {
    fontWeight: 'bold',
  },
  comentario: {
    flexDirection: 'row',
  },
  tituloComentario: {
    fontWeight: 'bold',
    marginRight: 5,
  },
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
    height: 30,
    width: 30,
  },
});
