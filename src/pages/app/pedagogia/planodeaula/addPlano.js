import MomentUtils from '@date-io/moment';
import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { AttachFile, Close, Language, Visibility } from '@material-ui/icons';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import 'date-fns';
import { Form, Formik } from 'formik';
import moment from 'moment';
import 'moment/locale/pt-br';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import AdadsForNucleo from '../../../../components/AdadsForNucleo';
import ButtonAnexo from '../../../../components/ButtonAnexo';
import SelectIdentificador from '../../../../components/IdentificacaoSelect';
import LideresForNucleo from '../../../../components/LideresForNucleo';
import { usePlano } from '../../../../context/app/plano';
import { useAuth } from '../../../../context/auth';
import api from '../../../../service/api';
import '../style.css';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'left',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  fullXS64: {
    width: '64%',
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },

  fullXS47: {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },

  fullXS20: {
    width: '25%',
    marginTop: 11,
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },
  fullXS30: {
    width: '30%',
    marginTop: 10,
    [theme.breakpoints.down('xs')]: {
      width: '92%',
    },
  },
  date: {
    marginTop: 8,
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },
  divContainer: {
    display: 'inline-flex',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      display: 'block',
      width: '100%',
    },
  },
  divPrimeira: {
    flexDirection: 'row',
    marginTop: 40,
    width: '70%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  divSegunda: {
    flexDirection: 'row',
    marginTop: 10,
    width: '30%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  formControl: {
    width: '46%',
    marginTop: 4,
  },
}));

