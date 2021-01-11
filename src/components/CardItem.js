import {
  Button,
  Card,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { AttachFile, Language, Visibility } from '@material-ui/icons';
import React from 'react';
import api from '../service/api';

function getRandomColor(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var e = 0; e < 3; e++) {
    var value = (hash >> (e * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    justifyContent: 'flex-start',
    display: 'flex',
    flexWrap: 'wrap',

    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  fullSm: {
    marginLeft: 10,
    marginTop: 10,
    width: 310,
    // texrtAlign: 'start',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  iconStyle: {
    color: 'white',
    height: '100%',
  },
  cardaction: { marginBottom: 3, alignItems: 'center' },
  circleIcon: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginRight: 5,
    textAlign: 'center',
  },
}));

export default function CardItem({ icon, item, callback, handleVisualizar }) {
  const classes = useStyles();

  async function handleDelete(item) {
    const response = await api.delete(`/doc/${item.id}`);

    if (response.data) {
      await api.post('/file/delete', { file: item.urldoc });
      callback('ok');
    }
  }

  function handleViewFile(value) {
    return window.open(`${api.defaults.baseURL}/uploads/${value}`);
  }

  function handleNavigateToLink(value) {
    window.open(value);
  }

  return (
    <div
      id='card_'
      key={item.name}
      className={classes.fullSm}
      // style={{ display: pageSelected && 'none' }}
    >
      <Card>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: 10,
            width: '100%',
            justifyContent: 'space-between',

            // justifyContent: 'flex-start',
          }}
        >
          <div
            className={classes.circleIcon}
            style={{ backgroundColor: getRandomColor(item.name) }}
          >
            {icon}
          </div>
          <Typography
            variant='subtitle2'
            style={{ color: getRandomColor(item.name), maxWidth: 100 }}
          >
            {item.name}
          </Typography>
          <Button
            color='primary'
            variant='outlined'
            onClick={() => handleDelete(item)}
            style={{
              marginBottom: 3,
              color: getRandomColor(item.name),
              border: '1px solid',
              borderColor: getRandomColor(item.name),
            }}
          >
            Excluir
          </Button>
        </div>
        <div className={classes.cardaction}>
          <List component='nav' aria-label='main mailbox folders'>
            {item.urldoc && (
              <ListItem key={item.name}>
                <ListItemIcon>
                  <AttachFile style={{ color: 'red' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant='body2'>
                      {item.urldoc.slice(0, 20)}...
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleViewFile(item.urldoc)}>
                    <Visibility />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )}
            {item.link && (
              <>
                <Divider />
                <ListItem key={item.name}>
                  <ListItemIcon>
                    <Language style={{ color: 'blue' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant='body2'>
                        {item.link.slice(0, 20)}...
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleNavigateToLink(item.link)}>
                      <Visibility />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </>
            )}
          </List>
        </div>
      </Card>
    </div>
  );
}
