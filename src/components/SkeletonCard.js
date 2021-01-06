import { makeStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  fullSm: {
    marginLeft: 10,
    marginTop: 10,
    width: '25%',
    texrtAlign: 'start',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

export default function Variants() {
  const classes = useStyles();
  return (
    <div id='card1' className={classes.fullSm}>
      <Skeleton variant='circle' width={60} height={60} />
      <Skeleton variant='rect' width={300} height={118} />
    </div>
  );
}
