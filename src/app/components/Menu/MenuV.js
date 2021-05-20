import React, { useState } from 'react';
import Paper from "@material-ui/core/Paper";
import clsx from 'clsx';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MenuItem from '@material-ui/core/MenuItem';
import BallotIcon from '@material-ui/icons/Ballot';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import LOGO from "../assets/pdn.png";
import { ConnectedCreateProvider } from '../providers/CreateProvider';
import {history} from "../../store/history";
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';
import {LoadFileV} from "../UploadFile/LoadFileV";
import {connect} from "react-redux";
import {ConnectedCreateUser} from "../users/createUser";
import {ListUser} from "../users/listUser";
import {ListProvider} from "../providers/ListProvider";
import {ConnectedCreateReg} from "../CargaDatos/createReg"
import { useLocation } from 'react-router-dom'
import {userActions} from "../../_actions/user.action";
import {ListS2Schema} from "../CargaDatos/listSchemaS2";
import {ConnectedConsultarBitacora} from "../Bitacora/ConsultarBitacora";
import {ListBitacora} from "../Bitacora/ListBitacora";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import {ListS3SSchema} from "../CargaDatos/listSchemaS3S";
import {ListS3PSchema} from "../CargaDatos/listSchemaS3P";
import {ConnectedCreateRegS3S} from "../CargaDatos/createRegS3S";
import {ConnectedChangePassword} from "../users/changePassword";
import {useSelector} from 'react-redux';
import {ConnectedCreateRegS3P} from "../CargaDatos/createRegS3P";
import FolderIcon from '@material-ui/icons/Folder';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import PublishIcon from '@material-ui/icons/Publish';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

