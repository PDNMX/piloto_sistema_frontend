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
    MenuItem, Slide, AppBar
} from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import {Checkboxes, TextField, makeValidate, makeRequired, Select, Switches, DatePicker} from 'mui-rff';
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import PropTypes from "prop-types";
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
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
import {S3PActions} from "../../_actions/s3p.action";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import {Form} from "react-final-form";
import * as Yup from 'yup';
import DateFnsUtils from "@date-io/date-fns";
import {formatISO} from "date-fns";
import {Moment} from "moment";
import deLocale from "date-fns/locale/es";
import {ConnectedCreateRegS3P} from "./createRegS3P";
import NumberFormat from "react-number-format";
import {storeValidate} from "../../store";
import {TransitionProps} from "@material-ui/core/transitions";
import CloseIcon from '@material-ui/icons/Close';

interface FormDataEsquemaS3P {
    particularSancionado?:{
        domicilioMexico:{
            pais:{
                valor: String,
                clave: String
            },
            entidadFederativa:{
                valor: String,
                clave: String
            },
            muncipio:{
                valor: String,
                clave: String
            },
            localidad:{
                valor: String,
                clave: String
            },
            vialidad:{
                valor: String,
                clave: String
            },
            codigoPostal:String,
            numeroExterior: String,
            numeroInterior: String
        },
        domicilioExtranjero:{
            pais:{
                valor: String,
                clave: String
            },
            calle: String,
            ciudadLocalidad: String,
            estadoProvincia: String,
            codigoPostal: String,
            numeroExterior: String,
            numeroInterior: String
        },
        nombreRazonSocial:String,
        objetoSocial: String,
        rfc: String,
        tipoPersona: String,
        telefono: String
    },
    multa?:{
        monto: Number,
        moneda: {
            clave:String,
            valor:String
        }
    },
    fechaCaptura?: String,
    expediente?: String,
    institucionDependencia?: {
        nombre: String,
        clave: String,
        siglas: String
    },
    directorGeneral?:{
        nombres: String,
        primerApellido: String,
        segundoApellido: String,
        curp: String
    },
    apoderadoLegal?:{
        nombres: String,
        primerApellido: String,
        segundoApellido: String,
        curp: String
    },
    objetoContrato?:String,
    autoridadSancionadora?: String,
    tipoFalta?: String,
    tipoSancion?: [{clave :String , valor: String , descripcion: String}],
    causaMotivoHechos?: String,
    acto?: String,
    responsableSancion?:{
        nombres: String,
        primerApellido: String,
        segundoApellido: String,
        curp: String
    },
    resolucion?:{
        sentido: String,
        url: String,
        fechaNotificacion: String
    },
    inhabilitacion?:{
        plazo: String,
        fechaInicial:String,
        fechaFinal:String
    },
    documentos?: [{id: String, tipo:String, titulo:String , descripcion :String , url: String, fecha:String}],
    observaciones?: String
}

