import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React from 'react';
import Webcam from 'react-webcam';

export default function WebComponent({ setOpen, open, callbackWeb }) {
  const handleClose = () => setOpen(false);
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  const capt = (e) => {
    const imageSrc = webcamRef.current.getScreenshot();

    setImgSrc(imageSrc);
  };

  function callB() {
    const now = new Date();

    const BASE64_MARKER = ';base64,';
    const parts = imgSrc.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    const blob = new Blob([uInt8Array], { type: contentType });

    var file = new File(
      [blob],
      `${now.getDay()}_${
        now.getMonth() + 1
      }_${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}_image.png`
    );

    callbackWeb(file);
    handleClose();
  }
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id='criaradad'>Perfil</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-perfil'>
            <Webcam
              audio={false}
              ref={webcamRef}
              width={500}
              height={500}
              screenshotFormat='image/jpeg'
            />
            {imgSrc && (
              <img src={imgSrc} style={{ maxWidth: 300, maxWidth: 300 }} />
            )}
            <DialogActions>
              <Button color='primary' onClick={handleClose}>
                Sair
              </Button>
              <Button color='primary' onClick={(e) => capt(e)}>
                Capturar Foto
              </Button>
              <Button color='primary' onClick={callB}>
                Salvar
              </Button>
            </DialogActions>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
