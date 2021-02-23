import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { CameraAlt, Computer, Search } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import { Form, Formik } from 'formik';
import MuiPhoneNumber from 'material-ui-phone-number';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { PERFIL_LIST } from '../../../components/constants';
import NucleoSelect from '../../../components/NucleoSelect';
import Webcam from '../../../components/Webcam';
import { usePeople } from '../../../context/app/people';
import { useAuth } from '../../../context/auth';
import api from '../../../service/api';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'end',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  fullSm47: {
    width: '47%',
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },
  fullSm46: {
    width: '46%',
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },
  fullSm37: {
    width: '37%',
    marginTop: 12,
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },
  fullSm55: {
    width: '55%',
    marginTop: 12,
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },

  fullSm: {
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },

  formControl: {
    width: '46%',
    marginTop: 4,
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },
}));

export default function AddPeople({
  openModal,
  handleClose,
  callbackPersonal,
  initialValues,
  edition,
}) {
  const classes = useStyles();

  const [urlPhoto, setUrlPhoto] = useState('');
  const { setLoadingData, setCarregar } = usePeople();
  const [openWeb, setOpenWeb] = useState(false);
  const [fileSelect, setFileSelect] = useState('');
  const [nucleoid, setNucleoid] = useState(0);
  const [perfilid, setPerfilid] = useState(7);
  const [errorFile, setErrorFile] = useState('');
  const { user } = useAuth();
  const horizontal = 'center';
  const vertical = 'top';
  const adad = 7;

  useEffect(() => {
    if (edition) {
      setUrlPhoto(`${api.defaults.baseURL}/uploads/${initialValues.avatar}`);
      setFileSelect('avatar');
      setPerfilid(initialValues.perfilid);
      setNucleoid(initialValues.nucleoid);
    } else {
      setUrlPhoto('');
    }
  }, [edition]);

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  function closeModal() {
    setFileSelect('');
    setUrlPhoto('');
    handleClose();
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

  function callbackNucleo(id) {
    setNucleoid(id);
  }
  const handlePerfil = (event) => {
    setPerfilid(event.target.value);
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

  function validandoCPF(cpf) {
    // Elimina CPFs invalidos conhecidos
    if (
      cpf === '00000000000' ||
      cpf === '11111111111' ||
      cpf === '22222222222' ||
      cpf === '33333333333' ||
      cpf === '44444444444' ||
      cpf === '55555555555' ||
      cpf === '66666666666' ||
      cpf === '77777777777' ||
      cpf === '88888888888' ||
      cpf === '99999999999'
    )
      return false;
    // Valida 1o digito
    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    return true;
  }

  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [openaAlert, setOpenAlert] = useState(false);

  async function sendMatricula(form) {
    if (form.cpf !== '') {
      if (!validandoCPF(form.cpf)) {
        setMessage('O cpf esta inválido');
        setSeverity('warning');
        setOpenAlert(true);
        return;
      }
    }

    let avatar = '';

    if (!fileSelect) {
      setErrorFile('Escolha uma foto');
      return;
    }

    if (edition) {
      if (fileSelect !== 'avatar') {
        await api.post('/file/delete', { file: initialValues.avatar });
        avatar = await createAvatar();
      } else {
        avatar = initialValues.avatar;
      }
    } else {
      avatar = await createAvatar();
    }

    let data = [];
    const formEnv = {
      ...form,
      cep: Number(form.cep),
      nucleoid,
      perfilid,
      avatar,
    };

    if (edition) {
      const resp = await api.put('/personaldata/update', formEnv);
      data = resp.data;
    }

    if (!edition) {
      const resp = await api.post('/personaldata/add', formEnv);
      data = resp.data;
    }
    console.log('como veio a edição', data);

    if (data.error) {
      callbackPersonal(false, data.error);
    } else {
      callbackPersonal(true);
      setLoadingData(true);
      setCarregar(true);
      closeModal();
    }
  }

  const validation = yup.object().shape({
    fullName: yup.string().required('Campo obrigatório'),
    cpf: yup.string().min(11, 'Número inválido'),
    email: yup.string().email('E-mail inválido'),
    phone: yup
      .string()
      .min(18, 'Número inválido')
      .required('Campo obrigatório'),
    street: yup.string().required('Campo obrigatório'),
    number: yup.string().required('Campo obrigatório'),
    city: yup.string().required('Campo obrigatório'),
    state: yup.string().required('Campo obrigatório'),
    neighborhood: yup.string().required('Campo obrigatório'),
    denomination: yup.string().required('Campo obrigatório'),
  });

  async function buscarCep(cep) {
    const response = await fetch(
      'https://viacep.com.br/ws/' + cep + '/json/?callback'
    )
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
    return response;
  }

  const formikForm = (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={sendMatricula}
      validationSchema={validation}
    >
      {({
        errors,
        touched,
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setValues,
        setFieldError,
        setFieldTouched,
      }) => {
        return (
          <Form>
            <div>
              <Typography variant='subtitle1'>Dados Pessoais</Typography>
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
                    <div style={{ color: 'red', marginTop: 10 }}>
                      {errorFile}
                    </div>
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

              <div
                id='dadosPessoais'
                className={classes.root}
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <TextField
                  style={{ width: '96%' }}
                  label='Nome completo'
                  name='fullName'
                  size='small'
                  value={values.fullName}
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.fullName && !!errors.fullName}
                  helperText={
                    touched.fullName && errors.fullName && errors.fullName
                  }
                />

                <TextField
                  style={{ width: '96%' }}
                  label={adad === perfilid ? 'E-mail do responsável' : 'E-mail'}
                  name='email'
                  size='small'
                  value={values.email}
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email && errors.email}
                />

                <MuiPhoneNumber
                  style={{ width: '96%', marginTop: 30 }}
                  defaultCountry={'br'}
                  onlyCountries={['br', 'es', 'ar']}
                  label={
                    adad === perfilid ? 'Telefone do responsável' : 'Telefone'
                  }
                  name='phone'
                  size='small'
                  value={values.phone}
                  fullWidth
                  onChange={(resp) => {
                    setFieldValue('phone', resp);
                  }}
                  onBlur={handleBlur}
                  error={!!touched.phone && !!errors.phone}
                  helperText={touched.phone && errors.phone && errors.phone}
                />
              </div>
              <div
                className={classes.root}
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <FormControl className={classes.formControl}>
                  <FormLabel component='legend'>Sexo</FormLabel>
                  <RadioGroup
                    row
                    value={values.sexo}
                    onChange={(e) => {
                      setFieldValue('sexo', e.target.value);
                    }}
                    onBlur={handleBlur}
                  >
                    <FormControlLabel value='m' control={<Radio />} label='M' />
                    <FormControlLabel value='f' control={<Radio />} label='F' />
                  </RadioGroup>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <FormLabel component='legend'>Estado civil</FormLabel>
                  <RadioGroup
                    row
                    value={values.maritalStatus}
                    onChange={(e) => {
                      setFieldValue('maritalStatus', e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value='casado'
                      control={<Radio />}
                      label='Casado'
                    />
                    <FormControlLabel
                      value='solteiro'
                      control={<Radio />}
                      label='Solteiro'
                    />
                    <FormControlLabel
                      value='outros'
                      control={<Radio />}
                      label='Outros'
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div
                className={classes.root}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <TextField
                  className={classes.fullSm47}
                  label='Nascimento'
                  name='birthDate'
                  size='small'
                  type='date'
                  defaultValue={initialValues.birthDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={values.birthDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.birthDate && !!errors.birthDate}
                />

                <FormControl className={classes.formControl}>
                  <InputLabel id='select-perfil-label-input'>Perfil</InputLabel>
                  <Select
                    labelId='select-perfil-label-id'
                    id='select-perfil-id'
                    value={perfilid}
                    onChange={handlePerfil}
                    disabled={!user.admin}
                  >
                    {PERFIL_LIST.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div
                className={classes.root}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <TextField
                  className={classes.fullSm47}
                  label='Rg ou Certidão'
                  name='personalDocument'
                  size='small'
                  type='number'
                  value={values.personalDocument}
                  onChange={(event) => {
                    setFieldValue('personalDocument', event.target.value);
                  }}
                  onBlur={handleBlur}
                  error={!!touched.personalDocument && errors.personalDocument}
                  helperText={
                    touched.personalDocument &&
                    errors.personalDocument &&
                    errors.personalDocument
                  }
                />

                <TextField
                  className={classes.fullSm46}
                  label='CPF'
                  name='cpf'
                  size='small'
                  type='number'
                  value={values.cpf}
                  onChange={(event) => {
                    setFieldValue('cpf', event.target.value);
                  }}
                  onBlur={handleBlur}
                  error={!!touched.cpf && !!errors.cpf}
                  helperText={touched.cpf && errors.cpf && errors.cpf}
                />
              </div>

              {perfilid === adad && (
                <TextField
                  style={{ width: '96%', marginTop: 10 }}
                  label='Nome do pai'
                  name='fathersName'
                  size='small'
                  value={values.fathersName}
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.fathersName && !!errors.fathersName}
                  helperText={
                    touched.fathersName &&
                    errors.fathersName &&
                    errors.fathersName
                  }
                />
              )}
              {perfilid === adad && (
                <TextField
                  style={{ width: '96%', marginTop: 20 }}
                  label='Nome da mãe'
                  name='mothersName'
                  size='small'
                  value={values.mothersName}
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.mothersName && !!errors.mothersName}
                  helperText={
                    touched.mothersName &&
                    errors.mothersName &&
                    errors.mothersName
                  }
                />
              )}

              <Typography variant='subtitle1' style={{ marginTop: 20 }}>
                Endereço
              </Typography>
              <div
                className={classes.root}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <TextField
                  style={{ marginTop: 12, width: '55%' }}
                  label='CEP'
                  name='cep'
                  size='small'
                  value={values.cep}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.cep && !!errors.cep}
                  helperText={touched.cep && errors.cep && errors.cep}
                />

                <Fab
                  color='primary'
                  aria-label='add'
                  size='small'
                  onClick={async () => {
                    const {
                      bairro,
                      localidade,
                      logradouro,
                      uf,
                    } = await buscarCep(values.cep);

                    if (logradouro === '' || logradouro === undefined) {
                      setFieldTouched('cep', true);
                      setFieldError('cep', 'Localização não encontrada');
                    } else {
                      setValues({
                        ...values,
                        neighborhood: bairro,
                        street: logradouro,
                        city: localidade,
                        state: uf,
                      });
                    }
                  }}
                >
                  <Search />
                </Fab>
              </div>
              <div
                className={classes.root}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <TextField
                  className={classes.fullSm55}
                  label='Rua'
                  name='street'
                  size='small'
                  value={values.street}
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.street && !!errors.street}
                  helperText={touched.street && errors.street && errors.street}
                />
                <TextField
                  className={classes.fullSm37}
                  label='Número'
                  name='number'
                  size='small'
                  value={values.number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.number && !!errors.number}
                  helperText={touched.number && errors.number && errors.number}
                />
              </div>
              <div
                className={classes.root}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <TextField
                  className={classes.fullSm55}
                  label='Cidade'
                  name='city'
                  size='small'
                  value={values.city}
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.city && !!errors.city}
                  helperText={touched.city && errors.city && errors.city}
                />
                <TextField
                  className={classes.fullSm37}
                  label='Estado'
                  name='state'
                  size='small'
                  value={values.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.state && !!errors.state}
                  helperText={touched.state && errors.state && errors.state}
                />
              </div>

              <div
                className={classes.root}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <TextField
                  className={classes.fullSm55}
                  label='Bairro'
                  name='neighborhood'
                  size='small'
                  value={values.neighborhood}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.neighborhood && !!errors.neighborhood}
                  helperText={
                    touched.neighborhood &&
                    errors.neighborhood &&
                    errors.neighborhood
                  }
                />
                <TextField
                  className={classes.fullSm37}
                  label='Complemento'
                  name='complement'
                  size='small'
                  value={values.complement}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <Typography variant='subtitle1' style={{ marginTop: 20 }}>
                Igreja
              </Typography>
              <div
                className={classes.root}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <TextField
                  className={classes.fullSm46}
                  label='Denominação'
                  name='denomination'
                  size='small'
                  value={values.denomination}
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.denomination && !!errors.denomination}
                  helperText={
                    touched.denomination &&
                    errors.denomination &&
                    errors.denomination
                  }
                />

                <FormControl
                  className={classes.fullSm37}
                  component='fieldset'
                  style={{ marginLeft: 20 }}
                >
                  <FormLabel component='legend'>Batizado em aguas?</FormLabel>
                  <RadioGroup
                    name='batizadoemaguas'
                    row
                    value={values.batizadoemaguas}
                    onChange={(event) => {
                      setFieldValue('batizadoemaguas', event.target.value);
                    }}
                  >
                    <FormControlLabel value='s' control={<Radio />} label='S' />
                    <FormControlLabel value='n' control={<Radio />} label='N' />
                  </RadioGroup>
                </FormControl>
              </div>
              <div
                className={classes.root}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <TextField
                  className={classes.fullSm46}
                  label='Atividade na igreja?'
                  name='atividadenaigreja'
                  size='small'
                  value={values.atividadenaigreja}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <NucleoSelect
                  callbackNucleo={callbackNucleo}
                  initialValues={initialValues}
                />
              </div>
            </div>

            <div className={classes.root}>
              <Button
                color='primary'
                aria-label='add'
                variant='outlined'
                style={{ marginTop: 15 }}
                onClick={handleSubmit}
              >
                Confirmar
              </Button>

              <Button
                color='primary'
                aria-label='add'
                variant='outlined'
                style={{ marginTop: 15 }}
                onClick={closeModal}
              >
                Retornar
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
  return (
    <div>
      <Dialog open={openModal}>
        <DialogTitle id='criaradad'>Nova Matrícula</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {formikForm}
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
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
