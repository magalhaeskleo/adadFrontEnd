import {
  Card,
  CardContent,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { AttachMoney, FormatListNumbered, People } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import SkeletonCard from '../../../components/SkeletonCard';
import { PeopleProvider } from '../../../context/app/people';
import api from '../../../service/api';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    justifyContent: 'flex-start',
    display: 'inline-flex',

    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  fullSm: {
    marginLeft: 10,
    marginTop: 10,
    width: '25%',
    texrtAlign: 'start',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  iconStyle: {
    color: 'white',
    height: '100%',
  },
  circleIcon: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginRight: 5,
    textAlign: 'center',
  },
}));

export default function Uniforme() {
  const width = { tudo: 'xl', lateral: 'md', pequeno: 'sm' };
  const classes = useStyles();
  const [concluidos, setConcluidos] = useState(0);
  const [verificando, setVerificando] = useState(0);
  const [matriculas, setMatriculas] = useState(0);
  const [loading, setLoading] = useState(false);

  async function getStatuPedido() {
    const resp = await api.get('/pedido/statusList');
    if (resp.data) {
      setConcluidos(resp.data.concluidos);
      setVerificando(resp.data.verificando);
    }
  }

  async function getMatriculasEfetuadas() {
    const resp = await api.get('/personal/matriculas');
    console.log('resp', resp.data);
    if (resp.data) {
      setMatriculas(resp.data.length);
    }
  }

  const cardTitle = (title, icon, color) => (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: 10,
        width: '100%',
      }}
    >
      <div className={classes.circleIcon} style={{ backgroundColor: color }}>
        {icon}
      </div>
      <Typography variant='subtitle2' style={{ color: '#5D6D7E' }}>
        {title}
      </Typography>
    </div>
  );

  const card = (title, value, icon, color) => (
    <div id='card1' className={classes.fullSm}>
      <Card>
        {cardTitle(title, icon, color)}
        <CardContent>
          <Typography variant='h4' align='center' style={{ color: '#5D6D7E' }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );

  const section = (
    <PeopleProvider>
      <Container
        maxWidth={width.tudo}
        style={{
          minHeight: '80vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div id='cardContainer' className={classes.root}>
          {card(
            'Matrículas',
            matriculas,
            <People className={classes.iconStyle} />,
            '#1B6692'
          )}
          {card(
            'Caixa',
            'R$ 500, 00',
            <AttachMoney className={classes.iconStyle} />,
            '#B92E58'
          )}
          {card(
            'Pedidos em verificação',
            verificando,
            <FormatListNumbered className={classes.iconStyle} />,
            '#ff8533'
          )}
          {card(
            'Pedidos concluídos',
            concluidos,
            <FormatListNumbered className={classes.iconStyle} />,
            '#127A35'
          )}
        </div>
      </Container>
    </PeopleProvider>
  );

  useEffect(() => {
    setLoading(true);
    async function getDatas() {
      getStatuPedido();
      getMatriculasEfetuadas();
      await new Promise((res) => setTimeout(res, 1000));
      setLoading(false);
    }
    getDatas();
  }, []);
  const skeleton = (
    <div id='cardContainer' className={classes.root}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );

  return loading ? skeleton : section;
}
