import { Paper, Table, Typography } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import { IDENTIFICACAO } from '../../../components/constants';
import StatusIdentificador from '../../../components/StatusIdentificador';

const columns = [
  {
    id: 'item',
    label: 'Item',
    maxWidth: 50,
    align: 'left',
  },
  { id: 'tamanho', label: 'Tamanho', maxWidth: 70, align: 'center' },
  { id: 'quantidade', label: 'Quantidade', maxWidth: 40, align: 'center' },
  {
    id: 'identificador',
    label: 'Identificador',
    maxWidth: 100,
    align: 'center',
  },
];

function createData(ordem, item, tamanho, quantidade, identificador) {
  return {
    ordem,
    item,
    tamanho,
    quantidade,
    identificador,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    width: '100%',
    maxHeight: '60vh',
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

export default function TableItensPedidosStatico({ listItens }) {
  const classes = useStyles();
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const listFormat =
      listItens.length > 0
        ? listItens.map((item) => {
            const colorId = IDENTIFICACAO.find(
              (i) => i.id === item.identification
            ).color;

            return createData(
              item.index,
              item.name,
              <Typography variant='body2' style={{ color: colorId }}>
                {`${item.tamanho}-:-${item.numeracao}`}
              </Typography>,
              item.quantidade,
              <StatusIdentificador identification={item.identification} />
            );
          })
        : [];
    setDataList(listFormat);
  }, [listItens]);

  const tableList = (
    <TableContainer className={classes.container}>
      <Table stickyHeader aria-label='sticky table'>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={column.id}
                align={column.align}
                variant='head'
                className={index === 3 ? classes.headerTableHide : ''}
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
                      className={i === 3 ? classes.headerTableHide : ''}
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
  const section = <Paper className={classes.root}>{tableList}</Paper>;
  return section;
}
