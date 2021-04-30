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
    makeStyles,
    Button,
    TableHead,
    ButtonGroup,
    Grid,
    IconButton,
    Modal,
    Typography,
    Snackbar,
    Divider,
    Tooltip,
    Toolbar,
    MenuItem, useTheme, DialogProps
} from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import {Checkboxes, TextField, makeValidate, makeRequired, Select, Switches, DatePicker, DateTimePicker} from 'mui-rff';
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import PropTypes from "prop-types";
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
import {S3SActions} from "../../_actions/s3s.action";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import {Form} from "react-final-form";
import * as Yup from 'yup';
import DateFnsUtils from "@date-io/date-fns";
import {formatISO} from "date-fns";
import deLocale from "date-fns/locale/es";
import {ConnectedCreateRegS3S} from "./createRegS3S";
import NumberFormat from 'react-number-format';
import {OnChange} from 'react-final-form-listeners'
import CloseIcon from "@material-ui/icons/Close";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DocumentTable from './documentTable';

interface FormDataEsquemaS3S {
    fechaCaptura?: String,
    expediente?: String,
    institucionDependencia?: {
        nombre: String,
        clave: String,
        siglas: String
    },
    servidorPublicoSancionado?: {
        rfc: String,
        curp: String,
        nombres: String,
        primerApellido: String,
        segundoApellido: String,
        genero: {
            clave: String,
            valor: String
        },
        puesto: String,
        nivel: String
    },
    autoridadSancionadora?: String,
    tipoFalta?: {
        clave: String,
        valor: String,
        descripcion: String
    },
    tipoSancion?: [{ clave: string, valor: string, descripcion: string }],
    causaMotivoHechos?: String,
    resolucion?: {
        url: String,
        fechaResolucion: String
    },
    multa?: {
        monto: Number,
        moneda: {
            clave: String,
            valor: String
        }
    },
    inhabilitacion?: {
        plazo: String,
        fechaInicial: String,
        fechaFinal: String
    },
    documentos?: [{ id: string, tipo: string, titulo: string, descripcion: string, url: string, fecha: string }],
    observaciones?: String
}