export const ListS3PSchema = () => {
    const {S3PList,alerta,paginationSuper,catalogos, permisos} = useSelector(state => ({
        S3PList : state.S3P,
        alerta : state.alert,
        paginationSuper: state.pagination,
        catalogos: state.catalogs,
        permisos: state.permisos
    }));

    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [RegistroId, setRegistroId] = React.useState("");
    const [nombreUsuario, setNombreUsuario] =  React.useState("");
    const [selectedCheckBox, setSelectedCheckBox ] = React.useState([]);
    const [query, setQuery] =  React.useState({});
    const [openModalUserInfo, setOpenModalUserInfo] = React.useState(false);
    const [selectedRegistro, setSelectedRegistro] = React.useState<FormDataEsquemaS3P>({});
    const [match, setMatch] =   React.useState({params: {id: "", flagOnlyRead : true}});
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('body');

    const handleOpenModalUserInfo = (id) => {
        setMatch({params:{id: id, flagOnlyRead : true}})
        setOpenModalUserInfo(true);
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
        dispatch(S3PActions.requestListS3P({query: query, page : newPage +1  ,pageSize: paginationSuper.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
        let newSize= parseInt(event.target.value, 10);
        if(paginationSuper.page * newSize > paginationSuper.totalRows){
            dispatch(S3PActions.requestListS3P({query: query, page: 1 , pageSize: parseInt(event.target.value, 10) }));
        }else{
            dispatch(S3PActions.requestListS3P({query: query, page:  paginationSuper.page , pageSize: parseInt(event.target.value, 10) }));
        }
    };

    const confirmAction = (id) => {
        dispatch(S3PActions.deleteRecordRequest(id));
        paginationSuper.totalRows= paginationSuper.totalRows-1;

        if(S3PList.length <= 1 ){
            if(paginationSuper.page -1 > 0 ){
                dispatch(S3PActions.requestListS3P({query: query, page:  paginationSuper.page -1 , pageSize: paginationSuper.pageSize}));
            }else{
                dispatch(S3PActions.requestListS3P({query: query, page: 1 , pageSize: paginationSuper.pageSize }));
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
            for(let schema of S3PList){
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

    interface FormFiltersEsquemaS3P {
        ejercicioFiscal: string,
        nombres?: string,
        primerApellido?: string,
        segundoApellido?: string,
        idnombre?: string,
        puestoNombre?: string,
    }

    const schema = Yup.object().shape({
        expediente: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres').trim(),
        idnombre:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').trim(),
        SP3nombres:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        SP3primerApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        SP3segundoApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        fechaCaptura:  Yup.string(),
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);

    // yes, this can even be async!
    async function onSubmit(values: FormDataEsquemaS3P) {

        let newQuery = {};
        for (let [key, value] of Object.entries(values)) {
            if(key === "expediente" && value !== null && value !== ''){
                newQuery["expediente"] = { $regex : diacriticSensitiveRegex(value),  $options : 'i'};
            }else if(key === "idnombre" && value !== null && value !== ''){
                newQuery["institucionDependencia.nombre"] = { $regex : diacriticSensitiveRegex(value),  $options : 'i'};
            }else if(key === "SP3nombres" && value !== null && value !== ''){
                newQuery["particularSancionado.nombreRazonSocial"] = { $regex : diacriticSensitiveRegex(value),  $options : 'i'};
            }else if(key === "tipoPersona" && value !== null && value !== ''){
                let objTipoPersona= JSON.parse(value);
                newQuery["particularSancionado.tipoPersona"]= { $in : [objTipoPersona.clave]};
            }else if(key === "tipoSancion" && value !== null && value !== ''){
                console.log(value);
                let arrayObjTipoSancion= value;
                let acumulado= []
                for(let obSancion of arrayObjTipoSancion){
                    // @ts-ignore
                    acumulado.push( JSON.parse(obSancion).clave);
                }
                newQuery["tipoSancion.clave"]= { $in :acumulado };
            }else if(key === "fechaFinal" && value !== null && value !== ''){
                let fecha = Date.parse(value);
                console.log(formatISO(fecha, { representation: 'date' }));
                newQuery["inhabilitacion.fechaFinal"] =  { $regex : formatISO(fecha, { representation: 'date' })};;
            }else if(key === "fechaCaptura" && value !== null && value !== ''){
                let fecha = Date.parse(value);
                console.log(formatISO(fecha, { representation: 'date' }));
                newQuery["fechaCaptura"] =  { $regex : formatISO(fecha, { representation: 'date' })};;
            }else
                if ( value !== null && value !== ''){
                newQuery[key]= { $regex : diacriticSensitiveRegex(value),  $options : 'i'};
            }
        }
        setQuery(newQuery);
        dispatch(S3PActions.requestListS3P({query : newQuery, page: 1 , pageSize: paginationSuper.pageSize }));


    }

    function resetForm (form){
        form.reset();
        setQuery({});
        dispatch(S3PActions.requestListS3P({page: paginationSuper.page , pageSize: paginationSuper.pageSize }));
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
            appBar: {
                position: 'relative',
            },
            paper: {
                'text-align': 'center',
                margin: 0,
                marginTop: '-450px',
                position: 'absolute',
                top: '150%',
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

    const Transition = React.forwardRef(function Transition(
        props: TransitionProps & { children?: React.ReactElement },
        ref: React.Ref<unknown>,
    ) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    // @ts-ignore
    // @ts-ignore
    return (

        <div >
            <Snackbar anchorOrigin={ { vertical: 'top', horizontal: 'center' }}  open={alerta.status} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={alerta.type}>
                    {alerta.message}
                </Alert>
            </Snackbar>


            <Dialog  scroll={scroll} fullScreen open={openModalUserInfo} onClose={handleCloseModalUserInfo} >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleCloseModalUserInfo} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Más información
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Grid item md={12}>
                    <ConnectedCreateRegS3P match = {match}/>
                </Grid>
            </Dialog>


            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"¿Seguro que desea eliminar el Registro "+ nombreUsuario+"?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Los cambios no seran reversibles
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
                        Sistema de los Particulares Sancionados
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
                                            <TextField label="Expediente" name="expediente"  />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Dependencia" name="idnombre" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Nombre/Razón social" name="SP3nombres"  />
                                        </Grid>
                                        {catalogos.tipoSancion &&
                                        <Grid item xs={12} md={3}>
                                            <Select  name={`tipoSancion`} label="Tipo sanción" data={catalogos.tipoSancion} multiple={true} ></Select>
                                        </Grid>}
                                        {catalogos.tipoPersona &&
                                        <Grid item xs={12} md={3}>
                                            <Select  name={`tipoPersona`} label="Tipo persona" data={catalogos.tipoPersona} ></Select>
                                        </Grid>}
                                        <Grid item xs={12} md={3}>
                                            <DatePicker
                                                locale={deLocale}
                                                format={"yyyy-MM-dd"}
                                                label="Última actualización"
                                                name="fechaCaptura"
                                                dateFunsUtils={DateFnsUtils} />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <DatePicker
                                                locale={deLocale}
                                                format={"yyyy-MM-dd"}
                                                label="Fecha de inhabilitación"
                                                name="fechaFinal"
                                                dateFunsUtils={DateFnsUtils} />
                                        </Grid>
                                    </Grid>
                                    <Grid container justify={"flex-end"}>
                                        <Button style={{margin: "0px 8px 0px 0px"}} className={classes.boton}  variant="contained"
                                                onClick={()=> {resetForm(form)}}> LIMPIAR </Button>
                                        <Button  className={classes.boton}  variant="contained"
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
                                        indeterminate={selectedCheckBox.length > 0 && selectedCheckBox.length < S3PList.length}
                                        checked={selectedCheckBox.length === S3PList.length}
                                        onClick={event =>
                                            handleCheckboxAll(event)}
                                    />
                                </TableCell>
                                <StyledTableCell align="center" >Expediente</StyledTableCell>
                                <StyledTableCell align="center">Institución/Dependencia</StyledTableCell>
                                <StyledTableCell align="center" >Nombre/Razón Social</StyledTableCell>
                                <StyledTableCell align="center">Tipo persona</StyledTableCell>
                                <StyledTableCell align="center">Tipo sanción</StyledTableCell>
                                <StyledTableCell align="center">Acciones</StyledTableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody key="usuarios">
                            {S3PList.map((schema)  => (
                                <TableRow key={schema._id}>
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
                                    {schema.particularSancionado &&
                                    <StyledTableCell style={{ width: 160 }} align="center">
                                        {schema.particularSancionado.nombreRazonSocial}
                                    </StyledTableCell>
                                    }
                                    {schema.particularSancionado &&
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {(schema.particularSancionado.tipoPersona == "F") ? "Física" : "Moral"}
                                    </StyledTableCell>
                                    }
                                    {schema.tipoSancion &&
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {schema.tipoSancion?.map((sancion) => (
                                            <div key={"tipoSancion"}>{JSON.parse(sancion.tipoSancion).valor + " "}</div>
                                        ))}
                                    </StyledTableCell>
                                    }

                                    <StyledTableCell style={{ width: 230 }} align="center">
                                        <Button  style= {{padding: '0px' }}  onClick={() => handleOpenModalUserInfo(schema._id)}>
                                            <Tooltip title="Más información" placement="left">
                                                <IconButton aria-label="expand row" size="small" >
                                                    <KeyboardArrowDownIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Button>
                                        <Button  style= {{padding: '0px' }} onClick={ () => redirectToRoute(`/editar/S3P/${schema._id}`)} >
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
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                { paginationSuper.pageSize != undefined  && paginationSuper.page != undefined  && <TablePagination
                                    rowsPerPageOptions={[3,5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={5}
                                    count={paginationSuper.totalRows}
                                    rowsPerPage={paginationSuper.pageSize}
                                    page={paginationSuper.page-1}
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
                </TableContainer>
            </Grid>

        </div>
    );
}