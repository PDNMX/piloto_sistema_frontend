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
    makeStyles, Button, TableHead, Grid, Typography
} from "@material-ui/core";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import PropTypes from "prop-types";
import AddBoxIcon from '@material-ui/icons/AddBox';
import {Alert} from "@material-ui/lab";
import {history} from "../../store/history";
import {withStyles} from "@material-ui/core/styles";
import {CSVLink} from "react-csv";


export const ListBitacora = () => {

    const {providers, alerta, providerSelect, idUser, bitacora} = useSelector(state => ({
        providers: state.providers,
        alerta: state.alert,
        providerSelect: state.providerSelect,
        idUser: state.userInSession,
        bitacora: state.bitacora
    }));
    const dispatch = useDispatch();
    const [pagination, setPagination] = React.useState({page: 0, pageSize: 10});

    const handleChangePage = (event, newPage) => {
        setPagination({page: newPage, pageSize: pagination.pageSize});
        //dispatch(userActions.requestPerPage({page : newPage ,pageSize: pagination.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
        console.log("pagination: ", parseInt(event.target.value,10))
        let newSize = parseInt(event.target.value, 10);
        if (pagination.page * newSize > bitacora.length) {
            setPagination({page: 0, pageSize: parseInt(event.target.value, 10)});
        } else {
            setPagination({page: pagination.page, pageSize: parseInt(event.target.value, 10)});
        }
    };


    const StyledTableCell = withStyles({
        root: {
            color: '#666666'
        }
    })(TableCell);

    const redirectToRoute = (path) => {
        history.push(path);
    }


    TablePaginationActions.propTypes = {
        count: PropTypes.number.isRequired,
        onChangePage: PropTypes.func.isRequired,
        page: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired
    };

    const useStyles = makeStyles((theme) => ({
        fontblack: {
            color: '#666666'
        },
        boton: {
            marginTop: '16px',
            marginLeft: '16px',
            marginRight: '16px',
            marginBottom: '12px',
            backgroundColor: '#ffe01b',
            color: '#666666'
        },
        boton2: {
            marginTop: '16px',
            marginLeft: '16px',
            marginRight: '-10px',
            marginBottom: '12px',
            backgroundColor: '#ffe01b',
            color: '#666666'
        },
        gridpadding: {
            padding: '10px',
        },
        marginright: {
            marginRight: '30px',
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

        whiteStyle: {
            color: '#ffff'
        },
    }));

    const headers = [
        {label: "Tipo de operación", key: "tipo"},
        {label: "Fecha", key: "fecha"},
        {label: "Sistema", key: "sistema_label"},
        {label: "Número registros", key: "numeroRegistros"},
        {label: "Usuario", key: "nombre"}
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

            <Grid className={classes.gridpadding} spacing={3} container>
                <TableContainer component={Paper}>
                    {bitacora.length > 0 ?
                        <Table aria-label="custom pagination table">
                            <TableHead className={classes.tableHead}>
                                <TableRow>
                                    <TableCell className={classes.tableHeaderColumn} style={{width: 'auto'}}
                                               align="left"><b>Operación</b></TableCell>
                                    <TableCell className={classes.tableHeaderColumn} style={{width: 'auto'}}
                                               align="left"><b>Fecha</b></TableCell>
                                    <TableCell className={classes.tableHeaderColumn} style={{width: 'auto'}}
                                               align="left"><b>Sistema</b></TableCell>
                                    <TableCell className={classes.tableHeaderColumn} style={{width: 'auto'}}
                                               align="center"><b>Registros</b></TableCell>
                                    <TableCell className={classes.tableHeaderColumn} align="center"><b>Usuario</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody key="bitacora">
                                {bitacora.slice(pagination.page * pagination.pageSize, pagination.page * pagination.pageSize + pagination.pageSize).map((rowbitacora) => (

                                    <TableRow key={rowbitacora._id}>
                                        <TableCell className={classes.fontblack} component="th" scope="row"
                                                   style={{width: 'auto'}} align="left">
                                            {rowbitacora.tipo}
                                        </TableCell>
                                        <TableCell className={classes.fontblack} style={{width: 'auto'}} align="left">
                                            {rowbitacora.fecha}
                                        </TableCell>
                                        <TableCell className={classes.fontblack} style={{width: 'auto'}} align="left">
                                            <div>
                                                {rowbitacora.sistema_label}
                                            </div>
                                        </TableCell>
                                        <TableCell className={classes.fontblack} style={{width: 'auto'}} align="center">
                                            {rowbitacora.numeroRegistros}
                                        </TableCell>
                                        <TableCell className={classes.fontblack} style={{width: 'auto'}} align="center">
                                            {rowbitacora.nombre}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    {pagination.pageSize != undefined && pagination.page != undefined &&
                                    <TablePagination
                                        rowsPerPageOptions={[3, 5, 10, 25, {label: 'Todos', value: bitacora.length}]}
                                        colSpan={6}
                                        count={bitacora.length}
                                        rowsPerPage={pagination.pageSize}
                                        page={pagination.page}
                                        SelectProps={{
                                            inputProps: {'aria-label': 'Registros por página'},
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
                                <TableCell className={classes.fontblack} style={{width: 'auto'}} align="center">
                                    No hay registros para está consulta.
                                </TableCell>
                            </TableRow>
                        </Table>}
                </TableContainer>
            </Grid>
            <Grid spacing={3} justify="flex-end"
                  alignItems="flex-end"
                  container
                  item
                  xs={12}
                  md={12}>
                <Tooltip title="Reporte Nuevo" placement="left">
                    <Button onClick={() => redirectToRoute("/bitacora")}
                            variant="contained"
                            className={classes.boton}
                            endIcon={<AddBoxIcon>Reporte Nuevo</AddBoxIcon>}
                    >
                        Reporte Nuevo
                    </Button>
                </Tooltip>
                <Tooltip title="Descargar CSV" placement="right">
                    <CSVLink data={data} headers={headers} filename={"Bitacora.csv"}>
                        <Button
                            variant="contained"
                            className={classes.boton2}
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



