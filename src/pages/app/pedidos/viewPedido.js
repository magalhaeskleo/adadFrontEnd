import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import TimelineComp from '../../../components/TimelineComp';
import TableItensPedidosStatico from './tableItensPedidosStatico';

export default function Addpage({ openView, close, initValue }) {
  const [listItens, setListItens] = useState([]);
  const [numberItem, setNumberItem] = useState(1);

  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    getValorTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listItens]);

  useEffect(() => {
    const newList = initValue.list.map((i, index) => ({ ...i, index }));
    setListItens(newList);
    setNumberItem(initValue.list.length);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initValue]);

  const handleClose = () => {
    setListItens([]);

    close();
  };

  function getValorTotal() {
    let total = 0;
    listItens.forEach((element) => {
      total += element.valor * element.quantidade;
    });
    setValorTotal(total);
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
