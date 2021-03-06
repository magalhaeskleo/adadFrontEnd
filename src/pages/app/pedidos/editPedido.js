import {
  Badge,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { Add, Remove } from '@material-ui/icons';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  COLOR_STATUS_PEDIDO,
  COLOR_STATUS_PEDIDO_HOVER,
  STATUS_PEDIDO,
} from '../../../components/constants';
import SelectIdentificador from '../../../components/IdentificacaoSelect';
import ItemSelect from '../../../components/ItemSelect';
import SelectNumeracao from '../../../components/SelectNumeracao';
import TimelineComp from '../../../components/TimelineComp';
import { usePedido } from '../../../context/app/pedido';
import { useAuth } from '../../../context/auth';
import api from '../../../service/api';
import TableItensPedidos from './tableItensPedidos';

export default function Editpage({ openModal, callback, initValue }) {
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    dialogAction: {
      width: '100%',
      display: 'inline-flex',
      justifyContent: 'flex-end',
      [theme.breakpoints.down('xs')]: {
        display: 'grid',
        justifyContent: 'normal',
      },
    },
    dialogActionUm: {
      [theme.breakpoints.down('xs')]: {
        display: 'grid',
        width: '100%',
      },
    },
    fabCancel: {
      backgroundColor: COLOR_STATUS_PEDIDO[4],
      '&:hover': {
        backgroundColor: COLOR_STATUS_PEDIDO_HOVER[3],
      },
      color: 'white',
    },
    fabNext: {
      backgroundColor: COLOR_STATUS_PEDIDO[initValue.pedido.status + 1],
      color: 'white',
      '&:hover': {
        backgroundColor: COLOR_STATUS_PEDIDO_HOVER[initValue.pedido.status],
      },
    },
    fullSm37: {
      width: 90,
    },
  }));

  const classes = useStyles();

  const [listItens, setListItens] = useState([]);
  const [numberItem, setNumberItem] = useState(1);
  const [item, setItem] = useState('');
  const [valorTotal, setValorTotal] = useState(0);
  const [quantidadeTotal, setQuantidadeTotal] = useState(0);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(false);
  const [textError, setTextErro] = useState('');
  const [count, setCount] = useState(1);
  const { user } = useAuth();
  const { setLoading } = usePedido();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const newList = initValue.list.map((i, index) => ({ ...i, index }));
    setListItens(newList);
    setNumberItem(initValue.list.length);
    setDescription(initValue.pedido.description);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initValue]);

  useEffect(() => {
    getValorTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listItens]);

  const handleClose = () => {
    setListItens([]);
    setItem('');
    setNumberItem(1);
    setError(false);
    setDescription('');
    setTextErro('');
    setCount(1);
    callback('cancel');
    // setStatusPedido(statusPedido);
  };

  function handleDescription(text) {
    setError(false);
    setTextErro('');
    setDescription(text);
  }
  async function sendPedido() {
    if (description === '') {
      setError(true);
      setTextErro('Campo Obrigatório');
      return;
    }
    if (listItens.length <= 0) {
      setError(true);
      setTextErro('Precisa inserir ao menos um item');
      return;
    }

    const form = {
      id: initValue ? initValue.pedido.id : '',
      description,
      personalid: user.id,
      listItens,
      valorTotal,
      quantidadeTotal,
    };

    const response = await api.put('/pedido/update', form);

    if (response.data.error) {
      callback('Error', response.data.error);
    }
    if (response.data.ok) {
      setLoading(true);
      setListItens([]);
      setItem('');
      setNumberItem(1);
      setError(false);
      setDescription('');
      setTextErro('');
      callback('ok');
    }
  }

  function getValorTotal() {
    let total = 0;
    let qtTotal = 0;
    listItens.forEach((element) => {
      total += element.valor * element.quantidade;
      qtTotal += element.quantidade;
    });
    setValorTotal(total);
    setQuantidadeTotal(qtTotal);
  }

  function handleConfirmCancel() {
    setOpen(true);
  }

  async function handleCancelar() {
    const resp = await api.put('/pedido/update/status', {
      status: STATUS_PEDIDO.CANCELADO,
      pedidoid: initValue.pedido.id,
    });
    setOpen(false);
    if (resp.data.error) {
      callback('Error', resp.data.error);
    } else {
      callback('ok');
    }
  }

  async function handleNextStatus() {
    const resp = await api.put('/pedido/update/status', {
      status: initValue.pedido.status + 1,
      pedidoid: initValue.pedido.id,
    });
    if (resp.data.error) {
      callback('Error', resp.data.error);
    } else {
      callback('ok');
    }
  }

  function addItemList(itemPedido) {
    const itemAlter = { ...item, quantidade: count };
    const newItem = { ...itemPedido, ...itemAlter, index: numberItem };

    setListItens([...listItens, { ...newItem }]);
    setNumberItem(numberItem + 1);
    setError(false);
    setTextErro('');
  }

  function deleteItemList(index) {
    setListItens(listItens.filter((i) => i.index !== index));
  }

  const validation = yup.object().shape({
    numeracao: yup.string().required('Campo obirgatório'),
  });

  const init = {
    tamanho: 'infantil',
    numeracao: '',
    identification: '',
  };

  const formik = (
    <Formik
      initialValues={init}
      onSubmit={addItemList}
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
            <div
              style={{
                marginTop: 20,
                borderRadius: 20,
                backgroundColor: 'whitesmoke',
              }}
            >
              <Typography variant='subtitle1'>Dados do Item</Typography>

              <div
                className={classes.root}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                <ItemSelect
                  onChange={({ name, uniformeid, valor }) =>
                    setItem({ name, uniformeid, valor })
                  }
                />

                <FormControl className={classes.fullSm37} component='fieldset'>
                  <RadioGroup
                    name='tamanho'
                    row
                    value={values.tamanho}
                    onChange={(event) => {
                      setFieldValue('tamanho', event.target.value);
                    }}
                  >
                    <FormControlLabel
                      value='infantil'
                      control={<Radio />}
                      label='Infantil'
                    />
                    <FormControlLabel
                      value='adulto'
                      control={<Radio />}
                      label='Adulto'
                    />
                  </RadioGroup>
                </FormControl>
                <SelectNumeracao
                  onChange={(e) => setFieldValue('numeracao', e)}
                  infantil={values.tamanho === 'infantil'}
                />

                <Badge
                  color='secondary'
                  placeholder='Quantidade'
                  badgeContent={count}
                  style={{ marginTop: 25, marginRight: 10, marginLeft: 10 }}
                >
                  <ButtonGroup>
                    <Button
                      aria-label='reduce'
                      onClick={() => {
                        setCount(Math.max(count - 1, 1));
                      }}
                    >
                      <Remove fontSize='small' />
                    </Button>
                    <Button
                      aria-label='increase'
                      onClick={() => {
                        setCount(count + 1);
                      }}
                    >
                      <Add fontSize='small' />
                    </Button>
                  </ButtonGroup>
                </Badge>

                <SelectIdentificador
                  infantil={values.tamanho === 'infantil'}
                  onChange={(e) => setFieldValue('identification', e)}
                />
                <Fab
                  color='primary'
                  aria-label='add'
                  size='small'
                  style={{ marginTop: 15 }}
                  onClick={handleSubmit}
                >
                  <Add />
                </Fab>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
  return (
    <div
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      id='divDialogItens'
    >
      <Dialog open={openModal} fullWidth maxWidth={'md'}>
        <DialogTitle id='criaradad'>Pedido</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <TextField
              style={{ maxWidth: 300 }}
              label='Descrição'
              name='description'
              size='small'
              value={description}
              fullWidth
              onChange={(e) => handleDescription(e.target.value)}
              error={!!error}
              helperText={!!error && textError}
            />
            {formik}
            <Typography
              variant='subtitle1'
              style={{ marginTop: 20, marginBottom: 20 }}
            >
              Dados do Pedido
            </Typography>
            <TableItensPedidos
              listItens={listItens}
              deleteItemList={deleteItemList}
            />

            <Typography variant='h6' style={{ marginTop: 10, color: 'green' }}>
              Valor Total : R${valorTotal}
            </Typography>

            <TimelineComp statusPedido={initValue.statusPedido} />
          </DialogContentText>

          <div className={classes.dialogAction}>
            {initValue.pedido.status < 3 && (
              <div className={classes.dialogActionUm}>
                <Button
                  className={classes.fabCancel}
                  size='small'
                  variant='outlined'
                  style={{ marginTop: 15, marginLeft: 5 }}
                  onClick={handleConfirmCancel}
                >
                  Cancelar
                </Button>

                <Button
                  className={classes.fabNext}
                  size='small'
                  variant='outlined'
                  style={{ marginTop: 15, marginLeft: 5 }}
                  onClick={handleNextStatus}
                >
                  Proximo
                </Button>
              </div>
            )}

            {initValue.pedido.status < 3 && (
              <Button
                color='primary'
                aria-label='add'
                size='small'
                variant='outlined'
                style={{ marginTop: 15, marginLeft: 5 }}
                onClick={sendPedido}
              >
                Confirmar
              </Button>
            )}
            <Button
              color='primary'
              aria-label='add'
              size='small'
              variant='outlined'
              style={{ marginTop: 15, marginLeft: 5 }}
              onClick={handleClose}
            >
              Retornar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Deseja excluir esse item ?'}
        </DialogTitle>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            Não
          </Button>
          <Button onClick={handleCancelar} color='primary' autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
