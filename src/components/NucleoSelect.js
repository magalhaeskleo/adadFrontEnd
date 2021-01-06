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
    width: '45%',
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },

  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelectNucleo({ callbackNucleo }) {
  const classes = useStyles();
  const [nucleos, setNucleos] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const { user } = useAuth();
  const [nucleo, setNucleo] = useState(user.nucleoid);

  async function getData() {
    const response = await api.get('/allsimpleactivate');
    setNucleos(response.data);
    callbackNucleo(user.nucleoid);

    if (user.admin) {
      setDisabled(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (event) => {
    setNucleo(event.target.value);
    callbackNucleo(event.target.value);
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
      <InputLabel id='select-nucleo'>Núcleo</InputLabel>
      <Select
        disabled={disabled}
        id='demo-mutiple-chip'
        value={nucleo}
        onChange={handleChange}
        input={<Input id='select-nucleo' />}
        MenuProps={MenuProps}
      >
        {nucleos.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
