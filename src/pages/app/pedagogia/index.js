import {
  Button,
  Card,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Description, MeetingRoom, ShowChart } from '@material-ui/icons';
import React, { useState } from 'react';
import { PlanoProvider } from '../../../context/app/plano';
import DocAuxiliar from './docs/docauxiliar';
import PlanoDeAula from './planodeaula/index';
import Turmas from './turmas/index';

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
    width: '22%',
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

export default function Pedagogia() {
  const classes = useStyles();
  const [pageSelected, setPageSelected] = useState('');

  const width = { tudo: 'xl', lateral: 'md', pequeno: 'sm' };

  const PAGES = {
    plano: <PlanoDeAula setPageReturn={() => setPageSelected('')} />,
    docAux: <DocAuxiliar setPageReturn={() => setPageSelected('')} />,
    turmas: <Turmas setPageReturn={() => setPageSelected('')} />,
  };

  const cardTitle = (title, icon, color, handleClick) => (
    <div
      id='card_'
      className={classes.fullSm}
      style={{ display: pageSelected && 'none' }}
    >
      <Card style={{ height: 120 }}>
        <div
          style={{
            // display: 'inline-flex',
            alignItems: 'center',
            padding: 10,
            width: '100%',
            justifyContent: 'space-around',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div
              className={classes.circleIcon}
              style={{ backgroundColor: color }}
            >
              {icon}
            </div>
            <Typography variant='subtitle2' style={{ color: '#5D6D7E' }}>
              {title}
            </Typography>
          </div>
          <div>
            <Button
              color='primary'
              variant='outlined'
              onClick={handleClick}
              style={{
                marginBottom: 10,
                color: color,
                border: '1px solid',
                borderColor: color,
              }}
            >
              Acessar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const section = (
    <PlanoProvider>
      <Container
        maxWidth={width.tudo}
        style={{
          minHeight: '80vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div id='cardContainer' className={classes.root}>
          {cardTitle(
            'Plano de Aulas',

            <ShowChart className={classes.iconStyle} />,
            '#A06B9C',
            () => setPageSelected(PAGES.plano)
          )}
          {cardTitle(
            'Doc Auxiliares',

            <Description className={classes.iconStyle} />,
            '#1f6f45',
            () => setPageSelected(PAGES.docAux)
          )}
          {cardTitle(
            'Turmas',

            <MeetingRoom className={classes.iconStyle} />,
            '#2DB6C4',
            () => setPageSelected(PAGES.turmas)
          )}
        </div>

        {pageSelected}
      </Container>
    </PlanoProvider>
  );
  return section;
}
