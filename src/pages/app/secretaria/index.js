import { Container, makeStyles, Snackbar, Typography } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { Add, Description } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import CardItem from '../../../components/CardItem';
import { useAuth } from '../../../context/auth';
import api from '../../../service/api';
import AddDoc from './addDoc';
const vertical = 'bottom';
const horizontal = 'left';

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
    marginLeft: 5,
    marginTop: 5,
    width: 350,
    // texrtAlign: 'start',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  iconStyle: {
    color: 'white',
    height: '100%',
  },
  cardaction: { marginBottom: 3, alignItems: 'center' },
  circleIcon: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginRight: 5,
    textAlign: 'center',
  },
}));

export default function DocAuxiliar({ setPageReturn }) {
  const width = { tudo: 'xl', lateral: 'md', pequeno: 'sm' };

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [itemSelected, setItemSelected] = useState('');
  const [openVisu, setopenVisu] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [inserteAnexos, setAnexos] = useState();
  const { user } = useAuth();

  function handleVisualizar(item) {
    window.open(`${api.defaults.baseURL}/uploads/${item.urldoc}`);
    setItemSelected(item);
    //setopenVisu(true);
  }

  async function getData() {
    const response = await api.get('/doc/setor', {
      headers: {
        nucleoid: user.nucleoid,
        setor: 0,
      },
    });
    console.log('data como veio', response.data);
    if (response.data) {
      setList(response.data);
    }
  }
  useEffect(() => {
    getData();
  }, []);

  function callback(call) {
    if (call === 'ok') {
      setSeverity('success');
      setMessage('Registro efetuado com sucesso');
      setOpenSnack(true);
      setOpen(false);
      getData();
    }
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
          Documentos Auxiliares
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
            onClick={() => setOpen(true)}
          >
            <Add />
          </Fab>
        </div>
      </div>

      <div id='cardContainer' className={classes.root}>
        {list.length > 0 &&
          list.map((item, index) => (
            <CardItem
              key={index}
              icon={<Description className={classes.iconStyle} />}
              item={item}
              callback={callback}
              handleVisualizar={handleVisualizar}
            />
          ))}
      </div>
      <AddDoc
        callback={callback}
        openModal={open}
        setOpenModal={setOpen}
        closeModal={() => setOpen(false)}
      />

      <Snackbar
        open={openSnack}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={5000}
        onClose={() => setOpenSnack(false)}
        onClick={() => setOpenSnack(false)}
      >
        <Alert onClose={() => setOpen(false)} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
