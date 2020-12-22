import React from 'react';
import Paper from '@material-ui/core/Paper';
import {connect, useDispatch, useSelector} from 'react-redux';
import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    TablePagination,
    TableFooter,
    makeStyles, Button, TableHead, ButtonGroup, Grid
} from "@material-ui/core";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {providerActions} from "../../_actions/provider.action";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import PropTypes from "prop-types";
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {Alert} from "@material-ui/lab";


export const ListProvider = () => {

    const {pagination, providers,alerta} = useSelector(state => ({
        pagination: state.pagination,
        providers: state.providers,
        alerta : state.alert
    }));
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [providerId, setProviderId] = React.useState("");
    const [nombreDependencia, setnombreDependencia] =  React.useState("");
    const handleClickOpen = (id, dependencia) => {
        setOpen(true);
        setProviderId(id);
        setnombreDependencia(dependencia);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        newPage= newPage+1;
       dispatch(providerActions.requestPerPage({page : newPage ,pageSize: pagination.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
       dispatch(providerActions.requestPerPage({pageSize: parseInt(event.target.value, 10) }));
    };

    const confirmAction = (id) => {
        dispatch(providerActions.deleteProvider(id));
        handleClose();
    }

    TablePaginationActions.propTypes = {
        count: PropTypes.number.isRequired,
        onChangePage: PropTypes.func.isRequired,
        page: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired
    };

    const useStyles = makeStyles((theme) => ({
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
            backgroundColor:'#ffe01b',
            color: '#666666',
            marginBottom: '30px'
        }
    }));

    const classes = useStyles();

        return (
            <div>
                {alerta.status == true && <Alert severity={alerta.type}>{alerta.message}</Alert>}
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"¿Seguro que desea eliminar el proveedor: "+nombreDependencia+"?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Los cambios no seran reversibles
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={()=> {confirmAction(providerId)}} color="primary" autoFocus>
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
                <Grid className= {classes.gridpadding} spacing={3} container >
                        <TableContainer component={Paper} >
                            {providers.length > 0  && <Table aria-label="custom pagination table">
                                <TableHead >
                                    <TableRow >
                                        <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">Proveedor</TableCell>
                                        <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">Estatus</TableCell>
                                        <TableCell className={classes.fontblack} align="center">Sistema</TableCell>
                                        <TableCell className={classes.fontblack} align="center">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody key="providers">
                                    {(providers).map((provider) => (
                                        <TableRow key={provider._id}>
                                            <TableCell className={classes.fontblack} component="th" scope="row" style={{ width: 'auto'}} align="left">
                                                {provider.dependencia}
                                            </TableCell>
                                            <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">
                                                {provider.estatus=='true' ? 'Vigente' : 'No vigente'}
                                            </TableCell>
                                            <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">
                                                {provider.sistemas}
                                            </TableCell>
                                            <TableCell style={{ width: 'auto' }} align="center">
                                                    <Link component={RouterLink}  to={`/proveedor/editar/${provider._id}`}>
                                                     <Button style={{ color: 'gray' }} ><EditOutlinedIcon/></Button>
                                                    </Link>
                                                    <Button>
                                                    <DeleteOutlineOutlinedIcon style={{ color: 'gray' }} onClick= {()=> {handleClickOpen(provider._id, provider.dependencia)}} />
                                                    </Button>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow >
                                        {pagination.totalRows != undefined && pagination.pageSize && pagination.page  && <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                            colSpan={6}
                                            count={pagination.totalRows}
                                            rowsPerPage={pagination.pageSize}
                                            page={pagination.page-1}
                                            SelectProps={{
                                                inputProps: { 'aria-label': 'rows per page' },
                                                native: true,
                                            }}
                                            onChangePage={handleChangePage}
                                            onChangeRowsPerPage={handleChangeRowsPerPage}
                                            ActionsComponent={TablePaginationActions}
                                            className={classes.fontblack}
                                        /> }
                                    </TableRow>
                                </TableFooter>
                            </Table>}
                         </TableContainer>
                </Grid>
                <Grid  spacing={3} justify="flex-end"
                       alignItems="flex-end"
                       container
                       item
                       xs={12}
                       md={12}>
                    <Link component={RouterLink}  to={`/proveedor/crear`}>
                        <Button
                            variant="contained"
                            className={classes.marginright}
                            endIcon={<AddBoxIcon>Agregar proveedor</AddBoxIcon>}
                        >
                            Agregar proveedor
                        </Button>
                    </Link>
                </Grid>
            </div>
        );
}



