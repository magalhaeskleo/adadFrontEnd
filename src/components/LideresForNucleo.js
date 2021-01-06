import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { usePlano } from '../context/app/plano';
import { useAuth } from '../context/auth';
import api from '../service/api';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },

  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(id, personName, theme) {
  return {
    fontWeight: personName.find((item) => item.id === id)
      ? theme.typography.fontWeightRegular
      : theme.typography.fontWeightMedium,
    display: personName.find((item) => item.id === id) ? 'none' : 'block',
  };
}

export default function LideresForNucleo({ callbackLideres, error, setError }) {
  const { user } = useAuth();
  const { itemSelected, edit } = usePlano();
  const classes = useStyles();
  const theme = useTheme();

  const [personName, setPersonName] = useState([]);
  const [lideres, setLideres] = useState([]);

  function handleDelete(item) {
    setPersonName(personName.filter((i) => Number(item.id) !== Number(i.id)));
    callbackLideres(personName.filter((i) => Number(item.id) !== Number(i.id)));
  }
  const handleChange = (event) => {
    setPersonName(event.target.value);
    callbackLideres(event.target.value);
    setError(false);
  };

  async function getData() {
    const response = await api.get(`/personal/fornucleo/${user.nucleoid}`);

    if (response.data) {
      setLideres(response.data);
    }
    // callbackNucleo(user.nucleoid);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (edit) {
      setPersonName(itemSelected.lideresSelected);
    } else {
      setPersonName([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

  return (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel id='demo-mutiple-chip-label'>Lideres</InputLabel>
        <Select
          fullWidth
          labelId='demo-mutiple-chip-label'
          id='demo-mutiple-chip'
          multiple
          disabled={lideres.length === personName.length}
          value={personName}
          onChange={handleChange}
          input={<Input id='select-multiple-chip-lideres' />}
          MenuProps={MenuProps}
        >
          {lideres.map((item) => (
            <MenuItem
              key={item.id}
              value={item}
              style={getStyles(item.id, personName, theme)}
            >
              {item.fullName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {
        <div className={classes.chips}>
          {error ? (
            <div style={{ color: 'red' }}>
              Ao menos um lider deve ser selecionado
            </div>
          ) : (
            personName.map((item) => (
              <Chip
                key={item.id}
                label={item.fullName}
                className={classes.chip}
                onDelete={() => handleDelete(item)}
              />
            ))
          )}
        </div>
      }
    </>
  );
}
/*
import { Input, MenuItem } from '@material-ui/core/';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/auth';
import api from '../service/api';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    marginTop: 4,
    width: '41%',
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },

  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelectLideres({ callbackLideres }) {
  const classes = useStyles();
  const [disabled, setDisabled] = useState(true);
  const { user } = useAuth();
  const [nucleo, setNucleo] = useState(user.nucleoid);
  const [lideres, setLideres] = useState([]);

  async function getData() {
    console.log('user', user);

    const response = await api.get(`/personal/fornucleo/${user.nucleoid}`);

    console.log('veio o response', response.data);
    if (response.data) {
      setLideres(response.data);
    }
    // callbackNucleo(user.nucleoid);
  }

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (event) => {
    setNucleo(event.target.value);
    // callbackNucleo(event.target.value);
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id='select-nucleo'>Lideres</InputLabel>
      <Select
        id='demo-mutiple-chip'
        value={nucleo}
        onChange={handleChange}
        input={<Input id='select-nucleo' />}
        MenuProps={MenuProps}
      >
        {lideres.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.fullName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

*/
