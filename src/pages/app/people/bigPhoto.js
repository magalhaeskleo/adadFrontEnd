import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

export default function BigPhoto({ url, setOpen, open }) {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id='criaradad'>Perfil</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-perfil'>
            <div>
              <img
                src={url}
                style={{ maxWidth: 500, maxHeight: 500 }}
                alt='big'
              />
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
