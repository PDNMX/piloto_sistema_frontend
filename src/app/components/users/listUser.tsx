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
import {requestCreationUser, requestErrorsValidation} from "../../store/mutations";
import {userActions} from "../../_actions/user.action";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";


export const ListUser = () => {

    const {pagination, users} = useSelector(state => ({
        pagination: state.pagination,
        users: state.users,
    }));
    const dispatch = useDispatch();

    const handleChangePage = (event, newPage) => {
        newPage= newPage+1;
       dispatch(userActions.requestPerPage({page : newPage ,pageSize: pagination.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
       dispatch(userActions.requestPerPage({pageSize: parseInt(event.target.value, 10) }));
    };


    TablePaginationActions.propTypes = {
        count: PropTypes.number.isRequired,
        onChangePage: PropTypes.func.isRequired,
        page: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired
    };

        return (
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
                                    {user.nombre}
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
                                    <ButtonGroup size="small" aria-label="small outlined button group">
                                        <Link to={`/user/edit/${user._id}`}>
                                            <Button><EditOutlinedIcon/></Button>
                                        </Link>
                                        <Button><DeleteOutlineOutlinedIcon/></Button>
                                    </ButtonGroup>
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
        );
}



