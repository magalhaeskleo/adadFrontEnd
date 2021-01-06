import { Container, makeStyles, Snackbar, Typography } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { ArrowForward } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import '../style.css';
import TablePlanos from './table';

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

export default function Turma({ setPageReturn }) {
  const width = { tudo: 'xl', lateral: 'md', pequeno: 'sm' };
  const vertical = 'bottom';
  const horizontal = 'left';
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [carregar, setCarregar] = useState(false);
  const [open, setOpen] = useState(false);

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
          Turmas
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
            onClick={setPageReturn}
          >
            <ArrowForward />
          </Fab>
        </div>
      </div>
      <TablePlanos carregar={carregar} setCarregar={setCarregar} />

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
