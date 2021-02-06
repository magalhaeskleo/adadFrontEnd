import MomentUtils from '@date-io/moment';
import { IconButton, Typography } from '@material-ui/core/';
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
import { PlayArrow, Search } from '@material-ui/icons/';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import 'date-fns';
import moment from 'moment';
import 'moment/locale/pt-br';
import React, { useEffect, useState } from 'react';
import { IDENTIFICACAO } from '../../../../components/constants';
import LoadingPage from '../../../../components/LoadingPage';
import NucleoSelectPegadogia from '../../../../components/NucleoSelectPegadogia';
import { usePlano } from '../../../../context/app/plano';
import api from '../../../../service/api';
import ExecutePlano from './executePlano';

const columns = [
  { id: 'tema', label: 'Tema', maxWidth: 100, align: 'left' },
  { id: 'divisa', label: 'Divisa', maxWidth: 100, align: 'center' },
  { id: 'date', label: 'Data', maxWidth: 100, align: 'center' },
  { id: 'action', label: '', maxWidth: 50, align: 'right' },
];

function createData(id, tema, divisa, date, identificador, action) {
  return { id, tema, divisa, date, identificador, action };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: 10,
  },
  divSearch: {
    width: '100%',
    padding: 20,
    textAlign: 'center',
    display: 'inline-flex',
    justifyContent: 'center',

    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
      display: 'block',
    },
  },

  searchInline: {
    width: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },

  container: {
    maxHeight: '60vh',
  },
  date: {
    marginTop: 5,
    width: '20%',
    [theme.breakpoints.down('sm')]: {
      width: '95%',
    },
  },
  divNucleo: {
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      width: '95%',
    },
  },
  search: {
    backgroundColor: 'white',
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
  },
  btnSearch: {
    marginRight: 20,
    width: '15%',
    [theme.breakpoints.down('sm')]: {
      width: '95%',
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
  divWhitesmoke: {
    height: 60,
    width: 2,
    backgroundColor: 'whitesmoke',
    marginRight: 20,
    [theme.breakpoints.down('sm')]: {
      height: 2,
      width: '100%',
      marginTop: 20,
    },
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
  const { user } = usePlano();
  const [dataList, setDataList] = useState([]);

  const [total, setTotal] = useState(0);
  const [nucleoid, setNucleoId] = useState(
    !user.admin || user.perfilid !== 8 ? user.nucleoid : 1
  );
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedYear, setSelectedYear] = useState(moment());

  const [openModal, setOpenModal] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState('');
  const [loading, setLoading] = useState(false);

  function callbackAddPlano(status) {
    if (status === 'ok') {
      setOpenModal(false);
      getData(1);
    }
  }

  async function handleOpenExecute(event, item) {
    const { data } = await api.get(`/turma/${item.id}`);
    let newItem = '';

    if (!data.result) {
      newItem = { ...item, ...data };
    } else {
      newItem = item;
    }
    setItemSelecionado(newItem);
    setOpenModal(true);
  }

  const handleDateChange = (date) => {
    setSelectedYear(moment());
    setSelectedDate(date._d);
  };

  async function handleYearChange(date) {
    setSelectedYear(date);
    const listFilter = await api.get('planoAula/year', {
      params: {
        date: moment(date).format('YYYY-MM-DD'),
        nucleoid: nucleoid,
      },
    });

    setTotal(listFilter.data.total);

    if (listFilter.data.list.length > 0) {
      const listFormat = listFilter.data.list.map((item) =>
        createData(
          item.id,
          item.tema,
          item.divisa,
          moment(item.date).format('DD/MM/YYYY'),
          item.identificador,
          action(item)
        )
      );
      setDataList(listFormat);
    } else {
      setDataList([]);
    }
  }

  async function handleFilter() {
    const listFilter = await api.get('planoAula/filter', {
      params: {
        date: moment(selectedDate).format('YYYY-MM-DD'),
        nucleoid: nucleoid,
      },
    });

    setTotal(listFilter.data.total);

    if (listFilter.data.list.length > 0) {
      const listFormat = listFilter.data.list.map((item) =>
        createData(
          item.id,
          item.tema,
          item.divisa,
          moment(item.date).format('DD/MM/YYYY'),
          item.identificador,
          action(item)
        )
      );
      setDataList(listFormat);
    } else {
      setDataList([]);
    }
  }
  async function handleChangePage(event, newPage) {
    setPage(Number(newPage + 1));
    await getData(newPage + 1);
  }

  const action = (item) => (
    <IconButton
      color='primary'
      aria-label='upload picture'
      component='span'
      style={{ color: 'white' }}
      onClick={(e) => handleOpenExecute(e, item)}
    >
      <PlayArrow />
    </IconButton>
  );

  async function getData(newPage) {
    const listFilter = await api.get('planoAula/year', {
      params: {
        page: newPage,
        date: moment(selectedYear).format('YYYY-MM-DD'),
        nucleoid: nucleoid,
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTotal(listFilter.data.total);

    if (listFilter.data.list.length > 0) {
      const listFormat = listFilter.data.list.map((item) =>
        createData(
          item.id,
          item.tema,
          item.divisa,
          moment(item.date).format('DD/MM/YYYY'),
          item.identificador,
          action(item)
        )
      );
      setDataList(listFormat);
    } else {
      setDataList([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getData(1);
    // setCarregar(false);
  }, []);

  function callbackNucleo(nucleo) {
    setNucleoId(nucleo);
  }
  const dateInput = (
    <MuiPickersUtilsProvider
      libInstance={moment}
      utils={MomentUtils}
      locale='pt-br'
    >
      <KeyboardDatePicker
        disableToolbar
        autoOk
        className={classes.date}
        views={['year', 'month']}
        variant='inline'
        id='date-picker'
        label='Data'
        value={selectedDate}
        invalidDateMessage='Data em formato inválido.'
        onChange={handleDateChange}
      />
    </MuiPickersUtilsProvider>
  );
  const yearInput = (
    <MuiPickersUtilsProvider
      libInstance={moment}
      utils={MomentUtils}
      locale='pt-br'
    >
      <KeyboardDatePicker
        autoOk
        disableToolbar
        className={classes.date}
        views={['year']}
        variant='inline'
        id='year-picker'
        label='Ano'
        value={selectedYear}
        invalidDateMessage='Data em formato inválido.'
        onChange={handleYearChange}
      />
    </MuiPickersUtilsProvider>
  );
  const search = (
    <div className={classes.divSearch}>
      <div className={classes.btnSearch}>
        <Fab color='primary' aria-label='add' onClick={handleFilter}>
          <Search />
        </Fab>
      </div>
      {dateInput}
      <div className={classes.divNucleo}>
        <NucleoSelectPegadogia callbackNucleo={callbackNucleo} />
      </div>

      <div className={classes.divWhitesmoke} />
      {yearInput}
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
          {dataList.map((row, index) => (
            <TableRow
              key={index}
              style={{
                background: IDENTIFICACAO.find(
                  (i) => i.id === row.identificador
                ).color,
              }}
            >
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
                    <Typography variant='subtitle1' style={{ color: 'white' }}>
                      {value}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
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
      <ExecutePlano
        openModal={openModal}
        onClose={() => setOpenModal(false)}
        itemSelecionado={itemSelecionado}
        callback={callbackAddPlano}
      />
    </Paper>
  );

  return section;
}
/**  {loadingData ? <LoadingPage /> : tableList} */
