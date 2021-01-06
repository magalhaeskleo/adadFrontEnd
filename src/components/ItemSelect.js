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
    width: 150,
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },

  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelectItem({ onChange }) {
  const classes = useStyles();
  const [itens, setItems] = useState([]);

  const { user } = useAuth();
  const [Item, setItem] = useState('');

  async function getData() {
    const response = await api.get('/uniforme/all');
    setItems(response.data);
    setItem(response.data[0].id);
    onChange({
      uniformeid: response.data[0].id,
      name: response.data[0].name,
      valor: response.data[0].valor,
    });
    // callbackItem(user.Itemid);
  }

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (event) => {
    const item = itens.find((item) => item.id === event.target.value);
    const name = item.name;
    const valor = item.valor;
    setItem(event.target.value);
    onChange({
      uniformeid: event.target.value,
      name,
      valor,
    });

    // callbackItem(event.target.value);
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 8.5 + ITEM_PADDING_TOP,
        width: 300,
        minWidth: 300,
      },
    },
  };
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id='select-Item'>Item</InputLabel>
      <Select
        id='demo-mutiple-chip'
        value={Item}
        onChange={handleChange}
        input={<Input id='select-Item' />}
        MenuProps={MenuProps}
      >
        {itens.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
