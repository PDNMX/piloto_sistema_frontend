import React from 'react';
import { Form } from 'react-final-form';
import {Checkboxes, TextField, makeValidate, makeRequired, Select, Switches, DatePicker} from 'mui-rff';
import {Grid, Button, Divider, MenuItem, Tooltip} from "@material-ui/core";
import * as Yup from 'yup';
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
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import {S3PActions} from "../../_actions/s3p.action";
import deLocale from "date-fns/locale/es";
import {catalogActions} from "../../_actions/catalog.action";
import axios from "axios";


const CreateReg = ({id ,alert, catalogos, registry}) => {
    return <MyForm initialValues={registry != undefined ? registry : {...registry, tipoSancion: [undefined]}} catalogos={catalogos}  alerta={alert} id={id}/>;
}

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

interface MyFormProps {
    initialValues: FormDataEsquemaS3P;
    alerta: { status: boolean , message :""};
    catalogos:{tipoPersona: [], paises:[], estados:[], municipios:[], localidades:[],  vialidades: [],   tipoSancion: [], moneda: [] , tipoDoc: []};
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

    let schema = Yup.object().shape({
        expediente: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres').trim(),
        institucionDependencia : Yup.object().shape({
            nombre:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').required("El campo Nombre de la sección Institución Dependencia es requerido").trim(),
            siglas:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres ').trim(),
            clave: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres').trim()
        }),
        particularSancionado :Yup.object().shape({
            nombreRazonSocial:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres').required("El campo Nombre razon social de Particular sancionado es requerido").trim(),
            objetoSocial: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,100}$'),'No se permiten cadenas vacías, máximo 100 caracteres').trim(),
            rfc: Yup.string().matches(new RegExp("^['A-z-0-9\/ ]{1,13}$"),'No se permiten puntos ,apóstrofes ni cadenas vacías máximo 13 caracteres').trim(),
            tipoPersona: Yup.object().required('El campo Tipo persona de la sección particular sancionado es requerido'),
            telefono:  Yup.string().matches(new RegExp('^[0-9]{12}$'), 'Inserta un número de teléfono válido, 12 caracteres').trim(),
            domicilioMexico: Yup.object().shape({
                pais: Yup.object(),
                entidadFederativa: Yup.object(),
                municipio: Yup.object(),
                codigoPostal:  Yup.string().matches(new RegExp('^[0-9]{5}$'),'Inserta un código postal válido, 5 caracteres máximo').trim(),
                localidad: Yup.object(),
                vialidad: Yup.object(),
                descripcionVialidad:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').trim(),
                numeroExterior:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,20}$'),'No se permiten cadenas vacías, máximo 20 caracteres').trim(),
                numeroInterior: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,20}$'),'No se permiten cadenas vacías, máximo 20 caracteres').trim(),
            }),
            domicilioExranjero: Yup.object().shape({
                calle:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').trim(),
                numeroExterior:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,20}$'),'No se permiten cadenas vacías, máximo 20 caracteres').trim(),
                numeroInterior: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,20}$'),'No se permiten cadenas vacías, máximo 20 caracteres').trim(),
                ciudadLocalidad:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').trim(),
                estadoProvincia:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').trim(),
                pais: Yup.object(),
                codigoPostal:  Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,20}$'),'No se permiten cadenas vacías, máximo 20 caracteres').trim(),
            }),
            directorGeneral:Yup.object().shape({
                nombres:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
                primerApellido:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
                segundoApellido:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
                curp: Yup.string().matches(new RegExp("[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])" +
                    "(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT" +
                    "|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$"), "Introducir un CURP valido")
            }),

            apoderadoLegal:Yup.object().shape({
                nombres:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
                primerApellido:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
                segundoApellido:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
                curp: Yup.string().matches(new RegExp("[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])" +
                    "(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT" +
                    "|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$"), "Introducir un CURP valido")
            })
        }),
        objetoContrato:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,300}$'),'No se permiten cadenas vacías, máximo 300 caracteres').trim(),
        autoridadSancionadora:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').required("El campo Autoridad sancionadora es requerido").trim(),
        tipoFalta:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,100}$'),'No se permiten cadenas vacías, máximo 100 caracteres').trim(),
        tipoSancion: Yup.array().of(
            Yup.object().shape({
                tipoSancion: Yup.object().required("El campo Tipo de sanción es requerido"),
                descripcion: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').trim()
            })
        ).required("Se requiere seleccionar mínimo una opción del campo Tipo sanción"),
        causaMotivoHechos:  Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,200}$'),'No se permiten cadenas vacías, máximo 200 caracteres').required("El campo Causa o motivo de la sanción es requerido").trim(),
        acto:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,200}$'),'No se permiten cadenas vacías, máximo 200 caracteres').trim(),
        responsableSancion:Yup.object().shape({
            nombres: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').required("El campo nombres de la sección Responsable sanción es requerido").trim(),
            primerApellido:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').required("El campo Primer apellido de la sección Responsable sanción es requerido").trim(),
            segundoApellido:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        }),
        resolucion:Yup.object().shape({
            sentido:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,200}$'),'No se permiten cadenas vacías, máximo 200 caracteres').trim(),
            url:Yup.string()
                .matches(/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                    'Introduce una direccion de internet valida'
                ).trim(),
            fechaNotificacion : Yup.string().trim(),
        }),
        multa:Yup.object().shape({
            monto: Yup.string().matches(new RegExp("^([0-9]*[.])?[0-9]+$"),'Solo se permiten números enteros o decimales').required("El campo Monto es requerido").trim(),
            moneda: Yup.object().required("El campo Moneda es requerido"),
        }),
        inhabilitacion: Yup.object().shape({
            plazo:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,200}$'),'No se permiten cadenas vacías, máximo 200 caracteres').trim(),
            fechaInicial:  Yup.string().trim(),
            fechaFinal: Yup.string().trim()
        }),
        observaciones:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,500}$'),'No se permiten cadenas vacías, máximo 500 caracteres').trim(),
        documentos: Yup.array().of(
                Yup.object().shape({
                    id: Yup.string().trim(),
                    titulo: Yup.string().required('El campo Título de la sección Documentos es requerido ').max(50, 'Máximo 50 caracteres').trim(),
                    descripcion: Yup.string().required('El campo Descripción de la sección Documentos es requerido ').max(200, 'Máximo 200 caracteres').trim(),
                    url: Yup.string()
                        .matches(/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                            'Introduce una direccion de internet valida'
                        )
                        .required('El campo URL de la sección Documentos es requerido').trim(),
                    fecha: Yup.string().required("El campo Fecha de la sección Documentos es requerido").trim(),
                    tipo: Yup.object()
                })
        )
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);


    const styles = makeStyles({

        hideGrid:{display: 'none'},
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

    async function requestMunicipio(value) {
        const token = localStorage.token;
        const respuestaArray = await axios.post('http://localhost:3004' + `/getCatalogsMunicipiosPorEstado`, {idEstado: value}, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if(Array.isArray(respuestaArray.data.results)){
            catalogos.municipios = respuestaArray.data.results;
        }

    }


    async function requestLocalidadByMunicipio(value) {
        const token = localStorage.token;
        const respuestaArray = await axios.post('http://localhost:3004' + `/getCatalogsLocalidadesPorEstado`, {idMunicipio: value}, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if(Array.isArray(respuestaArray.data.results)){
            catalogos.localidades = respuestaArray.data.results;
        }

    }
    // yes, this can even be async!
    async function onSubmit(values: FormDataEsquemaS3P) {
        if(id != undefined){
            dispatch(S3PActions.requestCreationS3P({...values, _id : id}));
        }else{
            dispatch(S3PActions.requestCreationS3P(values));
        }
        setOpen(true);
    }

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (

        <div>
            <Grid  container justify={"center"}>
                <Typography  noWrap variant="h6" className={cla.fontblack}>
                    Sistema de los Servidores Públicos Sancionados
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
                mutators={{
                    ...arrayMutators
                }}
                render={({ handleSubmit, form: {
                    mutators: { push, pop }
                }, values, submitting   }) => (
                    <form  onSubmit={handleSubmit} noValidate>
                        {alert.status === undefined &&
                        <div>
                            <Grid key={"GridContainerFormCreateRegS3P"} className= {cla.gridpadding} spacing={3} container >
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Datos del generales
                                    </Typography>
                                    <Divider className={cla.boton}/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Expediente" name="expediente"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Objeto contrato" name="objetoContrato" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Autoridad sancionadora" name="autoridadSancionadora" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Tipo falta" name="tipoFalta" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Causa" name="causaMotivoHechos" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Acto" name="acto" />
                                </Grid>


                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Tipo sanción
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Button  type="button"   onClick={() => push('tipoSancion', undefined)} variant="contained"  className={cla.marginright}>
                                        Agregar Tipo de sanción
                                    </Button>
                                </Grid>

                                <FieldArray name="tipoSancion">
                                    {({ fields }) =>
                                        fields.map((name, index) => (
                                            <Grid item xs={12} md={3} key={name}>
                                                <Grid container >
                                                    <Grid item xs={8} md={11} alignContent={"flex-start"}>
                                                        <Typography className={cla.titleCategory} variant="body1" gutterBottom>
                                                            Tipo de Sanción . #{index + 1}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={3} md={1} alignContent={"flex-end"}>
                                                        <Tooltip title="Remover sanción" placement="left">
                                                         <span
                                                             onClick={() => fields.remove(index)}
                                                             style={{ cursor: 'pointer' }}
                                                         >
                                                          ❌
                                                        </span>
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid>
                                                {catalogos.tipoSancion &&
                                                <Grid item xs={12} md={12}>
                                                    <Select  name={`tipoSancion.${index}.tipoSancion`} label="Tipo de sanción" data={catalogos.tipoSancion} ></Select>
                                                </Grid>}
                                                <Grid item xs={12} md={12}>
                                                    <TextField label="Descripción" name={`tipoSancion.${index}.descripcion`} />
                                                </Grid>
                                            </Grid>
                                        ))
                                    }
                                </FieldArray>


                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Institución Dependencia
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid key={"institucionDependencia.grid.nombre"} item xs={12} md={3}>
                                    <TextField key={"institucionDependencia.nombre"} label="Nombre" name="institucionDependencia.nombre" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Siglas" name="institucionDependencia.siglas"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Clave" name="institucionDependencia.clave" />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Particular sancionado
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Razón social" name="particularSancionado.nombreRazonSocial" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Objeto social" name="particularSancionado.objetoSocial" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="RFC" name="particularSancionado.rfc" />
                                </Grid>
                                {catalogos.tipoPersona &&
                                <Grid item xs={12} md={3}>
                                    <Select  name = "particularSancionado.tipoPersona" label="Tipo persona" data={catalogos.tipoPersona} ></Select>
                                </Grid>
                                }

                                <Grid item xs={12} md={3}>
                                <TextField label="Teléfono" name="particularSancionado.telefono" />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Domicilio méxico
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                {catalogos.paises &&
                                <Grid item xs={12} md={3}>
                                    <Select  name = "particularSancionado.domicilioMexico.pais" label="País" data={catalogos.paises} ></Select>
                                </Grid>
                                }
                                {catalogos.estados &&
                                <Grid key={"grid.particularSancionado.domicilioMexico.entidadFederativa"} item xs={12} md={3}>
                                    <Select key={"particularSancionado.domicilioMexico.entidadFederativa"} name = "particularSancionado.domicilioMexico.entidadFederativa" label="Estado" data={catalogos.estados} ></Select>
                                </Grid>
                                }
                                {catalogos.estados &&
                                <OnChange name="particularSancionado.domicilioMexico.entidadFederativa">
                                    {(value, previous) => {
                                        if(value){
                                            requestMunicipio(value);
                                        }
                                    }}
                                </OnChange>
                                }
                                {catalogos.municipios&&
                                <Grid key={"grid.particularSancionado.domicilioMexico.municipio"} item xs={12} md={3}>
                                    <Select key={"particularSancionado.domicilioMexico.municipio.grid"}  name = "particularSancionado.domicilioMexico.municipio" label="Municipio" data={catalogos.municipios} ></Select>
                                </Grid>
                                }
                                {catalogos.municipios &&
                                <OnChange name="particularSancionado.domicilioMexico.municipio">
                                    {(value, previous) => {
                                        if(value){
                                            requestLocalidadByMunicipio(value);
                                        }
                                    }}
                                </OnChange>
                                }
                                {catalogos.localidades&&
                                <Grid key={"grid.particularSancionado.domicilioMexico.localidad"} item xs={12} md={3}>
                                    <Select key={"particularSancionado.domicilioMexico.localidad.grid"}  name = "particularSancionado.domicilioMexico.localidad" label="Localidad" data={catalogos.localidades} ></Select>
                                </Grid>
                                }
                                <Grid item xs={12} md={3}>
                                    <Select  name = "particularSancionado.domicilioMexico.vialidad" label="Tipo vialidad" data={catalogos.vialidades} ></Select>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Vialidad nombre" name="particularSancionado.domicilioMexico.descripcionVialidad" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Código postal" name="particularSancionado.domicilioMexico.codigoPostal" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Número exterior" name="particularSancionado.domicilioMexico.numeroExterior" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Número interior" name="particularSancionado.domicilioMexico.numeroInterior" />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Domicilio extrangero
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Calle" name="particularSancionado.domicilioExranjero.calle" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Número exterior" name="particularSancionado.domicilioExranjero.numeroExterior" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Número interior" name="particularSancionado.domicilioExranjero.numeroInterior" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Ciudad/ Localidad" name="particularSancionado.domicilioExranjero.ciudadLocalidad" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Estado / Provincia" name="particularSancionado.domicilioExranjero.estadoProvincia" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Select  name = "particularSancionado.domicilioExranjero.pais" label="País" data={catalogos.paises} ></Select>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Código postal" name="particularSancionado.domicilioExranjero.codigoPostal" />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                       DIRECTOR GENERAL
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Nombres" name="particularSancionado.directorGeneral.nombres" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Primer apellido" name="particularSancionado.directorGeneral.primerApellido" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Segundo apellido" name="particularSancionado.directorGeneral.segundoApellido" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="CURP" name="particularSancionado.directorGeneral.curp" />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Apoderado legal
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Nombres" name="particularSancionado.apoderadoLegal.nombres" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Primer apellido" name="particularSancionado.apoderadoLegal.primerApellido" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Segundo apellido" name="particularSancionado.apoderadoLegal.segundoApellido" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="CURP" name="particularSancionado.apoderadoLegal.curp" />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Responsable sanción
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Nombres" name="responsableSancion.nombres" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Primer apellido" name="responsableSancion.primerApellido" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Segundo apellido" name="responsableSancion.segundoApellido" />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                       Resolución
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Sentido" name="resolucion.sentido" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Url" name="resolucion.url" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <DatePicker
                                        locale={deLocale}
                                        format={"yyyy-MM-dd"}
                                        label="Fecha de resolución"
                                        name="resolucion.fechaNotificacion"
                                        dateFunsUtils={DateFnsUtils} />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Multa
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Monto"  name="multa.monto"  />
                                </Grid>

                                {catalogos.moneda &&
                                <Grid item xs={12} md={3}>
                                    <Select name="multa.moneda" label="Moneda" data={catalogos.moneda}></Select>
                                </Grid>
                                }

                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Inhabilitacion
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <TextField label="Plazo"  name="inhabilitacion.plazo"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <DatePicker
                                        locale={deLocale}
                                        format={"yyyy-MM-dd"}
                                        label="Fecha Inicial"
                                        name="inhabilitacion.fechaInicial"
                                        dateFunsUtils={DateFnsUtils} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <DatePicker
                                        locale={deLocale}
                                        format={"yyyy-MM-dd"}
                                        label="Fecha Final"
                                        name="inhabilitacion.fechaFinal"
                                        dateFunsUtils={DateFnsUtils} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Observaciones"  name="observaciones"  />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                        Documentos
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Button  type="button"   onClick={() => push('documentos', undefined)} variant="contained"  className={cla.marginright}>
                                        Agregar Documento
                                    </Button>
                                </Grid>

                                <FieldArray name="documentos">
                                    {({ fields }) =>
                                        fields.map((name, index) => (
                                            <Grid item xs={12} md={3} key={name}>
                                                <Grid container >
                                                    <Grid item xs={8} md={11} alignContent={"flex-start"}>
                                                        <Typography className={cla.titleCategory} variant="body1" gutterBottom>
                                                            Documento . #{index + 1}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={3} md={1} alignContent={"flex-end"}>
                                                        <Tooltip title="Remover documento" placement="left">
                                                         <span
                                                             onClick={() => fields.remove(index)}
                                                             style={{ cursor: 'pointer' }}
                                                         >
                                                          ❌
                                                        </span>
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid>
                                                <Grid className={cla.hideGrid} key={`${name}.GridId`} item xs={12} md={12}>
                                                    <TextField label="Id" name={`documentos.${index}.id`} fieldProps= {{initialValue : index}}  />
                                                </Grid>
                                                <Grid key={`${name}.GridTitulo`} item xs={12} md={12}>
                                                    <TextField label="Título"  name={`documentos.${index}.titulo`} />
                                                </Grid>
                                                {catalogos.tipoDoc &&
                                                <Grid item xs={12} md={12}>
                                                    <Select name={`documentos.${index}.tipo`} label="Tipo de documento" data={catalogos.tipoDoc}></Select>
                                                </Grid>
                                                }
                                                <Grid key={`${name}.GridDes`} item xs={12} md={12}>
                                                    <TextField label="Descripción" name={`documentos.${index}.descripcion`} />
                                                </Grid>
                                                <Grid  key={`${name}.GridUrl`} item xs={12} md={12}>
                                                    <TextField label="URL"   name={`documentos.${index}.url`}  />
                                                </Grid>
                                                <Grid  key={`${name}.GridFecha`} item xs={12} md={12}>
                                                    <DatePicker
                                                        locale={deLocale}
                                                        format={"yyyy-MM-dd"}
                                                        label="Fecha"
                                                        name={`documentos.${index}.fecha`}
                                                        dateFunsUtils={DateFnsUtils} />
                                                </Grid>
                                            </Grid>
                                        ))
                                    }
                                </FieldArray>
                            </Grid>

                            <Grid  spacing={3} justify="flex-end"
                                   alignItems="flex-end"
                                   container
                                   item
                                   xs={12}
                                   md={12}>

                                <Button  onClick={ () => redirectToRoute("/consulta/S3P")} variant="contained"  className={cla.marginright}>
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
                                <Button disabled={!alert.status} onClick={ () => redirectToRoute("/consulta/S3P")} color="primary" autoFocus>
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
        let registry = state.S3P.find(reg=>reg._id === id);
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

export const ConnectedCreateRegS3P = connect(mapStateToProps,mapDispatchToProps)(CreateReg);
