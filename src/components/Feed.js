import React, {useEffect, useState} from 'react';
import {Button, FlatList, View} from 'react-native';
import Notificacao from '../api/Notificacao';
import InstaluraFetchService from '../services/InstaluraFetchService';
import HeaderUsuario from './HeaderUsuario';
import Post from './Post';
import AsyncStorage from '@react-native-community/async-storage';

export default function Feed(props) {
  const [fotos, setFotos] = useState([]);
  const [falhaCarregamento, setFalhaCarregamento] = useState(false);

  const buscaPorId = idFoto => {
    return fotos.find(f => f.id === idFoto);
  };

  const atualizaFotos = fotoAtualizada => {
    const fotosAtualizadas = fotos.map(f =>
      f.id === fotoAtualizada.id ? fotoAtualizada : f,
    );
    setFotos(fotosAtualizadas);
  };

  const like = idFoto => {
    const foto = buscaPorId(idFoto);
    const listaOriginal = fotos;
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
        atualizaFotos(fotoAtualizada);
      });

    InstaluraFetchService.post(`/fotos/${idFoto}/like`).catch(e => {
      setFotos(listaOriginal);
      Notificacao.exibe('Ops..', 'Algo deu errado ao curtir');
    });
  };

  const adicionaComentario = (idFoto, valorComentario, inputComentario) => {
    if (valorComentario === '') {
      return;
    }

    const foto = buscaPorId(idFoto);

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
        atualizaFotos(fotoAtualizada);
        inputComentario.clear();
      })
      .catch(e => {
        atualizaFotos(foto);
        Notificacao.exibe('Ops..', 'Algo deu errado ao comentar');
      });
  };

  const verPerfilUsuario = idFoto => {
    const foto = buscaPorId(idFoto);

    props.navigation.navigate('PerfilUsuario', {
      usuario: foto.loginUsuario,
      fotoDePerfil: foto.urlPerfil,
    });
  };

  const exibeHeader = () => {
    const {params} = props.route;
    if (params) {
      return <HeaderUsuario {...params} posts={fotos.length} />;
    }
  };

  const carregarFotos = () => {
    const {params} = props.route;
    let uri = '/fotos';

    if (params && params.usuario) {
      uri = `/public/fotos/${params.usuario}`;
    }

    InstaluraFetchService.get(uri)
      .then(json => setFotos(json))
      .catch(e => setFalhaCarregamento(true));
  };

  useEffect(() => {
    carregarFotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      {falhaCarregamento ? (
        <Button onPress={carregarFotos} title="Recarregar" />
      ) : (
        <FlatList
          keyExtractor={item => item.id + ''}
          data={fotos}
          renderItem={({item}) => (
            <Post
              foto={item}
              comentarioCallback={adicionaComentario}
              likeCallback={like}
              verPerfilCallback={verPerfilUsuario}
            />
          )}
          ListHeaderComponent={exibeHeader()}
        />
      )}
    </View>
  );
}
