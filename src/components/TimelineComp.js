import { makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { COLOR_STATUS_PEDIDO } from './constants';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'inline-flex',
    textAlign: 'center',
    width: '100%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'whitesmoke',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      textAlign: 'left',
    },
  },

  connector: {
    width: 80,
    height: 2,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 7,
    backgroundColor: 'silver',

    [theme.breakpoints.down('xs')]: {
      width: 2,
      height: 80,
    },
  },
}));

const now = new Date();
const formatDate = `${
  now.getDate() < 9 ? '0' + now.getDate() : now.getDate()
}/${
  now.getMonth() < 9 ? '' + now.getMonth() + 1 : now.getMonth()
}/${now.getFullYear()}`;

export default function TimelineComp({ statusPedido }) {
  const classes = useStyles();
  const [statusHistory, setStatusHistory] = useState();
  const [statusNew] = useState([formatDate, '0', '0', '0', '0']);

  const Connector = <div className={classes.connector} />;

  useEffect(() => {
    if (statusPedido) {
      setStatusHistory(statusPedido);
    } else {
      setStatusHistory(statusNew);
    }
  }, []);

  const separator = (numberColunm) => (
    <div>
      <Typography variant='subtitle2' align='left'>
        {statusHistory && statusHistory[numberColunm]}
      </Typography>

      <div
        id='timeItem'
        style={{
          display: 'inline-flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'inline-flex' }}>
          <div
            style={{
              width: 15,
              height: 15,
              borderRadius: 30,
              backgroundColor: COLOR_STATUS_PEDIDO[numberColunm],
            }}
          />
          {numberColunm !== 4 && Connector}
        </div>
      </div>
    </div>
  );
  return (
    <div className={classes.container} id='container'>
      {separator(0)}
      {separator(1)}
      {separator(2)}
      {separator(3)}
      {separator(4)}
    </div>
  );
}
