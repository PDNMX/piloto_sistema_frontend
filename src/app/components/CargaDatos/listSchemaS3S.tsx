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
import {Checkboxes, TextField, makeValidate, makeRequired, Select, Switches, DatePicker} from 'mui-rff';
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
import { OnChange } from 'react-final-form-listeners'
import CloseIcon from "@material-ui/icons/Close";
import useMediaQuery from "@material-ui/core/useMediaQuery";

interface FormDataEsquemaS3S {
    fechaCaptura?: String,
    expediente?: String,
    institucionDependencia?: {
        nombre: String,
        clave: String,
        siglas: String
    },
    servidorPublicoSancionado?:{
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
    tipoSancion?: [{clave :string , valor: string , descripcion: string}],
    causaMotivoHechos?: String,
    resolucion?:{
        url:String,
        fechaResolucion: String
    },
    multa?:{
        monto: Number,
        moneda: {
            clave:String,
            valor:String
        }
    },
    inhabilitacion?:{
        plazo: String,
        fechaInicial:String,
        fechaFinal:String
    },
    documentos?: [{id: string, tipo:string, titulo:string , descripcion :string , url: string, fecha:string}],
    observaciones?:String
}

export const ListS3SSchema = () => {
    const {S3SList,alerta,paginationSuper,catalogos,providerUser, recordsS3S} = useSelector(state => ({
        S3SList : state.S3S,
        alerta : state.alert,
        paginationSuper: state.pagination,
        catalogos: state.catalogs,
        providerUser: state.providerUser,
        recordsS3S: state.recordsS3S
    }));

    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [RegistroId, setRegistroId] = React.useState("");
    const [nombreUsuario, setNombreUsuario] =  React.useState("");
    const [selectedCheckBox, setSelectedCheckBox ] = React.useState([]);
    const [query, setQuery] =  React.useState({});
    const [openModalUserInfo, setOpenModalUserInfo] = React.useState(false);
    const [selectedRegistro, setSelectedRegistro] = React.useState<FormDataEsquemaS3S>({});
    const [match, setMatch] =   React.useState({params: {id: ""}});
    const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('md');

    const handleOpenModalUserInfo = (user) => {
        setOpenModalUserInfo(true);
        setSelectedRegistro(user);
    };

    const handleCloseModalUserInfo = () => {
        setOpenModalUserInfo(false);
    };

    const handleClickOpen = (id ,nameReg) => {
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
        dispatch(S3SActions.requestListS3S({query: query, page : newPage +1  ,pageSize: paginationSuper.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
        let newSize= parseInt(event.target.value, 10);
        if(paginationSuper.page * newSize > paginationSuper.totalRows){
            dispatch(S3SActions.requestListS3S({query: query, page: 1 , pageSize: parseInt(event.target.value, 10) }));
        }else{
            dispatch(S3SActions.requestListS3S({query: query, page: 1 , pageSize: parseInt(event.target.value, 10) }));
        }
    };

    const confirmAction = (id) => {
        dispatch(S3SActions.deleteRecordRequest(id));
        paginationSuper.totalRows= paginationSuper.totalRows-1;

        if(S3SList.length <= 1 ){
            if(paginationSuper.page -1 > 0 ){
                dispatch(S3SActions.requestListS3S({query: query, page:  paginationSuper.page -1 , pageSize: paginationSuper.pageSize}));
            }else{
                dispatch(S3SActions.requestListS3S({query: query, page: 1 , pageSize: paginationSuper.pageSize }));
            }

        }
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
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    {selectedCheckBox.length > 0 &&
                    <Tooltip title="Delete">
                        <Button style={{ color: 'white', padding: '0px' }}
                                onClick= {()=> {handleClickOpen(selectedCheckBox, "nomre")}} >
                            <DeleteOutlineOutlinedIcon/>
                        </Button>
                    </Tooltip>
                    }
                </div>
            </Toolbar>
        );
    };

    const handleCheckboxAll= (event) => {
        let array= [];
        if (event.target.checked) {
            for(let schema of S3SList){
                // @ts-ignore
                array.push(schema._id);
            }
        }
        setSelectedCheckBox(array);
        console.log("array "+array);
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
        fechaCaptura?:string

    }

    const schema = Yup.object().shape({
        expediente: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres').trim(),
        idnombre:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').trim(),
        SPSnombres:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        SPSprimerApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        SPSsegundoApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        inhabilitacionFechaFinal:  Yup.string(),
        fechaCaptura: Yup.string(),
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);

    // yes, this can even be async!
    async function onSubmit(values: FormDataEsquemaS3S) {
        let newQuery = {};
        for (let [key, value] of Object.entries(values)) {
            if(key === "expediente" && value !== null && value !== ''){
                newQuery["expediente"] = { $regex : diacriticSensitiveRegex(value),  $options : 'i'};
            }else if(key === "idnombre" && value !== null && value !== ''){
                newQuery["institucionDependencia.nombre"] = { $regex : diacriticSensitiveRegex(value),  $options : 'i'};
            }else if(key === "SPSnombres" && value !== null && value !== ''){
                newQuery["servidorPublicoSancionado.nombres"] = { $regex : diacriticSensitiveRegex(value),  $options : 'i'};
            }else if(key === "SPSprimerApellido" && value !== null && value !== ''){
                newQuery["servidorPublicoSancionado.primerApellido"] = { $regex : diacriticSensitiveRegex(value),  $options : 'i'};
            }else if(key === "SPSsegundoApellido" && value !== null && value !== ''){
                newQuery["servidorPublicoSancionado.segundoApellido"] = { $regex : diacriticSensitiveRegex(value),  $options : 'i'};
            }else if(key === "tipoSancion" ){
                if(value.length > 0){
                    console.log(value);
                    let arrayObjTipoSancion= value;
                    let acumulado= []
                    for(let obSancion of arrayObjTipoSancion){
                        // @ts-ignore
                        acumulado.push( JSON.parse(obSancion).clave);
                    }
                    newQuery["tipoSancion.clave"]= { $in :acumulado };
                }
            }else if(key === "inhabilitacionFechaFinal" && value !== null && value !== ''){
                let fecha = Date.parse(value);
                console.log(formatISO(fecha, { representation: 'date' }));
                newQuery["inhabilitacion.fechaFinal"] = formatISO(fecha, { representation: 'date' });
            }else if(key === "fechaCaptura" && value !== null && value !== ''){
                let fecha = Date.parse(value);
                console.log(formatISO(fecha, { representation: 'date' }));
                newQuery["fechaCaptura"] =  { $regex : formatISO(fecha, { representation: 'date' })};;
            }
        }
        setQuery(newQuery);
        dispatch(S3SActions.requestListS3S({query : newQuery, page: 1 , pageSize: paginationSuper.pageSize }));
    }

    function resetForm (form){
        form.reset();
        setQuery({});
        dispatch(S3SActions.requestListS3S({page: paginationSuper.page , pageSize: paginationSuper.pageSize }));
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

    var cont=0;

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                "&$checked": {
                    color: '#ffe01b',
                }
            },
            checked: {},
            indeterminate:{
                color: '#666666'
            },
            tool : {
                color: 'white',
                backgroundColor: '#7f7e7e'
            },
            spacer: {
                flex: "1 1 100%"
            },
            titleDialogDetail: {
                flex: 1,
            },
            actions: {
                color: theme.palette.text.secondary
            },
            title: {
                flex: "0 0 auto"
            },
            fontblack:{
                color: '#666666'
            },
            titleModal:{
                "padding-top": "13px",
                color: '#585858',
                "font-size" : '17px'
            },
            divider: {
                width: '100%',
                backgroundColor:'#ffe01b',
                color: '#666666'
            },
            boton:{
                marginTop:'16px',
                marginLeft:'16px',
                marginRight:'16px',
                marginBottom:'0px',
                backgroundColor:'#ffe01b',
                color: '#666666'
            },
            boton2:{
                marginTop:'16px',
                marginLeft:'16px',
                marginRight:'-10px',
                marginBottom:'0px',
                backgroundColor:'#ffe01b',
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
            body2:{
                color: '#666666'
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
                marginTop: '75px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[5],
                padding: theme.spacing(2, 4, 3),
            },
            modal:{
                overflowY: 'auto'
            }
        }),
    );

    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    // @ts-ignore
    // @ts-ignore
    return (

        <div >
            <Snackbar anchorOrigin={ { vertical: 'top', horizontal: 'center' }}  open={alerta.status} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={alerta.type}>
                    {alerta.message}
                </Alert>
            </Snackbar>

            <Dialog fullWidth={true} maxWidth={maxWidth} fullScreen={fullScreen} onClose={handleCloseModalUserInfo} aria-labelledby="customized-dialog-title" open={openModalUserInfo}>
                <Toolbar>
                    <Typography variant="h6" className={classes.titleDialogDetail}>
                        Detalle del registro
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={handleCloseModalUserInfo} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
                <DialogContent dividers>
                <Grid container item md={12} >
                    <Grid container>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                Expediente
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.expediente}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                Fecha Captura
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.fechaCaptura}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Nombres
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.servidorPublicoSancionado?.nombres}
                            </Typography>

                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Primer apellido
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.servidorPublicoSancionado?.primerApellido}
                            </Typography>

                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Segundo apellido
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.servidorPublicoSancionado?.segundoApellido}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Genero
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.servidorPublicoSancionado?.genero?.valor}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                RFC
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.servidorPublicoSancionado?.rfc}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                CURP
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.servidorPublicoSancionado?.curp}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Puesto
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.servidorPublicoSancionado?.puesto}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Nivel
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.servidorPublicoSancionado?.nivel}
                            </Typography>
                        </Grid>
                        <Grid container justify={"center"} item md={12}>
                            <Typography className={classes.titleModal} variant="h6"  align="center">
                                Autoridad Sancionadora
                            </Typography>
                            <Divider orientation="horizontal"  className={classes.divider} />
                        </Grid>

                        <Grid container>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Autoridad Sancionadora
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.autoridadSancionadora}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container justify={"center"} item md={12}>
                            <Typography className={classes.titleModal} variant="h6"  align="center">
                                Tipo falta
                            </Typography>
                            <Divider orientation="horizontal"  className={classes.divider} />
                        </Grid>
                        {selectedRegistro.tipoFalta &&
                        <Grid container>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Clave
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.tipoFalta?.clave}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Valor
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.tipoFalta?.valor}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={6} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Descripción
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.tipoFalta?.descripcion}
                                </Typography>
                            </Grid>
                        </Grid>
                        }

                        <Grid container justify={"center"} item md={12}>
                            <Typography  className={classes.titleModal} variant="h6"  align="center">
                                Tipo Sanción
                            </Typography>
                            <Divider orientation="horizontal"  className={classes.divider} />
                        </Grid>
                        {selectedRegistro.tipoSancion?.map((tipo) => (
                            <Grid container>
                                <Grid className={classes.gridpadding} item md={3} sm={12}>
                                    <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                        Clave
                                    </Typography>
                                    <Typography className={classes.body2} align="left" variant="body2">
                                        {tipo?.clave}
                                    </Typography>
                                </Grid>
                                <Grid className={classes.gridpadding} item md={3} sm={12}>
                                    <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                        Valor
                                    </Typography>
                                    <Typography className={classes.body2} align="left" variant="body2">
                                        {tipo?.valor}
                                    </Typography>
                                </Grid>
                                <Grid className={classes.gridpadding} item md={6} sm={12}>
                                    <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                        Descripción
                                    </Typography>
                                    <Typography className={classes.body2} align="left" variant="body2">
                                        {tipo?.descripcion}
                                    </Typography>
                                </Grid>
                            </Grid>
                        ))}
                        <Grid container justify={"center"} item md={12}>
                            <Typography  className={classes.titleModal} variant="h6"  align="center">
                                Causa o motivo hechos
                            </Typography>
                            <Divider orientation="horizontal"  className={classes.divider} />
                        </Grid>
                        <Grid container>
                            <Grid className={classes.gridpadding} item md={12} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Causa o Motivo de hechos
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.causaMotivoHechos}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justify={"center"} item md={12}>
                            <Typography  className={classes.titleModal} variant="h6"  align="center">
                                Resolución
                            </Typography>
                            <Divider orientation="horizontal"  className={classes.divider} />
                        </Grid>
                            <Grid container>
                                <Grid className={classes.gridpadding} item md={3} sm={12}>
                                    <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                        Fecha Resolución
                                    </Typography>
                                    <Typography className={classes.body2} align="left" variant="body2">
                                        {selectedRegistro.resolucion?.fechaResolucion}
                                    </Typography>
                                </Grid>
                                <Grid className={classes.gridpadding} item md={3} sm={12}>
                                    <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                        URL
                                    </Typography>
                                    <Typography className={classes.body2} align="left" variant="body2">
                                        {selectedRegistro.resolucion?.url}
                                    </Typography>
                                </Grid>
                            </Grid>
                        <Grid container justify={"center"} item md={12}>
                            <Typography  className={classes.titleModal} variant="h6"  align="center">
                                Multa
                            </Typography>
                            <Divider orientation="horizontal"  className={classes.divider} />
                        </Grid>
                        <Grid container>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Monto
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">

                                    <NumberFormat value={String(selectedRegistro.multa?.monto) } displayType={'text'} thousandSeparator={true} prefix={'$'} />

                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Valor
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.multa?.moneda?.valor}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Clave
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.multa?.moneda?.clave}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justify={"center"} item md={12}>
                            <Typography  className={classes.titleModal} variant="h6"  align="center">
                                Inhabilitación
                            </Typography>
                            <Divider orientation="horizontal"  className={classes.divider} />
                        </Grid>
                        <Grid container>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Plazo
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.inhabilitacion?.plazo}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Fecha inicial
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.inhabilitacion?.fechaInicial}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Fecha final
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.inhabilitacion?.fechaFinal}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justify={"center"} item md={12}>
                            <Typography  className={classes.titleModal} variant="h6"  align="center">
                                Observaciones
                            </Typography>
                            <Divider orientation="horizontal"  className={classes.divider} />
                        </Grid>
                        <Grid container>
                            <Grid className={classes.gridpadding} item md={12} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Observaciones
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.observaciones}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justify={"center"} item md={12}>
                            <Typography  className={classes.titleModal} variant="h6"  align="center">
                                Documentos
                            </Typography>
                            <Divider orientation="horizontal"  className={classes.divider} />
                        </Grid>
                        {selectedRegistro.documentos?.map((doc) => (
                            <Grid container>
                                <Grid className={classes.gridpadding} item md={3} sm={12}>
                                    <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                        Id
                                    </Typography>
                                    <Typography className={classes.body2} align="left" variant="body2">
                                        {doc?.id}
                                    </Typography>
                                </Grid>
                                <Grid className={classes.gridpadding} item md={3} sm={12}>
                                    <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                        Tipo
                                    </Typography>
                                    <Typography className={classes.body2} align="left" variant="body2">
                                        {doc?.tipo}
                                    </Typography>
                                </Grid>
                                <Grid className={classes.gridpadding} item md={6} sm={12}>
                                    <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                        Título
                                    </Typography>
                                    <Typography className={classes.body2} align="left" variant="body2">
                                        {doc?.titulo}
                                    </Typography>
                                </Grid>
                                <Grid className={classes.gridpadding} item md={6} sm={12}>
                                    <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                        Descricpción
                                    </Typography>
                                    <Typography className={classes.body2} align="left" variant="body2">
                                        {doc?.descripcion}
                                    </Typography>
                                </Grid>
                                <Grid className={classes.gridpadding} item md={6} sm={12}>
                                    <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                        URL
                                    </Typography>
                                    <Typography className={classes.body2} align="left" variant="body2">
                                        {doc?.url}
                                    </Typography>
                                </Grid>
                                <Grid className={classes.gridpadding} item md={6} sm={12}>
                                    <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                        Fecha
                                    </Typography>
                                    <Typography className={classes.body2} align="left" variant="body2">
                                        {doc?.fecha}
                                    </Typography>
                                </Grid>
                            </Grid>

                        ))}
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
                <DialogTitle id="alert-dialog-title">{"¿Seguro que desea eliminar el registro "+ nombreUsuario+"?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Los cambios no serán reversibles
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={()=> {confirmAction(RegistroId)}} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            <Grid container>
                <Grid container justify={"center"}>
                    <Typography  variant="h6" className={classes.fontblack}>
                        Sistema de los Servidores Públicos Sancionados
                    </Typography>
                </Grid>
                <Grid container className={classes.filterContainer} >
                    <Form
                        onSubmit={onSubmit}
                        validate={validate}
                        render={({handleSubmit, form,  values, submitting}) => (
                            <form onSubmit={handleSubmit} noValidate>
                                {alerta.status === undefined &&
                                <div>
                                    <Grid className= {classes.gridpadding} container justify={"flex-start"}>
                                        <Typography  variant="h6" className={classes.fontblack}>
                                            Búsqueda
                                        </Typography>
                                    </Grid>
                                    <Grid className= {classes.gridpadding} spacing={3} container >
                                        <Grid item xs={12} md={3}>
                                            <DatePicker
                                                locale={deLocale}
                                                format={"yyyy-MM-dd"}
                                                label="Última actualización"
                                                name="fechaCaptura"
                                                dateFunsUtils={DateFnsUtils} />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Expediente" name="expediente"  />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Institución / Dependencia" name="idnombre" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Nombre(s)" name="SPSnombres"  />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Primer apellido" name="SPSprimerApellido"  />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Segundo apellido" name="SPSsegundoApellido" />
                                        </Grid>
                                        {catalogos.tipoSancion &&
                                        <Grid item xs={12} md={3}>
                                            <Select  name={`tipoSancion`} label="Tipo sanción" data={catalogos.tipoSancion} multiple={true} ></Select>
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
                                                dateFunsUtils={DateFnsUtils} />
                                        </Grid>
                                    </Grid>
                                    <Grid container justify={"flex-end"}>
                                        <Button className={classes.boton}  variant="contained"
                                                onClick={()=> {resetForm(form)}}> LIMPIAR </Button>
                                        <Button  className={classes.boton2}  variant="contained"
                                                 type="submit"
                                                 disabled={submitting}> BUSCAR </Button>
                                    </Grid>


                                </div>
                                }
                            </form>
                        )}
                    />
                </Grid>
                <Grid item md={12} sm={12}>{selectedCheckBox.length > 0 && <EnhancedTableToolbar></EnhancedTableToolbar>} </Grid>

                <Grid className= {`${classes.gridpadding} ${classes.gridpaddingBottom} `} container justify={"flex-start"}>
                    <Typography  variant="h6" className={classes.fontblack}>
                        Resultados
                    </Typography>
                </Grid>
                <TableContainer  component={Paper}>
                    <Table  aria-label="custom pagination table">
                        <TableHead >
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
                                <StyledTableCell align="center" >Expediente</StyledTableCell>
                                <StyledTableCell align="center">Institución</StyledTableCell>
                                <StyledTableCell align="center" >Servidor público</StyledTableCell>
                                <StyledTableCell align="center">Tipo sanción</StyledTableCell>
                                <StyledTableCell align="center">Acciones</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {S3SList.map((schema)  => (
                        <TableBody key="usuarios">

                                <TableRow key={schema._id} >
                                    <TableCell className="selectCheckbox" padding="checkbox">
                                        <Checkbox  key={"check"+ schema._id}
                                                   onClick={event =>
                                                       handleCheckboxClick(event, schema._id)}
                                                   className="selectCheckbox"
                                                   classes={{
                                                       root: classes.root,
                                                       checked: classes.checked
                                                   }}
                                            // @ts-ignore
                                                   checked={selectedCheckBox.indexOf(schema._id) > -1 }

                                        />
                                    </TableCell>
                                    <StyledTableCell style={{ width: 140 }}  align="center">
                                        {schema.expediente}
                                    </StyledTableCell>
                                    {schema.institucionDependencia &&
                                    <StyledTableCell style={{ width: 160 }}  align="center">
                                        {schema.institucionDependencia.nombre}
                                    </StyledTableCell>
                                    }
                                    {schema.servidorPublicoSancionado &&
                                    <StyledTableCell style={{ width: 160 }} align="center">
                                        {schema.servidorPublicoSancionado.nombres&& schema.servidorPublicoSancionado.nombres + " " }
                                        {schema.servidorPublicoSancionado.primerApellido&& schema.servidorPublicoSancionado.primerApellido + " " }
                                        {schema.servidorPublicoSancionado.segundoApellido&& schema.servidorPublicoSancionado.segundoApellido}
                                    </StyledTableCell>
                                    }

                                    {schema.tipoSancion &&  <StyledTableCell style={{ width: 160 }} align="center">
                                        {schema.tipoSancion?.map((sancion) => (
                                            <div>{sancion.valor+ " "}</div>
                                        ))}
                                    </StyledTableCell>
                                    }


                                    <StyledTableCell style={{ width: 230 }} align="center">

                                        <Button  style= {{padding: '0px' }}  onClick={() => handleOpenModalUserInfo(schema)}>
                                            <Tooltip title="Más información" placement="left">
                                                <IconButton aria-label="expand row" size="small" >
                                                    <KeyboardArrowDownIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Button>



                                        <Button  style= {{padding: '0px' }} onClick={ () => redirectToRoute(`/editar/S3S/${schema._id}`)} >
                                            <Tooltip title="Editar registro" placement="top">
                                                <Button   style={{ color: 'gray'}} ><EditOutlinedIcon/></Button>
                                            </Tooltip>
                                        </Button>

                                        <Tooltip title="Eliminar registro" placement="right">
                                            <Button style={{ color: 'gray', padding: '0px' }}
                                                    onClick= {()=> {handleClickOpen(schema._id, "nomre")}} >
                                                <DeleteOutlineOutlinedIcon/>
                                            </Button>
                                        </Tooltip>

                                    </StyledTableCell>
                                </TableRow>

                        </TableBody>
                                ))}
                        <TableFooter>
                            <TableRow>
                                { paginationSuper.pageSize != undefined  && paginationSuper.page != undefined  && <TablePagination
                                    rowsPerPageOptions={[3,5, 10, 25, { label: 'All', value: paginationSuper.totalRows }]}
                                    colSpan={5}
                                    count={paginationSuper.totalRows}
                                    rowsPerPage={paginationSuper.pageSize}
                                    page={paginationSuper.page-1}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'Registros por página' },
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
