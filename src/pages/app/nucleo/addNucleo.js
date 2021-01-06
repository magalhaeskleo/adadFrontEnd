import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { useNucleo } from '../../../context/app/nucleo';
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

export default function Addpage({
  openModal,
  setOpenModal,
  callback,
  initialValues,
}) {
  const classes = useStyles();
  const { setLoadingNucleos } = useNucleo();
  const handleClose = () => {
    callback('cancel');
    setOpenModal(false);
  };
  const edition = !!initialValues;
  async function sendNucleo(form) {
    let response = '';

    if (edition) {
      response = await api.put('/nucleo/update', {
        ...form,
        id: initialValues.id,
      });
    } else {
      response = await api.post('/nucleo/add', form);
    }

    if (response.error) {
      callback('error', response.error);
    } else {
      setLoadingNucleos(true);
      callback('ok');
    }
    handleClose();
  }

  const init = edition
    ? { ...initialValues }
    : { name: '', city: '', neighborhood: '', email: '' };

  const validation = yup.object().shape({
    name: yup.string().required('Campo obirgatório'),
    city: yup.string().required('Campo obirgatório'),
    neighborhood: yup.string().required('Campo obirgatório'),
    email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
  });

  return (
    <div>
      <Dialog open={openModal} fullWidth maxWidth='xs'>
        <DialogTitle id='criaradad'>{'Núcleo'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Formik
              initialValues={init}
              onSubmit={sendNucleo}
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
                        Dados do Núcleo
                      </Typography>
                      <TextField
                        label='Nome'
                        name='name'
                        size='small'
                        value={values.name}
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.name && !!errors.name}
                        helperText={touched.name && errors.name && errors.name}
                      />
                      <TextField
                        label='Cidade'
                        name='city'
                        size='small'
                        value={values && values.city}
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.city && !!errors.city}
                        helperText={touched.city && errors.city && errors.city}
                      />

                      <TextField
                        label='Bairro'
                        name='neighborhood'
                        size='small'
                        value={values && values.neighborhood}
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.neighborhood && !!errors.neighborhood}
                        helperText={
                          touched.neighborhood &&
                          errors.neighborhood &&
                          errors.neighborhood
                        }
                      />
                      <TextField
                        label='E-mail'
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
                        size='small'
                        variant='outlined'
                        style={{ marginTop: 15 }}
                        onClick={handleClose}
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
    </div>
  );
}
