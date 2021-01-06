import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Table,
  TextField,
} from '@material-ui/core/';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Search } from '@material-ui/icons';
import { DeleteOutlined, EditOutlined } from '@material-ui/icons/';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useEffect, useState } from 'react';
import DailogConfirmation from '../../../components/DailogConfirmation';
import LoadingPage from '../../../components/LoadingPage';
import { usePeople } from '../../../context/app/people';
import api from '../../../service/api';
import BigPhoto from './bigPhoto';

const columns = [
  { id: 'avatar', label: 'Nome', maxWidth: 100, align: 'center' },
  { id: 'phone', label: 'Telefone', maxWidth: 80, align: 'center' },
  { id: 'nucleo', label: 'Núcleo', maxWidth: 100, align: 'center' },
  { id: 'action', label: '', maxWidth: 50, align: 'right' },
];

function createData(id, avatar, phone, nucleo, action) {
  return { id, avatar, phone, nucleo, action };
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
}));

export default function StickyHeadTable({ callbackEdit, callbackDelete }) {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [openBig, setOpenBig] = useState(false);
  const [urlBig, setUrlBig] = useState('');
  const [itemSelected, setItemSelected] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [filterValue, setFilterValue] = useState('');

  const {
    getDataServer,
    setLoadingData,
    total,
    loadingData,
    getAdadsFilter,
    carregar,
  } = usePeople();

  function handleUrlBig(url) {
    setUrlBig(url);
    setOpenBig(true);
  }

  async function getData(newPage) {
    const list = await getDataServer(newPage);

    if (list) {
      const listFormat = list.map((item) =>
        createData(
          item.personal.id,
          <ListItem
            button
            alignItems='flex-start'
            onClick={() =>
              handleUrlBig(
                `${api.defaults.baseURL}/uploads/${item.personal.avatar}`
              )
            }
          >
            <ListItemAvatar>
              <Avatar
                src={`${api.defaults.baseURL}/uploads/${item.personal.avatar}`}
                alt='request'
              />
            </ListItemAvatar>
            <ListItemText
              primary={item.personal.fullName}
              secondary={dateFormat(item.personal.birthDate)}
            />
          </ListItem>,
          item.personal.phone,
          item.nucleo.name,
          action(item)
        )
      );
      setDataList(listFormat);
    }
  }

  async function handleFilter() {
    if (filterValue === '') return;
    setLoadingData(true);
    const list = await getAdadsFilter(filterValue);

    if (list) {
      const listFormat = list.map((item) =>
        createData(
          item.personal.id,
          <ListItem alignItems='flex-start'>
            <ListItemAvatar>
              <Avatar
                src={`${api.defaults.baseURL}/uploads/${item.personal.avatar}`}
                alt='request'
              />
            </ListItemAvatar>
            <ListItemText
              primary={item.personal.fullName}
              secondary={dateFormat(item.personal.birthDate)}
            />
          </ListItem>,
          item.personal.phone,
          item.nucleo.name,
          action(item)
        )
      );
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

  async function handleChangePage(event, newPage) {
    setLoadingData(true);
    setPage(Number(newPage + 1));
    await getData(newPage + 1);
  }

  function handleEdit() {
    callbackEdit(itemSelected);
    handleClose();
  }

  function dateFormat(date) {
    const year = date.split('-')[0];
    const month = date.split('-')[1];
    const day = date.split('-')[2];
    return `${day}/${month}/${year}`;
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

  useEffect(() => {
    if (filterValue === '') {
      console.log('filter useefect');
      setLoadingData(true);
      getData(1);
    }
  }, [filterValue]);

  useEffect(() => {
    console.log('ativando o carregar');
    getData(1);
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
                className={
                  index > 1 && index < 3 ? classes.headerTableHide : ''
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
                      className={i > 1 && i < 3 ? classes.headerTableHide : ''}
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
      {loadingData ? <LoadingPage /> : tableList}
      <TablePagination
        rowsPerPageOptions={[10]}
        component='div'
        count={total}
        rowsPerPage={rowsPerPage}
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
      <BigPhoto open={openBig} setOpen={setOpenBig} url={urlBig} />
    </Paper>
  );
  return section;
}
