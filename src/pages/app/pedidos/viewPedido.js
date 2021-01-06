import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
  COLOR_STATUS_PEDIDO,
  COLOR_STATUS_PEDIDO_HOVER,
} from '../../../components/constants';
import TimelineComp from '../../../components/TimelineComp';
import { useAuth } from '../../../context/auth';
import TableItensPedidosStatico from './tableItensPedidosStatico';

const now = new Date();
const formatDate = `${now.getDate()}/${
  now.getMonth() + 1
}/${now.getFullYear()}`;

export default function Addpage({ openView, close, initValue, timeLine }) {
  const [statusPedido, setStatusPedido] = useState([
    formatDate,
    '0',
    '0',
    '0',
    '0',
  ]);
  console.log('valores iniciais', initValue);

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
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
      backgroundColor: COLOR_STATUS_PEDIDO[statusPedido + 1],
      color: 'white',
      '&:hover': {
        backgroundColor: COLOR_STATUS_PEDIDO_HOVER[statusPedido],
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

  useEffect(() => {
    getValorTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listItens]);

  useEffect(() => {
    const newList = initValue.list.map((i, index) => ({ ...i, index }));
    setListItens(newList);
    setNumberItem(initValue.list.length);
    setDescription(initValue.pedido.description);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initValue]);

  const handleClose = () => {
    setListItens([]);
    setItem('');
    setNumberItem(1);
    setError(false);
    setDescription('');
    setTextErro('');
    setCount(1);
    // callback('cancel');
    close();
    // setStatusPedido(statusPedido);
  };

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

  return (
    <div
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      id='divDialogItens'
    >
      <Dialog open={openView} fullWidth maxWidth={'md'} onClose={close}>
        <DialogTitle id='criaradad'>
          Descrição : {initValue.pedido.description}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <TableItensPedidosStatico listItens={listItens} />

            <Typography variant='h6' style={{ marginTop: 10, color: 'green' }}>
              Valor Total : R${valorTotal}
            </Typography>

            <TimelineComp statusPedido={initValue.statusPedido} />
          </DialogContentText>
          <DialogActions>
            <Button
              color='primary'
              aria-label='add'
              variant='outlined'
              size='small'
              style={{ marginTop: 15 }}
              onClick={handleClose}
            >
              Rertornar
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
