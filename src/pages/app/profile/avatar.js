import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Snackbar,
} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { CameraAlt, Computer } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import Webcam from '../../../components/Webcam';
import { useAuth } from '../../../context/auth';
import api from '../../../service/api';
import './style.css';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'end',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  formControl: {
    width: '46%',
    marginTop: 4,
  },
}));

export default function Addpage({ open, close, callback }) {
  const classes = useStyles();
  const { profile, alterStorageAndUser } = useAuth();
  const [openaAlert, setOpenAlert] = useState(false);
  const [fileSelect, setFileSelect] = useState('');
  const [errorFile, setErrorFile] = useState('');
  const [openWeb, setOpenWeb] = useState(false);
  const [urlPhoto, setUrlPhoto] = useState('');

  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const vertical = 'bottom';
  const horizontal = 'center';

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  function handleClose() {
    setUrlPhoto('');
    setFileSelect('');
    setErrorFile('');
    close();
  }

  function callbackWeb(file) {
    const url = URL.createObjectURL(file);
    setUrlPhoto(url);
    setFileSelect(file);
    setErrorFile('');
  }

  const handleUploadFile = (e) => {
    if (e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFileSelect(e.target.files[0]);
      setUrlPhoto(url);
    }

    setErrorFile('');
  };

  async function createAvatar() {
    const fileData = new FormData();
    fileData.append('file', fileSelect);

    const { data } = await api.post('/file/add', fileData, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
    return data;
  }

  async function sendAvatar() {
    if (!fileSelect) {
      setErrorFile('Escolha uma nova foto');
      return;
    }

    await api.post('/file/delete', { file: profile.avatar });
    const newAvatar = await createAvatar();

    const newForm = { newAvatar, idPersonal: profile.id };

    const resp = await api.post('/changeAvatar', newForm);

    if (resp.data.error) {
      setMessage(resp.data.error);
      setSeverity('warning');
      setOpenAlert(true);
    } else {
      setMessage(resp.data.ok);
      setSeverity('success');
      setOpenAlert(true);
    }
    await alterStorageAndUser(profile.id);
  }

  return (
    <div>
      <Dialog open={open} fullWidth maxWidth={'xs'}>
        <DialogTitle id='criaradad'>Alterar Avatar</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div
              style={{
                flexDirection: 'row',
                textAlign: '-webkit-center',
              }}
            >
              <Avatar
                src={urlPhoto}
                alt='request'
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <label htmlFor='upload-photo'>
                <input
                  style={{ display: 'none' }}
                  id='upload-photo'
                  name='upload-photo'
                  type='file'
                  onChange={(e) => handleUploadFile(e)}
                />
                {errorFile && (
                  <div style={{ color: 'red', marginTop: 10 }}>{errorFile}</div>
                )}
                <Fab component='span' size='small'>
                  <Computer />
                </Fab>
              </label>
              <Fab
                component='span'
                size='small'
                onClick={() => setOpenWeb(true)}
              >
                <CameraAlt />
              </Fab>
            </div>

            <Webcam
              open={openWeb}
              setOpen={setOpenWeb}
              callbackWeb={callbackWeb}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            color='primary'
            size='small'
            onClick={sendAvatar}
          >
            Confirmar
          </Button>
          <Button
            variant='outlined'
            color='primary'
            size='small'
            onClick={handleClose}
          >
            Retornar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openaAlert}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={5000}
        onClose={() => setOpenAlert(false)}
      >
        <Alert onClose={() => setOpenAlert(false)} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
