import React from 'react';
import { Form } from 'react-final-form';
import {Checkboxes, TextField, makeValidate, makeRequired, Select, Switches, DateTimePicker} from 'mui-rff';
import {Grid, Button, Divider} from "@material-ui/core";
import * as Yup from 'yup';
import {S2Actions } from "../../_actions/s2.action";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import Typography from "@material-ui/core/Typography";
import { connect } from 'react-redux';
import {makeStyles} from "@material-ui/core/styles";
import {history} from "../../store/history";
import { useDispatch } from "react-redux";
import {requestCreationUser, requestEditUser} from "../../store/mutations";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {alertActions} from "../../_actions/alert.actions";
import { OnChange } from 'react-final-form-listeners'
import DateFnsUtils from "@date-io/date-fns";

const CreateReg = ({id ,alert, catalogos, registry}) => {
    return <MyForm initialValues={registry} catalogos={catalogos}  alerta={alert} id={id}/>;
}

interface FormDataEsquemaS3S {
    fechaCaptura?: String,
    expediente?: String,
    institucionDependencia?: {
        nombre: String,
        clave: String,
        siglas: String
    },
    servidorPublicoSancionado?:{
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
    tipoSancion?: [{clave :String , valor: String , descripcion: String}],
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
    documentos?: [{id: String, tipo:String, titulo:String , descripcion :String , url: String, fecha:String}],
    observaciones?:String
}

interface MyFormProps {
    initialValues: FormDataEsquemaS3S;
    alerta: { status: boolean , message :""};
    catalogos:{genero: [], tipoFalta: [], tipoSancion: [], moneda: [] };
    id: string;
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function MyForm(props: MyFormProps ) {
    let { initialValues ,  alerta, catalogos, id } = props;
    const alert = alerta;
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);


