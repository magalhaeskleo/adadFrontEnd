import {
  AppBar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  makeStyles,
  Toolbar,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';
import './style.css';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

export default function Addpage({ openModal, closeModal, url }) {
  const classes = useStyles();
  return (
    <Dialog open={openModal} fullScreen>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            onClick={closeModal}
            aria-label='close'
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogTitle id='criaradad'>Documento</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          <iframe
            title='iFrame_pdf'
            src={url}
            width='20%'
            height='780'
            style={{ width: '90%', maxWidth: '90%' }}
          />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
