import { Container, makeStyles, Snackbar } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { Add } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import api from '../../../service/api';
import AddFinanceiro from './addFinanceiro';
import TableFinanceiro from './table';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    marginTop: 5,
    backgroundColor: theme.palette.background.paper,
  },
  searchDiv: {
    maxWidth: '100vh',
    marginLeft: 10,
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
    },
  },
  headerTable: {
    flex: 1,
    textAlign: 'start',
    justifyItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  listItemTitle1: {
    flex: 1,
    maxWidth: '33%',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      width: '100%',
    },
  },
  small: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },

  rootHeader: {
    width: '100%',
    // maxWidth: 360,
    marginTop: 10,
    paddingLeft: 5,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Nucleo() {
  const width = { tudo: 'xl', lateral: 'md', pequeno: 'sm' };
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [carregar, setCarregar] = useState(false);
  const [initialValues, setInitialValues] = useState('');
  const vertical = 'bottom';
  const horizontal = 'left';

  function callbackAdd(status, message) {
    if (status === 'ok') {
      setSeverity('success');
      setMessage('Ação realizada com sucesso');
      setOpen(true);
    }
    if (status === 'error') {
      setSeverity('warning');
      setMessage(message);
      setOpen(true);
    }

    setInitialValues('');
    setCarregar(true);
  }

  function callbackEdit(item) {
    setInitialValues(item);
    setOpenModal(true);
  }

  async function callbackDelete(item) {
    const resp = await api.delete(`/financeiro/${item.id}`);
    if (resp.data) {
      setCarregar(true);
    }
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
      <AddFinanceiro
        openModal={openModal}
        setOpenModal={setOpenModal}
        callback={callbackAdd}
        initialValues={initialValues}
      />

      <TableFinanceiro
        carregar={carregar}
        setCarregar={setCarregar}
        callbackEdit={callbackEdit}
        callbackDelete={callbackDelete}
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
