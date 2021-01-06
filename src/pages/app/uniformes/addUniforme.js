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
  async function sendUniforme(form) {
    let response = '';

    if (edition) {
      response = await api.put('/uniforme/update', {
        ...form,
        id: initialValues.id,
      });
    } else {
      response = await api.post('/uniforme/add', form);
    }

    if (response.error) {
      callback('error', response.error);
    } else {
      setLoadingNucleos(true);
      callback('ok');
    }
    handleClose();
  }

  const init = edition ? { ...initialValues } : { name: '', valor: '' };

  const validation = yup.object().shape({
    name: yup.string().required('Campo obirgatório'),
    valor: yup.string().required('Campo obirgatório'),
  });

  return (
    <div>
      <Dialog open={openModal} fullWidth maxWidth='xs'>
        <DialogTitle id='criaradad'>Item</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Formik
              initialValues={init}
              onSubmit={sendUniforme}
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
                      <Typography variant='subtitle1'>Dados do Item</Typography>
                      <TextField
                        label='Nome'
                        name='name'
                        size='small'
                        value={values.name}
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && errors.name}
                        helperText={touched.name && errors.name && errors.name}
                      />
                      <TextField
                        label='Valor'
                        name='valor'
                        size='small'
                        value={values && values.valor}
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.valor && errors.valor}
                        helperText={
                          touched.valor && errors.valor && errors.valor
                        }
                      />
                    </div>

                    <div className={classes.root}>
                      <Button
                        variant='outlined'
                        color='primary'
                        size='small'
                        onClick={handleSubmit}
                        style={{ minWidth: 100 }}
                      >
                        Confirmar
                      </Button>
                      <Button
                        variant='outlined'
                        color='primary'
                        size='small'
                        onClick={handleClose}
                        style={{ minWidth: 100 }}
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
