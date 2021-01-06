import { DialogContent, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';

export default function DialogInsertLink({
  setAnexos,
  inserteAnexos,
  open,
  setOpen,
}) {
  const [link, setLink] = useState('');
  const [error, setError] = useState(false);

  const handleClose = () => {
    setLink('');
    setError('');
    setOpen(false);
  };

  const handleConfirm = () => {
    if (link === '') {
      setError(true);
    }
    const listForm = inserteAnexos.filter((item) => item.type !== 'link');

    setAnexos([...listForm, { type: 'link', value: link, name: link }]);
    handleClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id='link-acesso'> Link de Acesso </DialogTitle>
        <DialogContent>
          <TextField
            style={{ width: '96%', marginTop: 10 }}
            label='Link'
            name='Digite o link'
            size='small'
            value={link}
            fullWidth
            onChange={(e) => setLink(e.target.value)}
            error={error}
            helperText={error && 'Campo Obrigatório'}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} color='primary' autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
