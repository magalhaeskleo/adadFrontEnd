import { Container, Snackbar } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { Add } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { PeopleProvider } from '../../../context/app/people';
import api from '../../../service/api';
import AddUniforme from './addUniforme';
import TableUniformes from './table';

export default function Uniforme() {
  const width = { tudo: 'xl', lateral: 'md', pequeno: 'sm' };

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [openModal, setOpenModal] = useState(false);
  const [initialValues, setInitialValues] = useState(false);
  const [carregar, setCarregar] = useState(false);
  const vertical = 'bottom';
  const horizontal = 'left';

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  function callbackEdit(item) {
    setInitialValues(item);
    setOpenModal(true);
  }

  async function callbackDelete(item) {
    if (item) {
      const response = await api.delete(`/uniforme/delete/${item.id}`);

      if (response.error) {
        setSeverity('warning');
        setMessage(response.error);
      } else {
        setSeverity('success');
        setMessage('Ação realizda com sucesso');
      }
      setOpen(true);
    }
  }

  function callbackAdd(status, message) {
    if (status === 'ok') {
      setCarregar(true);
      setSeverity('success');
      setMessage('Cadasrto realizado com sucesso');
      setOpen(true);
    }
    if (status === 'error') {
      setSeverity('warning');
      setMessage(message);
      setOpen(true);
    }

    if (status === 'cancel') {
      setInitialValues('');
    }
    setCarregar(true);
  }

  const section = (
    <PeopleProvider>
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
        <TableUniformes
          callbackEdit={callbackEdit}
          callbackDelete={callbackDelete}
          carregar={carregar}
        />
        <AddUniforme
          openModal={openModal}
          setOpenModal={setOpenModal}
          callback={callbackAdd}
          initialValues={initialValues}
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
    </PeopleProvider>
  );

  return section;
}
