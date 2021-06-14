import React from 'react';
import { Form, Field } from 'react-final-form';
import { TextField, makeValidate, makeRequired, Select, DatePicker, Radios } from 'mui-rff';
import { Grid, Button, Tooltip, } from "@material-ui/core";
import * as Yup from 'yup';
import { css } from "@emotion/core";
import Typography from "@material-ui/core/Typography";
import { connect } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { history } from "../../store/history";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { alertActions } from "../../_actions/alert.actions";
import { OnChange } from 'react-final-form-listeners'
import DateFnsUtils from "@date-io/date-fns";
import arrayMutators from 'final-form-arrays'
import { S3PActions } from "../../_actions/s3p.action";
import deLocale from "date-fns/locale/es";
import axios from "axios";


import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@material-ui/core';

import schema from './validate.s3p';

const host = process.env.URLAPI;
// @ts-ignore
const ur = host + process.env.PORTAPI;

const CreateReg = ({ id, alert, catalogos, registry, flagOnlyRead }) => {
    // @ts-ignore
    return <MyForm initialValues={
        registry != undefined ?
            (registry?.particularSancionado?.domicilioMexico ? registry : { ...registry, particularSancionado: { ...registry.particularSancionado, domicilioMexico: { pais: '{"clave":"MX","valor":"México"}' } } })
            : { ...registry, tipoSancion: [], documentos: [], particularSancionado: { domicilioMexico: { pais: '{"clave":"MX","valor":"México"}' } } }}
        catalogos={catalogos} alerta={alert} id={id} flagOnlyRead={flagOnlyRead} />;
}

