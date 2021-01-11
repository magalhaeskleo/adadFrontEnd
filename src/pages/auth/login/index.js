import { Button, Container, Snackbar, TextField } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import logo from '../../../assets/logo.png';
import { useAuth } from '../../../context/auth';
import './style.css';

export default function Login() {
  const { singIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const vertical = 'bottom';
  const horizontal = 'left';

  async function sendLogin(form) {
    const data = await singIn(form);

    if (data.id) {
      setSeverity('success');
      setMessage('Login efetuado com sucesso');
      setOpen(true);
    } else {
      setSeverity('warning');
      setMessage(data);
      setOpen(true);
    }
  }

  const validation = yup.object().shape({
    email: yup.string().email('E-mail inválido').required('Campo obirgatório'),
    password: yup
      .string()
      .min(4, 'Minimo quatro caracteres')
      .required('Campo obirgatório'),
  });

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  const width = { tudo: 'xl', lateral: 'md', pequeno: 'sm' };
  return (
    <Container
      maxWidth={width.pequeno}
      style={{
        minHeight: '80vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className='login-img'>
        <img src={logo} alt='Logo' />
      </div>
      <div className='login-titulo'>Seja Bem Vindo </div>
      <div className='login-subtitulo'>
        Estamos felizes por você estar trabalhando em nosso aplicativo. Faça
        login abaixo para continuar
      </div>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity={severity}>
          {message}
        </Alert>
      </Snackbar>

      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={sendLogin}
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
              <div className='login-form'>
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
                  <div className='login-error'>{errors.email}</div>
                )}

                <TextField
                  label='Senha'
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
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSubmit}
                  style={{ minWidth: 350, marginTop: 20 }}
                >
                  Entrar
                </Button>
              </div>
              <div className='resetandForgot'>
                <Link to='/forgot' style={{ textDecoration: 'none' }}>
                  Esqueci minha senha
                </Link>
                <Link to='/reset' style={{ textDecoration: 'none' }}>
                  Resetar senha
                </Link>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
}
