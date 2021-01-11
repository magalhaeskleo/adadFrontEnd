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
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Search } from '@material-ui/icons';
import { EditOutlined } from '@material-ui/icons/';
import MenuIcon from '@material-ui/icons/Menu';
import Visibility from '@material-ui/icons/Visibility';
import React, { useEffect, useState } from 'react';
import { COLOR_STATUS_PEDIDO } from '../../../components/constants';
import IconButtonDelete from '../../../components/IconButtonDelete';
import LoadingPage from '../../../components/LoadingPage';
import StatusPedido from '../../../components/StatusPedido';
import { usePedido } from '../../../context/app/pedido';
import EditPedido from './editPedido';
import ViewPedido from './viewPedido';

const columns = [
  {
    id: 'identificacao',
    label: 'Identificação',
    maxWidth: 90,
    align: 'left',
  },
  { id: 'data', label: 'Data', maxWidth: 95, align: 'center' },
  { id: 'quantidade', label: 'Quantidade', maxWidth: 100, align: 'center' },
  { id: 'total', label: 'Total', maxWidth: 100, align: 'center' },
  { id: 'status', label: 'Status', maxWidth: 80, align: 'center' },
  { id: 'nucleo', label: 'Nucleo', maxWidth: 100, align: 'center' },
  { id: 'action', label: '', maxWidth: 55, align: 'right' },
];

function createData(
  identificacao,
  data,
  quantidade,
  total,
  status,
  nucleo,
  action
) {
  return {
    identificacao,
    data,
    quantidade,
    total,
    status,
    nucleo,
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
}));

export default function TablePedidos({
  callbackDelete,
  carregar,
  setCarregar,
}) {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [itemEdit, setItemEdit] = useState({
    pedido: '',
    list: [],
    statusPedido: [],
  });

  const [openView, setOpenView] = useState(false);

  const {
    user,
    getDataServer,
    total,
    loading,
    setItemSelected,

    dataListPedido,
    setLoading,
    itemSelected,
  } = usePedido();

  async function getData(page) {
    const list = await getDataServer(page);
    if (list.length > 0) {
      const listFormat = list.map((item) =>
        createData(
          <p style={{ color: COLOR_STATUS_PEDIDO[item.pedido.status] }}>
            {item.pedido.description}
          </p>,
          item.pedido.data,
          item.pedido.quantidadeTotal,
          `R$ ${item.pedido.valortotal}, 00`,
          <StatusPedido status={item.pedido.status} />,
          item.pedido.nucleo.name,
          action(item.pedido, item.list, item.statusPedido)
        )
      );
      setDataList(listFormat);
    } else {
      setDataList([]);
    }
  }

  useEffect(() => {
    const listFormat = dataListPedido.map((item) =>
      createData(
        <p style={{ color: COLOR_STATUS_PEDIDO[item.pedido.status] }}>
          {item.pedido.description}
        </p>,
        item.pedido.data,
        item.pedido.quantidadetotal,
        `R$ ${item.pedido.valortotal}, 00`,
        <StatusPedido status={item.pedido.status} />,
        item.pedido.nucleo.name,
        action(item.pedido, item.list, item.statusPedido)
      )
    );
    setDataList(listFormat);
  }, [dataListPedido]);

  const handleClick = (event, pedido, list, statusPedido) => {
    setItemSelected({ pedido, list, statusPedido });
    setItemEdit({ pedido, list, statusPedido });
    setAnchorEl(event.currentTarget);
  };
  function handleClickView(event, pedido, list, statusPedido) {
    setItemSelected({ pedido, list, statusPedido });
    setOpenView(true);
  }

  async function handleChangePage(event, newPage) {
    setPage(Number(newPage + 1));
    await getData(newPage + 1);
  }

  function handleDelete(status) {
    if (status === 'ok') {
      handleClose();
      callbackDelete('ok');
    }
    if (status === 'cancel') {
      handleClose();
      callbackDelete('cancel');
    }
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  function callbackEditSalve(result) {
    if (result === 'cancel') {
      setOpenModalEdit(false);
      handleClose();
      return;
    }
    setOpenModalEdit(false);
    handleClose();
    setCarregar(true);
  }

  function handleEdit() {
    setOpenModalEdit(true);
    handleClose();
  }

  const action = (pedido, list, statusPedido) => {
    if (pedido.status === 0 || user.admin) {
      return (
        <IconButton
          color='primary'
          aria-label=' menu'
          component='span'
          onClick={(e) => handleClick(e, pedido, list, statusPedido)}
        >
          <MenuIcon />
        </IconButton>
      );
    } else {
      return (
        <IconButton
          color='primary'
          aria-label='view pedido'
          component='span'
          onClick={(e) => handleClickView(e, pedido, list, statusPedido)}
        >
          <Visibility />
        </IconButton>
      );
    }
  };

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
    if (carregar) {
      setLoading(true);
      setCarregar(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      <IconButtonDelete
        url={'/pedido'}
        id={itemSelected ? itemSelected.pedido.id : 0}
        handleDelete={handleDelete}
        handleClose={handleClose}
      />
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
                  index === 1 || index === 2 || index === 4
                    ? classes.headerTableHide
                    : ''
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
                      className={
                        i === 1 || i === 2 || i === 4
                          ? classes.headerTableHide
                          : ''
                      }
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

      <EditPedido
        initValue={itemSelected ? itemSelected : itemEdit}
        openModal={openModalEdit}
        setOpenModal={setOpenModalEdit}
        callback={callbackEditSalve}
      />
      <ViewPedido
        openView={openView}
        close={() => setOpenView(false)}
        initValue={itemSelected ? itemSelected : itemEdit}
      />
    </Paper>
  );
  return section;
}
