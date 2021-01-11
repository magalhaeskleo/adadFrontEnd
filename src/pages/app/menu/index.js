import { Avatar, Typography } from '@material-ui/core/';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import {
  AttachMoney,
  BarChart,
  DoubleArrow,
  ExitToApp,
  Face,
  FormatListNumbered,
  HomeWork,
  PeopleAlt,
  School,
  Store,
} from '@material-ui/icons/';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { PERFIL_LIST } from '../../../components/constants';
import { PedidoProvider } from '../../../context/app/pedido';
import { useAuth } from '../../../context/auth';
import api from '../../../service/api';
import Dashboard from '../dashboard';
import Financeiro from '../financeiro';
import Nucleo from '../nucleo';
import Pedagogia from '../pedagogia';
import Pedidos from '../pedidos';
import People from '../people';
import Profile from '../profile';
import Secretaria from '../secretaria';
import Uniforme from '../uniformes';
import Usuarios from '../usuarios';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#f4f6f8',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },

  big: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },

  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

  menuButtonLogout: {
    marginRight: theme.spacing(2),
  },
  // necessário para que o conteúdo esteja abaixo da barra do aplicativo

  toolbar: theme.mixins.toolbar,

  toolbarIcons: {
    marginRight: theme.spacing(-3),
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-end',
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));
const menuAdmin = [
  { id: 7, name: 'Núcleo', icon: <HomeWork /> },
  {
    id: 8,
    name: 'Uniformes',
    icon: <DoubleArrow style={{ transform: 'rotate(90deg)' }} />,
  },
  { id: 9, name: 'Usuários', icon: <PeopleAlt /> },
];

const menuItens = [
  { id: 1, name: 'Dashboard', icon: <BarChart /> },
  { id: 2, name: 'Matrículas', icon: <Face /> },
  { id: 3, name: 'Secretaria', icon: <Store /> },

  { id: 4, name: 'Pedagogia', icon: <School /> },
  {
    id: 5,
    name: 'Pedidos',
    icon: <FormatListNumbered />,
  },

  { id: 6, name: 'Financeiro', icon: <AttachMoney /> },
];

function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [pageSelected, setPageSelected] = useState(user.perfilid === 8 ? 3 : 0);

  const [pageList] = useState([
    <Dashboard />,
    <People />,
    <Secretaria />,
    <Pedagogia />,
    <PedidoProvider>
      <Pedidos />,
    </PedidoProvider>,
    <Financeiro />,
    <Nucleo />,
    <Uniforme />,
    <Usuarios />,
    <Profile />,
  ]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <div style={{ textAlign: '-webkit-center', marginTop: 20 }}>
          <Fab
            color='primary'
            onClick={() => setPageSelected(pageList.length - 1)}
            style={{ marginBottom: 10 }}
          >
            <Avatar
              alt='Remy Sharp'
              src={`${api.defaults.baseURL}/uploads/${user.avatar}`}
              className={classes.big}
            />
          </Fab>

          <Typography variant='subtitle2'>{user.fullName}</Typography>
          <Typography variant='inherit' color='textSecondary'>
            {PERFIL_LIST[user.perfilid].name}
          </Typography>
        </div>
      </div>
      <Divider />
      <List>
        {user.perfilid !== 8 ? (
          menuItens.map((item) => (
            <ListItem
              button
              key={item.id}
              style={{
                backgroundColor: item.id === pageSelected + 1 && '#CED8F6',
              }}
              onClick={() => setPageSelected(item.id - 1)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))
        ) : (
          <ListItem
            button
            key={1}
            style={{
              backgroundColor: 1 === pageSelected + 1 && '#CED8F6',
            }}
            onClick={() => setPageSelected(3)}
          >
            <ListItemIcon>
              <School />
            </ListItemIcon>
            <ListItemText primary={'Pedagogia'} />
          </ListItem>
        )}
        {user.admin && user.perfilid !== 8 && (
          <>
            <ListItem
              button
              key={menuAdmin[0].id}
              style={{
                backgroundColor:
                  menuAdmin[0].id === pageSelected + 1 && '#CED8F6',
              }}
              onClick={() => setPageSelected(menuAdmin[0].id - 1)}
            >
              <ListItemIcon>{menuAdmin[0].icon}</ListItemIcon>
              <ListItemText primary={menuAdmin[0].name} />
            </ListItem>
            <ListItem
              button
              key={menuAdmin[1].id}
              style={{
                backgroundColor:
                  menuAdmin[1].id === pageSelected + 1 && '#CED8F6',
              }}
              onClick={() => setPageSelected(menuAdmin[1].id - 1)}
            >
              <ListItemIcon>{menuAdmin[1].icon}</ListItemIcon>
              <ListItemText primary={menuAdmin[1].name} />
            </ListItem>

            <ListItem
              button
              key={menuAdmin[2].id}
              style={{
                backgroundColor:
                  menuAdmin[2].id === pageSelected + 1 && '#CED8F6',
              }}
              onClick={() => setPageSelected(menuAdmin[2].id - 1)}
            >
              <ListItemIcon>{menuAdmin[2].icon}</ListItemIcon>
              <ListItemText primary={menuAdmin[2].name} />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar className={classes.toolbarIcons}>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color='inherit'
            aria-label='logout'
            edge='end'
            onClick={logout}
            className={classes.menuButtonLogout}
          >
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label='mailbox folders'>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation='css'>
          <Drawer
            container={container}
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant='permanent'
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {pageList[pageSelected]}
      </main>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
