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
    makeStyles, Button, TableHead, ButtonGroup
} from "@material-ui/core";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {userActions} from "../../_actions/user.action";
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


export const ListUser = () => {

    const {pagination, users,alerta} = useSelector(state => ({
        pagination: state.pagination,
        users: state.users,
        alerta : state.alert
    }));
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [usuarioId, setUsuarioId] = React.useState("");
    const handleClickOpen = (id) => {
        setOpen(true);
        setUsuarioId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        newPage= newPage+1;
       dispatch(userActions.requestPerPage({page : newPage ,pageSize: pagination.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
       dispatch(userActions.requestPerPage({pageSize: parseInt(event.target.value, 10) }));
    };

    const confirmAction = (id) => {
        dispatch(userActions.deleteUser(id));
        handleClose();
    }

    TablePaginationActions.propTypes = {
        count: PropTypes.number.isRequired,
        onChangePage: PropTypes.func.isRequired,
        page: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired
    };

        return (
            <div>

                <Link component={RouterLink}  to={`/createUser`}>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<AddBoxIcon>Agregar usuario</AddBoxIcon>}
                    >
                        Agregar usuario
                    </Button>
                </Link>

                {alerta.status != undefined && <Alert severity={alerta.type}>{alerta.message}</Alert>}


                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"¿Seguro que desea eliminar el usuario?"+usuarioId}</DialogTitle>
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

            <TableContainer component={Paper}>
                {users.length > 0  && <Table aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Primer apellido</TableCell>
                            <TableCell align="right">Segundo apellido</TableCell>
                            <TableCell align="right">Sistemas</TableCell>
                            <TableCell align="right">Estatus</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody key="usuarios">
                        {(users).map((user) => (
                            <TableRow key={user._id}>
                                <TableCell component="th" scope="row">
                                    {user._id}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {user.apellidoUno}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {user.apellidoDos}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {user.sistemas}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {user.estatus}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                        <Link component={RouterLink}  to={`/user/edit/${user._id}`}>
                                         <Button><EditOutlinedIcon/></Button>
                                        </Link>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick= {()=> {handleClickOpen(user._id)}} >
                                        <DeleteOutlineOutlinedIcon/>
                                    </Button>
                                         <Button></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            {pagination.totalRows != undefined && pagination.pageSize && pagination.page  && <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
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
                            /> }
                        </TableRow>
                    </TableFooter>
                </Table>}
            </TableContainer>
            </div>
        );
}



