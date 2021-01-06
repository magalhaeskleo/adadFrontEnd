import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

export default function AlertDialog({ callback, open, setOpen }) {
  const handleClose = () => {
    callback('cancel');
    setOpen(false);
  };
  const handleConfirm = () => {
    callback('ok');
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Deseja excluir esse item ?'}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Não
          </Button>
          <Button onClick={handleConfirm} color='primary' autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
