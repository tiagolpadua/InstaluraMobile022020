import React, {Component} from 'react';
import {FlatList, Button, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Post from './Post';
import InstaluraFetchService from '../services/InstaluraFetchService';
import Notificacao from '../api/Notificacao';

export default class Feed extends Component {
  constructor() {
    super();
    this.state = {
      fotos: [],
      falhaCarregamento: false,
    };
  }

  carregarFotos = () => {
    InstaluraFetchService.get('/fotos')
      .then(json => {
        this.setState({fotos: json});
      })
      .catch(e => this.setState({falhaCarregamento: true}));
  };

  componentDidMount() {
    this.carregarFotos();
  }

  adicionaComentario = (idFoto, valorComentario, inputComentario) => {
    if (valorComentario === '') {
      return;
    }

    const foto = this.buscaPorId(idFoto);

    const novoComentario = {
      texto: valorComentario,
    };

    InstaluraFetchService.post(`/fotos/${idFoto}/comment`, novoComentario)
      .then(comentario => [...foto.comentarios, comentario])
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          comentarios: novaLista,
        };
        this.atualizaFotos(fotoAtualizada);
        inputComentario.clear();
      })
      .catch(e => {
        this.atualizaFotos(foto);
        Notificacao.exibe('Ops..', 'Algo deu errado ao comentar');
      });
  };

  like = idFoto => {
    const foto = this.buscaPorId(idFoto);
    const listaOriginal = this.state.fotos;
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
    InstaluraFetchService.post(`/fotos/${idFoto}/like`).catch(e => {
      this.setState({fotos: listaOriginal});
      Notificacao.exibe('Ops..', 'Algo deu errado ao curtir');
    });
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
    const {falhaCarregamento} = this.state;
    return (
      <View>
        {falhaCarregamento ? (
          <Button onPress={this.carregarFotos} title="Recarregar" />
        ) : (
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
        )}
      </View>
    );
  }
}
