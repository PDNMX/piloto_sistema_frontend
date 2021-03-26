import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector} from 'react-redux';
import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    TablePagination,
    TableFooter,
    Tooltip,
    makeStyles, Button, TableHead, ButtonGroup, Grid, IconButton, Modal, Typography, Snackbar
} from "@material-ui/core";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {userActions} from "../../_actions/user.action";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import PropTypes from "prop-types";
import {Link} from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {Alert} from "@material-ui/lab";
import {createStyles, Theme, withStyles} from '@material-ui/core/styles';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {alertActions} from "../../_actions/alert.actions";
import {history} from "../../store/history";
import KeyboardHideIcon from '@material-ui/icons/KeyboardHide';
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';
import {requestResetPassword} from "../../store/mutations";



export const ListUser = () => {

    const {users,alerta,providerSelect} = useSelector(state => ({
        users: state.users,
        alerta : state.alert,
        providerSelect : state.providerSelect
    }));

    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [usuarioId, setUsuarioId] = React.useState("");
    const [nombreUsuario, setNombreUsuario] =  React.useState("");
    const [pagination, setPagination] =  React.useState({page : 0 , pageSize : 10 });
    const [openModalUserInfo, setOpenModalUserInfo] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState({_id : "",cargo: "" , correoElectronico : "",  telefono : "" ,  extension : "" , usuario : "" , sistemas : [] , fechaAlta : "" , vigenciaContrasena :""  });
    const sistemas = {S2: "Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación", S3S : "Sistema de los Servidores Públicos Sancionados", S3P : "Sistema de los Particulares Sancionados"}
    const [openPassword, setOpenPassword] = React.useState(false);
    const [usuarioCorreo, setUsuarioCorreo]= React.useState("");

    const renderSelect = (user) => {
        let c1= false;
        for(let value of providerSelect){
            if(value._id === user.proveedorDatos ) {
                c1=true;
                return (<StyledTableCell key={value._id} style={{width: 160}} align="center">{value.label}</StyledTableCell>);
            }
        }
        if(!c1){
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

    const handleClickOpen = (id,name,primerApellido,segundoApellido) => {
        setOpen(true);
        setUsuarioId(id);
        setNombreUsuario(name+ " "+ primerApellido+ " "+ segundoApellido);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenPassword(false);
    };

    const handleCloseSnackbar = () => {
        dispatch(alertActions.clear());
    };

    const handleChangePage = (event, newPage) => {
        setPagination({page : newPage , pageSize : pagination.pageSize });
       //dispatch(userActions.requestPerPage({page : newPage ,pageSize: pagination.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
        let newSize= parseInt(event.target.value, 10);
        if(pagination.page * newSize > users.length){
            setPagination({page : 0 , pageSize : parseInt(event.target.value, 10) });
        }else{
            setPagination({page : pagination.page , pageSize : parseInt(event.target.value, 10) });
        }

       //dispatch(userActions.requestPerPage({pageSize: parseInt(event.target.value, 10) }));
    };

    const confirmAction = (id) => {
         dispatch(userActions.deleteUser(id));
        let initialRange=pagination.page * pagination.pageSize;
        let endRange= pagination.page * pagination.pageSize + pagination.pageSize;
        let totalUsers= users.length -1 ;
        console.log("initialRange "+ initialRange + " end range "+ endRange+ " totalusers "+ totalUsers);
        if(totalUsers <= initialRange ){
            setPagination({page : pagination.page -1 , pageSize : pagination.pageSize });
        }

        handleClose();
    }

    const confirmActionPassword = (correoElectronico) => {
        alerta.estatus=false;
        console.log(correoElectronico);
        let data=[];
        data["correo"]=correoElectronico;
        data["sistema"]=true;
        dispatch(requestResetPassword(data));
        handleClose();
    }

    const StyledTableCell = withStyles({
        root: {
            color: '#666666'
        }
    })(TableCell);

    const redirectToRoute = (path) =>{
        history.push(path);
    }

    TablePaginationActions.propTypes = {
        count: PropTypes.number.isRequired,
        onChangePage: PropTypes.func.isRequired,
        page: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired
    };

    const handleOpenModalUserPassword = (id,name,primerApellido,segundoApellido, correoElectronico) => {
        setOpenPassword(true);
        setNombreUsuario(name+ " "+ primerApellido+ " "+ segundoApellido);
        setUsuarioCorreo(correoElectronico);
    };




    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            fontblack:{
                color: '#666666'
            },
            boton:{
                backgroundColor:'#ffe01b',
                color: '#666666'
            },
            gridpadding: {
                padding: '30px',
            },
            marginright:{
                marginRight: '30px',
                marginTop: '15px',
                backgroundColor:'#ffe01b',
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
        }),
    );

    const classes = useStyles();

        return (

           <div >
               <Grid item xs={12}>
                   <Typography variant={"h6"} paragraph className={classes.fontblack} align={"center"}>
                       <b>Lista de usuarios</b>
                   </Typography>
               </Grid>
               <Snackbar anchorOrigin={ { vertical: 'top', horizontal: 'center' }}  open={alerta.status} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                   <Alert onClose={handleCloseSnackbar} severity={alerta.type}>
                       {alerta.message}
                   </Alert>
               </Snackbar>


               <Modal
                   open={openModalUserInfo}
                   onClose={handleCloseModalUserInfo}
                   aria-labelledby="simple-modal-title"
                   aria-describedby="simple-modal-description"
               >
                   <Grid container item md={8} className={classes.paper}>
                       <TableContainer component={Paper}>
                           <TableHead>
                               <TableRow>
                                   <StyledTableCell align="center" >Cargo</StyledTableCell>
                                   <StyledTableCell align="center">Correo Electrónico</StyledTableCell>
                                   <StyledTableCell align="center">Teléfono</StyledTableCell>
                                   <StyledTableCell align="center" >Extensión</StyledTableCell>
                                   <StyledTableCell align="center" >Usuario</StyledTableCell>
                                   <StyledTableCell align="center" >Sistemas</StyledTableCell>
                                   <StyledTableCell align="center" >Fecha de alta</StyledTableCell>
                                   <StyledTableCell align="center" >Vigencia de Contraseña</StyledTableCell>
                               </TableRow>
                           </TableHead>
                           <TableBody key="InfoPlusUser">
                               <TableRow key={selectedUser._id + "InfoPlusUser"}>
                                   <StyledTableCell align="center" style={{width: 160}} component="th" scope="row">
                                       {selectedUser.cargo}
                                   </StyledTableCell>
                                   <StyledTableCell style={{width: 160}} align="center">
                                       {selectedUser.correoElectronico}
                                   </StyledTableCell>
                                   <StyledTableCell style={{width: 160}} align="center">
                                       {selectedUser.telefono}
                                   </StyledTableCell>
                                   <StyledTableCell style={{width: 160}}align="center">
                                       {selectedUser.extension}
                                   </StyledTableCell>
                                   <StyledTableCell style={{width: 160}} align="center">
                                       {selectedUser.usuario}
                                   </StyledTableCell>
                                   <StyledTableCell style={{width: 160}} align="center">
                                       {selectedUser.sistemas.map( value => (
                                           <Typography>{sistemas[value]}, </Typography>
                                       ))}
                                   </StyledTableCell>
                                   <StyledTableCell style={{width: 160}} align="center">
                                       {selectedUser.fechaAlta}
                                   </StyledTableCell>
                                   <StyledTableCell style={{width: 160}} align="center">
                                       {selectedUser.vigenciaContrasena}
                                   </StyledTableCell>
                               </TableRow>
                           </TableBody>
                       </TableContainer>
                   </Grid>
               </Modal>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"¿Seguro que desea eliminar el usuario "+ nombreUsuario+"?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Los cambios no seran reversibles
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={()=> {confirmAction(usuarioId)}} color="primary" autoFocus>
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
                   <DialogTitle id="alert-dialog-title">{"¿Deseas reestablecer la contraseña de "+ nombreUsuario+"?"}</DialogTitle>
                   <DialogContent>
                       <DialogContentText id="alert-dialog-description">
                           La contraseña se generará de manera automática y se enviará a su correo electrónico.
                       </DialogContentText>
                   </DialogContent>
                   <DialogActions>
                       <Button onClick={handleClose} color="primary">
                           Cancelar
                       </Button>
                       <Button onClick={()=> {confirmActionPassword(usuarioCorreo)}} color="primary" autoFocus>
                           Aceptar
                       </Button>
                   </DialogActions>
               </Dialog>
            <Grid container >

                <TableContainer  component={Paper}>
                    {users.length > 0  && <Table aria-label="custom pagination table">
                        <TableHead >
                            <TableRow>
                                <StyledTableCell align="center" >Nombre completo</StyledTableCell>
                                <StyledTableCell align="center" >Usuario</StyledTableCell>
                                <StyledTableCell align="center">Correo</StyledTableCell>
                                <StyledTableCell align="center">Proveedor</StyledTableCell>
                                <StyledTableCell align="center">Acciones</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody key="usuarios">
                            {users.slice(pagination.page * pagination.pageSize, pagination.page * pagination.pageSize + pagination.pageSize).map((user)  => (
                                <TableRow key={user._id}>
                                    <StyledTableCell style={{ width: 160 }}  align="center">
                                        {user.nombre+" "+user.apellidoUno}
                                        {user.apellidoDos ? " "+user.apellidoDos : ""}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: 160 }}  align="center">
                                        {user.usuario}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: 160 }}  align="center">
                                        {user.correoElectronico}
                                    </StyledTableCell>

                                    {renderSelect(user)}

                                    <StyledTableCell style={{ width: 430 }} align="center">
                                        <Button onClick={() => handleOpenModalUserInfo(user)}>
                                            <Tooltip title="Más información" placement="left">
                                                <IconButton aria-label="expand row" size="small" >
                                                    <KeyboardArrowDownIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Button>
                                        <Button onClick={ () => redirectToRoute(`/usuario/editar/${user._id}`)}>
                                            <Tooltip title="Editar usuario" placement="top">
                                                <Button   style={{ color: 'gray' }} ><EditOutlinedIcon/></Button>
                                            </Tooltip>
                                        </Button>
                                        <Button onClick={() => handleOpenModalUserPassword(user._id, user.nombre,user.apellidoUno,user.apellidoDos, user.correoElectronico)}>
                                            <Tooltip title="Reestablecer contraseña" placement="top">
                                                <IconButton aria-label="expand row" size="small" >
                                                    <EnhancedEncryptionIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        </Button>
                                        <Tooltip title="Eliminar usuario" placement="right">
                                            <Button
                                                onClick= {()=> {handleClickOpen(user._id, user.nombre,user.apellidoUno,user.apellidoDos)}} >
                                                <DeleteOutlineOutlinedIcon style={{ color: 'gray' }}/>
                                            </Button>
                                        </Tooltip>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                            <TableFooter>
                                    <TableRow>
                                        { pagination.pageSize != undefined  && pagination.page != undefined  && <TablePagination
                                            rowsPerPageOptions={[3,5, 10, 25, { label: 'All', value: -1 }]}
                                            colSpan={6}
                                            count={users.length}
                                            rowsPerPage={pagination.pageSize}
                                            page={pagination.page}
                                            SelectProps={{
                                                inputProps: { 'aria-label': 'rows per page' },
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
                      alignItems="flex-end" >

                    <Tooltip title="Agregar usuario" placement="right">
                        <Button  onClick={ () => redirectToRoute(`/usuario/crear`)} className={classes.marginright}
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



