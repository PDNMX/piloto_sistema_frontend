import React, { useState } from 'react';
import Header from "../Header/Header"
import Paper from "@material-ui/core/Paper";
import clsx from 'clsx';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import InputLabel from '@material-ui/core/InputLabel';
import Grid from "@material-ui/core/Grid";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import {requestSchemaS2Creation} from '../../store/mutations'
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
//import { ListaPrincipal, ListaSecundaria } from './ItemsPrincipal';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MenuItem from '@material-ui/core/MenuItem';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import BallotIcon from '@material-ui/icons/Ballot';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import BorderColorIcon from '@material-ui/icons/BorderColor';
//import CerrarSesion from './CerrarSesion';
import LOGO from "../assets/pdn.png";
import { ConnectedCreateProvider } from '../providers/CreateProvider';
import {Main} from "../Main";
import {history} from "../../store/history";
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';

export const MenuV = () => {


  //MSubmenus
  const [submenuAdmonDatos,setsubmenuAdmonDatos]=useState(false);
  const [submenuUsuario,setsubMenuUsuario]=useState(false);
  const [submenuBitacora,setsubMenuBitacora]=useState(false);
  const [crearProovedor,setcrearProovedor]=useState(false);

  const menuDatos=(e)=>{
    setsubmenuAdmonDatos(true);
    setsubMenuUsuario(true);
    setsubMenuBitacora(false);
    setcrearProovedor(false);
    setCheckedDatos((prev) => !prev);
    setCheckedBitacora((prev) => false);
    setCheckedUser((prev) => false);
  }


  const menuUser=(e)=>{
    setsubmenuAdmonDatos(false);
    setsubMenuUsuario(true);
    setsubMenuBitacora(false);
    setcrearProovedor(false);
    setCheckedUser((prev) => !prev);
    setCheckedBitacora((prev) => false);
    setCheckedDatos((prev) => false);

  }

  const menuBitacora=(e)=>{
    setsubmenuAdmonDatos(false);
    setsubMenuBitacora(true);
    setsubMenuUsuario(false);
    setcrearProovedor(false);
    setCheckedBitacora((prev) => !prev);
    setCheckedUser((prev) => false);
    setCheckedDatos((prev) => false);
  }

  const compCrearProovedor=(e)=>{
    setcrearProovedor(true);
  }

  const redirectToRoute = (path) =>{
      history.push(path);
  }

  //Cerrar sesión
  const [anchorEl, setAnchorEl] = useState(null);

  //Mostrar opciones de cerrar sesión
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //Cerrar opciones de cerrar sesión
  const handleClose = () => {
    setAnchorEl(null);
  };

    function Copyright() {
      return (
        <Typography variant="body2" className={classes.fontblack} align="center">
          {'PDN Copyright © '}
          
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      );
    }
    
  const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
      root: {
        display: 'flex',
      },
      toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
      },
      toolbarIcon: {
        backgroundImage: `url(${LOGO})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "contain",
            
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
      },
      appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#34b3eb',
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      menuButton: {
        marginRight: 36,
      },
      menuButtonHidden: {
        display: 'none',
      },
      title: {
        flexGrow: 1,
        textAlign: 'center',
      },
      drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      },
      appBarSpacer: theme.mixins.toolbar,
      content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      },
      container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
      },
      paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      },
        paperPadding: {
            padding: theme.spacing(2),
        },
      fixedHeight: {
        height: 240,
      },
      fontblack:{
        color: '#666666'
      },
      colorico:{
        color: '#ffffff'
      },
      submenuicono:{
        paddingLeft:'15px',
        backgroundColor:'#eee'
      }

    }));

    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const [checkedBitacora, setCheckedBitacora] = useState(false);
    const [checkedUser, setCheckedUser] = useState(false);
    const [checkedDatos, setCheckedDatos] = useState(false);

    const handleDrawerOpen = () => {
      setOpen(true);
    };
    const handleDrawerClose = () => {
      setOpen(false);
    };
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);



    return (

        <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Sistema de Carga de datos S2 y S3
          </Typography>
            <div>
              <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <BallotIcon className={classes.colorico} fontSize="large" />
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Perfil</MenuItem>
                <MenuItem onClick={handleClose}>Avanzadas</MenuItem>
                <MenuItem onClick={handleClose}>Cerrar sesión</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List className={classes.fontblack}>
          <div>
          <ListItem button onClick={e=>menuDatos(e)}>
              <ListItemIcon>
                  <FolderSpecialIcon />
              </ListItemIcon>
              <ListItemText  primary="Administración datos" />
          </ListItem>

            { submenuAdmonDatos ?
              <Collapse in={checkedDatos}>
                <div>
                  <Tooltip title="Administrador datos" placement="right">
                    <ListItem button className={classes.submenuicono} >
                      <ListItemIcon>
                        <ArrowForwardIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Administrador datos" />
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Carga datos" placement="right">
                    <ListItem button className={classes.submenuicono} onClick={ () => redirectToRoute("/cargamasiva")}>
                      <ListItemIcon>
                        <ArrowForwardIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Carga datos" />
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Captura datos" placement="right">
                    <ListItem button className={classes.submenuicono} >
                      <ListItemIcon>
                        <ArrowForwardIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Captura datos" />
                    </ListItem>
                  </Tooltip>
                </div>
              </Collapse>
          : ""
        }
            <ListItem button onClick={e=>menuUser(e)}>
              <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
              <ListItemText  primary="Usuarios" />
              </ListItem>

              { submenuUsuario ?
              <Collapse in={checkedUser}>
                <div>
                  <Tooltip title="Crear usuario" placement="right">
                    <ListItem button className={classes.submenuicono} onClick={ () => redirectToRoute("/usuario/crear")}>
                      <ListItemIcon>
                        <ArrowForwardIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Crear usuario" />
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Listado de usuarios" placement="right">
                    <ListItem button className={classes.submenuicono} onClick={ () => redirectToRoute("/usuarios")}>
                      <ListItemIcon>
                        <ArrowForwardIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Listado de usuarios" />
                    </ListItem>
                  </Tooltip>
                </div>
              </Collapse>
          : ""
        }
            <ListItem button onClick={e=>menuBitacora(e)}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Proveedores" />
            </ListItem>

            { submenuBitacora ?
              <Collapse in={checkedBitacora}>
                <div>
                  <Tooltip title="Crear proveedor" placement="right">
                    <ListItem button className={classes.submenuicono} onClick={ () => redirectToRoute("/proveedor/crear")}>
                      <ListItemIcon>
                        <ArrowForwardIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Crear proveedor" />
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Lista Proveedores" placement="right">
                  <ListItem button className={classes.submenuicono} onClick={ () => redirectToRoute("/proveedores")}>
                    <ListItemIcon>
                      <ArrowForwardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Lista Proveedores" />
                  </ListItem>
                  </Tooltip>
                </div>
              </Collapse>
          : ""
        }
          </div>
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Grid 1 */}
            <Grid item xs={12} md={12} lg={12}>
              <Paper className={classes.paperPadding} >
                  <Main/>
                {crearProovedor ? <ConnectedCreateProvider /> : ""}
              </Paper>
            </Grid>
            {/* Grid 2 
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                
              </Paper>
            </Grid>
              Grid 3 *
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                
              </Paper>
            </Grid>*/}
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  
    );

}

