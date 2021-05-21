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
    Snackbar,
    DialogProps,
    useTheme,
    Toolbar
} from "@material-ui/core";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {providerActions} from "../../_actions/provider.action";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {Alert} from "@material-ui/lab";
import {history} from "../../store/history";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {alertActions} from "../../_actions/alert.actions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from '@material-ui/icons/Check';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import TablePaginationActions from '../Common/TablePaginationActionsProps';

export const ListProvider = () => {

    const {providers, alerta, providerSelect} = useSelector(state => ({
        providers: state.providers,
        alerta: state.alert,
        providerSelect: state.providerSelect
    }));
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [providerId, setProviderId] = React.useState("");
    const [nombreDependencia, setnombreDependencia] = React.useState("");
    const [pagination, setPagination] = React.useState({page: 0, pageSize: 10});
    const [openModalProviderInfo, setOpenModalProviderInfo] = React.useState(false);
    const [selectedProvider, setSelectedProvider] = React.useState({
        _id: "",
        fechaAlta: "",
        fechaActualizacion: "",
        dependencia: "",
        estatus: "",
        sistemas: []
    });
    var optionsDate = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('md');

    const handleOpenModalProviderInfo = (provider) => {
        setOpenModalProviderInfo(true);
        setSelectedProvider(provider);
    };

    const handleCloseModalProviderInfo = () => {
        setOpenModalProviderInfo(false);
    };

    const handleClickOpen = (id, dependencia) => {
        setOpen(true);
        setProviderId(id);
        setnombreDependencia(dependencia);
    };

    const handleClose = () => {
        setOpen(false);
    }

    const handleCloseSnackbar = () => {
        dispatch(alertActions.clear());
    };

    const handleChangePage = (event, newPage) => {
        setPagination({page: newPage, pageSize: pagination.pageSize});
        //dispatch(userActions.requestPerPage({page : newPage ,pageSize: pagination.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
        let newSize = parseInt(event.target.value, 10);
        if (pagination.page * newSize > providers.length) {
            setPagination({page: 0, pageSize: parseInt(event.target.value, 10)});
        } else {
            setPagination({page: pagination.page, pageSize: parseInt(event.target.value, 10)});
        }
    };

    const confirmAction = (id) => {
        dispatch(providerActions.deleteProvider(id));
        let initialRange = pagination.page * pagination.pageSize;
        let endRange = pagination.page * pagination.pageSize + pagination.pageSize;
        let totalProviders = providers.length - 1;
        console.log("initialRange " + initialRange + " end range " + endRange + " totalproviders " + totalProviders);
        if (totalProviders <= initialRange) {
            setPagination({page: pagination.page - 1, pageSize: pagination.pageSize});
        }

        handleClose();
    }


    const StyledTableCell = withStyles({
        root: {
            color: '#666666'
        }
    })(TableCell);

    const redirectToRoute = (path) => {
        history.push(path);
    }

    const StyledTableRow = withStyles((theme: Theme) =>
        createStyles({
            root: {
                '&:nth-of-type(odd)': {
                    backgroundColor: theme.palette.action.hover,
                },
            },
        }),
    )(TableRow);


    const useStyles = makeStyles((theme) => ({
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
            marginRight: '-12px',
            marginBottom: '16px',
            backgroundColor: '#ffe01b',
            color: '#666666'
        },
        gridpadding: {
            padding: '2px 0px 2px',
        },
        gridpaddingBot: {
            padding: '14px',
        },
        titlegridModal: {
            color: '#585858'
        },
        body2: {
            color: '#666666'
        },
        gridialog: {
            padding: '0px',
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
        toolBarModal: {
            backgroundColor: "#34b3eb"
        },
        whiteStyle: {
            color: '#ffff'
        },
        tableGrantsHead: {
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
    }));

    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    return (
        <div>
            <Grid item xs={12}>
                <Typography variant={"h6"} paragraph className={classes.fontblack} align={"center"}>
                    <b>Lista de proveedores</b>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={alerta.status}
                          autoHideDuration={3000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={alerta.type}>
                        {alerta.message}
                    </Alert>
                </Snackbar>
            </Grid>

            <Dialog fullWidth={true} maxWidth={maxWidth} fullScreen={fullScreen} onClose={handleCloseModalProviderInfo}
                    aria-labelledby="customized-dialog-title" open={openModalProviderInfo}>
                <Toolbar className={classes.toolBarModal}>
                    <Typography variant="h6" className={classes.titleDialogDetail}>
                        <b>Detalle del proveedor</b>
                        <Typography className={classes.whiteStyle}>
                            *(DNC) = Dato No Capturado
                        </Typography>
                    </Typography>
                    <IconButton className={classes.fontblack} edge="end" color="inherit"
                                onClick={handleCloseModalProviderInfo} aria-label="close">
                        <CloseIcon className={classes.whiteStyle}/>
                    </IconButton>
                </Toolbar>
                <DialogContent dividers>
                    <Grid container item md={12} lg={12}>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Proveedor</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedProvider.dependencia}
                            </Typography>
                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Estatus</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedProvider.estatus ? 'Vigente' : 'No vigente'}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Fecha alta</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {new Date(selectedProvider.fechaAlta).toLocaleDateString("es-ES", optionsDate)}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Fecha actualización</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedProvider.fechaActualizacion != null ? new Date(selectedProvider.fechaActualizacion).toLocaleDateString("es-ES", optionsDate) : ""}
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
                                                <StyledTableCell align="center">{selectedProvider.sistemas.find(element => element === 'S2') ? <CheckIcon style={{'color': '#34b3eb'}}/> : <NotInterestedIcon style={{'color': 'red'}}/> }</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow key={"S3S"}>
                                                <StyledTableCell component="th" scope="row">
                                                    {'Sistema de los Servidores Públicos Sancionados'}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{selectedProvider.sistemas.find(element => element === 'S3S') ? <CheckIcon style={{'color': '#34b3eb'}}/> : <NotInterestedIcon style={{'color': 'red'}}/> }</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow key={"S3P"}>
                                                <StyledTableCell component="th" scope="row">
                                                    {'Sistema de los Particulares Sancionados'}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{selectedProvider.sistemas.find(element => element === 'S3P') ? <CheckIcon style={{'color': '#34b3eb'}}/> : <NotInterestedIcon style={{'color': 'red'}}/> }</StyledTableCell>
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
                    id="alert-dialog-title">{"¿Seguro que desea eliminar el proveedor: " + nombreDependencia + "?"}</DialogTitle>
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
                        confirmAction(providerId)
                    }} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid className={classes.gridpaddingBot} spacing={3} container>
                <TableContainer component={Paper}>
                    {providers.length > 0 && <Table aria-label="custom pagination table">
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <TableCell className={classes.tableHeaderColumn} style={{width: 'auto'}}
                                           align="left"><b>Proveedor</b></TableCell>
                                <TableCell className={classes.tableHeaderColumn} style={{width: 'auto'}}
                                           align="left"><b>Estatus</b></TableCell>
                                <TableCell className={classes.tableHeaderColumn} align="left"><b>Fecha alta</b></TableCell>
                                <TableCell className={classes.tableHeaderColumn} align="center"><b>Acciones</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody key="providers">
                            {providers.slice(pagination.page * pagination.pageSize, pagination.page * pagination.pageSize + pagination.pageSize).map((provider) => (
                                <TableRow key={provider._id}>
                                    <TableCell className={classes.fontblack} component="th" scope="row"
                                               style={{width: 'auto'}} align="left">
                                        {provider.dependencia}
                                    </TableCell>
                                    <TableCell className={classes.fontblack} style={{width: 'auto'}} align="left">
                                        {provider.estatus ? 'Vigente' : 'No vigente'}
                                    </TableCell>
                                    <TableCell className={classes.fontblack} style={{width: 'auto'}} align="left">
                                        {new Date(provider.fechaAlta).toLocaleDateString("es-ES", optionsDate)}
                                    </TableCell>
                                    <TableCell style={{width: 230}} align="center">
                                        <Tooltip title="Más información" placement="left">
                                            <Button onClick={() => handleOpenModalProviderInfo(provider)}>
                                                <IconButton style={{color: "#34b3eb"}} aria-label="expand row" size="small">
                                                    <KeyboardArrowDownIcon/>
                                                </IconButton>
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Editar proveedor" placement="top">
                                            <Button onClick={() => redirectToRoute(`/proveedor/editar/${provider._id}`)}
                                                    style={{color: 'gray'}}>
                                                <EditOutlinedIcon style={{color: '#ffe01b'}}/>
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Eliminar proveedor" placement="right">
                                            <Button onClick={() => {
                                                handleClickOpen(provider._id, provider.dependencia)
                                            }}>
                                                <DeleteOutlineOutlinedIcon style={{color: '#f44336'}}/>
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                {pagination.pageSize != undefined && pagination.page != undefined && <TablePagination
                                    rowsPerPageOptions={[3, 5, 10, 25, {label: 'Todos', value: providers.length}]}
                                    colSpan={6}
                                    count={providers.length}
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
            </Grid>
            <Grid spacing={3} justify="flex-end"
                  alignItems="flex-end"
                  container
                  item
                  xs={12}
                  md={12}>
                <Tooltip title="Agregar proveedor" placement="right">
                    <Button onClick={() => redirectToRoute("/proveedor/crear")}
                            variant="contained"
                            className={classes.boton}
                            endIcon={<AddBoxIcon>Crear proveedor</AddBoxIcon>}
                    >
                        Crear proveedor
                    </Button>
                </Tooltip>
            </Grid>
        </div>
    );
}



