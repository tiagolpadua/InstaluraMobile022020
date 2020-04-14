import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

function carregaIcone(likeada) {
  return likeada
    ? require('../../resources/img/s2-checked.png')
    : require('../../resources/img/s2.png');
}

function exibeLikes(likers) {
  if (likers.length <= 0) {
    return;
  }
  return (
    <Text style={styles.likes}>
      {likers.length} {likers.length > 1 ? 'curtidas' : 'curtida'}
    </Text>
  );
}

export default function Likes(props) {
  const {foto, likeCallback} = props;

  return (
    <View>
      <TouchableOpacity onPress={() => likeCallback(foto.id)}>
        <Image style={styles.botaoDeLike} source={carregaIcone(foto.likeada)} />
      </TouchableOpacity>
      {exibeLikes(foto.likers)}
    </View>
  );
}

const styles = StyleSheet.create({
  botaoDeLike: {
    marginBottom: 10,
    height: 40,
    width: 40,
  },
  likes: {
    fontWeight: 'bold',
  },
});
