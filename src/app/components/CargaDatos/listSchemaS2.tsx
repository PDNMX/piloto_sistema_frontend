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
    Grid,
    IconButton,
    Typography,
    Snackbar,
    Divider,
    Tooltip,
    Toolbar,
    useTheme, DialogProps
} from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import {TextField, makeValidate, makeRequired, DatePicker} from 'mui-rff';
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Alert} from "@material-ui/lab";
import {createStyles, Theme, withStyles} from '@material-ui/core/styles';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {alertActions} from "../../_actions/alert.actions";
import {history} from "../../store/history";
import {S2Actions} from "../../_actions/s2.action";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import {Form} from "react-final-form";
import * as Yup from 'yup';
import deLocale from "date-fns/locale/es";
import DateFnsUtils from "@date-io/date-fns";
import {formatISO} from "date-fns";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloseIcon from '@material-ui/icons/Close';
import Nota from '../Common/Nota';
import TablePaginationActions from '../Common/TablePaginationActionsProps';

interface FormDataEsquemaS2 {
    fechaCaptura?: string,
    ejercicioFiscal?: String,
    ramo?: { clave?: number, valor?: string },
    nombres?: String,
    primerApellido?: String,
    segundoApellido?: String,
    rfc?: String,
    curp?: String,
    genero?: {
        clave: String,
        valor: String
    },
    institucionDependencia?: {
        nombre: String,
        clave: String,
        siglas: String
    },
    puesto?: {
        nombre: String,
        nivel: String
    },
    tipoArea?: [{ clave: string, valor: string }],
    tipoProcedimiento?: [{ clave: string, valor: string }],
    nivelResponsabilidad?: [{ clave: string, valor: string }],
    superiorInmediato?: {
        nombres: String,
        primerApellido: String,
        segundoApellido: String,
        curp: String,
        rfc: String,
        puesto: {
            nombre: String,
            nivel: String
        }
    },
    observaciones?: String
}

