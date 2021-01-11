import {
  AppBar,
  Button,
  Checkbox,
  Container,
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
import 'date-fns';
import { Form, Formik } from 'formik';
import moment from 'moment';
import 'moment/locale/pt-br';
import React, { useEffect, useState } from 'react';
import { IDENTIFICACAO } from '../../../../components/constants';
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
    backgroundColor: 'whitesmoke',
    flexDirection: 'row',
    borderRadius: 10,
    marginTop: 40,
    padding: 5,
    width: '60%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  divInf: {
    width: '100%',
    display: 'inline-flex',
    [theme.breakpoints.down('md')]: {
      display: 'block',
      width: '100%',
    },
  },

  ladoAeB: {
    width: '50%',
    textAlign: 'start',
    padding: 10,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  divSegunda: {
    flexDirection: 'row',
    marginTop: 10,
    width: '40%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  formControl: {
    width: '46%',
    marginTop: 4,
  },
}));

export default function ExecutePlano({
  openModal,
  onClose,
  callback,
  itemSelecionado,
}) {
  const classes = useStyles();
  const width = { tudo: 'xl', lateral: 'md', pequeno: 'sm' };
  const [erroSalve, setErroSalve] = useState('');
  const [erroConcluir, setErroConcluir] = useState('');
  const [avaliacao, setAvaliacao] = useState('');
  const [concluir, setConcluir] = useState('');

  // const { user } = useAuth();

  const [checked, setChecked] = useState([1]);

  function handleAvaliacao(value) {
    setErroConcluir('');
    setConcluir(false);
    setAvaliacao(value);
  }

  const handleToggle = (value) => () => {
    setErroSalve('');
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const edit = !!itemSelecionado.idTurma;

  useEffect(() => {
    setChecked([]);
    if (itemSelecionado.alunosPresentes) {
      setChecked(itemSelecionado.alunosPresentes.map((item) => item.id));
    }
    if (itemSelecionado.avaliacao) {
      setAvaliacao(itemSelecionado.avaliacao);
    }
  }, [itemSelecionado]);

  async function sendTurma(form) {
    const alunosPresentes = checked;

    if (alunosPresentes.length <= 0) {
      setErroSalve('Ao menos um aluno deve ser selecionado');
      return;
    }

    const alunosFaltantes = [];
    itemSelecionado.adadsSelected.forEach((element) => {
      if (alunosPresentes.indexOf(element.id) === -1)
        alunosFaltantes.push(element.id);
    });

    const newForm = {
      ...form,
      alunosPresentes,
      alunosFaltantes,
      idPlanoAula: itemSelecionado.id,
    };
    let resp = '';
    if (edit) {
      resp = await api.put('/turma', {
        ...newForm,
        idTurma: itemSelecionado.idTurma,
      });
    } else {
      resp = await api.post('/turma', newForm);
    }

    if (resp.data.error) {
      callback('error', resp.data.error);
    } else {
      callback('ok');
    }
    setAvaliacao('');
    setConcluir(false);
  }

  async function handleUpStatus() {
    if (checked.length <= 0) {
      setErroSalve('Ao menos um aluno deve ser selecionado');
      setConcluir(true);
      return;
    }
    if (avaliacao === '') {
      setErroConcluir('Avaliação deve ser preenchida');
      setConcluir(true);
      return;
    }

    const resp = await api.post('/planoAula/upstatus', {
      status: 2,
      id: itemSelecionado.id,
    });

    if (resp.data.error) {
      console.log('deu ruim', resp.data);
    } else {
    }

    callback('ok');
  }

  const handleClose = () => {
    onClose();
    setChecked([]);
    setErroSalve('');
    setConcluir(false);
  };

  function handleNavigateToLink(item) {
    window.open(item.value);
  }

  function handleViewFile(item) {
    if (item.id) {
      return window.open(`${api.defaults.baseURL}/uploads/${item.value}`);
    }
    window.open(item.value);
  }

  const ladoAInfo = (
    <div className={classes.ladoAeB}>
      <div
        style={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Typography variant='subtitle2' style={{ marginRight: 5 }}>
          Divisa:
        </Typography>
        <Typography variant='body1'>{itemSelecionado.divisa}</Typography>
      </div>
      <div>
        <div
          style={{
            alignItems: 'center',
            display: 'inline-flex',
          }}
        >
          <Typography variant='subtitle2' style={{ marginRight: 5 }}>
            Data:
          </Typography>
          <Typography variant='body1'>
            {moment(itemSelecionado.date).format('LL')}
          </Typography>
        </div>
      </div>
      <div>
        <div
          style={{
            alignItems: 'center',
            display: 'inline-flex',
          }}
        >
          <Typography variant='subtitle2' style={{ marginRight: 5 }}>
            Lideres:
          </Typography>
          <div>
            {itemSelecionado.lideresSelected &&
              itemSelecionado.lideresSelected.map((lider) => (
                <div>{lider.fullName}</div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ladoBInfo = (
    <div className={classes.ladoAeB}>
      <div
        style={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Typography variant='subtitle2' style={{ marginRight: 5 }}>
          Objetivo:
        </Typography>
        <Typography variant='body1'>{itemSelecionado.objetivos}</Typography>
      </div>
      <div>
        <div
          style={{
            alignItems: 'center',
            display: 'inline-flex',
          }}
        >
          <Typography variant='subtitle2' style={{ marginRight: 5 }}>
            Recursos:
          </Typography>
          <Typography variant='body1'>{itemSelecionado.recursos}</Typography>
        </div>
      </div>
      <div>
        <div
          style={{
            alignItems: 'center',
            display: 'inline-flex',
          }}
        >
          <Typography variant='subtitle2' style={{ marginRight: 5 }}>
            Desenvolvimento:
          </Typography>
          <Typography variant='body1'>
            {itemSelecionado.desenvolvimento}
          </Typography>
        </div>
      </div>
    </div>
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
        <DialogContent>
          <DialogTitle id='criaradad'>Plano de Aula</DialogTitle>
          <Container
            maxWidth={width.lateral}
            style={{
              minHeight: '80vh',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <DialogContentText id='alert-dialog-description'>
              <Formik
                initialValues={{
                  avaliacao: itemSelecionado.avaliacao
                    ? itemSelecionado.avaliacao
                    : '',
                }}
                onSubmit={sendTurma}
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
                        <div
                          style={{
                            width: '100%',
                            background: IDENTIFICACAO.find(
                              (i) => i.id === itemSelecionado.identificador
                            ).color,
                            color: '#FAFAFA',
                            borderRadius: 10,
                          }}
                        >
                          <Typography variant='h4'>
                            {itemSelecionado.tema}
                          </Typography>
                          <div className={classes.divInf}>
                            {ladoAInfo}
                            {ladoBInfo}
                          </div>
                        </div>
                        <div style={{ width: '100%' }}>
                          <Typography
                            variant='subtitle1'
                            style={{ marginTop: 15 }}
                          >
                            Turma
                          </Typography>
                          <Divider variant='middle' />
                        </div>
                        <div className={classes.divContainer}>
                          <div className={classes.divPrimeira}>
                            {itemSelecionado.adadsSelected.map((adad) => (
                              <div>
                                <div
                                  style={{
                                    width: '100%',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 5,
                                  }}
                                >
                                  <div>{adad.fullName}</div>

                                  <Checkbox
                                    size='small'
                                    color='primary'
                                    onChange={handleToggle(adad.id)}
                                    checked={checked.indexOf(adad.id) !== -1}
                                  />
                                </div>
                                <Divider variant='middle' />
                              </div>
                            ))}
                            {erroSalve !== '' && (
                              <div style={{ color: 'red' }}>{erroSalve}</div>
                            )}
                          </div>

                          <div className={classes.divSegunda}>
                            <div
                              id='div_atachs'
                              style={{
                                marginTop: 10,
                                marginLeft: 8,
                                width: '96%',
                                textAlign: 'start',
                              }}
                            >
                              {itemSelecionado.inserteAnexos.length > 0 &&
                                itemSelecionado.inserteAnexos.map(
                                  (item, index) => (
                                    <List component='nav'>
                                      <ListItem key={index}>
                                        <ListItemIcon>
                                          {item.type === 'file' ? (
                                            <AttachFile
                                              style={{ color: 'red' }}
                                            />
                                          ) : (
                                            <Language
                                              style={{ color: 'blue' }}
                                            />
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
                                        </ListItemSecondaryAction>
                                      </ListItem>
                                      <Divider />
                                    </List>
                                  )
                                )}
                              <TextField
                                style={{ width: '100%', marginTop: 10 }}
                                label='Avaliação'
                                name='avaliacao'
                                size='small'
                                variant='outlined'
                                multiline
                                rows={3}
                                value={values.avaliacao}
                                fullWidth
                                onChange={(e) => (
                                  setFieldValue('avaliacao', e.target.value),
                                  handleAvaliacao(e.target.value)
                                )}
                                onBlur={handleBlur}
                                error={concluir && !!erroConcluir}
                                helperText={concluir && erroConcluir}
                              />
                              <TextField
                                style={{ width: '100%', marginTop: 10 }}
                                label='Feedback'
                                name='feedback'
                                size='small'
                                variant='outlined'
                                multiline
                                rows={3}
                                defaultValue={itemSelecionado.feedback}
                                //  value={itemSelecionado.feedback}
                                fullWidth
                                disabled={true}
                              />
                            </div>

                            <div
                              style={{
                                textAlign: 'end',
                                width: '98%',
                              }}
                            >
                              {edit && itemSelecionado.status < 2 && (
                                <Button
                                  color='primary'
                                  aria-label='add'
                                  variant='outlined'
                                  style={{ marginTop: 15 }}
                                  onClick={handleUpStatus}
                                >
                                  Concluir
                                </Button>
                              )}
                              {itemSelecionado.status < 2 && (
                                <Button
                                  color='primary'
                                  aria-label='add'
                                  variant='outlined'
                                  style={{ marginTop: 15, marginLeft: 10 }}
                                  onClick={handleSubmit}
                                >
                                  Salvar
                                </Button>
                              )}

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
              {itemSelecionado.status >= 2 && (
                <div style={{ color: '#E5CD34' }}>
                  Plano de Aula já foi concluído
                </div>
              )}
            </DialogContentText>
          </Container>
        </DialogContent>
      </Dialog>
    </div>
  );
}