export const ListS3SSchema = () => {
    const {S3SList, alerta, paginationSuper, catalogos, providerUser} = useSelector(state => ({
        S3SList: state.S3S,
        alerta: state.alert,
        paginationSuper: state.pagination,
        catalogos: state.catalogs,
        providerUser: state.providerUser
    }));

    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [RegistroId, setRegistroId] = React.useState("");
    const [nombreUsuario, setNombreUsuario] = React.useState("");
    const [selectedCheckBox, setSelectedCheckBox] = React.useState([]);
    const [query, setQuery] = React.useState({});
    const [openModalUserInfo, setOpenModalUserInfo] = React.useState(false);
    const [selectedRegistro, setSelectedRegistro] = React.useState<FormDataEsquemaS3S>({});
    const [match, setMatch] = React.useState({params: {id: ""}});
    const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('md');
    var optionsDate = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    var optionsOnlyDate = {year: 'numeric', month: 'long', day: 'numeric'};

    const handleOpenModalUserInfo = (user) => {
        setOpenModalUserInfo(true);
        setSelectedRegistro(user);
    };

    const handleCloseModalUserInfo = () => {
        setOpenModalUserInfo(false);
    };

    const handleClickOpen = (id, nameReg) => {
        setOpen(true);
        setRegistroId(id);
        // setNombreUsuario(name+ " "+ primerApellido+ " "+ segundoApellido);
    };


    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseSnackbar = () => {
        dispatch(alertActions.clear());
    };

    const handleChangePage = (event, newPage) => {
        dispatch(S3SActions.requestListS3S({query: query, page: newPage + 1, pageSize: paginationSuper.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
        let newSize = parseInt(event.target.value, 10);
        if (paginationSuper.page * newSize > paginationSuper.totalRows) {
            dispatch(S3SActions.requestListS3S({query: query, page: 1, pageSize: parseInt(event.target.value, 10)}));
        } else {
            dispatch(S3SActions.requestListS3S({query: query, page: 1, pageSize: parseInt(event.target.value, 10)}));
        }
    };

    const confirmAction = (id) => {
        let disco = 1;
        if (Array.isArray(id)) {
            disco = id.length;
        }
        let sizeList = S3SList.length - disco;

        dispatch(S3SActions.deleteRecordRequest(id));
        paginationSuper.totalRows = paginationSuper.totalRows - disco;

        if (sizeList < 1) {
            if (paginationSuper.page - 1 > 0) {
                dispatch(S3SActions.requestListS3S({
                    query: query,
                    page: paginationSuper.page - 1,
                    pageSize: paginationSuper.pageSize
                }));
            } else {
                dispatch(S3SActions.requestListS3S({query: query, page: 1, pageSize: paginationSuper.pageSize}));
            }

        }
        setSelectedCheckBox([]);
        handleClose();
    }

    let EnhancedTableToolbar = () => {
        return (
            <Toolbar className={classes.tool}>
                <div className={classes.title}>
                    {selectedCheckBox.length > 0 &&
                    <Typography color="inherit" variant="subtitle1">
                        {selectedCheckBox.length} registros seleccionados
                    </Typography>
                    }
                </div>
                <div className={classes.spacer}/>
                <div className={classes.actions}>
                    {selectedCheckBox.length > 0 &&
                    <Tooltip title="Delete">
                        <Button style={{color: 'white', padding: '0px'}}
                                onClick={() => {
                                    handleClickOpen(selectedCheckBox, "nomre")
                                }}>
                            <DeleteOutlineOutlinedIcon/>
                        </Button>
                    </Tooltip>
                    }
                </div>
            </Toolbar>
        );
    };

    const handleCheckboxAll = (event) => {
        let array = [];
        if (event.target.checked) {
            for (let schema of S3SList) {
                // @ts-ignore
                array.push(schema._id);
            }
        }
        setSelectedCheckBox(array);
        console.log("array " + array);
    }

    const handleCheckboxClick = (event, id) => {
        event.stopPropagation();
        console.log("checkbox select");
        // @ts-ignore
        const selectedIndex = selectedCheckBox.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedCheckBox, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedCheckBox.slice(1));
        } else if (selectedIndex === selectedCheckBox.length - 1) {
            newSelected = newSelected.concat(selectedCheckBox.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedCheckBox.slice(0, selectedIndex),
                selectedCheckBox.slice(selectedIndex + 1)
            );
        }

        setSelectedCheckBox(newSelected);
        console.log(newSelected);
    };


    function diacriticSensitiveRegex(string = '') {
        string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return string.replace(/a/g, '[a,á,à,ä]')
            .replace(/e/g, '[e,é,ë]')
            .replace(/i/g, '[i,í,ï]')
            .replace(/o/g, '[o,ó,ö,ò]')
            .replace(/u/g, '[u,ü,ú,ù]')
            .replace(/A/g, '[a,á,à,ä]')
            .replace(/E/g, '[e,é,ë]')
            .replace(/I/g, '[i,í,ï]')
            .replace(/O/g, '[o,ó,ö,ò]')
            .replace(/U/g, '[u,ü,ú,ù]')
    }

    interface FormFiltersEsquemaS3S {
        ejercicioFiscal: string,
        nombres?: string,
        primerApellido?: string,
        segundoApellido?: string,
        idnombre?: string,
        puestoNombre?: string,
        fechaCaptura?: string

    }

    const schema = Yup.object().shape({
        expediente: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,25}$'), 'No se permiten cadenas vacías, máximo 25 caracteres').trim(),
        idnombre: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,50}$'), 'No se permiten cadenas vacías, máximo 50 caracteres').trim(),
        SPSnombres: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"), 'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        SPSprimerApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"), 'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        SPSsegundoApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"), 'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        inhabilitacionFechaFinal: Yup.string().nullable(true),
        fechaCaptura: Yup.string().nullable(true),
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);

    // yes, this can even be async!
    async function onSubmit(values: FormDataEsquemaS3S) {
        let newQuery = {};
        for (let [key, value] of Object.entries(values)) {
            if (key === "expediente" && value !== null && value !== '') {
                newQuery["expediente"] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
            } else if (key === "idnombre" && value !== null && value !== '') {
                newQuery["institucionDependencia.nombre"] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
            } else if (key === "SPSnombres" && value !== null && value !== '') {
                newQuery["servidorPublicoSancionado.nombres"] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
            } else if (key === "SPSprimerApellido" && value !== null && value !== '') {
                newQuery["servidorPublicoSancionado.primerApellido"] = {
                    $regex: diacriticSensitiveRegex(value),
                    $options: 'i'
                };
            } else if (key === "SPSsegundoApellido" && value !== null && value !== '') {
                newQuery["servidorPublicoSancionado.segundoApellido"] = {
                    $regex: diacriticSensitiveRegex(value),
                    $options: 'i'
                };
            } else if (key === "tipoSancion") {
                if (value.length > 0) {
                    console.log(value);
                    let arrayObjTipoSancion = value;
                    let acumulado = []
                    for (let obSancion of arrayObjTipoSancion) {
                        // @ts-ignore
                        acumulado.push(JSON.parse(obSancion).clave);
                    }
                    newQuery["tipoSancion.clave"] = {$in: acumulado};
                }
            } else if (key === "inhabilitacionFechaFinal" && value !== null && value !== '') {
                let fecha = Date.parse(value);
                console.log(formatISO(fecha, {representation: 'date'}));
                newQuery["inhabilitacion.fechaFinal"] = formatISO(fecha, {representation: 'date'});
            } else if (key === "fechaCaptura" && value !== null && value !== '') {
                let fecha = Date.parse(value);
                console.log(formatISO(fecha, {representation: 'date'}));
                newQuery["fechaCaptura"] = {$regex: formatISO(fecha, {representation: 'date'})};
                ;
            }
        }
        setQuery(newQuery);
        dispatch(S3SActions.requestListS3S({query: newQuery, page: 1, pageSize: paginationSuper.pageSize}));
    }

    function resetForm(form) {
        form.reset();
        setQuery({});
        dispatch(S3SActions.requestListS3S({page: paginationSuper.page, pageSize: paginationSuper.pageSize}));
    }

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

    var cont = 0;

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                "&$checked": {
                    color: '#ffe01b',
                }
            },
            checked: {},
            indeterminate: {
                color: '#666666'
            },
            tool: {
                color: 'white',
                backgroundColor: '#7f7e7e'
            },
            spacer: {
                flex: "1 1 100%"
            },
            titleDialogDetail: {
                flex: 1,
                color: "#ffff",
            },
            actions: {
                color: theme.palette.text.secondary
            },
            title: {
                flex: "0 0 auto"
            },
            fontblack: {
                color: '#666666'
            },
            titleModal: {
                "padding-top": "13px",
                color: '#585858',
                "font-size": '17px'
            },
            divider: {
                width: '100%',
                backgroundColor: '#ffe01b',
                color: '#666666'
            },
            boton: {
                marginTop: '16px',
                marginLeft: '16px',
                marginRight: '16px',
                marginBottom: '0px',
                backgroundColor: '#ffe01b',
                color: '#666666'
            },
            boton2: {
                marginTop: '16px',
                marginLeft: '16px',
                marginRight: '-10px',
                marginBottom: '0px',
                backgroundColor: '#ffe01b',
                color: '#666666'
            },
            filterContainer: {
                'padding': '10px 10px 20px 10px',
            },
            gridpadding: {
                'padding-top': '10px',
            },
            gridpaddingBottom: {
                'padding-bottom': '10px',
                'padding-left': '10px'
            },
            titlegridModal: {
                color: '#585858'
            },
            body2: {
                color: '#666666'
            },
            marginright: {
                marginRight: '30px',
                marginTop: '15px',
                backgroundColor: '#ffe01b',
                color: '#666666',
                marginBottom: '30px'
            },
            overSelect: {
                'max-height': '19px',
                "white-space": "normal !important"
            },
            paper: {
                'text-align': 'center',
                margin: 0,
                marginTop: '75px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[5],
                padding: theme.spacing(2, 4, 3),
            },
            modal: {
                overflowY: 'auto'
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
            titulo: {
                fontSize: 15,
                fontWeight: "bold",
                marginBottom: 10,
                textDecoration: "underline",
                textDecorationColor: '#34b3eb',
                color: '#34b3eb',
            },
            toolBarModal:{
                backgroundColor: "#34b3eb"
            }
        }),
    );

    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    // @ts-ignore
    // @ts-ignore
    const NOTA = "(DNC)"
    return (

        <div>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={alerta.status}
                      autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={alerta.type}>
                    {alerta.message}
                </Alert>
            </Snackbar>

            <Dialog fullWidth={true} maxWidth={maxWidth} fullScreen={fullScreen} onClose={handleCloseModalUserInfo}
                    aria-labelledby="customized-dialog-title" open={openModalUserInfo}>
                <Toolbar className={classes.toolBarModal}>
                    <Typography variant="h6" className={classes.titleDialogDetail}>
                        <b>Detalle del registro</b>
                        <Typography className={classes.whiteStyle}>
                            *(DNC) = Dato No Capturado
                        </Typography>
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={handleCloseModalUserInfo} aria-label="close">
                        <CloseIcon className={classes.whiteStyle}/>
                    </IconButton>
                </Toolbar>
                <DialogContent dividers>
                    <Grid container item md={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography className={classes.titulo} align={"center"}>
                                    Datos generales
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Expediente</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.expediente ? selectedRegistro.expediente : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Fecha última actualización</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {//@ts-ignore
                                        new Date(selectedRegistro.fechaCaptura).toLocaleDateString("es-ES", optionsDate)}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Nombres</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado?.nombres}
                                </Typography>

                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Primer apellido</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado?.primerApellido}
                                </Typography>

                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Segundo apellido</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado ? selectedRegistro.servidorPublicoSancionado.segundoApellido : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>RFC</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado && selectedRegistro.servidorPublicoSancionado.rfc ? selectedRegistro.servidorPublicoSancionado.rfc : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>CURP</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado && selectedRegistro.servidorPublicoSancionado.curp ? selectedRegistro.servidorPublicoSancionado.curp : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Género</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado && selectedRegistro.servidorPublicoSancionado.genero ? selectedRegistro.servidorPublicoSancionado.genero.valor : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Institución/Dependencia <br/>(Clave)</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.institucionDependencia && selectedRegistro.institucionDependencia.clave ? selectedRegistro.institucionDependencia.clave : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Institución/Dependencia <br/>(Siglas)</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.institucionDependencia && selectedRegistro.institucionDependencia.siglas ? selectedRegistro.institucionDependencia.siglas : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={6} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Institución/Dependencia <br/>(Nombre)</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.institucionDependencia && selectedRegistro.institucionDependencia.nombre ? selectedRegistro.institucionDependencia.nombre : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Puesto</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado && selectedRegistro.servidorPublicoSancionado.puesto ? selectedRegistro.servidorPublicoSancionado.puesto : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Nivel</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado && selectedRegistro.servidorPublicoSancionado.nivel ? selectedRegistro.servidorPublicoSancionado.nivel : NOTA}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography className={classes.titulo} align={"center"}>
                                    Datos de la sanción
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={6} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Tipo de falta</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.tipoFalta ?
                                        (selectedRegistro.tipoFalta.valor + " - Descripción: " + (selectedRegistro.tipoFalta.descripcion ? selectedRegistro.tipoFalta.descripcion : NOTA))
                                        : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={6} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Tipo sanción</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.tipoSancion ? selectedRegistro.tipoSancion.map(e => (
                                        <li>{e.valor} - Descripción: {e.descripcion ? e.descripcion : NOTA}</li>
                                    )) : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Autoridad sancionadora</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.autoridadSancionadora ? selectedRegistro.autoridadSancionadora : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Fecha resolución</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {//@ts-ignore
                                        selectedRegistro.fechaResolucion ? new Date(selectedRegistro.resolucion?.fechaResolucion + "T00:00:00.000").toLocaleDateString("es-ES", optionsOnlyDate) : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Resolución-URL</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.resolucion ? selectedRegistro.resolucion.url : NOTA}
                                </Typography>
                            </Grid>

                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Multa</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.multa ?
                                        (<NumberFormat value={String(selectedRegistro.multa?.monto)} displayType={'text'}thousandSeparator={true} prefix={'$'}/>)
                                        : NOTA}
                                    {selectedRegistro.multa && selectedRegistro.multa.moneda ? selectedRegistro.multa.moneda.clave : ''}

                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Plazo</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.inhabilitacion && selectedRegistro.inhabilitacion.plazo ? selectedRegistro.inhabilitacion.plazo : NOTA}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Fecha inicial</b>
                                </Typography>

                                <Typography className={classes.body2} align="left" variant="body2">
                                    {//@ts-ignore
                                        selectedRegistro.inhabilitacion && selectedRegistro.inhabilitacion.fechaInicial ? new Date(selectedRegistro.inhabilitacion?.fechaInicial + "T00:00:00.000").toLocaleDateString("es-ES", optionsOnlyDate)() : NOTA
                                    }

                                </Typography>

                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Fecha final</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {//@ts-ignore
                                        selectedRegistro.inhabilitacion && selectedRegistro.inhabilitacion.fechaFinal ? new Date(selectedRegistro.inhabilitacion?.fechaFinal + "T00:00:00.000").toLocaleDateString("es-ES", optionsOnlyDate)() : NOTA
                                        }
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={12} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Causa o Motivo de hechos</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.causaMotivoHechos}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={12} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Observaciones</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.observaciones ? selectedRegistro.observaciones : NOTA}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography className={classes.titulo} align={"center"}>
                                    Documentos
                                </Typography>
                            </Grid>
                            {!selectedRegistro.documentos || selectedRegistro.documentos.length<1 ? <Typography className={classes.body2} align="left" variant="body2"><b>*No se proporcionaron documentos</b></Typography> : ''}
                            {selectedRegistro.documentos && selectedRegistro.documentos.length > 0 &&
                                <DocumentTable documents = {selectedRegistro.documentos}/>
                            }

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
                    id="alert-dialog-title">{"¿Seguro que desea eliminar el registro " + nombreUsuario + "?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Los cambios no serán reversibles
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => {
                        confirmAction(RegistroId)
                    }} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            <Grid container>
                <Grid container justify={"center"}>
                    <Typography variant="h6" className={classes.fontblack}>
                        <b>Sistema de los Servidores Públicos Sancionados</b>
                    </Typography>
                </Grid>
                <Grid container className={classes.filterContainer}>
                    <Form
                        onSubmit={onSubmit}
                        validate={validate}
                        render={({handleSubmit, form, values, submitting}) => (
                            <form onSubmit={handleSubmit} noValidate>
                                {alerta.status === undefined &&
                                <div>
                                    <Grid className={classes.gridpadding} container justify={"flex-start"}>
                                        <Typography variant="body1" className={classes.fontblack}>
                                            <b>Búsqueda</b>
                                        </Typography>
                                    </Grid>
                                    <Grid className={classes.gridpadding} spacing={3} container>
                                        <Grid item xs={12} md={3}>
                                            <DatePicker
                                                locale={deLocale}
                                                format={"yyyy-MM-dd"}
                                                label="Última actualización"
                                                name="fechaCaptura"
                                                dateFunsUtils={DateFnsUtils}
                                                clearable={true}
                                                cancelLabel={"Cancelar"}
                                                clearLabel={"Limpiar"}
                                                okLabel={"Aceptar"}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Expediente" name="expediente"/>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Institución / Dependencia" name="idnombre"/>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Nombre(s)" name="SPSnombres"/>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Primer apellido" name="SPSprimerApellido"/>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Segundo apellido" name="SPSsegundoApellido"/>
                                        </Grid>
                                        {catalogos.tipoSancion &&
                                        <Grid item xs={12} md={3}>
                                            <Select inputProps={{
                                                classes: {
                                                    select: classes.overSelect,
                                                },
                                            }} name={`tipoSancion`} label="Tipo sanción" data={catalogos.tipoSancion}
                                                    multiple={true}></Select>
                                        </Grid>}
                                        {catalogos.tipoSancion &&
                                        <OnChange name="tipoSancion">
                                            {(value, previous) => {
                                                for (let item of value) {
                                                    if (item == "") {
                                                        // @ts-ignore
                                                        values.tipoSancion = [];
                                                    }
                                                }
                                            }}
                                        </OnChange>
                                        }
                                        <Grid item xs={12} md={3}>
                                            <DatePicker
                                                locale={deLocale}
                                                format={"yyyy-MM-dd"}
                                                label="Inhabilitación fecha final"
                                                name="inhabilitacionFechaFinal"
                                                dateFunsUtils={DateFnsUtils}
                                                clearable={true}
                                                cancelLabel={"Cancelar"}
                                                clearLabel={"Limpiar"}
                                                okLabel={"Aceptar"}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container justify={"flex-end"}>
                                        <Button className={classes.boton} variant="contained"
                                                onClick={() => {
                                                    resetForm(form)
                                                }}> LIMPIAR </Button>
                                        <Button className={classes.boton2} variant="contained"
                                                type="submit"
                                                disabled={submitting}> BUSCAR </Button>
                                    </Grid>


                                </div>
                                }
                            </form>
                        )}
                    />
                </Grid>
                <Grid item md={12} sm={12}>{selectedCheckBox.length > 0 &&
                <EnhancedTableToolbar></EnhancedTableToolbar>} </Grid>

                <Grid className={`${classes.gridpadding} ${classes.gridpaddingBottom} `} container
                      justify={"flex-start"}>
                    <Typography variant="body1" className={classes.fontblack}>
                        <b>Resultados</b>
                    </Typography>
                </Grid>
                <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        classes={{
                                            root: classes.root,
                                            checked: classes.checked,
                                            indeterminate: classes.indeterminate
                                        }}
                                        indeterminate={selectedCheckBox.length > 0 && selectedCheckBox.length < S3SList.length}
                                        checked={selectedCheckBox.length === S3SList.length}
                                        onClick={event =>
                                            handleCheckboxAll(event)}
                                    />
                                </TableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Expediente</b></StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Institución</b></StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Servidor
                                    público</b></StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Tipo
                                    sanción</b></StyledTableCell>
                                <StyledTableCell align="center"
                                                 className={classes.tableHeaderColumn}><b>Acciones</b></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {S3SList.map((schema) => (
                            <TableBody key="usuarios">

                                <TableRow key={schema._id}>
                                    <TableCell className="selectCheckbox" padding="checkbox">
                                        <Checkbox key={"check" + schema._id}
                                                  onClick={event =>
                                                      handleCheckboxClick(event, schema._id)}
                                                  className="selectCheckbox"
                                                  classes={{
                                                      root: classes.root,
                                                      checked: classes.checked
                                                  }}
                                            // @ts-ignore
                                                  checked={selectedCheckBox.indexOf(schema._id) > -1}

                                        />
                                    </TableCell>
                                    <StyledTableCell style={{width: 140}} align="center">
                                        {schema.expediente}
                                    </StyledTableCell>
                                    {schema.institucionDependencia &&
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {schema.institucionDependencia.nombre}
                                    </StyledTableCell>
                                    }
                                    {schema.servidorPublicoSancionado &&
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {schema.servidorPublicoSancionado.nombres && schema.servidorPublicoSancionado.nombres + " "}
                                        {schema.servidorPublicoSancionado.primerApellido && schema.servidorPublicoSancionado.primerApellido + " "}
                                        {schema.servidorPublicoSancionado.segundoApellido && schema.servidorPublicoSancionado.segundoApellido}
                                    </StyledTableCell>
                                    }

                                    {schema.tipoSancion && <StyledTableCell style={{width: 160}} align="center">
                                        {schema.tipoSancion?.map((sancion) => (
                                            <div>{sancion.valor + " "}</div>
                                        ))}
                                    </StyledTableCell>
                                    }


                                    <StyledTableCell style={{width: 230}} align="center">

                                        <Button style={{padding: '0px'}}
                                                onClick={() => handleOpenModalUserInfo(schema)}>
                                            <Tooltip title="Más información" placement="left">
                                                <IconButton style={{color: "#34b3eb"}} aria-label="expand row"
                                                            size="small">
                                                    <KeyboardArrowDownIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        </Button>


                                        <Button style={{padding: '0px'}}
                                                onClick={() => redirectToRoute(`/editar/S3S/${schema._id}`)}>
                                            <Tooltip title="Editar registro" placement="top">
                                                <Button style={{color: '#ffe01b'}}><EditOutlinedIcon/></Button>
                                            </Tooltip>
                                        </Button>

                                        <Tooltip title="Eliminar registro" placement="right">
                                            <Button style={{color: '#f44336', padding: '0px'}}
                                                    onClick={() => {
                                                        handleClickOpen(schema._id, "nomre")
                                                    }}>
                                                <DeleteOutlineOutlinedIcon/>
                                            </Button>
                                        </Tooltip>

                                    </StyledTableCell>
                                </TableRow>

                            </TableBody>
                        ))}
                        <TableFooter>
                            <TableRow>
                                {paginationSuper.pageSize != undefined && paginationSuper.page != undefined &&
                                <TablePagination
                                    rowsPerPageOptions={[3, 5, 10, 25, {
                                        label: 'Todos',
                                        value: paginationSuper.totalRows
                                    }]}
                                    colSpan={5}
                                    count={paginationSuper.totalRows}
                                    rowsPerPage={paginationSuper.pageSize}
                                    page={paginationSuper.page - 1}
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
                </TableContainer>
            </Grid>

        </div>
    );
}
