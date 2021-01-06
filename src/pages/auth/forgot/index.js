import { Button, Container, TextField } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import './style.css';

export default function Forgot() {
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
      <div className='forgot-img'>
        <img src={logo} alt='Logo' />
      </div>

      <div className='forgot-titulo'>Recuperação de Senha</div>
      <div className='forgot-form'>
        <TextField
          label='E-mail'
          size='small'
          fullWidth
          placeholder='Digite seu email'
        />

        <Button
          variant='contained'
          color='primary'
          style={{ minWidth: 350, marginTop: 20 }}
        >
          Solicitar nova senha
        </Button>
      </div>
      <div className='returnLogin'>
        <Link
          to='/'
          title='Retornar ao login'
          placeholder='Login'
          style={{ textDecoration: 'none' }}
        >
          Retornar ao login
        </Link>
      </div>
    </Container>
  );
}
