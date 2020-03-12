import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Likes from '../src/components/Likes';
import foto from './foto.json';
import fotoLikeada from './fotoLikeada.json';

it('Deve renderizar corretamente', () => {
  const likes = renderer.create(<Likes foto={foto} likeCallback={jest.fn} />);
  expect(likes).toMatchSnapshot();
});

it('Deve renderizar corretamente uma foto likeada', () => {
  const likes = renderer.create(
    <Likes foto={fotoLikeada} likeCallback={jest.fn} />,
  );
  expect(likes).toMatchSnapshot();
});
