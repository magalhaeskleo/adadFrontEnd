import { Button, Container, TextField } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import logo from '../../../assets/logo.png';
import { useAuth } from '../../../context/auth';
import './style.css';

export default function Reset() {
  const { reset } = useAuth();

  const width = { tudo: 'xl', lateral: 'md', pequeno: 'sm' };
  const validation = yup.object().shape({
    email: yup.string().email('E-mail inválido').required('Campo obirgatório'),
    passwordReset: yup.string().required('Campo obrigatório'),
    password: yup
      .string()
      .min(4, 'Minimo quatro caracteres')
      .required('Campo obirgatório'),
  });

  return (
    <Container
      maxWidth={width.pequeno}
      style={{
        minHeight: '80vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className='reset-img'>
        <img src={logo} alt='Logo' />
      </div>
      <div className='reset-titulo'>Resetar Senha</div>

      <Formik
        initialValues={{ email: '', password: '', passwordReset: '' }}
        onSubmit={reset}
        validationSchema={validation}
      >
        {({
          errors,
          touched,
          values,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          return (
            <Form>
              <div className='reset-form'>
                <TextField
                  label='E-mail'
                  name='email'
                  size='small'
                  value={values.email}
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && errors.email && (
                  <div className='login-error'>
                    {touched.email && errors.email && errors.email}
                  </div>
                )}

                <TextField
                  label='Nova Senha'
                  name='password'
                  size='small'
                  type='password'
                  valeu={values.password}
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.password && errors.password && (
                  <div className='login-error'>{errors.password}</div>
                )}
                <TextField
                  label='Chave'
                  name='passwordReset'
                  size='small'
                  valeu={values.passwordReset}
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.passwordReset && errors.passwordReset && (
                  <div className='login-error'>{errors.passwordReset}</div>
                )}
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSubmit}
                  style={{ minWidth: 350, marginTop: 20 }}
                >
                  Recuperar
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      <div className='resetandForgot'>
        <Link
          classeName='reset-link'
          to='/'
          placeholder='Login'
          style={{ textDecoration: 'none' }}
        >
          Retornar ao login
        </Link>

        <Link to='/forgot' style={{ textDecoration: 'none' }}>
          Solicitar chave
        </Link>
      </div>
    </Container>
  );
}
