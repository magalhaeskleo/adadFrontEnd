import {
  Avatar,
  Button,
  Card,
  Container,
  Divider,
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
import { Search } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import { Form, Formik } from 'formik';
import MuiPhoneNumber from 'material-ui-phone-number';
import React, { useState } from 'react';
import * as yup from 'yup';
import { PERFIL_LIST } from '../../../components/constants';
import NucleoSelect from '../../../components/NucleoSelect';
import { useAuth } from '../../../context/auth';
import api from '../../../service/api';
import AvatarDialog from './avatar';
import Email from './email';
import Senha from './senha';
const width = { tudo: 'xl', lateral: 'md', pequeno: 'sm' };

const useStyles = makeStyles((theme) => ({
  hiper: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  containerProfile: {
    display: 'inline-flex',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      width: '96%',
    },
  },
  root: {
    textAlign: 'end',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  fullSm47: {
    width: '47%',
    [theme.breakpoints.down('sm')]: {
      width: '96%',
    },
  },
  fullSm46: {
    width: '47%',
    [theme.breakpoints.down('sm')]: {
      width: '96%',
    },
  },
  fullSm37: {
    width: '39%',
    marginTop: 12,
    [theme.breakpoints.down('sm')]: {
      width: '96%',
    },
  },
  fullSm55: {
    width: '55%',
    marginTop: 12,
    [theme.breakpoints.down('sm')]: {
      width: '96%',
    },
  },

  fullSm: {
    [theme.breakpoints.down('sm')]: {
      width: '96%',
    },
  },

  formControl: {
    width: '47%',
    marginTop: 4,
    [theme.breakpoints.down('sm')]: {
      width: '96%',
    },
  },
  formLadoUm: {
    width: '35%',
    marginLeft: 9,
    textAlign: '-webkit-center',
    [theme.breakpoints.down('sm')]: {
      width: '96%',
    },
  },
  formLadoDois: {
    width: '65%',
    marginLeft: 10,
    textAlign: '-webkit-center',
    [theme.breakpoints.down('sm')]: {
      marginTop: 10,
      width: '96%',
    },
  },
}));

export default function Profile() {
  const { profile, alterStorageAndUser } = useAuth();
  const classes = useStyles();
  const [openaAlert, setOpenAlert] = useState(false);
  const [userSelect, setUserSelect] = useState('');
  const [perfilid, setPerfilid] = useState(profile.perfilid);
  const [nucleoid, setNucleoid] = useState(profile.nucleoid);
  const [openEmail, setOpenEmail] = useState(false);
  const [openSenha, setOpenSenha] = useState(false);
  const [openAvatar, setOpenAvatar] = useState(false);

  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const horizontal = 'center';
  const vertical = 'top';

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

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  const handlePerfil = (event) => {
    setPerfilid(event.target.value);
  };

  function callbackNucleo(id) {
    setNucleoid(id);
  }

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

  async function sendProfile(form) {
    if (!validandoCPF(form.cpf)) {
      setMessage('O cpf esta inválido');
      setSeverity('warning');
      setOpenAlert(true);

      return;
    }

    const formEnv = {
      ...form,
      cep: Number(form.cep),
      nucleoid,
      perfilid,
    };

    const resp = await api.put('/personaldata/update', formEnv);

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
  const validation = yup.object().shape({
    fullName: yup.string().required('Campo obrigatório'),
    cpf: yup.string().min(11, 'Número inválido').required('Campo obrigatório'),
    email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
    phone: yup
      .string()
      .min(18, 'Número inválido')
      .required('Campo obrigatório'),
    street: yup.string().required('Campo obrigatório'),
    number: yup.string().required('Campo obrigatório'),
    city: yup.string().required('Campo obrigatório'),
    state: yup.string().required('Campo obrigatório'),
    personalDocument: yup.string().required('Campo obrigatório'),
    neighborhood: yup.string().required('Campo obrigatório'),
  });
  console.log('o profile', profile);
  const formikForm = (
    <Formik
      initialValues={{ ...profile }}
      enableReinitialize
      onSubmit={sendProfile}
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
          <Form onChange={() => console.log(values)}>
            <div>
              <Typography variant='subtitle1'>Dados Pessoais</Typography>

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
                  label='E-mail'
                  name='email'
                  size='small'
                  value={values.email}
                  fullWidth
                  disabled={true}
                />

                <MuiPhoneNumber
                  style={{ width: '96%', marginTop: 30 }}
                  defaultCountry={'br'}
                  onlyCountries={['br', 'es', 'ar']}
                  label='Telefone'
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
                  defaultValue={userSelect.birthDate}
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
                    disabled={!profile.admin}
                    onChange={handlePerfil}
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
              <div
                className={classes.root}
                style={{
                  marginTop: 30,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
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
              </div>
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
                  style={{ marginTop: 12 }}
                  label='Atividade na igreja?'
                  name='atividadenaigreja'
                  size='small'
                  value={values.atividadenaigreja}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <NucleoSelect callbackNucleo={callbackNucleo} />
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
            </div>
          </Form>
        );
      }}
    </Formik>
  );

  return (
    <Container
      maxWidth={width.tudo}
      style={{
        minHeight: '80vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div id='containerProfile' className={classes.containerProfile}>
        <div id='ladoUmProf' className={classes.formLadoUm}>
          <Card style={{ width: '100%' }}>
            <Avatar
              alt='Remy Sharp'
              src={
                profile && `${api.defaults.baseURL}/uploads/${profile.avatar}`
              }
              className={classes.hiper}
            />
            <Typography variant='h5'>{profile.fullName}</Typography>
            <Typography variant='subtitle1'>
              {profile && PERFIL_LIST[profile.perfilid].name}
            </Typography>
            <Divider />
            <Button
              variant='text'
              fullWidth
              onClick={() => setOpenAvatar(true)}
              color='primary'
              style={{ margin: 5, maxWidth: '97%' }}
            >
              Alterar foto
            </Button>
            <Divider />
            <Button
              variant='text'
              fullWidth
              color='primary'
              onClick={() => setOpenSenha(true)}
              style={{ margin: 5, maxWidth: '97%' }}
            >
              Alterar senha
            </Button>
            <Divider />
            <Button
              variant='text'
              fullWidth
              color='primary'
              onClick={() => setOpenEmail(true)}
              style={{ margin: 5, maxWidth: '97%' }}
            >
              Alterar e-mail
            </Button>
          </Card>
        </div>
        <div id='ladoDoisProf' className={classes.formLadoDois}>
          <Card style={{ width: '100%', padding: 5 }}>{formikForm}</Card>
        </div>
      </div>
      <Email open={openEmail} close={() => setOpenEmail(false)} />
      <Senha open={openSenha} close={() => setOpenSenha(false)} />
      <AvatarDialog open={openAvatar} close={() => setOpenAvatar(false)} />
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
    </Container>
  );
}
