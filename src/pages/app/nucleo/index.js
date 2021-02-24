import { Container, makeStyles, Snackbar } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { Add } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { NucleoProvider } from '../../../context/app/nucleo';
import api from '../../../service/api';
import AddNucleos from './addNucleo';
import TableNucleos from './table';

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

  const [initialValues, setInitialValues] = useState('');
  const vertical = 'bottom';
  const horizontal = 'left';

  function callbackAdd(status, message) {
    if (status === 'ok') {
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
  }

  function callbackEdit(item) {
    setInitialValues(item);
    setOpenModal(true);
  }

  async function callbackDelete(item) {
    if (item) {
      const response = await api.put(`/nucleo/deactivate/${item.id}`);

      if (response.data.error) {
        setSeverity('warning');
        setMessage(response.data.error);
      } else {
        setSeverity('success');
        setMessage('Ação realizda com sucesso');
      }
      setOpen(true);
    }
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  const section = (
    <NucleoProvider>
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

        <TableNucleos
          callbackEdit={callbackEdit}
          callbackDelete={callbackDelete}
        />
        <AddNucleos
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
    </NucleoProvider>
  );
  return section;
}
