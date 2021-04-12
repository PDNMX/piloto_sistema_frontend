import React from 'react';
import { Form } from 'react-final-form';
import { Checkboxes ,TextField,  makeValidate,makeRequired, Select, Switches} from 'mui-rff';
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

const CreateReg = ({id ,alert, catalogos, registry}) => {
    return <MyForm initialValues={registry} catalogos={catalogos}  alerta={alert} id={id}/>;
}

interface FormDataEsquemaS2 {
    ejercicioFiscal: string,
    ramo?: string,
    nombres?: string,
    primerApellido?: string,
    segundoApellido?: string,
    genero?: { },
    institucionDependencia?:{ },
    tipoArea?: [],
    tipoProcedimiento?:[],
    nivelResponsabilidad?: [],
    idnombre?: string,
    idsiglas?:string,
    idclave?:string ,
    puestoNombre?: string,
    puestoNivel?:string,
    sinombres?: string ,
    siPrimerApellido?: string,
    siSegundoApellido?: string,
    siPuestoNombre?: string,
    siPuestoNivel?:string
}

interface MyFormProps {
    initialValues: FormDataEsquemaS2;
    alerta: { status: boolean , message :""};
    catalogos:{genero: [], ramo: [], puesto: [], tipoArea: [], nivelResponsabilidad:[], tipoProcedimiento:[] };
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
        ejercicioFiscal: Yup.string().matches(new RegExp('^[0-9]{4}$'),'Debe tener 4 dígitos'),
        ramo: Yup.string(),
        rfc: Yup.string().matches(new RegExp("[A-ZÑ&]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9A]"),'No se permiten puntos ,apóstrofes ni cadenas vacías máximo 13 caracteres').trim(),
        curp: Yup.string().matches(new RegExp("[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])" +
            "(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT" +
            "|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$"), "Introducir un CURP valido"),
        nombres : Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías ' ).required("El campo Nombres es requerido").trim(),
        primerApellido : Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías ' ).required("El campo Primer apellido es requerido").trim(),
        segundoApellido :Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías ' ).trim(),
        genero : Yup.object(),
        idnombre:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').required("El campo Nombres de la sección Institución Dependencia es requerido").trim(),
        idsiglas: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres ').trim(),
        idclave: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres').trim(),
        puestoNombre: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten cadenas vacías, máximo 25 caracteres' ).trim()
            .when('puestoNivel',  (puestoNivel) => {
            if(!puestoNivel)
                return Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías, máximo 25 caracteres ' ).trim().required("Al menos un campo de la sección Puesto, es requerido ")
        }),
        puestoNivel :Yup.string().matches(new RegExp("^[a-zA-Z0-9 ]{1,25}$"),'No se permiten números, ni cadenas vacías ' ).trim(),
        tipoArea: Yup.array(),
        nivelResponsabilidad : Yup.array(),
        tipoProcedimiento :Yup.array().min(1).required("Se requiere seleccionar mínimo una opción del campo Tipo de procedimiento"),
        sinombres: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías, máximo 25 caracteres ' ).trim() ,
        siPrimerApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías, máximo 25 caracteres ' ).trim() ,
        siSegundoApellido:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías, máximo 25 caracteres ' ).trim() ,
        siRfc:Yup.string().matches(new RegExp("[A-ZÑ&]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9A]"),'No se permiten puntos ,apóstrofes ni cadenas vacías máximo 13 caracteres').trim(),
        siCurp:Yup.string().matches(new RegExp("[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])" +
            "(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT" +
            "|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$"), "Introducir un CURP valido"),
        siPuestoNombre: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías, máximo 25 caracteres ' ).trim(),
        siPuestoNivel: Yup.string().matches(new RegExp("^[a-zA-Z0-9 ]{1,25}$"),'No se permiten números, ni cadenas vacías, máximo 25 caracteres' ).trim()
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
    async function onSubmit(values: FormDataEsquemaS2) {
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
                                        Datos generales
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField required={true} label="Nombre(s)" name="nombres"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField required={true} label="Primer apellido" name="primerApellido"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Segundo apellido" name="segundoApellido" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Select  name = "genero" label="Género" data={catalogos.genero} ></Select>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Ejercicio fiscal"  name="ejercicioFiscal"  />
                                </Grid>
                                {catalogos.ramo &&
                                <Grid item xs={12} md={3}>
                                    <Select  name = "ramo" label="Ramo" data={catalogos.ramo} ></Select>
                                </Grid>}
                                <Grid item xs={12} md={3}>
                                    <TextField label="RFC" name="rfc" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="CURP" name="curp" />
                                </Grid>
                                {catalogos.tipoArea &&
                                <Grid item xs={12} md={3}>
                                    <Select  name = "tipoArea" label="Tipo de área" data={catalogos.tipoArea} multiple={true} ></Select>
                                </Grid>}
                                {catalogos.tipoArea &&
                                <OnChange name="tipoArea">
                                    {(value, previous) => {
                                        for (let item of value) {
                                            if (item == "") {
                                                // @ts-ignore
                                                values.tipoArea = [];
                                            }
                                        }
                                    }}
                                </OnChange>
                                }

                                {catalogos.nivelResponsabilidad &&
                                <Grid item xs={12} md={3}>
                                    <Select  name = "nivelResponsabilidad" label="Nivel de responsabilidad" data={catalogos.nivelResponsabilidad} multiple={true} ></Select>
                                </Grid>}

                                {catalogos.nivelResponsabilidad &&
                                <OnChange name="nivelResponsabilidad">
                                    {(value, previous) => {
                                        for (let item of value) {
                                            if (item == "") {
                                                // @ts-ignore
                                                values.nivelResponsabilidad = [];
                                            }
                                        }
                                    }}
                                </OnChange>
                                }
                                {catalogos.tipoProcedimiento &&
                                <Grid item xs={12} md={6}>
                                    <Select required={true} name = "tipoProcedimiento" label="Tipo de procedimiento" data={catalogos.tipoProcedimiento} multiple={true} ></Select>
                                </Grid>}
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Institución Dependencia
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField required={true} label="Nombre" name="idnombre" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Siglas" name="idsiglas"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Clave" name="idclave" />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                       Puesto
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField required={true} label="Nombre" name="puestoNombre" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Nivel" name="puestoNivel" />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Superior Inmediato
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <TextField label="Nombre(s)" name="sinombres" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Primer apellido" name="siPrimerApellido"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Segundo apellido" name="siSegundoApellido" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="RFC" name="siRfc" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="CURP" name="siCurp" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Puesto nombre" name="siPuestoNombre"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Puesto nivel" name="siPuestoNivel"  />
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
        let registry = state.S2.find(reg=>reg._id === id);
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

export const ConnectedCreateReg = connect(mapStateToProps,mapDispatchToProps)(CreateReg);
