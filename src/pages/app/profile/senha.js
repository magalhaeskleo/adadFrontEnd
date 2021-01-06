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

  async function sendSenha(form) {
    const newForm = { ...form, idPersonal: profile.id };
    const resp = await api.post('/changeSenha', newForm);
    console.log('passou', resp.data);

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
    newPassword: yup
      .string()
      .min(4, 'Minimo quatro caracteres')
      .required('Campo obirgatório'),
    password: yup
      .string()
      .min(4, 'Minimo quatro caracteres')
      .required('Campo obirgatório'),
  });

  return (
    <div>
      <Dialog open={open} fullWidth maxWidth={'xs'}>
        <DialogTitle id='criaradad'>Alterar Senha</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Formik
              initialValues={{
                password: '',
                newPassword: '',
              }}
              onSubmit={sendSenha}
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
                        Dados da Senha
                      </Typography>
                      <TextField
                        label='Senha Atual'
                        name='password'
                        size='small'
                        value={values && values.password}
                        fullWidth
                        type='password'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.password && !!errors.password}
                        helperText={
                          touched.password && errors.password && errors.password
                        }
                      />
                      <TextField
                        label='Nova Senha'
                        name='newPassword'
                        size='small'
                        type='password'
                        value={values && values.newPassword}
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.newPassword && !!errors.newPassword}
                        helperText={
                          touched.newPassword &&
                          errors.newPassword &&
                          errors.newPassword
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
