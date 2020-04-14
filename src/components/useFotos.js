import AsyncStorage from '@react-native-community/async-storage';
import {useState} from 'react';
import Notificacao from '../api/Notificacao';
import InstaluraFetchService from '../services/InstaluraFetchService';

export default function useFotos() {
  const [items, setItems] = useState([]);

  const buscaPorId = idFoto => {
    return items.find(f => f.id === idFoto);
  };

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

  return {
    items,
    setItems,
    like,
  };
}
