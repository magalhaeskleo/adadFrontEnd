import { IconButton, Menu, MenuItem, TextField } from '@material-ui/core/';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {
  AddCircleOutline,
  DeleteOutlined,
  EditOutlined,
  RemoveCircleOutline,
  Search,
} from '@material-ui/icons/';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useEffect, useState } from 'react';
import DailogConfirmation from '../../../components/DailogConfirmation';
import LoadingPage from '../../../components/LoadingPage';
import { useAuth } from '../../../context/auth';
import api from '../../../service/api';

const columns = [
  { id: 'descricao', label: 'Descricao', maxWidth: 100, align: 'center' },
  { id: 'type', label: 'Tipo', maxWidth: 80, align: 'center' },
  { id: 'valor', label: 'Valor', maxWidth: 80, align: 'center' },
  { id: 'nucleo', label: 'Nucleo', maxWidth: 50, align: 'center' },
  { id: 'action', label: '', maxWidth: 50, align: 'right' },
];

function createData(id, descricao, type, valor, nucleo, action) {
  return { id, descricao, type, valor, nucleo, action };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  searchDiv: {
    maxWidth: '100vh',
    marginLeft: 10,
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
    },
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

export default function StickyHeadTable({
  callbackEdit,
  callbackDelete,
  carregar,
  setCarregar,
}) {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [anchorEl, setAnchorEl] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [itemSelected, setItemSelected] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [filterValue, setFilterValue] = useState('');

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
      handleClose();
    }
    getData(1);
  }

  function handleDelete() {
    setOpenConfirmation(true);
  }

  function handleEdit() {
    callbackEdit(itemSelected);
    handleClose();
  }

  function handleFilter() {
    /*
    const list = nucleosList.filter((valor) =>
      valor.name.includes(filterValue)
    );
    setDataList(list);
    */
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleChangePage(event, newPage) {
    setPage(Number(newPage + 1));
    await getData(newPage + 1);
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

  async function getData(newPage) {
    let resp = [];
    if (user.admin) {
      resp = await api.get('/financeiro/all', {
        headers: {
          page: newPage,
        },
      });
    } else {
      resp = await api.get('/financeiro', {
        headers: {
          page: newPage,
          nucleoid: user.nucleoid,
        },
      });
    }

    if (resp.data) {
      const listFormat = resp.data.list.map((item) =>
        createData(
          item.id,
          item.descricao,
          item.type === 'saida' ? (
            <RemoveCircleOutline htmlColor='red' />
          ) : (
            <AddCircleOutline htmlColor='green' />
          ),
          item.type === 'saida' ? `-${item.valor}` : item.valor,
          item.nucleo.name,
          action(item)
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDataList(listFormat);
      setTotal(resp.data.total);
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    getData(1);
    setCarregar(false);
  }, [carregar]);

  const menuButton = (
    <Menu
      id='menu-nucleo'
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
  const search = (
    <div className={classes.search}>
      <Fab color='primary' aria-label='add' onClick={handleFilter}>
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
  const tableList = (
    <TableContainer className={classes.container}>
      <Table>
        <TableHead style={{ backgroundColor: '#F3F0F0' }}>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={column.id}
                align={column.align}
                className={
                  index > 0 && index < 3 ? classes.headerTableHide : ''
                }
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
                      className={i > 0 && i < 3 ? classes.headerTableHide : ''}
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

      <TablePagination
        rowsPerPageOptions={[10]}
        component='div'
        count={total}
        rowsPerPage={10}
        page={page - 1}
        onChangePage={handleChangePage}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
      />

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
