import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { AttachFile, InsertLink } from '@material-ui/icons';
import React, { useState } from 'react';
import DialogInsertLink from './DialogInsertLink';

export default function ButtonAnexo({
  callbackAnexos,
  setAnexos,
  inserteAnexos,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handlLink() {
    setOpen(true);
    handleClose();
  }

  const handleUploadFile = (e) => {
    const arquivo = e.target.files[0];
    if (e.target.files[0]) {
      const url = URL.createObjectURL(arquivo);

      const listForm = inserteAnexos.filter((item) => item.type !== 'file');

      setAnexos([
        ...listForm,
        {
          type: 'file',
          value: url,
          name: arquivo.name,
          file: e.target.files[0],
        },
      ]);
    }
  };

  return (
    <div style={{ marginTop: 15, marginRight: 10 }}>
      <Button
        aria-controls='simple-menu-anexos'
        color='primary'
        onClick={handleClick}
        variant='outlined'
      >
        Arquivo <AttachFile fontSize='small' />
      </Button>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <input
          accept='image/*'
          style={{ display: 'none' }}
          //  className={classes.input}
          id='contained-button-file'
          type='file'
          onChange={(e) => handleUploadFile(e)}
        />
        <label htmlFor='contained-button-file'>
          <MenuItem onClick={handleClose}>
            <AttachFile fontSize='small' style={{ marginRight: 10 }} />
            Arquivo
          </MenuItem>
        </label>
        <MenuItem onClick={handlLink}>
          <InsertLink fontSize='small' style={{ marginRight: 10 }} />
          Link
        </MenuItem>
      </Menu>

      <DialogInsertLink
        open={open}
        setOpen={setOpen}
        setAnexos={setAnexos}
        inserteAnexos={inserteAnexos}
      />
    </div>
  );
}
