import { Container, makeStyles, Snackbar, Typography } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { Add, ArrowForward } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { usePlano } from '../../../../context/app/plano';
import '../style.css';
import AddPlano from './addPlano';
import TablePlanos from './table';

function getRandomColor(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var e = 0; e < 3; e++) {
    var value = (hash >> (e * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    justifyContent: 'flex-start',
    display: 'flex',
    flexWrap: 'wrap',

    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  fullSm: {
    marginLeft: 10,
    marginTop: 10,
    width: '25%',
    texrtAlign: 'start',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  iconStyle: {
    color: 'white',
    height: '100%',
  },
  circleIcon: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginRight: 5,
    textAlign: 'center',
  },
}));

export default function PlanoDeAula({ setPageReturn }) {
  const width = { tudo: 'xl', lateral: 'md', pequeno: 'sm' };
  const vertical = 'bottom';
  const horizontal = 'left';
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [carregar, setCarregar] = useState(false);
  const [open, setOpen] = useState(false);

  const [openVisu, setOpenVisu] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { setEdit } = usePlano();

  function handleOpenAdd() {
    setEdit(false);

    setOpenModal(true);
  }

  function handleAdd() {
    setEdit(false);
    setOpenModal(true);
  }

  function callbackAddPlano(status) {
    if (status === 'ok') {
      setSeverity('success');
      setMessage('Operação realizada com sucesso');
      setOpen(true);
    }
    if (status === 'error') {
      setSeverity('warning');
      setMessage(message);
      setOpen(true);
    }

    setOpenModal(false);
    setCarregar(true);
    setEdit(false);
  }

  function callbackEdit() {
    setOpenModal(true);
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  return (
    <Container
      maxWidth={width.tudo}
      style={{
        minHeight: '80vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          textAlign: 'start',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant='h6' style={{ color: '#5D6D7E' }}>
          Planos de Aula
        </Typography>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            textAlign: 'start',
            width: 130,
            justifyContent: 'space-evenly',
          }}
        >
          <Fab
            color='primary'
            aria-label='add'
            style={{ marginTop: 15 }}
            onClick={() => handleAdd()}
          >
            <Add />
          </Fab>
          <Fab
            color='primary'
            aria-label='add'
            style={{ marginTop: 15 }}
            onClick={setPageReturn}
          >
            <ArrowForward />
          </Fab>
        </div>
      </div>
      <TablePlanos
        carregar={carregar}
        setCarregar={setCarregar}
        callbackDelete={callbackAddPlano}
        callbackEdit={callbackEdit}
      />
      <AddPlano
        openModal={openModal}
        onClose={() => handleOpenAdd()}
        callback={callbackAddPlano}
      />

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
    </Container>
  );
}