interface FormDataEsquemaS3P {
    domicilio?: string,
    particularSancionado?: {
        domicilioMexico: {
            pais: {
                valor: String,
                clave: String
            },
            entidadFederativa: {
                valor: String,
                clave: String
            },
            muncipio: {
                valor: String,
                clave: String
            },
            localidad: {
                valor: String,
                clave: String
            },
            vialidad: {
                valor: String,
                clave: String
            },
            codigoPostal: String,
            numeroExterior: String,
            numeroInterior: String
        },
        domicilioExtranjero: {
            pais: {
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
        nombreRazonSocial: String,
        objetoSocial: String,
        rfc: String,
        tipoPersona: String,
        telefono: String
    },
    multa?: {
        monto: Number,
        moneda: {
            clave: String,
            valor: String
        }
    },
    fechaCaptura?: String,
    expediente?: String,
    institucionDependencia?: {
        nombre: String,
        clave: String,
        siglas: String
    },
    directorGeneral?: {
        nombres: String,
        primerApellido: String,
        segundoApellido: String,
        curp: String
    },
    apoderadoLegal?: {
        nombres: String,
        primerApellido: String,
        segundoApellido: String,
        curp: String
    },
    objetoContrato?: String,
    autoridadSancionadora?: String,
    tipoFalta?: String,
    tipoSancion?: [{ clave: string, valor: string, descripcion: string }],
    tipoSancionElement?: { clave: string, valor: string, descripcion: string },
    causaMotivoHechos?: String,
    acto?: String,
    responsableSancion?: {
        nombres: String,
        primerApellido: String,
        segundoApellido: String,
        curp: String
    },
    resolucion?: {
        sentido: String,
        url: String,
        fechaNotificacion: String
    },
    inhabilitacion?: {
        plazo: String,
        fechaInicial: String,
        fechaFinal: String
    },
    documentos?: [{ id: String, tipo: String, titulo: String, descripcion: String, url: String, fecha: String }],
    documentElement?: { id: String, tipo: String, titulo: String, descripcion: String, url: String, fecha: String },
    observaciones?: String
}

interface MyFormProps {
    initialValues: FormDataEsquemaS3P;
    alerta: { status: boolean, message: "" };
    catalogos: { tipoPersona: [], paises: [], estados: [], municipios: [], localidades: [], vialidades: [], tipoSancion: [], moneda: [], tipoDoc: [] };
    id: string;
    flagOnlyRead: boolean;
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function MyForm(props: MyFormProps) {
    let { initialValues, alerta, catalogos, id, flagOnlyRead } = props;
    const alert = alerta;
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [errors, setErrors] = React.useState({ tipoSancionElement: {}, documentElement: {} });
    
    const validate = makeValidate(schema);
    const required = makeRequired(schema);

    const styles = makeStyles({

        hideGrid: { display: 'none' },
        titleCategory: {
            color: '#666666'
        },
        invLine: {
            color: '#FFFFFF80'
        },
        boton1: {
            marginTop: '16px',
            marginLeft: '16px',
            marginRight: '16px',
            marginBottom: '5px',
            backgroundColor: '#ffe01b',
            color: '#666666'
        },
        boton2: {
            marginTop: '16px',
            marginLeft: '16px',
            marginRight: '-23px',
            marginBottom: '5px',
            backgroundColor: '#ffe01b',
            color: '#666666'
        },
        boton: {
            backgroundColor: '#ffe01b',
            color: '#666666',
        },
        overSelect: {
            'max-height': '19px',
            "white-space": "normal !important"
        },
        marginright: {
            marginRight: '30px',
            backgroundColor: '#ffe01b',
            color: '#666666'
        },
        gridpadding: {
            padding: '0px',
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
        fontblack: {
            color: '#666666'
        },
        gridpaddingBottom: {
            'padding-bottom': '10px',
            'padding-left': '10px'
        },
        titulo: {
            fontSize: 15,
            fontWeight: "bold",
            textDecoration: "underline",
            textDecorationColor: '#34b3eb',
            color: '#34b3eb',
        },
        subtitulo: {
            fontSize: 15,
            fontWeight: "bold",
            textDecoration: "underline",
            textDecorationColor: '#585858',
            color: '#585858',
        },
        tableHead: {
            backgroundColor: '#34b3eb'
        },
        tableHeaderColumn: {
            color: '#ffff'
        },
        checked: {},
        indeterminate: {
            color: '#666666'
        },
        mensajeError: { color: "#f44336" },
        select: { boxSizing: 'border-box', maxWidth: "376px" }
    });


    const redirectToRoute = (path) => {
        history.push(path);
        dispatch(alertActions.clear());
    }

    const cla = styles();

    const buttonSubmittProps = { // make sure all required component's inputs/Props keys&types match
        variant: "contained",
        color: "primary",
        type: "submit"
    }

    async function requestMunicipio(value) {
        const token = localStorage.token;
        const respuestaArray = await axios.post(ur + `/getCatalogsMunicipiosPorEstado`, { idEstado: value }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (Array.isArray(respuestaArray.data.results)) {
            catalogos.municipios = respuestaArray.data.results;
        }

    }


    async function requestLocalidadByMunicipio(value, entidad) {
        const token = localStorage.token;
        const respuestaArray = await axios.post(ur + `/getCatalogsLocalidadesPorEstado`, {
            idMunicipio: value,
            idEntidad: entidad
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (Array.isArray(respuestaArray.data.results)) {
            catalogos.localidades = respuestaArray.data.results;
        }

    }

    const clear = ([name], state, { changeValue }) => {
        changeValue(state, name, () => undefined);
    };

    const addSancion = (values, push, clear) => {

        let schema = Yup.object().shape({
            tipoSancion: Yup.string().required('El campo Tipo de sanción es requerido')
        });

        schema.validate(values.tipoSancionElement).then((result) => {

            let data = { ...JSON.parse(values.tipoSancionElement.tipoSancion), descripcion: values.tipoSancionElement.descripcion }

            let registrados = values.tipoSancion.map(e => e.clave.toLowerCase());

            if (registrados.indexOf(data.clave.toLowerCase()) !== -1) {
                setErrors({
                    ...errors,
                    tipoSancionElement: { ...errors.tipoSancionElement, ['tipoSancion']: "Tipo de sanción duplicado" }
                });
            } else {
                push('tipoSancion', data);
                clear('tipoSancionElement');
                setErrors({
                    ...errors,
                    tipoSancionElement: {}
                });
            }
        }).catch((err) => {
            setErrors({
                ...errors,
                tipoSancionElement: { ...errors.tipoSancionElement, [err.path]: err.message }
            });

        });

    };

    const addDocument = async (values, push, clear) => {
        let schema = Yup.object().shape({
            id: Yup.string().trim(),
            titulo: Yup.string()
                .required('El campo Título es requerido')
                .max(50, 'Máximo 50 caracteres')
                .trim(),
            descripcion: Yup.string()
                .required('El campo Descripción es requerido')
                .max(200, 'Máximo 200 caracteres')
                .trim(),
            url: Yup.string()
                .matches(
                    /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                    'Introduce una dirección de internet valida'
                )
                .required('El campo URL es requerido')
                .trim(),
            fecha: Yup.string().required('El campo Fecha es requerido').trim(),
            tipo: Yup.object()
        });

        schema.validate(values.documentElement, { abortEarly: false }).then((result) => {

            let id = values.documentos.length ? parseInt(values.documentos[values.documentos.length - 1].id) + 1 : 1;

            let { titulo, descripcion, url, fecha } = values.documentElement;
            let tipo = typeof values.documentElement.tipo === 'undefined' ? '' : JSON.parse(values.documentElement.tipo).valor;

            let datos = {};

            if (tipo === '') {
                datos = { id, titulo, descripcion, url, fecha };
            } else {
                datos = { id, titulo, tipo, descripcion, url, fecha };
            }

            push('documentos', datos);
            clear('documentElement');
            setErrors({
                ...errors,
                documentElement: {}
            });
        }).catch((err) => {

            let info = {};

            err.inner && err.inner.forEach(e => { info = { ...info, [e.path]: e.message } })


            setErrors({
                ...errors,
                documentElement: info
            });
        });
    };

    // yes, this can even be async!
    async function onSubmit(values: FormDataEsquemaS3P) {

        delete values.documentElement;
        delete values.tipoSancionElement;

        if (id != undefined) {
            dispatch(S3PActions.requestCreationS3P({ ...values, _id: id }));
        } else {
            dispatch(S3PActions.requestCreationS3P(values));
        }
        setOpen(true);
    }

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (

        <>
            <Grid container justify={"center"}>
                <Typography noWrap variant="h6" className={cla.fontblack}>
                    <b>Sistema de los Particulares Sancionados</b>
                </Typography>
            </Grid>
            <Grid container justify={"center"}>
                <Typography noWrap variant="h6" className={cla.fontblack}>
                    <b>{id != undefined ? "Edición" : "Captura"}</b>
                </Typography>
            </Grid>
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={validate}
                mutators={{
                    clear,
                    ...arrayMutators
                }}
                render={({
                    handleSubmit, form: {
                        mutators: { push, pop, clear, remove }
                    }, values, submitting
                }) => (
                    <form onSubmit={handleSubmit} noValidate>
                        {alert.status === undefined &&
                            <fieldset style={{ border: "0px" }} disabled={flagOnlyRead}>
                                <div>
                                    <Grid key={"GridContainerFormCreateRegS3P"} className={cla.gridpadding} spacing={3}
                                        container>
                                        <Grid item xs={12} md={12}>
                                            <Typography className={cla.titulo} align={'center'}>
                                                Datos generales
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Expediente" name="expediente" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField label="Nombre(s)/Razón social *"
                                                name="particularSancionado.nombreRazonSocial" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="RFC" name="particularSancionado.rfc" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField label="Causa, motivo o hechos *" name="causaMotivoHechos"
                                                multiline={true} />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField label="Acto" name="acto" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField label="Objeto contrato" name="objetoContrato" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField label="Tipo falta *" name="tipoFalta" />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Typography className={cla.subtitulo}>
                                                Institución / Dependencia
                                        </Typography>
                                        </Grid>
                                        <Grid key={"institucionDependencia.grid.nombre"} item xs={12} md={6}>
                                            <TextField key={"institucionDependencia.nombre"} label="Nombre(s) *"
                                                name="institucionDependencia.nombre" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Siglas" name="institucionDependencia.siglas" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Clave" name="institucionDependencia.clave" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField label="Observaciones" name="observaciones" multiline={true} />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Typography className={cla.titulo} align={'center'}>
                                                Datos de la sanción
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Typography className={cla.subtitulo}>
                                                Resolución
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Autoridad sancionadora *" name="autoridadSancionadora" />
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
                                                dateFunsUtils={DateFnsUtils}
                                                clearable={true}
                                                cancelLabel={"Cancelar"}
                                                clearLabel={"Limpiar"}
                                                okLabel={"Aceptar"}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={12}>
                                            <Typography className={cla.subtitulo}>
                                                Responsable sanción
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Nombre(s) *" name="responsableSancion.nombres" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Primer apellido *" name="responsableSancion.primerApellido" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Segundo apellido" name="responsableSancion.segundoApellido" />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Typography className={cla.subtitulo}>
                                                Inhabilitación
                                        </Typography>
                                        </Grid>

                                        <Grid item xs={12} md={3}>
                                            <TextField label="Plazo" name="inhabilitacion.plazo" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <DatePicker
                                                locale={deLocale}
                                                format={"yyyy-MM-dd"}
                                                label="Fecha Inicial"
                                                name="inhabilitacion.fechaInicial"
                                                dateFunsUtils={DateFnsUtils}
                                                clearable={true}
                                                cancelLabel={"Cancelar"}
                                                clearLabel={"Limpiar"}
                                                okLabel={"Aceptar"}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <DatePicker
                                                locale={deLocale}
                                                format={"yyyy-MM-dd"}
                                                label="Fecha Final"
                                                name="inhabilitacion.fechaFinal"
                                                dateFunsUtils={DateFnsUtils}
                                                clearable={true}
                                                cancelLabel={"Cancelar"}
                                                clearLabel={"Limpiar"}
                                                okLabel={"Aceptar"}
                                                minDate={values.inhabilitacion?.fechaInicial}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Typography className={cla.subtitulo}>
                                                Multa
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Monto" name="multa.monto" />
                                        </Grid>
                                        {catalogos.moneda &&
                                            <Grid item xs={12} md={3}>
                                                <Select name="multa.moneda" label="Moneda" data={catalogos.moneda} />
                                            </Grid>
                                        }
                                        <Grid item md={6} />
                                        <Grid item xs={12} md={12}>
                                            <Typography className={cla.subtitulo} >
                                                Tipo sanción
                                        </Typography>
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <Select
                                                name={`tipoSancionElement.tipoSancion`}
                                                label="Tipo de sanción *"
                                                data={catalogos.tipoSancion}
                                                className={cla.select}
                                            />
                                            {errors.tipoSancionElement['tipoSancion'] && <span className={cla.mensajeError}>{errors.tipoSancionElement['tipoSancion']}</span>}
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField label="Descripción" name={`tipoSancionElement.descripcion`} />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Button type="button" onClick={() => { addSancion(values, push, clear) }}
                                                variant="contained"
                                                className={cla.marginright}
                                            >
                                                Agregar Tipo de sanción
										</Button>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <TableContainer component={Paper}>
                                                <Table aria-label="custom pagination table">
                                                    <TableHead className={cla.tableHead}>
                                                        <TableRow>
                                                            <TableCell className={cla.tableHeaderColumn}>
                                                                <b>Tipo de Sanción</b>
                                                            </TableCell>
                                                            <TableCell className={cla.tableHeaderColumn}>
                                                                <b>Descripción</b>
                                                            </TableCell>
                                                            <TableCell className={cla.tableHeaderColumn}>
                                                                <b />
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            values?.tipoSancion?.map((sancion, index) => (
                                                                <TableRow key={`tiposancion-${index}`}>
                                                                    <TableCell>{sancion.valor}</TableCell>
                                                                    <TableCell>{sancion.descripcion}</TableCell>
                                                                    <TableCell>
                                                                        <Tooltip title="Remover sanción" placement="left">
                                                                            <span
                                                                                onClick={() => remove('tipoSancion', index)}
                                                                                style={{ cursor: 'pointer' }}
                                                                            >
                                                                                ❌
																			</span>
                                                                        </Tooltip>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        }
                                                        <Field name={'tipoSancion'} render={({ input, meta }) => (
                                                            <TableRow>
                                                                {meta.error && <TableCell colSpan={3} align="center" style={{ color: "#721c24", backgroundColor: "#f8d7da", borderColor: "#f5c6cb" }}>{meta.error}</TableCell>}
                                                            </TableRow>

                                                        )} />
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>

                                        <Grid item xs={12} md={12}>
                                            <Typography className={cla.titulo} align={'center'}>
                                                Datos del particular sancionado
                                        </Typography>
                                        </Grid>
                                        {catalogos.tipoPersona &&
                                            <Grid item xs={12} md={3}>
                                                <Select name="particularSancionado.tipoPersona" label="Tipo persona *"
                                                    data={catalogos.tipoPersona} />
                                            </Grid>
                                        }
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Teléfono" name="particularSancionado.telefono" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField label="Objeto social" name="particularSancionado.objetoSocial"
                                                multiline={true} />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Typography className={cla.subtitulo}>
                                                Director general
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Nombre(s)"
                                                name="particularSancionado.directorGeneral.nombres" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Primer apellido"
                                                name="particularSancionado.directorGeneral.primerApellido" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Segundo apellido"
                                                name="particularSancionado.directorGeneral.segundoApellido" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="CURP" name="particularSancionado.directorGeneral.curp" />
                                        </Grid>

                                        <Grid item xs={12} md={12}>
                                            <Typography className={cla.subtitulo}>
                                                Apoderado legal
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Nombre(s)"
                                                name="particularSancionado.apoderadoLegal.nombres" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Primer apellido"
                                                name="particularSancionado.apoderadoLegal.primerApellido" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Segundo apellido"
                                                name="particularSancionado.apoderadoLegal.segundoApellido" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="CURP" name="particularSancionado.apoderadoLegal.curp" />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Typography className={cla.titulo} align={'center'}>
                                                Domicilio
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Radios
                                                radioGroupProps={{ row: true }}
                                                label="Selecciona el tipo de domicilio para cargar los datos"
                                                name="domicilio"
                                                required={true}
                                                data={[
                                                    { label: 'México', value: 'mex' },
                                                    { label: 'Extranjero', value: 'ext' },
                                                    { label: 'Ninguno', value: '' }
                                                ]}
                                            />
                                        </Grid>
                                        {values.domicilio === 'mex' &&
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={12}>
                                                    <Typography className={cla.subtitulo}>
                                                        Domicilio México
                                            </Typography>
                                                </Grid>
                                                {catalogos.paises &&
                                                    <Grid item xs={12} md={3}>
                                                        <Select disabled name="particularSancionado.domicilioMexico.pais"
                                                            label="País"
                                                            data={catalogos.paises} />
                                                    </Grid>
                                                }
                                                {catalogos.estados &&
                                                    <Grid key={"grid.particularSancionado.domicilioMexico.entidadFederativa"} item
                                                        xs={12} md={3}>
                                                        <Select key={"particularSancionado.domicilioMexico.entidadFederativa"}
                                                            name="particularSancionado.domicilioMexico.entidadFederativa"
                                                            label="Estado" data={catalogos.estados} />
                                                    </Grid>
                                                }
                                                {catalogos.estados &&
                                                    <OnChange name="particularSancionado.domicilioMexico.entidadFederativa">
                                                        {(value, previous) => {
                                                            if (value) {
                                                                requestMunicipio(value);
                                                            }
                                                        }}
                                                    </OnChange>
                                                }
                                                {catalogos.municipios &&
                                                    <Grid key={"grid.particularSancionado.domicilioMexico.municipio"} item xs={12}
                                                        md={3}>
                                                        <Select key={"particularSancionado.domicilioMexico.municipio.grid"}
                                                            name="particularSancionado.domicilioMexico.municipio"
                                                            label="Municipio"
                                                            data={catalogos.municipios} />
                                                    </Grid>
                                                }
                                                {catalogos.municipios &&
                                                    <OnChange name="particularSancionado.domicilioMexico.municipio">
                                                        {(value, previous) => {
                                                            if (value) {
                                                                // @ts-ignore
                                                                requestLocalidadByMunicipio(value, values.particularSancionado.domicilioMexico.entidadFederativa);
                                                            }
                                                        }}
                                                    </OnChange>
                                                }
                                                {catalogos.localidades &&
                                                    <Grid key={"grid.particularSancionado.domicilioMexico.localidad"} item xs={12}
                                                        md={3}>
                                                        <Select key={"particularSancionado.domicilioMexico.localidad.grid"}
                                                            name="particularSancionado.domicilioMexico.localidad"
                                                            label="Localidad"
                                                            data={catalogos.localidades} />
                                                    </Grid>
                                                }
                                                <Grid item xs={12} md={3}>
                                                    <Select name="particularSancionado.domicilioMexico.vialidad"
                                                        label="Tipo vialidad" data={catalogos.vialidades} />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <TextField label="Vialidad nombre"
                                                        name="particularSancionado.domicilioMexico.descripcionVialidad" />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <TextField label="Código postal"
                                                        name="particularSancionado.domicilioMexico.codigoPostal" />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <TextField label="Número exterior"
                                                        name="particularSancionado.domicilioMexico.numeroExterior" />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <TextField label="Número interior"
                                                        name="particularSancionado.domicilioMexico.numeroInterior" />
                                                </Grid>
                                            </Grid>
                                        }

                                        {values.domicilio === 'ext' &&
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={12}>
                                                    <Typography className={cla.subtitulo}>
                                                        Domicilio extranjero
                                            </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <Select name="particularSancionado.domicilioExtranjero.pais" label="País"
                                                        data={catalogos.paises} />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <TextField label="Estado / Provincia"
                                                        name="particularSancionado.domicilioExtranjero.estadoProvincia" />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <TextField label="Ciudad/ Localidad"
                                                        name="particularSancionado.domicilioExtranjero.ciudadLocalidad" />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <TextField label="Calle"
                                                        name="particularSancionado.domicilioExtranjero.calle" />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <TextField label="Número exterior"
                                                        name="particularSancionado.domicilioExtranjero.numeroExterior" />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <TextField label="Número interior"
                                                        name="particularSancionado.domicilioExtranjero.numeroInterior" />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <TextField label="Código postal"
                                                        name="particularSancionado.domicilioExtranjero.codigoPostal" />
                                                </Grid>
                                            </Grid>
                                        }

                                        <Grid item xs={12} md={12}>
                                            <Typography className={cla.titulo} align={'center'}>
                                                Documentos
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField label="Título *" name={`documentElement.titulo`} />
                                            {errors.documentElement['titulo'] && <span className={cla.mensajeError}>{errors.documentElement['titulo']}</span>}
                                        </Grid>
                                        {catalogos.tipoDoc && (
                                            <Grid item xs={12} md={4}>
                                                <Select
                                                    name={`documentElement.tipo`}
                                                    label="Tipo de documento"
                                                    data={catalogos.tipoDoc}
                                                />
                                            </Grid>
                                        )}
                                        <Grid item xs={12} md={4}>
                                            <TextField label="Descripción *" name={`documentElement.descripcion`} />
                                            {errors.documentElement['descripcion'] && <span className={cla.mensajeError}>{errors.documentElement['descripcion']}</span>}
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <TextField label="URL *" name={`documentElement.url`} />
                                            {errors.documentElement['url'] && <span className={cla.mensajeError}>{errors.documentElement['url']}</span>}
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <DatePicker
                                                locale={deLocale}
                                                format={'yyyy-MM-dd'}
                                                label="Fecha *"
                                                name={`documentElement.fecha`}
                                                dateFunsUtils={DateFnsUtils}
                                                clearable={true}
                                                cancelLabel={'Cancelar'}
                                                clearLabel={'Limpiar'}
                                                okLabel={'Aceptar'}
                                            />
                                            {errors.documentElement['fecha'] && <span className={cla.mensajeError}>{errors.documentElement['fecha']}</span>}
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Button
                                                type="button"
                                                onClick={() => addDocument(values, push, clear)}
                                                variant="contained"
                                                className={cla.marginright}
                                            >
                                                Agregar Documento
										</Button>
                                        </Grid>
                                        {values?.documentos?.length ? (
                                            <Grid item xs={12} md={12}>
                                                <TableContainer component={Paper}>
                                                    <Table aria-label="custom pagination table">
                                                        <TableHead className={cla.tableHead}>
                                                            <TableRow>
                                                                <TableCell className={cla.tableHeaderColumn}>
                                                                    <b>ID</b>
                                                                </TableCell>
                                                                <TableCell className={cla.tableHeaderColumn}>
                                                                    <b>Título</b>
                                                                </TableCell>
                                                                <TableCell className={cla.tableHeaderColumn}>
                                                                    <b>Tipo de Documento</b>
                                                                </TableCell>
                                                                <TableCell className={cla.tableHeaderColumn}>
                                                                    <b>Descripción</b>
                                                                </TableCell>
                                                                <TableCell className={cla.tableHeaderColumn}>
                                                                    <b>URL</b>
                                                                </TableCell>
                                                                <TableCell className={cla.tableHeaderColumn}>
                                                                    <b>Fecha</b>
                                                                </TableCell>
                                                                <TableCell className={cla.tableHeaderColumn}>
                                                                    <b />
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {values?.documentos?.map((value, index) => (
                                                                <TableRow key={`documento-${index}`}>
                                                                    <TableCell>{value.id}</TableCell>
                                                                    <TableCell>{value.titulo}</TableCell>
                                                                    <TableCell>
                                                                        {value.tipo}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {value.descripcion}
                                                                    </TableCell>
                                                                    <TableCell>{value.url}</TableCell>
                                                                    <TableCell>
                                                                        {value.fecha ? (new Date(value.fecha.toString()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })) : null}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Tooltip
                                                                            title="Remover documento"
                                                                            placement="left"
                                                                        >
                                                                            <span
                                                                                onClick={() => remove('documentos', index)}
                                                                                style={{ cursor: 'pointer' }}
                                                                            >
                                                                                ❌
                                                                        </span>
                                                                        </Tooltip>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                        ) : null}
                                    </Grid>
                                    <Grid spacing={3} justify="flex-end"
                                        alignItems="flex-end"
                                        container
                                        item
                                        xs={12}
                                        md={12}>

                                        <Button onClick={() => redirectToRoute("/consulta/S3P")} variant="contained"
                                            className={cla.boton1}>
                                            Cancelar
                                    </Button>
                                        <Button className={cla.boton2} variant="contained"
                                            type="submit"
                                            disabled={submitting}> Guardar </Button>
                                    </Grid>
                                </div>
                            </fieldset>
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
                                    <Typography noWrap variant="h6" className={cla.fontblack}>
                                        {alert.message}
                                    </Typography>
                                </DialogContent>
                            </DialogContent>
                            <DialogActions>
                                <Button disabled={!alert.status} onClick={() => redirectToRoute("/consulta/S3P")}
                                    color="primary" autoFocus>
                                    Aceptar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </form>
                )}
            />
        </>
    );
}

function mapStateToProps(state, ownProps) {
    let alert = state.alert;
    let catalogos = state.catalogs;
    if (ownProps.match != undefined) {
        let id = ownProps.match.params.id;
        let flagOnlyRead = ownProps.match.params.flagOnlyRead;
        let registry = state.S3P.find(reg => reg._id === id);
        return {
            id,
            registry,
            alert,
            catalogos,
            flagOnlyRead
        }
    } else {
        return { alert, catalogos };
    }
}


function mapDispatchToProps(dispatch, ownProps) {
    return {};
}

export const ConnectedCreateRegS3P = connect(mapStateToProps, mapDispatchToProps)(CreateReg);