    const schema = Yup.object().shape({
        expediente: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres').trim(),
        idnombre:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').required("El campo Nombres de la sección Institución Dependencia es requerido").trim(),
        idsiglas: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres ').trim(),
        idclave: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres').trim(),
        SPSnombres:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres ' ).required("El campo Nombres de Servidor público es requerido").trim(),
        SPSprimerApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').required("El campo Primer apellido de Servidor público es requerido").trim(),
        SPSsegundoApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        SPSgenero : Yup.object(),
        SPSpuesto:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').required("El campo Puesto de Servidor público es requerido").trim(),
        SPSnivel:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,25}$'),'No se cadenas vacías máximo 25 caracteres').trim(),
        autoridadSancionadora:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        tipoFalta: Yup.object(),
        tpfdescripcion: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').trim(),
        tipoSancion: Yup.array().min(1).required("Se requiere seleccionar mínimo una opción del campo Tipo sanción"),
        tsdescripcion:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').trim(),
        causaMotivoHechos:  Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,500}$'),'No se permiten cadenas vacías, máximo 500 caracteres').required("El campo Causa o motivo de la sanción es requerido").trim(),
        resolucionURL: Yup.string()
            .matches(/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                'Introduce una direccion de internet valida'
            ),
        resolucionFecha:  Yup.string().required("El campo Fecha de resolución es requerido"),
        multaMonto: Yup.string().matches(new RegExp("^([0-9]*[.])?[0-9]+$"),'Solo se permiten números enteros o decimales').required("El campo Monto es requerido"),
        multaMoneda: Yup.object().required("El campo Moneda es requerido"),
        inhabilitacionPlazo:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]*$'),'No se permiten cadenas vacías').trim(),
        inhabilitacionFechaInicial:  Yup.string().required("El campo Fecha inicial de la sección  es requerido"),
        inhabilitacionFechaFinal:  Yup.string().required("El campo Fecha final de la sección  es requerido"),
        observaciones: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,500}$'),'No se permiten cadenas vacías, máximo 500 caracteres').trim(),
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);


    const styles = makeStyles({
        titleCategory:{
            color: '#666666'
        },
        invLine:{
            color: '#FFFFFF80'
        },
        boton:{
            backgroundColor:'#ffe01b',
            color: '#666666',
        },
        marginright:{
            marginRight: '30px',
            backgroundColor:'#ffe01b',
            color: '#666666'
        },
        gridpadding: {
            padding: '30px',
        },
        primary: {
            main: "#89d4f2",
            light: "#bdffff",
            dark: "#34b3eb"
        },
        secondary: {
            main: "#ffe01b",
            light: "#ffff5c",
            dark: "#c8af00"
        },
        fontblack:{
            color: '#666666'
        },
        gridpaddingBottom: {
            'padding-bottom': '10px',
            'padding-left': '10px'
        },
    });


    const redirectToRoute = (path) =>{
        history.push(path);
        dispatch(alertActions.clear());
    }

    const cla = styles();

    const buttonSubmittProps = { // make sure all required component's inputs/Props keys&types match
        variant:"contained",
        color:"primary",
        type:"submit"
    }

    // yes, this can even be async!
    async function onSubmit(values: FormDataEsquemaS3S) {
        if(id != undefined){
            dispatch(S2Actions.requestEditDo({...values, _id : id}));
        }else{
            dispatch(S2Actions.requestCreationS2(values));
        }
        setOpen(true);

    }

    return (

        <div>
            <Grid  container justify={"center"}>
                <Typography  noWrap variant="h6" className={cla.fontblack}>
                    Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación
                </Typography>
            </Grid>
            <Grid  container justify={"center"}>
                <Typography  noWrap variant="h6" className={cla.fontblack}>
                    {id != undefined ? "Edición" :  "Captura" }
                </Typography>
            </Grid>
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={validate}
                render={({ handleSubmit,values, submitting   }) => (
                    <form  onSubmit={handleSubmit} noValidate>
                        {alert.status === undefined &&
                        <div>
                            <Grid className= {cla.gridpadding} spacing={3} container >
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Datos del generales
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Expediente" name="expediente"  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <TextField label="Autoridad sancionadora"  name="autoridadSancionadora"  />
                                </Grid>

                                /* Institucion dependencia ----------------------*/
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Institución Dependencia
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Nombre" name="idnombre" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Siglas" name="idsiglas"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Clave" name="idclave" />
                                </Grid>


                                /* Servidor Publico ----------------------*/
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Servidor público sancionado
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <TextField label="Nombres" name="SPSnombres"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Primer apellido" name="SPSprimerApellido"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Segundo apellido" name="SPSsegundoApellido" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Select  name = "SPSgenero" label="Género" data={catalogos.genero} ></Select>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Puesto"  name="SPSpuesto"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Nivel"  name="SPSnivel"  />
                                </Grid>
                                /*-------Tipo falta---------*/

                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                       Tipo falta
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>

                                {catalogos.tipoFalta &&
                                <Grid item xs={12} md={3}>
                                    <Select name="tipoFalta" label="Tipo de falta" data={catalogos.tipoFalta}></Select>
                                </Grid>
                                }
                                <Grid item xs={12} md={3}>
                                    <TextField label="Descripción"  name="tpfdescripcion"  />
                                </Grid>

                                /*-----Tipo sancion -------*/

                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Tipo sanción
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>

                                {catalogos.tipoSancion &&
                                <Grid item xs={12} md={3}>
                                    <Select  name = "tipoSancion" label="Tipo de sanción" data={catalogos.tipoSancion} multiple={true} ></Select>
                                </Grid>}
                                <Grid item xs={12} md={3}>
                                    <TextField label="Descripción"  name="tsdescripcion"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Causa"  name="causaMotivoHechos"  />
                                </Grid>

                                /*-----------Resolucion--------------*/
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Resolución
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <TextField label="URL"  name="resolucionURL"  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <DateTimePicker
                                        format={"yyyy-MM-dd'T'HH:mm:ss"}
                                        label="Fecha de resolución"
                                        name="resolucionFecha"
                                        dateFunsUtils={DateFnsUtils} />
                                </Grid>


                                /*-----------Multa--------------*/
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Multa
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Monto"  name="multaMonto"  />
                                </Grid>

                                {catalogos.moneda &&
                                <Grid item xs={12} md={3}>
                                    <Select name="multaMoneda" label="Moneda" data={catalogos.moneda}></Select>
                                </Grid>
                                }

                                /*-----------Inhabilitacion--------------*/
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Inhabilitacion
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <TextField label="Plazo"  name="inhabilitacionPlazo"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <DateTimePicker
                                        format={"yyyy-MM-dd'T'HH:mm:ss"}
                                        label="Fecha Inicial"
                                        name="inhabilitacionFechaInicial"
                                        dateFunsUtils={DateFnsUtils} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <DateTimePicker
                                        format={"yyyy-MM-dd'T'HH:mm:ss"}
                                        label="Fecha Final"
                                        name="inhabilitacionFechaFinal"
                                        dateFunsUtils={DateFnsUtils} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Observaciones"  name="observaciones"  />
                                </Grid>

                            </Grid>
                            <Grid  spacing={3} justify="flex-end"
                                   alignItems="flex-end"
                                   container
                                   item
                                   xs={12}
                                   md={12}>

                                <Button  onClick={ () => redirectToRoute("/consulta/S2")} variant="contained"  className={cla.marginright}
                                         type="submit">
                                    Cancelar
                                </Button>
                                <Button  className={cla.boton}  variant="contained"
                                         type="submit"
                                         disabled={submitting}> Guardar </Button>
                            </Grid>
                        </div>
                        }



                        <Dialog
                            disableBackdropClick
                            disableEscapeKeyDown
                            open={open}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Resultado"}</DialogTitle>
                            <DialogContent>
                                <DialogContent id="alert-dialog-description">
                                    <Typography  noWrap variant="h6" className={cla.fontblack}>
                                        {alert.message}
                                    </Typography>
                                </DialogContent>
                            </DialogContent>
                            <DialogActions>
                                <Button disabled={!alert.status} onClick={ () => redirectToRoute("/consulta/S2")} color="primary" autoFocus>
                                    Aceptar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </form>
                )}
            />
        </div>
    );
}

function mapStateToProps(state,ownProps){
    let alert = state.alert;
    let catalogos = state.catalogs;
    if( ownProps.match != undefined ){
        let id = ownProps.match.params.id;
        let registry = state.S3S.find(reg=>reg._id === id);
        return {
            id,
            registry,
            alert,
            catalogos
        }
    }else{
        return {alert, catalogos};
    }
}


function mapDispatchToProps(dispatch, ownProps){
    return {};
}

export const ConnectedCreateRegS3S = connect(mapStateToProps,mapDispatchToProps)(CreateReg);
