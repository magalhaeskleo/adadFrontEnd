import {
  Button,
  Dialog,
  DialogActions,
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
  Typography,
} from '@material-ui/core';
import { AttachFile, Close, Language, Visibility } from '@material-ui/icons';
import React, { useState } from 'react';
import ButtonAnexo from '../../../../components/ButtonAnexo';
import { useAuth } from '../../../../context/auth';
import api from '../../../../service/api';
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

export default function Addpage({
  openModal,
  closeModal,
  callback,
  initialValues,
}) {
  const classes = useStyles();
  const [errorFile, setErrorFile] = useState('');
  const [fileSelect, setFileSelect] = useState('');
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [inserteAnexos, setAnexos] = useState([]);
  const { user } = useAuth();

  function clean() {
    setErrorFile('');
    setFileSelect();
    setUrl();
    setName();
  }
  const handleClose = () => {
    clean();
    closeModal();
    setAnexos([]);
  };

  async function sendDoc() {
    const link = inserteAnexos.find((item) => item.type === 'link');
    const form = {
      name,
      urldoc: await createDoc(),
      link: link ? link.value : '',
      nucleoid: user.nucleoid,
      setor: 1,
    };

    console.log(form);
    const { data } = await api.post('/doc/add', form);

    clean();
    callback('ok');
  }

  async function createDoc() {
    const doc = inserteAnexos.find((item) => item.type === 'file');
    console.log('file', doc);
    if (doc) {
      const fileData = new FormData();
      fileData.append('file', doc.file);
      const { data } = await api.post('/file/add', fileData, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      });
      return data;
    }
    return '';
  }

  function handleViewFile(item) {
    if (item.id) {
      return window.open(`${api.defaults.baseURL}/uploads/${item.value}`);
    }
    window.open(item.value);
  }

  function handleNavigateToLink(item) {
    window.open(item.value);
  }

  function handleDeletAnexos(item) {
    setAnexos(inserteAnexos.filter((i) => i.value !== item.value));
  }

  return (
    <div>
      <Dialog open={openModal} fullWidth maxWidth='xs'>
        <DialogTitle id='criaradad'>Documento</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div className='login-form'>
              <div
                style={{
                  width: '50%',
                  marginRight: 10,
                }}
              >
                <TextField
                  label='Nome'
                  name='name'
                  size='small'
                  value={name}
                  fullWidth
                  onChange={(e) => setName(e.target.value)}

                  //error={!!touched.name && !!errors.name}
                  //helperText={touched.name && errors.name && errors.name}
                />
                <ButtonAnexo
                  setAnexos={setAnexos}
                  inserteAnexos={inserteAnexos}
                />
              </div>
              <div
                id='div_atachs'
                style={{
                  marginTop: 10,
                  marginLeft: 20,
                  width: '100%',
                  textAlign: 'start',
                }}
              >
                {inserteAnexos &&
                  inserteAnexos.map((item, index) => (
                    <List component='nav' aria-label='main mailbox folders'>
                      <ListItem key={index}>
                        <ListItemIcon>
                          {item.type === 'file' ? (
                            <AttachFile style={{ color: 'red' }} />
                          ) : (
                            <Language style={{ color: 'blue' }} />
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

                          <IconButton onClick={() => handleDeletAnexos(item)}>
                            <Close />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </List>
                  ))}
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            aria-label='add'
            variant='outlined'
            size='small'
            style={{ marginTop: 15 }}
            onClick={sendDoc}
          >
            Confirmar
          </Button>
          <Button
            size='small'
            color='primary'
            variant='outlined'
            style={{ marginTop: 15 }}
            onClick={handleClose}
          >
            Retornar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
