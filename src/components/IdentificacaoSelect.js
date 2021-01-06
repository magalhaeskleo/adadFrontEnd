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

export default function SelectIdentificador({ infantil, onChange }) {
  const classes = useStyles();
  const { itemSelected, edit } = usePlano();

  const [itens, setItens] = useState(IDENTIFICACAO);
  const [item, setItem] = useState(1);

  const [infantilIdentificacao] = useState(
    IDENTIFICACAO.filter((i) => i.id < 4)
  );

  const [adultoIdentificacao] = useState(IDENTIFICACAO.filter((i) => i.id > 3));

  const handleChange = (event) => {
    console.log('item selecionado', event.target.value);
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
  console.log('itdentificadores', IDENTIFICACAO);
  useEffect(() => {
    if (infantil === null) {
      setItens(IDENTIFICACAO);
      setItem(IDENTIFICACAO[0].id);
    } else {
      setItens(infantil ? infantilIdentificacao : adultoIdentificacao);
      setItem(
        infantil ? infantilIdentificacao[0].id : adultoIdentificacao[0].id
      );
      onChange(
        infantil ? infantilIdentificacao[0].id : adultoIdentificacao[0].id
      );
    }
  }, [infantil]);

  console.log('edit', edit, itemSelected);

  useEffect(() => {
    if (edit) {
      setItem(itemSelected.identificador);
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
