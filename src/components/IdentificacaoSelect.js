import { Input, MenuItem } from '@material-ui/core/';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { usePlano } from '../context/app/plano';
import { IDENTIFICACAO } from './constants';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    marginTop: 8,
    width: 150,
    [theme.breakpoints.down('xs')]: {
      width: '96%',
    },
  },

  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SelectIdentificador({ onChange }) {
  const classes = useStyles();
  const { itemSelected, edit } = usePlano();

  const [itens, setItens] = useState(IDENTIFICACAO);
  const [item, setItem] = useState(1);

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

  useEffect(() => {
    setItens(IDENTIFICACAO);
    setItem(IDENTIFICACAO[0].id);
    onChange(IDENTIFICACAO[0].id);
  }, []);

  useEffect(() => {
    if (edit) {
      setItem(itemSelected.identificador);
      onChange(IDENTIFICACAO[0].id);
    } else {
      setItem(1);
    }
  }, [edit]);

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id='select-Item'>Identificador</InputLabel>
      <Select
        id='demo-mutiple-chip'
        value={item}
        onChange={handleChange}
        input={<Input id='select_identification' />}
        MenuProps={MenuProps}
      >
        {itens.map((item, index) => (
          <MenuItem
            title={item.descricao}
            key={index}
            value={item.id}
            style={{
              background: item.color,
              color: 'white',
            }}
          >
            <div
              style={{
                background: item.color,
                textAlign: 'center',
                width: '100%',
                height: '100%',
                color: 'white',
                borderRadius: 20,
              }}
            >
              {item.type}
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
