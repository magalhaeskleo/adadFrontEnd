import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
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

export default function Addpage({
  openModal,
  setOpenModal,
  callback,
  initialValues,
}) {
  const classes = useStyles();
  const { user } = useAuth();

  const handleClose = () => {
    setOpenModal(false);
  };
  const edition = !!initialValues;

  async function sendFinanceiro(form) {
    const newForm = { ...form, nucleoid: user.nucleoid };
    let resp = '';

    if (edition) {
      resp = await api.put('/financeiro', newForm);
    } else {
      resp = await api.post('/financeiro/add', newForm);
    }

    if (resp.data.error) {
      callback('error', resp.error);
    } else {
      callback('ok');
    }
    handleClose();
  }

  const init = edition
    ? { ...initialValues }
    : { descricao: '', valor: '', type: 'entrada' };

  const validation = yup.object().shape({
    descricao: yup.string().required('Campo obirgatório'),
    valor: yup.string().required('Campo obirgatório'),
  });

  return (
    <div>
      <Dialog open={openModal} fullWidth maxWidth='sm'>
        <DialogTitle id='criaradad'>{'Financeiro'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Formik
              initialValues={init}
              onSubmit={sendFinanceiro}
              validationSchema={validation}
            >
              {({
                errors,
                touched,
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
              }) => {
                return (
                  <Form>
                    <div className='login-form'>
                      <TextField
                        label='Descrição'
                        name='descricao'
                        size='small'
                        value={values.descricao}
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.descricao && !!errors.descricao}
                        helperText={
                          touched.descricao &&
                          errors.descricao &&
                          errors.descricao
                        }
                      />
                      <div
                        style={{
                          display: 'inline-flex',
                          marginTop: 10,
                          width: '100%',
                        }}
                      >
                        <FormControl className={classes.formControl}>
                          <FormLabel component='legend'>
                            Tipo de Transação
                          </FormLabel>
                          <RadioGroup
                            row
                            value={values.type}
                            onChange={(e) => {
                              setFieldValue('type', e.target.value);
                            }}
                            onBlur={handleBlur}
                          >
                            <FormControlLabel
                              value='entrada'
                              control={<Radio />}
                              label='Entrada'
                            />
                            <FormControlLabel
                              value='saida'
                              control={<Radio />}
                              label='Saída'
                            />
                          </RadioGroup>
                        </FormControl>

                        <TextField
                          label='Valor'
                          style={{ width: '50%' }}
                          name='valor'
                          size='small'
                          type='number'
                          value={values && values.valor}
                          fullWidth
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.valor && !!errors.valor}
                          helperText={
                            touched.valor && errors.valor && errors.valor
                          }
                        />
                      </div>
                    </div>

                    <div className={classes.root}>
                      <Button
                        color='primary'
                        aria-label='add'
                        variant='outlined'
                        size='small'
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