export const ListS2Schema = () => {
    const {S2List, alerta, paginationSuper, providerUser} = useSelector(state => ({
        S2List: state.S2,
        alerta: state.alert,
        paginationSuper: state.pagination,
        providerUser: state.providerUser
    }));


    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [RegistroId, setRegistroId] = React.useState("");
    const [nombreUsuario, setNombreUsuario] = React.useState("");
    const [selectedCheckBox, setSelectedCheckBox] = React.useState([]);
    const [query, setQuery] = React.useState({});
    const [openModalUserInfo, setOpenModalUserInfo] = React.useState(false);
    const [selectedRegistro, setSelectedRegistro] = React.useState<FormDataEsquemaS2>({});
    const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('md');
    var optionsDate = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};

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
        dispatch(S2Actions.requestListS2({query: query, page: newPage + 1, pageSize: paginationSuper.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
        let newSize = parseInt(event.target.value, 10);
        if (paginationSuper.page * newSize > paginationSuper.totalRows) {
            dispatch(S2Actions.requestListS2({query: query, page: 1, pageSize: parseInt(event.target.value, 10)}));
        } else {
            dispatch(S2Actions.requestListS2({query: query, page: 1, pageSize: parseInt(event.target.value, 10)}));
        }
    };

    const confirmAction = (id) => {
        let disco = 1;
        if (Array.isArray(id)) {
            disco = id.length;
        }
        let sizeList = S2List.length - disco;

        dispatch(S2Actions.deleteRecordRequest(id));
        paginationSuper.totalRows = paginationSuper.totalRows - disco;

        if (sizeList < 1) {
            if (paginationSuper.page - 1 > 0) {
                dispatch(S2Actions.requestListS2({
                    query: query,
                    page: paginationSuper.page - 1,
                    pageSize: paginationSuper.pageSize
                }));
            } else {
                dispatch(S2Actions.requestListS2({query: query, page: 1, pageSize: paginationSuper.pageSize}));
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
            for (let schema of S2List) {
                // @ts-ignore
                array.push(schema._id);
            }
        }
        setSelectedCheckBox(array);
        //console.log("array " + array);
    }

    const handleCheckboxClick = (event, id) => {
        event.stopPropagation();
        //console.log("checkbox select");
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

    interface FormFiltersEsquemaS2 {
        ejercicioFiscal: string,
        nombres?: string,
        primerApellido?: string,
        segundoApellido?: string,
        idnombre?: string,
        puestoNombre?: string,
        fechaCaptura?: string
    }

    const schema = Yup.object().shape({
        ejercicioFiscal: Yup.string().matches(new RegExp('^[0-9]{4}$'), 'Debe tener 4 dígitos'),
        nombres: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"), 'no se permiten números, ni cadenas vacias ').trim(),
        primerApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"), 'no se permiten números, ni cadenas vacias ').trim(),
        segundoApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"), 'no se permiten números, ni cadenas vacias ').trim(),
        idnombre: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,50}$'), 'no se permiten cadenas vacias , max 50 caracteres ').trim(),
        puestoNombre: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"), 'no se permiten números, ni cadenas vacias ').trim(),
        fechaCaptura: Yup.string().nullable(true)
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);

    // yes, this can even be async!
    async function onSubmit(values: FormFiltersEsquemaS2) {
        let newQuery = {};
        for (let [key, value] of Object.entries(values)) {
            if (key === "puestoNombre" && value !== null && value !== '') {
                newQuery["puesto.nombre"] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
            } else if (key === "idnombre" && value !== null && value !== '') {
                newQuery["institucionDependencia.nombre"] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
            } else if (key === "fechaCaptura" && value !== null && value !== '') {
                let fecha = Date.parse(value);
                console.log(formatISO(fecha, {representation: 'date'}));
                newQuery["fechaCaptura"] = {$regex: formatISO(fecha, {representation: 'date'})};
                ;
            } else if (value !== null && value !== '') {
                newQuery[key] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
            }
        }
        setQuery(newQuery);
        dispatch(S2Actions.requestListS2({query: newQuery, page: 1, pageSize: paginationSuper.pageSize}));
    }

    function resetForm(form) {
        form.reset();
        setQuery({});
        dispatch(S2Actions.requestListS2({page: paginationSuper.page, pageSize: paginationSuper.pageSize}));
    }

    const StyledTableCell = withStyles({
        root: {
            color: '#666666'
        }
    })(TableCell);

    const redirectToRoute = (path) => {
        history.push(path);
    }

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
            actions: {
                color: theme.palette.text.secondary
            },
            title: {
                flex: "0 0 auto"
            },
            titleDialogDetail: {
                flex: 1,
                color: "#ffff",
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
                backgroundColor: '##b7a426',
                color: '#b7a426',
                margin: '10px'
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
                color: '#666666'
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
            paper: {
                'text-align': 'center',
                margin: 0,
                marginTop: '-10px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[5],

            },
            modal: {
                position: 'absolute',
                top: '10%',
                left: '10%',
                padding: theme.spacing(2, 4, 3),
                overflow: 'scroll',
                height: '100%',
                display: 'block',
                backgroundColor: theme.palette.background.paper
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
            toolBarModal: {
                backgroundColor: "#34b3eb"
            },
            subtitulo: {
                fontSize: 15,
                fontWeight: "bold",
                textDecoration: "underline",
                textDecorationColor: '#585858',
                color: '#585858',
                paddingTop: '10px'
            },
            containerDivider: {
                paddingLeft: '15px',
                paddingRight: '15px'
            }
        })
    );

    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    // @ts-ignore
    // @ts-ignore
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
                    <Grid container item md={12} spacing={1}>
                        <Grid item xs={12}>
                            <Typography className={classes.titulo} align={"center"}>
                                Datos generales
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Ejercicio Fiscal</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.ejercicioFiscal ? selectedRegistro.ejercicioFiscal : <Nota/>}
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
                                <b>Nombre(s)</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.nombres}
                            </Typography>

                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Primer apellido</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.primerApellido}
                            </Typography>

                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Segundo apellido</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.segundoApellido ? selectedRegistro.segundoApellido : <Nota/>}
                            </Typography>
                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>RFC</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.rfc ? selectedRegistro.rfc : <Nota/>}
                            </Typography>
                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>CURP</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.curp ? selectedRegistro.curp : <Nota/>}
                            </Typography>
                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Género</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.genero ? selectedRegistro.genero.valor : <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.subtitulo} align={"left"}>
                                Institución / Dependencia
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Clave</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.institucionDependencia?.clave ? selectedRegistro.institucionDependencia.clave :
                                    <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Siglas</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.institucionDependencia?.siglas ? selectedRegistro.institucionDependencia.siglas :
                                    <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={6} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Nombre</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.institucionDependencia?.nombre}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.containerDivider}>
                            <Divider orientation="horizontal" className={classes.divider} variant={'inset'}
                                     light={true}/>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={6} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Puesto</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.puesto?.nombre ? selectedRegistro.puesto.nombre : <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Nivel</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.puesto?.nivel ? selectedRegistro.puesto.nivel : <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.containerDivider}>
                            <Divider orientation="horizontal" className={classes.divider} variant={'inset'}
                                     light={true}/>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={12} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Observaciones</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.observaciones? selectedRegistro.observaciones: <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.titulo} align={"center"}>
                                Procedimientos
                            </Typography>
                        </Grid>
                        <Grid item md={6} sm={12}>
                            <Typography className={classes.titlegridModal} variant="subtitle2" align="left">
                                <b>Tipo de área</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.tipoArea ? selectedRegistro.tipoArea.map(e => (
                                    <li>{e.valor}</li>
                                )) : <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid item md={6} sm={12}>
                            <Typography className={classes.titlegridModal} variant="subtitle2" align="left">
                                <b>Tipo de procedimiento</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.tipoProcedimiento ? selectedRegistro.tipoProcedimiento.map(e => (
                                    <li>{e.valor}</li>
                                )) : <Nota/>}
                            </Typography>
                        </Grid>


                        <Grid item md={6} sm={12}>
                            <Typography className={classes.titlegridModal} variant="subtitle2" align="left">
                                <b>Nivel de responsabilidad</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.nivelResponsabilidad ? selectedRegistro.nivelResponsabilidad.map(e => (
                                    <li>{e.valor}</li>
                                )) : <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={6} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Ramo</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.ramo ? selectedRegistro.ramo.valor + '(' + selectedRegistro.ramo.clave + ')' :
                                    <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.titulo} align={"center"}>
                                Superior inmediato
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Nombre(s)</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.nombres ? selectedRegistro.superiorInmediato.nombres :
                                    <Nota/>}
                            </Typography>
                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Primer Apellido</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.primerApellido ? selectedRegistro.superiorInmediato.primerApellido :
                                    <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Segundo apellido</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.segundoApellido ? selectedRegistro.superiorInmediato.segundoApellido :
                                    <Nota/>}
                            </Typography>
                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>RFC</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.rfc ? selectedRegistro.superiorInmediato.rfc :
                                    <Nota/>}
                            </Typography>
                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>CURP</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.curp ? selectedRegistro.superiorInmediato.curp :
                                    <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Puesto</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.puesto?.nombre ? selectedRegistro.superiorInmediato.puesto.nombre  :
                                    <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Nivel</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.puesto?.nivel ? selectedRegistro.superiorInmediato.puesto.nivel :
                                    <Nota/>}
                            </Typography>
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
                        <b>Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación</b>
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
                                            <TextField label="Nombre(s)" name="nombres"/>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Primer apellido" name="primerApellido"/>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Segundo apellido" name="segundoApellido"/>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Institución / Dependencia" name="idnombre"/>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Puesto" name="puestoNombre"/>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Ejercicio fiscal" name="ejercicioFiscal"/>
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
                                        indeterminate={selectedCheckBox.length > 0 && selectedCheckBox.length < S2List.length}
                                        checked={selectedCheckBox.length === S2List.length}
                                        onClick={event =>
                                            handleCheckboxAll(event)}
                                    />
                                </TableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Ejercicio
                                    fiscal</b></StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Servidor
                                    público</b></StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Institución</b></StyledTableCell>
                                <StyledTableCell align="center"
                                                 className={classes.tableHeaderColumn}><b>Puesto</b></StyledTableCell>
                                <StyledTableCell align="center"
                                                 className={classes.tableHeaderColumn}><b>Acciones</b></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {S2List.map((schema) => (

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
                                        {schema.ejercicioFiscal}
                                    </StyledTableCell>
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {schema.nombres && schema.nombres + " "}
                                        {schema.primerApellido && schema.primerApellido + " "}
                                        {schema.segundoApellido && schema.segundoApellido}
                                    </StyledTableCell>
                                    {schema.institucionDependencia &&
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {schema.institucionDependencia.nombre}
                                    </StyledTableCell>
                                    }
                                    {schema.puesto &&
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {schema.puesto.nombre}
                                    </StyledTableCell>
                                    }

                                    <StyledTableCell style={{width: 260}} align="center">
                                        <Tooltip title="Más información" placement="left">
                                            <Button style={{padding: '0px'}}
                                                    onClick={() => handleOpenModalUserInfo(schema)}>
                                                <IconButton style={{color: "#34b3eb"}} aria-label="expand row"
                                                            size="small">
                                                    <KeyboardArrowDownIcon/>
                                                </IconButton>

                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Editar registro" placement="top">
                                            <Button style={{padding: '0px'}}
                                                    onClick={() => redirectToRoute(`/editar/S2/${schema._id}`)}>
                                                <Button style={{color: '#ffe01b'}}><EditOutlinedIcon/></Button>

                                            </Button>
                                        </Tooltip>
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
                                    colSpan={6}
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



