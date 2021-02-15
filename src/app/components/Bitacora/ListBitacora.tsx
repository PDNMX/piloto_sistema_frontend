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
    Tooltip,
    makeStyles, Button, TableHead, ButtonGroup, Grid, IconButton, Modal, Typography
} from "@material-ui/core";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {providerActions} from "../../_actions/provider.action";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {Alert} from "@material-ui/lab";
import {history} from "../../store/history";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {withStyles} from "@material-ui/core/styles";
import {userActions} from "../../_actions/user.action";
import {bitacoraActions} from "../../_actions/bitacora.action";
import { CSVLink, CSVDownload } from "react-csv";

export const ListBitacora = () => {

    const {providers,alerta,providerSelect, idUser, bitacora} = useSelector(state => ({
        providers: state.providers,
        alerta : state.alert,
        providerSelect : state.providerSelect,
        idUser: state.userInSession,
        bitacora:state.bitacora
    }));
    const dispatch = useDispatch();
    const [pagination, setPagination] =  React.useState({page : 0 , pageSize : 10 });

    const handleChangePage = (event, newPage) => {
        setPagination({page : newPage , pageSize : pagination.pageSize });
        //dispatch(userActions.requestPerPage({page : newPage ,pageSize: pagination.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
        let newSize= parseInt(event.target.value, 10);
        if(pagination.page * newSize > bitacora.length){
            setPagination({page : 0 , pageSize : parseInt(event.target.value, 10) });
        }else{
            setPagination({page : pagination.page , pageSize : parseInt(event.target.value, 10) });
        }
    };


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
    }));

    const headers = [
        { label: "Tipo de Operación", key: "tipoOperacion" },
        { label: "Fecha", key: "fechaOperacion" },
        { label: "Sistema", key: "sistema" },
        { label: "Número Registros", key: "numeroRegistros" },
        { label: "Usuario", key: "usuario" }
    ];

    const data = bitacora;

    const classes = useStyles();
    console.log(bitacora);
    return (
        <div>
            <Grid item xs={12}>
                <Typography variant={"h6"} paragraph className={classes.fontblack} align={"center"}>
                    <b>Reporte de bitácora</b>
                </Typography>
            </Grid>
            {alerta.status == true && <Alert severity={alerta.type}>{alerta.message}</Alert>}

            <Grid className= {classes.gridpadding} spacing={3} container >
                <TableContainer component={Paper} >
                    {bitacora.length > 0 ?
                        <Table aria-label="custom pagination table">
                        <TableHead >
                            <TableRow >
                                <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">Operación</TableCell>
                                <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">Fecha</TableCell>
                                <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">Sistema</TableCell>
                                <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">Registros</TableCell>
                                <TableCell className={classes.fontblack} align="center">Usuario</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody key="bitacora">
                            {bitacora.slice(pagination.page * pagination.pageSize, pagination.page * pagination.pageSize + pagination.pageSize).map((rowbitacora)  => (

                                <TableRow key={rowbitacora._id}>
                                    <TableCell className={classes.fontblack} component="th" scope="row" style={{ width: 'auto'}} align="center">
                                        {rowbitacora.tipoOperacion}
                                    </TableCell>
                                    <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">
                                        {rowbitacora.fechaOperacion}
                                    </TableCell>
                                    <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="left">
                                            <div>
                                                {rowbitacora.sistema=='S2' ? <li>Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación</li> : "" }
                                                {rowbitacora.sistema=='S3S' ? <li>Sistema de los Servidores Públicos Sancionados</li> : "" }
                                                {rowbitacora.sistema=='S3P' ? <li>Sistema de los Particulares Sancionados</li> : "" }
                                            </div>
                                    </TableCell>
                                    <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">
                                        {rowbitacora.numeroRegistros}
                                    </TableCell>
                                    <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">
                                        {rowbitacora.usuario}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                { pagination.pageSize != undefined  && pagination.page != undefined  && <TablePagination
                                    rowsPerPageOptions={[3,5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={6}
                                    count={bitacora.length}
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
                    </Table>
                    :
                        <Table>
                            <TableRow>
                                <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">
                                    No hay registros para está consulta.
                                </TableCell>
                            </TableRow>
                        </Table>}
                </TableContainer>
            </Grid>
                <Grid  spacing={3} justify="flex-end"
                       alignItems="flex-end"
                       container
                       item
                       xs={12}
                       md={12}>
                    <Tooltip title="Reporte Nuevo" placement="left">
                        <Button  onClick={ () => redirectToRoute("/bitacora")}
                                 variant="contained"
                                 className={classes.marginright}
                                 endIcon={<AddBoxIcon>Reporte Nuevo</AddBoxIcon>}
                        >
                            Reporte Nuevo
                        </Button>
                    </Tooltip>
                    <Tooltip title="Descargar CSV" placement="right">
                        <CSVLink data={data} headers={headers} filename={"Bitacora.csv"}>
                        <Button
                                 variant="contained"
                                 className={classes.marginright}
                                 endIcon={<FileCopyIcon>Descargar CSV</FileCopyIcon>}
                        >
                            Descargar CSV
                        </Button>
                        </CSVLink>
                    </Tooltip>
            </Grid>
        </div>
    );
}



