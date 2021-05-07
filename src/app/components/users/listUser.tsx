import React from 'react';
import Paper from '@material-ui/core/Paper';
import {useDispatch, useSelector} from 'react-redux';
import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    TablePagination,
    TableFooter,
    Tooltip,
    makeStyles,
    Button,
    TableHead,
    Grid,
    IconButton,
    Typography,
    Toolbar,
    DialogProps,
    useTheme,
} from "@material-ui/core";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {userActions} from "../../_actions/user.action";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {createStyles, Theme, withStyles} from '@material-ui/core/styles';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {history} from "../../store/history";
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';
import {requestResetPassword} from "../../store/mutations";
import CloseIcon from "@material-ui/icons/Close";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Nota from '../Common/Nota';
import CheckIcon from '@material-ui/icons/Check';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import TablePaginationActions from '../Common/TablePaginationActionsProps';

export const ListUser = () => {
    const {users, alerta, providerSelect} = useSelector(state => ({
        users: state.users,
        alerta: state.alert,
        providerSelect: state.providerSelect
    }));

    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [usuarioId, setUsuarioId] = React.useState("");
    const [nombreUsuario, setNombreUsuario] = React.useState("");
    const [pagination, setPagination] = React.useState({page: 0, pageSize: 10});
    const [openModalUserInfo, setOpenModalUserInfo] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState({
        _id: "",
        cargo: "",
        correoElectronico: "",
        telefono: "",
        extension: "",
        usuario: "",
        estatus: "",
        sistemas: [],
        fechaAlta: "",
        vigenciaContrasena: "",
        nombre: "",
        apellidoUno: "",
        apellidoDos: ""
    });

    const [openPassword, setOpenPassword] = React.useState(false);
    const [usuarioCorreo, setUsuarioCorreo] = React.useState("");
    const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('md');
    var optionsDate = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };

    const renderSelect = (user) => {
        let c1 = false;
        for (let value of providerSelect) {
            if (value._id === user.proveedorDatos) {
                c1 = true;
                return (value.label);
            }
        }
        if (!c1) {
            return <StyledTableCell></StyledTableCell>;
        }
    }

    const handleOpenModalUserInfo = (user) => {
        setOpenModalUserInfo(true);
        setSelectedUser(user);
    };

    const handleCloseModalUserInfo = () => {
        setOpenModalUserInfo(false);
    };

    const handleClickOpen = (id, name, primerApellido, segundoApellido) => {
        setOpen(true);
        setUsuarioId(id);
        setNombreUsuario(name + " " + primerApellido + " " + segundoApellido);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenPassword(false);
    };

    const handleChangePage = (event, newPage) => {
        setPagination({page: newPage, pageSize: pagination.pageSize});
        //dispatch(userActions.requestPerPage({page : newPage ,pageSize: pagination.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
        let newSize = parseInt(event.target.value, 10);
        if (pagination.page * newSize > users.length) {
            setPagination({page: 0, pageSize: parseInt(event.target.value, 10)});
        } else {
            setPagination({page: pagination.page, pageSize: parseInt(event.target.value, 10)});
        }

        //dispatch(userActions.requestPerPage({pageSize: parseInt(event.target.value, 10) }));
    };

    const confirmAction = (id) => {
        dispatch(userActions.deleteUser(id));
        let initialRange = pagination.page * pagination.pageSize;
        let endRange = pagination.page * pagination.pageSize + pagination.pageSize;
        let totalUsers = users.length - 1;
        console.log("initialRange " + initialRange + " end range " + endRange + " totalusers " + totalUsers);
        if (totalUsers <= initialRange) {
            setPagination({page: pagination.page - 1, pageSize: pagination.pageSize});
        }
        handleClose();
    }

    const confirmActionPassword = (correoElectronico) => {
        alerta.estatus = false;
        console.log(correoElectronico);
        let data = [];
        data["correo"] = correoElectronico;
        data["sistema"] = true;
        dispatch(requestResetPassword(data));
        handleClose();
    }

    const StyledTableCell = withStyles({
        root: {
            color: '#666666'
        }
    })(TableCell);

    const StyledTableRow = withStyles((theme: Theme) =>
        createStyles({
            root: {
                '&:nth-of-type(odd)': {
                    backgroundColor: theme.palette.action.hover,
                },
            },
        }),
    )(TableRow);

    const redirectToRoute = (path) => {
        history.push(path);
    }


    const handleOpenModalUserPassword = (id, name, primerApellido, segundoApellido, correoElectronico) => {
        setOpenPassword(true);
        setNombreUsuario(name + " " + primerApellido + " " + segundoApellido);
        setUsuarioCorreo(correoElectronico);
    };

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            titlegridModal: {
                color: '#666666'
            },
            body2: {
                color: '#666666'
            },
            fontblack: {
                color: '#666666'
            },
            titleDialogDetail: {
                flex: 1,
                color: '#ffff'
            },
            boton: {
                marginTop: '16px',
                marginLeft: '16px',
                backgroundColor: '#ffe01b',
                color: '#666666'
            },
            gridpadding: {
                padding: '2px 0px 2px',
            },
            marginright: {
                marginRight: '30px',
                marginTop: '15px',
                backgroundColor: '#ffe01b',
                color: '#666666',
                marginBottom: '30px'
            },
            paper: {
                'text-align': 'center',
                margin: 0,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[5],
                padding: theme.spacing(2, 4, 3),
            },
            tableHead: {
                backgroundColor: '#34b3eb'
            },
            tableHeaderColumn: {
                color: '#ffff'
            },
            toolBarModal: {
                backgroundColor: "#34b3eb"
            },
            whiteStyle: {
                color: '#ffff'
            },
            tableGrantsHead:{
                backgroundColor: '#ffe01b'
            },
            titulo: {
                fontSize: 15,
                fontWeight: "bold",
                marginBottom: 10,
                textDecoration: "underline",
                textDecorationColor: '#34b3eb',
                color: '#34b3eb',
                margin: '15px'
            },

        }),
    );

    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (

        <div>
            <Grid item xs={12}>
                <Typography variant={"h6"} paragraph className={classes.fontblack} align={"center"}>
                    <b>Lista de usuarios</b>
                </Typography>
            </Grid>

            <Dialog fullWidth={true} maxWidth={maxWidth} fullScreen={fullScreen} onClose={handleCloseModalUserInfo}
                    aria-labelledby="customized-dialog-title" open={openModalUserInfo}>
                <Toolbar className={classes.toolBarModal}>
                    <Typography variant="h6" className={classes.titleDialogDetail}>
                        <b>Detalle del usuario</b>
                        <Typography className={classes.whiteStyle}>
                            *(DNC) = Dato No Capturado
                        </Typography>
                    </Typography>
                    <IconButton className={classes.fontblack} edge="end" color="inherit"
                                onClick={handleCloseModalUserInfo} aria-label="close">
                        <CloseIcon className={classes.whiteStyle}/>
                    </IconButton>
                </Toolbar>
                <DialogContent dividers>
                    <Grid container item md={12} lg={12}>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Fecha alta</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {new Date(selectedUser.fechaAlta).toLocaleDateString("es-ES", optionsDate)}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Nombre</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedUser.nombre + " " + selectedUser.apellidoUno}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Apellido uno</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedUser.apellidoUno ? selectedUser.apellidoUno : <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Apellido dos</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedUser.apellidoDos ? selectedUser.apellidoDos : <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Usuario</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedUser.usuario}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Estatus</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedUser.estatus.toString() == "true" ? "Vigente" : "No vigente"}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Vigencia de contraseña</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {new Date(selectedUser.vigenciaContrasena).toLocaleDateString("es-ES", optionsDate)}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Cargo</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedUser.cargo}
                            </Typography>

                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Correo electrónico</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedUser.correoElectronico}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Teléfono</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedUser.telefono}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Extensión</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedUser.extension ? selectedUser.extension : <Nota/>}
                            </Typography>
                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Proveedor</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {(renderSelect(selectedUser))}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.titulo} align={"center"}>
                                Permisos
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={12} sm={12}>
                            <TableContainer component={Paper}>
                                <Table aria-label="customized table">
                                    <TableHead className={classes.tableGrantsHead}>
                                        <TableRow>
                                            <StyledTableCell><b>Sistema</b></StyledTableCell>
                                            <StyledTableCell align="center"><b>Permiso</b></StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                            <StyledTableRow key={"S2"}>
                                                <StyledTableCell component="th" scope="row">
                                                    {'Sistema de los Servidores que Intervienen en Procedimientos de Contratación'}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{selectedUser.sistemas.find(element => element === 'S2') ? <CheckIcon style={{'color': '#34b3eb'}}/> : <NotInterestedIcon style={{'color': 'red'}}/> }</StyledTableCell>
                                            </StyledTableRow>
                                        <StyledTableRow key={"S3S"}>
                                            <StyledTableCell component="th" scope="row">
                                                {'Sistema de los Servidores Públicos Sancionados'}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{selectedUser.sistemas.find(element => element === 'S3S') ? <CheckIcon style={{'color': '#34b3eb'}}/> : <NotInterestedIcon style={{'color': 'red'}}/> }</StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow key={"S3P"}>
                                            <StyledTableCell component="th" scope="row">
                                                {'Sistema de los Particulares Sancionados'}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{selectedUser.sistemas.find(element => element === 'S3P') ? <CheckIcon style={{'color': '#34b3eb'}}/> : <NotInterestedIcon style={{'color': 'red'}}/> }</StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>


            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title">{"¿Seguro que desea eliminar el usuario " + nombreUsuario + "?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Los cambios no seran reversibles
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => {
                        confirmAction(usuarioId)
                    }} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openPassword}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title">{"¿Deseas reestablecer la contraseña de " + nombreUsuario + "?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        La contraseña se generará de manera automática y se enviará a su correo electrónico.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => {
                        confirmActionPassword(usuarioCorreo)
                    }} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid container>

                <TableContainer component={Paper}>
                    {users.length > 0 && <Table aria-label="custom pagination table">
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Nombre
                                    completo</b></StyledTableCell>
                                <StyledTableCell align="center"
                                                 className={classes.tableHeaderColumn}><b>Usuario</b></StyledTableCell>
                                <StyledTableCell align="center"
                                                 className={classes.tableHeaderColumn}><b>Correo</b></StyledTableCell>
                                <StyledTableCell align="center" style={{width: 160}}
                                                 className={classes.tableHeaderColumn}><b>Proveedor</b></StyledTableCell>
                                <StyledTableCell align="center"
                                                 className={classes.tableHeaderColumn}><b>Acciones</b></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody key="usuarios">
                            {users.slice(pagination.page * pagination.pageSize, pagination.page * pagination.pageSize + pagination.pageSize).map((user) => (
                                <TableRow key={user._id}>
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {user.nombre + " " + user.apellidoUno}
                                        {user.apellidoDos ? " " + user.apellidoDos : ""}
                                    </StyledTableCell>
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {user.usuario}
                                    </StyledTableCell>
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {user.correoElectronico}
                                    </StyledTableCell>
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {renderSelect(user)}
                                    </StyledTableCell>
                                    <StyledTableCell style={{width: 430}} align="center">
                                        <Button onClick={() => handleOpenModalUserInfo(user)}>
                                            <Tooltip title="Más información" placement="left">
                                                <IconButton style={{color: "#34b3eb"}} aria-label="expand row"
                                                            size="small">
                                                    <KeyboardArrowDownIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        </Button>
                                        <Button onClick={() => redirectToRoute(`/usuario/editar/${user._id}`)}>
                                            <Tooltip title="Editar usuario" placement="top">
                                                <Button style={{color: '#ffe01b'}}><EditOutlinedIcon/></Button>
                                            </Tooltip>
                                        </Button>
                                        <Button
                                            onClick={() => handleOpenModalUserPassword(user._id, user.nombre, user.apellidoUno, user.apellidoDos, user.correoElectronico)}>
                                            <Tooltip title="Reestablecer contraseña" placement="top">
                                                <IconButton style={{color: "#67BFB7"}} aria-label="expand row"
                                                            size="small">
                                                    <EnhancedEncryptionIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        </Button>
                                        <Tooltip title="Eliminar usuario" placement="right">
                                            <Button style={{color: '#f44336', padding: '0px'}}
                                                    onClick={() => {
                                                        handleClickOpen(user._id, user.nombre, user.apellidoUno, user.apellidoDos)
                                                    }}>
                                                <DeleteOutlineOutlinedIcon/>
                                            </Button>
                                        </Tooltip>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                {pagination.pageSize != undefined && pagination.page != undefined && <TablePagination
                                    rowsPerPageOptions={[3, 5, 10, 25, {label: 'Todos', value: users.length}]}
                                    colSpan={6}
                                    count={users.length}
                                    rowsPerPage={pagination.pageSize}
                                    page={pagination.page}
                                    SelectProps={{
                                        inputProps: {'aria-label': 'rows per page'},
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />}
                            </TableRow>
                        </TableFooter>
                    </Table>}
                </TableContainer>
                <Grid container item
                      xs={12} md={12}
                      justify="flex-end"
                      alignItems="flex-end">

                    <Tooltip title="Agregar usuario" placement="right">
                        <Button onClick={() => redirectToRoute(`/usuario/crear`)} className={classes.boton}
                                variant="contained"
                                endIcon={<AddBoxIcon>Crear usuario</AddBoxIcon>}
                        >
                            Crear usuario
                        </Button>
                    </Tooltip>

                </Grid>
            </Grid>

        </div>
    );
}



