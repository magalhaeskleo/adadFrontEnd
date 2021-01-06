import { Container, makeStyles, Snackbar } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { Add } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { PeopleProvider } from '../../../context/app/people';
import api from '../../../service/api';
import AddPepople from './addPeople';
import TablePeople from './table';

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
  nameAvatar: {
    maxWidth: '27%',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
  avatarData: {
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-between',
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
const now = new Date();
const nowFormat = `${now.getFullYear() - 6}-${
  now.getMonth() < 10 ? '' + now.getMonth() + 1 : now.getMonth() + 1
}-${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()}`;

const init = {
  fullName: '',
  cpf: '',
  maritalStatus: 'solteiro',
  personalDocument: '',
  sexo: 'f',
  phone: '',
  street: '',
  email: '',
  number: '',
  city: '',
  state: '',
  neighborhood: '',
  complement: '',
  denomination: '',
  mothersName: '',
  fathersName: '',
  atividadenaigreja: '',
  birthDate: nowFormat,
  cep: '',
  batizadoemaguas: 'n',
};

export default function Nucleo() {
  const width = { tudo: 'xl', lateral: 'md', pequeno: 'sm' };
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [edition, setEdition] = useState(false);

  const [initialValues, setInitialValues] = useState(init);

  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const vertical = 'bottom';
  const horizontal = 'left';

  function handleClose() {
    setOpenModal(false);
    setInitialValues(init);
    setEdition(false);
  }

  function callbackEdit(item) {
    const { denomination, batizadoemaguas, atividadenaigreja } = item.church;
    const {
      street,
      number,
      cep,
      city,
      state,
      complement,
      neighborhood,
    } = item.address;

    const personal = item.personal;

    setInitialValues({
      ...personal,
      street,
      number,
      cep,
      city,
      state,
      complement,
      neighborhood,
      denomination,
      batizadoemaguas,
      atividadenaigreja,
    });
    setEdition(true);
    setOpenModal(true);
  }

  function callbackPersonal(status, message) {
    if (!status) {
      setSeverity('warning');
      setMessage(message);
    } else {
      setSeverity('success');
      setMessage('Ação realizada com sucesso');
    }
    setOpen(true);
  }

  async function callbackDelete(item) {
    if (item) {
      const response = await api.put(
        `/personaldata/deactivate/${item.personal.id}`
      );

      if (response.error) {
        setSeverity('warning');
        setMessage(response.error);
      } else {
        setSeverity('success');
        setMessage('Ação realizada com sucesso');
      }
      setOpen(true);
    }
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
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

        <TablePeople
          callbackEdit={callbackEdit}
          callbackDelete={callbackDelete}
        />
        <AddPepople
          openModal={openModal}
          handleClose={handleClose}
          callbackPersonal={callbackPersonal}
          initialValues={initialValues}
          edition={edition}
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
