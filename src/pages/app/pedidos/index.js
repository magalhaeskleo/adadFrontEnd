import { Container, Snackbar } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { Add } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import AddPedido from './addPedido';
import TablePedidos from './table';

export default function Pedidos() {
  const width = { tudo: 'xl', lateral: 'md', pequeno: 'sm' };
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [carregar, setCarregar] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const vertical = 'bottom';
  const horizontal = 'left';

  function callbackDelete(status) {
    if (status === 'ok') {
      setCarregar(true);
      setSeverity('success');
      setMessage('Registro excluído com sucesso');
      setOpen(true);
    }

    //  setOpenModal(false);
  }

  function callbackAdd(status, message) {
    if (status === 'ok') {
      setCarregar(true);
      setSeverity('success');
      setMessage('Operação realizado com sucesso');
      setOpen(true);
    }
    if (status === 'error') {
      setSeverity('warning');
      setMessage(message);
      setOpen(true);
    }

    setOpenModal(false);
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  const section = (
    <Container
      maxWidth={width.tudo}
      style={{
        minHeight: '80vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'end' }}>
        <Fab
          color='primary'
          aria-label='add'
          onClick={() => setOpenModal(true)}
        >
          <Add />
        </Fab>
      </div>
      <TablePedidos
        carregar={carregar}
        setCarregar={setCarregar}
        callbackDelete={callbackDelete}
      />
      <AddPedido
        openModal={openModal}
        setOpenModal={setOpenModal}
        callback={callbackAdd}
        // initialValues={initialValues}
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

  return section;
}
