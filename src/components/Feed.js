import React, {Component} from 'react';
import {FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Post from './Post';

export default class Feed extends Component {
  constructor() {
    super();
    this.state = {
      fotos: [],
    };
  }

  async componentDidMount() {
    const uri = 'https://instalura-api.herokuapp.com/api/fotos';

    /*
    AsyncStorage.getItem('token')
      .then(token => {
        return {
          headers: new Headers({
            'X-AUTH-TOKEN': token,
          }),
        };
      })
      .then(requestInfo => fetch(uri, requestInfo))
      .then(resposta => resposta.json())
      .then(json => this.setState({fotos: json}));
    */

    const token = await AsyncStorage.getItem('token');
    const requestInfo = {
      headers: new Headers({
        'X-AUTH-TOKEN': token,
      }),
    };
    const resposta = await fetch(uri, requestInfo);
    const json = await resposta.json();

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({fotos: json});
  }

  adicionaComentario = (idFoto, valorComentario, inputComentario) => {
    if (valorComentario === '') {
      return;
    }
    const foto = this.buscaPorId(idFoto);
    const uri = `http://instalura-api.herokuapp.com/api/fotos/${idFoto}/comment`;
    AsyncStorage.getItem('token')
      .then(token => {
        return {
          method: 'POST',
          body: JSON.stringify({
            texto: valorComentario,
          }),
          headers: new Headers({
            'Content-type': 'application/json',
            'X-AUTH-TOKEN': token,
          }),
        };
      })
      .then(requestInfo => fetch(uri, requestInfo))
      .then(resposta => resposta.json())
      .then(comentario => [...foto.comentarios, comentario])
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          comentarios: novaLista,
        };
        this.atualizaFotos(fotoAtualizada);
        inputComentario.clear();
      });
  };

  like = idFoto => {
    const foto = this.buscaPorId(idFoto);
    AsyncStorage.getItem('usuario')
      .then(usuarioLogado => {
        let novaLista = [];
        if (!foto.likeada) {
          novaLista = [...foto.likers, {login: usuarioLogado}];
        } else {
          novaLista = foto.likers.filter(liker => {
            return liker.login !== usuarioLogado;
          });
        }
        return novaLista;
      })
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          likeada: !foto.likeada,
          likers: novaLista,
        };
        this.atualizaFotos(fotoAtualizada);
      });
    const uri = `http://instalura-api.herokuapp.com/api/fotos/${idFoto}/like`;
    AsyncStorage.getItem('token')
      .then(token => {
        return {
          method: 'POST',
          headers: new Headers({
            'X-AUTH-TOKEN': token,
          }),
        };
      })
      .then(requestInfo => fetch(uri, requestInfo));
  };

  atualizaFotos = fotoAtualizada => {
    const {fotos} = this.state;
    const fotosAtualizadas = fotos.map(f =>
      f.id === fotoAtualizada.id ? fotoAtualizada : f,
    );
    this.setState({fotos: fotosAtualizadas});
  };

  buscaPorId(idFoto) {
    const {fotos} = this.state;
    return fotos.find(f => f.id === idFoto);
  }

  render() {
    return (
      <FlatList
        keyExtractor={item => item.id + ''}
        data={this.state.fotos}
        renderItem={({item}) => (
          <Post
            foto={item}
            likeCallback={this.like}
            comentarioCallback={this.adicionaComentario}
          />
        )}
      />
    );
  }
}
