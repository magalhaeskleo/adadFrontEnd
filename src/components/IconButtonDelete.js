import { MenuItem } from '@material-ui/core/';
import { DeleteOutlined } from '@material-ui/icons';
import React, { useState } from 'react';
import api from '../service/api';
import DailogConfirmation from './DailogConfirmation';
export default function IconButtonDelete({
  url,
  id,
  handleDelete,
  handleClose,
}) {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  function handle() {
    setOpenConfirmation(true);
  }

  async function callbackConfirm(status) {
    if (status === 'ok') {
      const del = await api.delete(`${url}/${id}`);

      if (del.data.error) {
        handleDelete('error', del.data.error);
      } else {
        handleDelete('ok');
      }
    }
    if (status === 'cancel') {
      handleClose();
    }
  }

  return (
    <div>
      <MenuItem onClick={() => handle()}>
        <DeleteOutlined style={{ marginRight: 10 }} />
        Excluir
      </MenuItem>
      <DailogConfirmation
        callback={callbackConfirm}
        open={openConfirmation}
        setOpen={setOpenConfirmation}
      />
    </div>
  );
}
