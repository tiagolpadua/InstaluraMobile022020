import React from 'react';
import {Button, FlatList, View} from 'react-native';
import HeaderUsuario from './HeaderUsuario';
import Post from './Post';
import useFotos from './useFotos';
import {FotosProvider} from './FotosContext';

export default function Feed(props) {
  const fotos = useFotos(props.route);

  const verPerfilUsuario = idFoto => {
    const foto = fotos.buscaPorId(idFoto);

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

  return (
    <FotosProvider value={fotos}>
      <View>
        {fotos.falhaCarregamento ? (
          <Button onPress={fotos.carregarFotos} title="Recarregar" />
        ) : (
          <FlatList
            keyExtractor={item => item.id + ''}
            data={fotos.items}
            renderItem={({item}) => (
              <Post foto={item} verPerfilCallback={verPerfilUsuario} />
            )}
            ListHeaderComponent={exibeHeader()}
          />
        )}
      </View>
    </FotosProvider>
  );
}
