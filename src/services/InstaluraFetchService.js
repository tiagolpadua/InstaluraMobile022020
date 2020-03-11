import AsyncStorage from '@react-native-community/async-storage';

export default class InstaluraFetchService {
  static base = 'https://instalura-api.herokuapp.com/api';

  static get(recurso) {
    return this.request(recurso);
  }

  static post(recurso, dados) {
    return this.request(recurso, 'POST', dados);
  }

  static request(recurso, metodo, dados) {
    const uri = `${this.base}${recurso}`;
    return AsyncStorage.getItem('token')
      .then(token => {
        return {
          method: metodo,
          body: dados && JSON.stringify(dados),
          headers: new Headers({
            'Content-type': 'application/json',
            'X-AUTH-TOKEN': token,
          }),
        };
      })
      .then(requestInfo => fetch(uri, requestInfo))
      .then(resposta => {
        if (resposta.ok) {
          return resposta.json();
        }
        throw new Error('Não foi possível completar a operação');
      });
  }
}
