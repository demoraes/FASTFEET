/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { signInRequest } from '../../store/modules/auth/actions';

import logo from '../../assets/logo.png';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

export default function SignIn() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  function handleSubmit({ email, password }) {
    dispatch(signInRequest(email, password));
  }

  return (
    <Form schema={schema} onSubmit={handleSubmit}>
      <img src={logo} alt="GoBarber" />

      <label htmlFor="email">SEU E-MAIL</label>
      <Input name="email" type="email" placeholder="exemplo@gmail.com" />

      <label htmlFor="password">SUA SENHA</label>
      <Input name="password" type="password" placeholder="*********" />

      <button type="submit">
        {loading ? <FaSpinner color="#fff" size={14} /> : 'Entrar no sistema'}
      </button>
    </Form>
  );
}
