import {
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TextField,
} from '@material-ui/core/';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Search } from '@material-ui/icons';
import { DeleteOutlined, EditOutlined } from '@material-ui/icons/';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useEffect, useState } from 'react';
import DailogConfirmation from '../../../components/DailogConfirmation';
import LoadingPage from '../../../components/LoadingPage';
import api from '../../../service/api';

const columns = [
  { id: 'item', label: 'Item', maxWidth: 52, align: 'center' },
  {
    id: 'name',
    label: 'Nome',
    maxWidth: 150,
    align: 'center',
  },
  { id: 'valor', label: 'Valor', maxWidth: 95, align: 'center' },
  { id: 'action', label: '', maxWidth: 55, align: 'right' },
];

function createData(item, name, valor, action) {
  return {
    item,
    name,
    valor,
    action,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '60vh',
  },
  search: {
    backgroundColor: 'white',
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
  },

  searchDiv: {
    maxWidth: '100vh',
    marginLeft: 10,
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
    },
  },
  headerTableHide: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  small: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

export default function TableUniformes({
  callbackEdit,
  callbackDelete,
  carregar,
}) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [dataList, setDataList] = useState([]);

  const [itemSelected, setItemSelected] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(false);

  async function getData() {
    const response = await api.get('/uniforme/all');
    if (response.data) {
      const listFormat = response.data.map((item) =>
        createData(
          item.id,
          item.name,
          item.valor,

          action(item)
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
      setDataList(listFormat);
    }
  }

  const handleClick = (event, item) => {
    setItemSelected(item);
    setAnchorEl(event.currentTarget);
  };

  async function callbackConfirm(status) {
    if (status === 'ok') {
      await callbackDelete(itemSelected);
      handleClose();
    }
    if (status === 'cancel') {
      callbackDelete();
      handleClose();
    }
    getData();
  }

  function handleDelete() {
    setOpenConfirmation(true);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleEdit() {
    callbackEdit(itemSelected);
    handleClose();
  }

  const action = (item) => (
    <IconButton
      color='primary'
      aria-label='upload picture'
      component='span'
      onClick={(e) => handleClick(e, item)}
    >
      <MenuIcon />
    </IconButton>
  );

  const search = (
    <div className={classes.search}>
      <Fab color='primary' aria-label='add'>
        <Search />
      </Fab>
      <TextField
        className={classes.searchDiv}
        fullWidth
        label='Pesquisar'
        placeholder='Digite um nome para a pesquisa'
        variant='outlined'
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
    </div>
  );

  useEffect(() => {
    setLoading(true);
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [carregar]);

  const menuButton = (
    <Menu
      id='menu'
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={() => handleEdit()}>
        <EditOutlined style={{ marginRight: 10 }} />
        Editar
      </MenuItem>
      <MenuItem onClick={() => handleDelete()}>
        <DeleteOutlined style={{ marginRight: 10 }} />
        Excluir
      </MenuItem>
    </Menu>
  );

  const tableList = (
    <TableContainer className={classes.container}>
      <Table>
        <TableHead style={{ backgroundColor: '#F3F0F0' }}>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={column.id}
                align={column.align}
                variant='head'
                style={{
                  maxWidth: column.maxWidth,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataList.map((row, index) => {
            return (
              <TableRow key={index}>
                {columns.map((column, i) => {
                  const value = row[column.id];

                  return (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        maxWidth: column.maxWidth,
                      }}
                    >
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
  const section = (
    <Paper className={classes.root}>
      {search}
      {loading ? <LoadingPage /> : tableList}

      {menuButton}
      <DailogConfirmation
        callback={callbackConfirm}
        open={openConfirmation}
        setOpen={setOpenConfirmation}
      />
    </Paper>
  );
  return section;
}