export const MenuV =({ vistaRender, match , closeSession }) => {

    const {vigencia, permisos} = useSelector(state => ({
        vigencia:state.vigencia,
        permisos:state.permisos
    }));

    const location = useLocation();

    //MSubmenus
    const [submenuAdmonDatos,setsubmenuAdmonDatos]=useState(false);
    const [submenuUsuario,setsubMenuUsuario]=useState(false);
    const [submenuBitacora,setsubMenuBitacora]=useState(false);
    const [crearProovedor,setcrearProovedor]=useState(false);
    const [submenuAdmonDatosS2,setsubmenuAdmonDatosS2]=useState(false);

    const menuDatos=(e)=>{
        setsubmenuAdmonDatos(true);
        setsubMenuUsuario(true);
        setsubMenuBitacora(false);
        setcrearProovedor(false);
        setCheckedDatos((prev) => !prev);
        setCheckedBitacora((prev) => false);
        setCheckedUser((prev) => false);
        setcrearProovedor(false);
    }


    const menuUser=(e)=>{
        setsubmenuAdmonDatos(false);
        setsubMenuUsuario(true);
        setsubMenuBitacora(false);
        setcrearProovedor(false);
        setCheckedUser((prev) => !prev);
        setCheckedBitacora((prev) => false);
        setCheckedDatos((prev) => false);
        setcheckedDatos2((prev) => false);
        setcheckedDatosS3S((prev) => false);
        setcheckedDatosS3P((prev) => false);
        setcheckedAdminDatos2((prev) => false);
        setcheckedAdminDatosS3S((prev) => false);
        setcheckedAdminDatosS3P((prev) => false);

    }

    const menuProveedor=(e)=>{
        setsubmenuAdmonDatos(false);
        setsubMenuUsuario(false);
        setcrearProovedor(true);
        setCheckedProveedor((prev) => !prev);
        setCheckedUser((prev) => false);
        setCheckedDatos((prev) => false);
        setCheckedBitacora((prev) => false);
        setsubMenuBitacora(false);
        setcheckedDatos2((prev) => false);
        setcheckedDatosS3S((prev) => false);
        setcheckedDatosS3P((prev) => false);
        setcheckedAdminDatos2((prev) => false);
        setcheckedAdminDatosS3S((prev) => false);
        setcheckedAdminDatosS3P((prev) => false);
    }

    const menuBitacora=(e)=>{
        setsubmenuAdmonDatos(false);
        setsubMenuBitacora(true);
        setsubMenuUsuario(false);
        setcrearProovedor(false);
        setCheckedBitacora((prev) => !prev);
        setCheckedUser((prev) => false);
        setCheckedDatos((prev) => false);
        setCheckedProveedor((prev) => false);
        setcheckedDatos2((prev) => false);
        setcheckedDatosS3S((prev) => false);
        setcheckedDatosS3P((prev) => false);
        setcheckedAdminDatos2((prev) => false);
        setcheckedAdminDatosS3S((prev) => false);
        setcheckedAdminDatosS3P((prev) => false);

        history.push("/bitacora");

    }

    const menuDatos2=(e)=>{
        setsubmenuAdmonDatos(true);
        setsubMenuBitacora(false);
        setsubMenuUsuario(false);
        setcrearProovedor(false);
        setCheckedBitacora((prev) => false);
        setCheckedUser((prev) => false);
        setCheckedDatos(true);
        setCheckedProveedor((prev) => false);
        setcheckedDatos2((prev) => !prev);
        setcheckedDatosS3S((prev) => !prev);
        setcheckedDatosS3P((prev) =>  !prev);
        setcheckedAdminDatos2((prev) => false);
        setcheckedAdminDatosS3S((prev) => false);
        setcheckedAdminDatosS3P((prev) => false);

    }

    const menuAdminDatos2=(e)=>{
        setsubmenuAdmonDatos(true);
        setsubMenuBitacora(false);
        setsubMenuUsuario(false);
        setcrearProovedor(false);
        setCheckedBitacora((prev) => false);
        setCheckedUser((prev) => false);
        setCheckedDatos(true);
        setCheckedProveedor((prev) => false);
        setcheckedDatos2((prev) => false);
        setcheckedDatosS3S((prev) => false);
        setcheckedDatosS3P((prev) => false);
        setcheckedAdminDatos2((prev) => !prev);
        setcheckedAdminDatosS3S((prev) => !prev);
        setcheckedAdminDatosS3P((prev) => !prev);
    }

    const compCrearProovedor=(e)=>{
        setcrearProovedor(true);
    }


    const rol=localStorage.getItem("rol");

    const redirectToRoute = (path) =>{
        const cambiarcontrasena= localStorage.getItem("cambiarcontrasena");
        if(vigencia===true || cambiarcontrasena===true){
            history.push("/usuario/cambiarcontrasena");
        }else{
            history.push(path);
        }

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


    const cerrarSesion  = () => {
        closeSession();
    }


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
            marginTop:'5px',
            marginBottom: '5px'
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
            backgroundColor:'#ffff'
        },
        submenuicono2:{
            backgroundColor:'#eee'
        },
        itemOne:{
            color:'#34b3eb'
        },
        itemTwo:{
            color:'#9ACA83'
        },
        itemThree:{
            color:'#67BFB7'
        },
        itemIcon:{
            minWidth:'35px'
        }

    }));

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [checkedBitacora, setCheckedBitacora] = useState(false);
    const [checkedUser, setCheckedUser] = useState(false);
    const [checkedDatos, setCheckedDatos] = useState(false);
    const [checkedProveedor, setCheckedProveedor] = useState(false);
    const [checkedDatos2, setcheckedDatos2] = useState(false);
    const [checkedDatosS3S, setcheckedDatosS3S] = useState(false);
    const [checkedDatosS3P, setcheckedDatosS3P] = useState(false);
    const [checkedAdminDatos2, setcheckedAdminDatos2] = useState(false);
    const [checkedAdminDatosS3S, setcheckedAdminDatosS3S] = useState(false);
    const [checkedAdminDatosS3P, setcheckedAdminDatosS3P] = useState(false);

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
                        {'Sistema de Carga de Datos'}<br/>
                        {'S2 y S3'}
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
                            <MenuItem onClick={ () => redirectToRoute("/usuario/cambiarcontrasena")} >Cambiar contraseña</MenuItem>
                            <MenuItem onClick={ ()=>cerrarSesion()}>Cerrar sesión</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                variant={"persistent"}
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon} onClick={handleDrawerClose}/>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon className={classes.itemOne}/>
                </IconButton>
                <Divider />
                <List className={classes.fontblack}>
                        { rol==2 || rol=="" ?
                            <Tooltip title="Administrador datos" placement="right">
                                <ListItem button className={classes.submenuicono} onClick={e=>menuAdminDatos2(e)} key={'m1'}>
                                    <ListItemIcon className={classes.itemIcon}>
                                        <FolderIcon className={classes.itemOne}/>
                                    </ListItemIcon>
                                    <ListItemText primary="Administrador datos" />
                                </ListItem>
                            </Tooltip>
                            : ""
                        }
                        {permisos.map(item => (
                            item==="S2" ?
                                <Collapse in={checkedAdminDatos2} key="S2">
                                    <div>
                                        <Tooltip title="Servidores Públicos que Intervienen en Procedimientos de Contratación" placement="right">
                                            <ListItem button className={classes.submenuicono2} onClick={ () => redirectToRoute("/consulta/S2")} key={'m1s2'}>
                                                <ListItemIcon className={classes.itemIcon}>
                                                    <ArrowRightIcon fontSize="small" className={classes.itemOne} />
                                                </ListItemIcon>
                                                <ListItemText secondary="S.P. en Contrataciones" />
                                            </ListItem>
                                        </Tooltip>
                                    </div>
                                </Collapse>
                                : ""
                        ))}
                        {permisos.map(item => (
                            item==="S3S" ?
                                <Collapse in={checkedAdminDatosS3S} key="S3S">
                                    <div>
                                        <Tooltip title="Servidores Públicos Sancionados" placement="right">
                                            <ListItem button className={classes.submenuicono2} onClick={ () => redirectToRoute("/consulta/S3S")} key={'m1s3s'}>
                                                <ListItemIcon className={classes.itemIcon}>
                                                    <ArrowRightIcon fontSize="small" className={classes.itemOne}/>
                                                </ListItemIcon>
                                                <ListItemText secondary="Servidores Sancionados" />
                                            </ListItem>
                                        </Tooltip>
                                    </div>
                                </Collapse>
                                : ""
                        ))}
                        {permisos.map(item => (
                            item==="S3P" ?
                                <Collapse in={checkedAdminDatosS3P} key="S3P">
                                    <div>
                                        <Tooltip title="Particulares Sancionados" placement="right">
                                            <ListItem button className={classes.submenuicono2} onClick={ () => redirectToRoute("/consulta/S3P")} key={'m1s3p'}>
                                                <ListItemIcon className={classes.itemIcon}>
                                                    <ArrowRightIcon fontSize="small" className={classes.itemOne} />
                                                </ListItemIcon>
                                                <ListItemText secondary="Particulares Sancionados" />
                                            </ListItem>
                                        </Tooltip>
                                    </div>
                                </Collapse>
                                : ""
                        ))}
                        {
                            rol ==2 || rol =="" ?
                                <Tooltip title="Cargar datos" placement="right">
                                    <ListItem button className={classes.submenuicono} onClick={ () => redirectToRoute("/cargamasiva")} key={'m2'}>
                                        <ListItemIcon className={classes.itemIcon}>
                                            <PublishIcon className={classes.itemTwo} />
                                        </ListItemIcon>
                                        <ListItemText primary="Cargar datos" />
                                    </ListItem>
                                </Tooltip> :""

                        }
                        {
                            rol == 2 || rol == "" ?
                                <Tooltip title="Capturar datos" placement="right">
                                    <ListItem button className={classes.submenuicono} onClick={e=>menuDatos2(e)} key={'m3'}>
                                        <ListItemIcon className={classes.itemIcon}>
                                            <KeyboardIcon className={classes.itemThree}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Capturar datos" />
                                    </ListItem>
                                </Tooltip> : ""
                        }
                        {permisos.map(item => (
                            item==="S2" ?
                                <Collapse in={checkedDatos2} key="S2">
                                    <div>
                                        <Tooltip title="Servidores Públicos que Intervienen en Procedimientos de Contratación" placement="right">
                                            <ListItem button className={classes.submenuicono2} onClick={ () => redirectToRoute("/captura/S2")} key={'m3s2'}>
                                                <ListItemIcon className={classes.itemIcon}>
                                                    <ArrowRightIcon fontSize="small" className={classes.itemThree} />
                                                </ListItemIcon>
                                                <ListItemText secondary="S.P. en Contrataciones" />
                                            </ListItem>
                                        </Tooltip>
                                    </div>
                                </Collapse>
                                : ""
                        ))}
                        {permisos.map(item => (
                            item==="S3S" ?
                                <Collapse in={checkedDatosS3S} key="S3S">
                                    <div>
                                        <Tooltip title="Servidores Públicos Sancionados" placement="right">
                                            <ListItem button className={classes.submenuicono2} onClick={ () => redirectToRoute("/captura/S3S")} key={'m3s3s'}>
                                                <ListItemIcon className={classes.itemIcon}>
                                                    <ArrowRightIcon fontSize="small"  className={classes.itemThree}/>
                                                </ListItemIcon>
                                                <ListItemText secondary="Servidores Sancionados" />
                                            </ListItem>
                                        </Tooltip>
                                    </div>
                                </Collapse>
                                : ""
                        ))}
                        {permisos.map(item => (
                            item==="S3P" ?
                                <Collapse in={checkedDatosS3P} key="S3P">
                                    <div>
                                        <Tooltip title="Particulares Sancionados" placement="right">
                                            <ListItem button className={classes.submenuicono2} onClick={ () => redirectToRoute("/captura/S3P")} key={'m3s3p'}>
                                                <ListItemIcon className={classes.itemIcon}>
                                                    <ArrowRightIcon fontSize="small" className={classes.itemThree} />
                                                </ListItemIcon>
                                                <ListItemText secondary="Particulares Sancionados" />
                                            </ListItem>
                                        </Tooltip>
                                    </div>
                                </Collapse>
                                : ""
                        ))}


                        { rol==1 ?
                            <ListItem button onClick={e=>menuUser(e)}>
                                <ListItemIcon className={classes.itemIcon}>
                                    <PeopleIcon style={{color:'#34b3eb'}}/>
                                </ListItemIcon>
                                <ListItemText  primary="Usuarios" />
                            </ListItem>
                            : "" }
                        { submenuUsuario ?
                            <Collapse in={checkedUser}>
                                <div>
                                    <Tooltip title="Crear usuario" placement="right">
                                        <ListItem button className={classes.submenuicono} onClick={ () => redirectToRoute("/usuario/crear")} key={'mu1'}>
                                            <ListItemIcon className={classes.itemIcon}>
                                                <ArrowRightIcon fontSize="small" className={classes.itemOne }/>
                                            </ListItemIcon>
                                            <ListItemText primary="Crear usuario" />
                                        </ListItem>
                                    </Tooltip>

                                    <Tooltip title="Listar usuarios" placement="right">

                                        <ListItem button className={classes.submenuicono} onClick={ () => redirectToRoute("/usuarios")} key={'mu2'}>
                                            <ListItemIcon className={classes.itemIcon}>
                                                <ArrowRightIcon fontSize="small" className={classes.itemOne}/>
                                            </ListItemIcon>

                                            <ListItemText primary="Listar usuarios" />
                                        </ListItem>
                                    </Tooltip>
                                </div>
                            </Collapse>
                            : ""
                        }
                        { rol==1 ?
                            <ListItem button onClick={e=>menuProveedor(e)} key={'mp'}>
                                <ListItemIcon className={classes.itemIcon}>
                                    <AssignmentIcon className={classes.itemTwo} />
                                </ListItemIcon>
                                <ListItemText primary="Proveedores" />
                            </ListItem>
                            : "" }
                        { crearProovedor ?
                            <Collapse in={checkedProveedor}>
                                <div>
                                    <Tooltip title="Crear proveedor" placement="right">
                                        <ListItem button className={classes.submenuicono} onClick={ () => redirectToRoute("/proveedor/crear")} key={'mp1'}>
                                            <ListItemIcon className={classes.itemIcon}>
                                                <ArrowRightIcon fontSize="small" className={classes.itemTwo} />
                                            </ListItemIcon>
                                            <ListItemText primary="Crear proveedor" />
                                        </ListItem>
                                    </Tooltip>

                                    <Tooltip title="Listar proveedores" placement="right">

                                        <ListItem button className={classes.submenuicono} onClick={ () => redirectToRoute("/proveedores")} key={'mp2'}>
                                            <ListItemIcon className={classes.itemIcon}>
                                                <ArrowRightIcon fontSize="small" className={classes.itemTwo} />
                                            </ListItemIcon>
                                            <ListItemText primary="Listar proveedores" />
                                        </ListItem>
                                    </Tooltip>
                                </div>
                            </Collapse>
                            : ""
                        }

                        { rol==1 ?
                            <ListItem button onClick={e=>menuBitacora(e)} key={'mb'}>
                                <ListItemIcon className={classes.itemIcon}>
                                    <BookmarksIcon className={classes.itemThree}  />
                                </ListItemIcon>
                                <ListItemText primary="Bitácora" />
                            </ListItem>
                            : "" }

                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        {/* Grid 1 */}
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper className={classes.paperPadding} >
                                {vistaRender === "cargamasiva" && <LoadFileV/>  }
                                {vistaRender === "createuser" && <ConnectedCreateUser/>}
                                {vistaRender === "edituser" && <ConnectedCreateUser match = {match} />}
                                {vistaRender === "users" && <ListUser/> }
                                {vistaRender === "createprovider" && <ConnectedCreateProvider/> }
                                {vistaRender === "editprovider" && <ConnectedCreateProvider match = {match} /> }
                                {vistaRender === "providers" && <ListProvider/> }
                                {vistaRender === "createReg" && <ConnectedCreateReg/> }
                                {vistaRender === "createRegS3S" && <ConnectedCreateRegS3S/> }
                                {vistaRender === "createRegS3P" && <ConnectedCreateRegS3P/> }

                                {vistaRender === "editRegS2" && <ConnectedCreateReg match = {match}/> }
                                {vistaRender === "editRegS3S" && <ConnectedCreateRegS3S match = {match}/> }
                                {vistaRender === "editRegS3P" && <ConnectedCreateRegS3P match = {match}/> }

                                {vistaRender === "S2Schema" && <ListS2Schema/> }
                                {vistaRender === "S3SSchema" && <ListS3SSchema/> }
                                {vistaRender === "S3PSchema" && <ListS3PSchema/> }


                                {vistaRender === "consultarbitacora" && <ConnectedConsultarBitacora/>}
                                {vistaRender === "reportebitacora" && <ListBitacora/> }
                                {vistaRender === "cambiarcontrasena" && <ConnectedChangePassword/> }
                            </Paper>
                        </Grid>
                    </Grid>
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </Container>
            </main>
        </div>

    );



}


function mapStateToProps(state,ownProps){
    let vistaRender = ownProps.propiedades.renderView;
    let match = ownProps.match;
    return {vistaRender, match} ;
}


const mapDispatchToProps = (dispatch, ownProps)=>({
    closeSession(){
        dispatch(userActions.removeSessionLogIn());
    }
});

export const ConnectedMenuV = connect(mapStateToProps,mapDispatchToProps)(MenuV);