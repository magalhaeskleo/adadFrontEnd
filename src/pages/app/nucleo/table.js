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
import { DeleteOutlined, EditOutlined, Search } from '@material-ui/icons/';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useEffect, useState } from 'react';
import DailogConfirmation from '../../../components/DailogConfirmation';
import LoadingPage from '../../../components/LoadingPage';
import { useNucleo } from '../../../context/app/nucleo';

const columns = [
  { id: 'name', label: 'Nome', maxWidth: 100, align: 'center' },
  { id: 'city', label: 'Cidade', maxWidth: 80, align: 'center' },
  { id: 'neighborhood', label: 'Bairro', maxWidth: 80, align: 'center' },
  { id: 'action', label: '', maxWidth: 50, align: 'right' },
];

function createData(id, name, city, neighborhood, action) {
  return { id, name, city, neighborhood, action };
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

export default function StickyHeadTable({ callbackEdit, callbackDelete }) {
  const classes = useStyles();
  const [page, setPage] = useState(1);

  const [anchorEl, setAnchorEl] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [itemSelected, setItemSelected] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const {
    loadingNucleos,
    getNucleos,
    total,
    setLoadingNucleos,
    nucleosList,
  } = useNucleo();

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
      callbackDelete();
      handleClose();
    }
    getData();
  }

  function handleDelete() {
    setOpenConfirmation(true);
  }

  function handleEdit() {
    callbackEdit(itemSelected);
    handleClose();
  }

  function handleFilter() {
    const list = nucleosList.filter((valor) =>
      valor.name.includes(filterValue)
    );
    setDataList(list);
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleChangePage(event, newPage) {
    setLoadingNucleos(true);
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
    const list = await getNucleos(newPage);

    if (list) {
      const listFormat = list.map((item) =>
        createData(
          item.id,
          item.name,
          item.city,
          item.neighborhood,
          action(item)
        )
      );
      setDataList(listFormat);
    }
  }

  useEffect(() => {
    if (filterValue === '') {
      setLoadingNucleos(true);
      getData(1);
    }
  }, [filterValue]);

  useEffect(() => {
    getData(page);
  }, [loadingNucleos]);

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
      {loadingNucleos ? <LoadingPage /> : tableList}
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
