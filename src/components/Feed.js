import React, {Component} from 'react';
import {FlatList} from 'react-native';
import Post from './Post';

export default class Feed extends Component {
  constructor() {
    super();
    this.state = {
      fotos: [],
    };
  }

  componentDidMount() {
    fetch('https://instalura-api.herokuapp.com/api/public/fotos/rafael')
      .then(resposta => resposta.json())
      .then(json => this.setState({fotos: json}));
  }

  adicionaComentario = (idFoto, valorComentario, inputComentario) => {
    if (valorComentario === '') {
      return;
    }
    const {fotos} = this.state;
    const foto = this.buscaPorId(idFoto);
    const novaLista = [
      ...foto.comentarios,
      {
        id: valorComentario,
        login: 'meuUsuario',
        texto: valorComentario,
      },
    ];
    const fotoAtualizada = {
      ...foto,
      comentarios: novaLista,
    };
    const fotosAtualizadas = fotos.map(f =>
      f.id === fotoAtualizada.id ? fotoAtualizada : f,
    );
    this.setState({fotos: fotosAtualizadas});
    inputComentario.clear();
  };

  like = idFoto => {
    const {fotos} = this.state;
    const foto = this.buscaPorId(idFoto);
    let novaLista = [];
    if (!foto.likeada) {
      novaLista = [...foto.likers, {login: 'meuUsuario'}];
    } else {
      novaLista = foto.likers.filter(liker => liker.login !== 'meuUsuario');
    }
    const fotoAtualizada = {
      ...foto,
      likeada: !foto.likeada,
      likers: novaLista,
    };
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
