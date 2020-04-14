import AsyncStorage from '@react-native-community/async-storage';
import {useState, useEffect} from 'react';
import Notificacao from '../api/Notificacao';
import InstaluraFetchService from '../services/InstaluraFetchService';

export default function useFotos(route) {
  const [items, setItems] = useState([]);
  const [falhaCarregamento, setFalhaCarregamento] = useState(false);

  const buscaPorId = idFoto => items.find(f => f.id === idFoto);

  const atualizaFotos = fotoAtualizada => {
    const fotosAtualizadas = items.map(f =>
      f.id === fotoAtualizada.id ? fotoAtualizada : f,
    );
    setItems(fotosAtualizadas);
  };

  const like = idFoto => {
    const foto = buscaPorId(idFoto);
    const listaOriginal = items;
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
      setItems(listaOriginal);
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

  const carregarFotos = () => {
    const {params} = route;
    let uri = '/fotos';

    if (params && params.usuario) {
      uri = `/public/fotos/${params.usuario}`;
    }

    InstaluraFetchService.get(uri)
      .then(json => setItems(json))
      .catch(e => setFalhaCarregamento(true));
  };

  useEffect(() => {
    carregarFotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    adicionaComentario,
    buscaPorId,
    carregarFotos,
    falhaCarregamento,
    items,
    like,
  };
}
