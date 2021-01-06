import { Input, MenuItem } from '@material-ui/core/';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { TAMANHO_ADULTO, TAMANHO_INFANTIL } from './constants';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    marginTop: 8,
    width: 80,
    [theme.breakpoints.down('xs')]: {
      width: '50%',
    },
  },

  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SelectNumeracao({ onChange, onBlur, infantil }) {
  const classes = useStyles();
  const [Itens, setItens] = useState(TAMANHO_INFANTIL);

  const [item, setItem] = useState(TAMANHO_INFANTIL[0]);

  useEffect(() => {
    setItens(infantil ? TAMANHO_INFANTIL : TAMANHO_ADULTO);
    setItem(infantil ? TAMANHO_INFANTIL[0] : TAMANHO_ADULTO[0]);
    onChange(infantil ? TAMANHO_INFANTIL[0] : TAMANHO_ADULTO[0]);
  }, [infantil]);

  const handleChange = (event) => {
    setItem(event.target.value);
    onChange(event.target.value);
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
      <InputLabel id='select-numeracao'>Numeração</InputLabel>
      <Select
        id='demo-mutiple-chip'
        value={item}
        onChange={handleChange}
        input={<Input id='select_numeracao' />}
        MenuProps={MenuProps}
      >
        {Itens.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
