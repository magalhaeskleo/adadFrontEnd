import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as yup from 'yup';
import { useAuth } from '../../../context/auth';
import api from '../../../service/api';
import './style.css';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'end',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  formControl: {
    width: '46%',
    marginTop: 4,
  },
}));

export default function Addpage({ open, close, callback }) {
  const classes = useStyles();
  const { profile, alterStorageAndUser } = useAuth();
  const [openaAlert, setOpenAlert] = useState(false);

  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const vertical = 'bottom';
  const horizontal = 'center';

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  async function sendEmail(form) {
    const newForm = { ...form, idPersonal: profile.id };
    const resp = await api.post('/changeEmail', newForm);

    if (resp.data.error) {
      setMessage(resp.data.error);
      setSeverity('warning');
      setOpenAlert(true);
    } else {
      setMessage(resp.data.ok);
      setSeverity('success');
      setOpenAlert(true);
    }
    await alterStorageAndUser(profile.id);
  }

  const validation = yup.object().shape({
    email: yup.string().email('E-mail inválido').required('Campo obirgatório'),
    password: yup
      .string()
      .min(4, 'Minimo quatro caracteres')
      .required('Campo obirgatório'),
  });

  return (
    <div>
      <Dialog open={open} fullWidth maxWidth={'xs'}>
        <DialogTitle id='criaradad'>Alterar E-mail</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Formik
              initialValues={{
                emailAtual: profile.email,
                email: '',
                password: '',
              }}
              onSubmit={sendEmail}
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
                      <Typography variant='subtitle1'>
                        Dados do E-mail
                      </Typography>
                      <TextField
                        label='Email atual'
                        name='emailAtual'
                        size='small'
                        disabled={true}
                        value={values.emailAtual}
                        fullWidth
                      />
                      <TextField
                        label='Novo e-mail'
                        name='email'
                        size='small'
                        value={values && values.email}
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.email && !!errors.email}
                        helperText={
                          touched.email && errors.email && errors.email
                        }
                      />
                      <TextField
                        label='Senha'
                        name='password'
                        size='small'
                        value={values && values.password}
                        type='password'
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.password && !!errors.password}
                        helperText={
                          touched.password && errors.password && errors.password
                        }
                      />
                    </div>

                    <div className={classes.root}>
                      <Button
                        color='primary'
                        aria-label='add'
                        size='small'
                        variant='outlined'
                        style={{ marginTop: 15 }}
                        onClick={handleSubmit}
                      >
                        Confirmar
                      </Button>

                      <Button
                        color='primary'
                        aria-label='add'
                        variant='outlined'
                        size='small'
                        style={{ marginTop: 15 }}
                        onClick={close}
                      >
                        Retornar
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={openaAlert}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={5000}
        onClose={() => setOpenAlert(false)}
      >
        <Alert onClose={() => setOpenAlert(false)} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
