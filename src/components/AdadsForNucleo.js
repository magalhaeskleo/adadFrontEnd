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

export default function AdadsForNucleod({ callbackAdads, error, setError }) {
  const { user } = useAuth();
  const { itemSelected, edit } = usePlano();
  const classes = useStyles();
  const theme = useTheme();

  const [personName, setPersonName] = useState([]);
  const [adadsSelect, setAdadsSelect] = useState([]);

  function handleDelete(item) {
    setPersonName(personName.filter((i) => item.id !== i.id));
    callbackAdads(personName.filter((i) => item.id !== i.id));
    //setAdadsSelect([...adadsSelect, item]);
  }
  const handleChange = (event) => {
    setPersonName(event.target.value);
    callbackAdads(event.target.value);
    setError(false);
  };

  async function getData() {
    const response = await api.get('/adads/forNucleo', {
      headers: {
        nucleoid: user.nucleoid,
      },
    });
    if (response.data) {
      setAdadsSelect(response.data.list);
    }
    // callbackNucleo(user.nucleoid);
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (edit) {
      setPersonName(itemSelected.adadsSelected);
    } else {
      setPersonName([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

  return (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel id='demo-mutiple-chip-label'>Adads</InputLabel>
        <Select
          fullWidth
          labelId='demo-mutiple-chip-label'
          id='demo-mutiple-chip'
          multiple
          disabled={adadsSelect.length === personName.length}
          value={personName}
          onChange={handleChange}
          input={<Input id='select-multiple-chip-adads' />}
          MenuProps={MenuProps}
        >
          {adadsSelect.map((item) => (
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
              Ao menos um adad deve ser selecionado
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