export default function AddPlano({ openModal, onClose, callback }) {
  const classes = useStyles();

  const { user } = useAuth();
  const { itemSelected, edit } = usePlano();
  const [lideresSelected, setLideresSelected] = useState([]);
  const [identificador, setIdentificador] = useState(1);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [adadsSelected, setAdadsSelected] = useState([]);
  const [inserteAnexos, setAnexos] = useState([]);

  const [init, setInit] = useState({
    divisa: '',
    tema: '',
    objetivos: '',
    recursos: '',
    desenvolvimento: '',
    //inserteAnexos: [],
  });
  const [error, setError] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  async function createDoc(file) {
    const fileData = new FormData();
    fileData.append('file', file);

    const { data } = await api.post('/file/add', fileData, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
    return data;
  }

  async function deleteDoc(value) {
    await api.post('/file/delete', { file: value });
  }

  async function sendPlanoDeAula(form) {
    let resp = '';

    if (lideresSelected.length <= 0) {
      setError(true);
      return;
    }

    if (adadsSelected.length <= 0) {
      return;
    }

    let urlAnexo = '';
    let linkAnexo = '';
    const docList = inserteAnexos.find((i) => i.type === 'file');
    const linkList = inserteAnexos.find((i) => i.type === 'link');

    if (docList) {
      if (docList.value !== itemSelected.anexo) {
        await deleteDoc(itemSelected.anexo);
        urlAnexo = await createDoc(docList.file);
      }
    }
    if (itemSelected.anexo !== '' && docList === undefined) {
      await deleteDoc(itemSelected.anexo);
    }

    if (linkList) {
      linkAnexo = linkList.value;
    }

    const newForm = {
      ...form,
      nucleoid: user.nucleoid,
      personalidlist: lideresSelected.map((item) => item.id),
      adadsidlist: adadsSelected.map((item) => item.id),
      identificador: identificador,
      anexo: urlAnexo,
      link: linkAnexo,
      date: moment(selectedDate).format('YYYY-MM-DD'),
    };

    if (edit) {
      resp = await api.put('/planoAula/update', newForm);
    }
    if (!edit) {
      resp = await api.post('/planoAula/add', newForm);
    }

    if (resp.data.error) {
      callback('error', resp.data.error);
    } else {
      callback('ok');
    }
  }
  function handleDeletAnexos(item) {
    setAnexos(inserteAnexos.filter((i) => i.value !== item.value));
  }
  const handleClose = () => {
    // setSelectedDate(moment()._d);
    onClose();
    callback('cancel');
    setAnexos([]);
  };

  function callbackLideres(lideres) {
    setLideresSelected(lideres);
  }

  function callbackAdads(adads) {
    setAdadsSelected(adads);
  }
  function onChangeIdentificador(identify) {
    setIdentificador(identify);
  }

  function handleNavigateToLink(item) {
    window.open(item.value);
  }

  function handleViewFile(item) {
    if (item.id) {
      return window.open(`${api.defaults.baseURL}/uploads/${item.value}`);
    }
    window.open(item.value);
  }

  useEffect(() => {
    if (edit) {
      setInit({ ...itemSelected });
      setIdentificador(itemSelected.identificador);
      setSelectedDate(itemSelected.date);
      setLideresSelected(itemSelected.lideresSelected);
      setAdadsSelected(itemSelected.adadsSelected);
      setAnexos(itemSelected.inserteAnexos);
    } else {
      setInit({
        divisa: '',
        tema: '',
        objetivos: '',
        recursos: '',
        desenvolvimento: '',
        feedback: '',
      });
      setIdentificador(1);
      setSelectedDate(moment());
      setLideresSelected([]);
    }
  }, [edit]);

  const validation = yup.object().shape({
    divisa: yup.string().required('Campo obirgatório'),
    tema: yup.string().required('Campo obirgatório'),
    objetivos: yup.string().required('Campo obirgatório'),
    recursos: yup.string().required('Campo obirgatório'),
    desenvolvimento: yup.string().required('Campo obirgatório'),
  });

  const dateInput = (
    <MuiPickersUtilsProvider
      libInstance={moment}
      utils={MomentUtils}
      locale='pt-br'
    >
      <KeyboardDatePicker
        disableToolbar
        autoOk
        className={classes.date}
        variant='inline'
        format='DD/MM/yyyy'
        id='date-picker-inline'
        label='Data'
        value={selectedDate}
        invalidDateMessage='Data em formato inválido.'
        onChange={handleDateChange}
      />
    </MuiPickersUtilsProvider>
  );

  return (
    <div>
      <Dialog open={openModal} fullScreen>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={handleClose}
              aria-label='close'
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogTitle id='criaradad'>Plano de Aula</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Formik
              initialValues={init}
              onSubmit={sendPlanoDeAula}
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
                        Dados do Plano
                      </Typography>
                      <div className={classes.divContainer}>
                        <div className={classes.divPrimeira}>
                          <TextField
                            style={{ width: '96%', marginTop: 10 }}
                            label='Objetivos'
                            name='objetivos'
                            size='small'
                            value={values.objetivos}
                            fullWidth
                            multiline
                            rows={3}
                            variant='outlined'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!touched.objetivos && !!errors.objetivos}
                            helperText={
                              touched.objetivos &&
                              errors.objetivos &&
                              errors.objetivos
                            }
                          />
                          <TextField
                            style={{ width: '96%', marginTop: 10 }}
                            label='Recursos'
                            name='recursos'
                            size='small'
                            variant='outlined'
                            multiline
                            rows={3}
                            value={values.recursos}
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!touched.recursos && !!errors.recursos}
                            helperText={
                              touched.recursos &&
                              errors.recursos &&
                              errors.recursos
                            }
                          />
                          <TextField
                            style={{ width: '96%', marginTop: 10 }}
                            label='Desenvolvimento'
                            name='desenvolvimento'
                            size='small'
                            variant='outlined'
                            multiline
                            rows={3}
                            value={values.desenvolvimento}
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              !!touched.desenvolvimento &&
                              !!errors.desenvolvimento
                            }
                            helperText={
                              touched.desenvolvimento &&
                              errors.desenvolvimento &&
                              errors.desenvolvimento
                            }
                          />
                          {user.admin && (
                            <TextField
                              style={{ width: '96%', marginTop: 10 }}
                              label='Feddback'
                              name='feedback'
                              size='small'
                              variant='outlined'
                              multiline
                              rows={3}
                              value={values.feedback}
                              fullWidth
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.feedback && !!errors.feedback}
                              helperText={
                                touched.feedback &&
                                errors.feedback &&
                                errors.feedback
                              }
                            />
                          )}

                          <div
                            style={{
                              width: '100%',
                              textAlign: 'start',
                              marginLeft: 20,
                            }}
                          >
                            <ButtonAnexo
                              setAnexos={setAnexos}
                              inserteAnexos={inserteAnexos}
                            />
                          </div>
                          <div
                            id='div_atachs'
                            style={{
                              marginTop: 10,
                              marginLeft: 20,
                              width: '96%',
                              textAlign: 'start',
                            }}
                          >
                            {inserteAnexos &&
                              inserteAnexos.map((item, index) => (
                                <List component='nav' aria-label='main mailbox'>
                                  <ListItem key={index}>
                                    <ListItemIcon>
                                      {item.type === 'file' ? (
                                        <AttachFile style={{ color: 'red' }} />
                                      ) : (
                                        <Language style={{ color: 'blue' }} />
                                      )}
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={
                                        <Typography variant='body2'>
                                          {item.name.slice(0, 20)}...
                                        </Typography>
                                      }
                                    />
                                    <ListItemSecondaryAction>
                                      <IconButton
                                        onClick={() =>
                                          item.type === 'file'
                                            ? handleViewFile(item)
                                            : handleNavigateToLink(item)
                                        }
                                      >
                                        <Visibility />
                                      </IconButton>

                                      <IconButton
                                        onClick={() => handleDeletAnexos(item)}
                                      >
                                        <Close />
                                      </IconButton>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                  <Divider />
                                </List>
                              ))}
                          </div>
                        </div>

                        <div className={classes.divSegunda}>
                          <TextField
                            style={{ width: '96%', marginTop: 10 }}
                            label='Divisa'
                            name='divisa'
                            size='small'
                            value={values.divisa}
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!touched.divisa && !!errors.divisa}
                            helperText={
                              touched.divisa && errors.divisa && errors.divisa
                            }
                          />
                          <TextField
                            style={{ width: '96%', marginTop: 10 }}
                            label='Tema'
                            name='tema'
                            size='small'
                            value={values.tema}
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!touched.tema && !!errors.tema}
                            helperText={
                              touched.tema && errors.tema && errors.tema
                            }
                          />

                          <SelectIdentificador
                            infantil={null}
                            onChange={onChangeIdentificador}
                          />
                          {dateInput}

                          <LideresForNucleo
                            callbackLideres={callbackLideres}
                            error={error}
                            setError={setError}
                          />
                          <AdadsForNucleo
                            callbackAdads={callbackAdads}
                            error={error}
                            setError={setError}
                          />
                          <div
                            style={{
                              justifyContent: 'flex-end',
                              display: 'inline-flex',
                              width: '100%',
                            }}
                          >
                            <Button
                              color='primary'
                              aria-label='add'
                              variant='outlined'
                              style={{ marginTop: 15, marginLeft: 10 }}
                              onClick={handleSubmit}
                            >
                              Confirmar
                            </Button>

                            <Button
                              color='primary'
                              aria-label='add'
                              variant='outlined'
                              style={{ marginTop: 15, marginLeft: 10 }}
                              onClick={handleClose}
                            >
                              Retornar
                            </Button>
                          </div>
                        </div>
                      </div>
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
/*
<ModalVS
  openModal={openVisu}
  closeModal={() => setopenVisu(false)}
  url={`${api.defaults.baseURL}/uploads/${itemSelected.urldoc}`}
/>
*/
