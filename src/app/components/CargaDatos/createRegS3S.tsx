import React from 'react';
import { Form } from 'react-final-form';
import { TextField, makeValidate, makeRequired, Select, DatePicker} from 'mui-rff';
import {Grid, Button, Divider, Tooltip} from "@material-ui/core";
import * as Yup from 'yup';
import { css } from "@emotion/core";
import Typography from "@material-ui/core/Typography";
import { connect } from 'react-redux';
import {makeStyles} from "@material-ui/core/styles";
import {history} from "../../store/history";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {alertActions} from "../../_actions/alert.actions";
import DateFnsUtils from "@date-io/date-fns";
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import {S3SActions} from "../../_actions/s3s.action";
import deLocale from "date-fns/locale/es";

const CreateReg = ({id ,alert, catalogos, registry}) => {
        return <MyForm initialValues={registry != undefined ? registry : {...registry, tipoSancionArray: [undefined]}} catalogos={catalogos}  alerta={alert} id={id}/>;
}

interface FormDataEsquemaS3S {
    fechaCaptura?: String,
    expediente?: String,
    idnombre?:String,
    idsiglas?:String,
    idclave?:String,
    SPSnombres?:String,
    SPSprimerApellido?:String,
    SPSsegundoApellido?:String,
    SPSgenero?: {} ,
    SPSpuesto?:String,
    SPSnivel?:String,
    autoridadSancionadora?:String,
    tipoFalta? : {},
    tpfdescripcion?:String,
    tipoSancionArray?: [{ tipoSancion? : string, tsdescripcion?: string}] ,
    tsdescripcion?:String,
    causaMotivoHechos?:String,
    resolucionURL?:String,
    resolucionFecha?:String,
    multa?:{
        monto: Number,
        moneda: {
            clave:String,
            valor:String
        }
    },
    inhabilitacionPlazo?:String,
    inhabilitacionFechaInicial?:String,
    inhabilitacionFechaFinal?:String,
    observaciones?:String,
    documents?:[{id: String, titulo:String, descripcion: String, url :String , fecha: String , tipo: {}}]
}

interface MyFormProps {
    initialValues: FormDataEsquemaS3S;
    alerta: { status: boolean , message :""};
    catalogos:{genero: [], tipoFalta: [], tipoSancion: [], moneda: [] , tipoDoc: []};
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
    const [tipoSancion, setTipoSancion]= React.useState([]);

    let schemaMix = Yup.mixed();


    let schema = Yup.object().shape({
        expediente: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres').trim(),
        idnombre:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').required("El campo Nombres de la sección Institución Dependencia es requerido").trim(),
        idsiglas: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres ').trim(),
        idclave: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,25}$'),'No se permiten cadenas vacías, máximo 25 caracteres').trim(),
        SPrfc: Yup.string().matches(new RegExp("[A-ZÑ&]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9A]"),'No se permiten puntos ,apóstrofes ni cadenas vacías máximo 13 caracteres').trim(),
        SPcurp: Yup.string().matches(new RegExp("[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])" +
        "(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT" +
        "|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$"), "Introducir un CURP valido"),
        SPSnombres:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres ' ).required("El campo Nombres de Servidor público es requerido").trim(),
        SPSprimerApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').required("El campo Primer apellido de Servidor público es requerido").trim(),
        SPSsegundoApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        SPSgenero : Yup.object(),
        SPSpuesto:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'No se permiten números, ni cadenas vacías máximo 25 caracteres').required("El campo Puesto de Servidor público es requerido").trim(),
        SPSnivel:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,25}$'),'No se cadenas vacías, máximo 25 caracteres').trim(),
        autoridadSancionadora:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,100}$"),'No se permiten números, ni cadenas vacías máximo 100 caracteres').trim(),
        tipoFalta: Yup.object().required("El campo Tipo de falta es requerido"),
        tpfdescripcion: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').trim(),
        tipoSancionArray: Yup.array().of(
            Yup.object().shape({
                tipoSancion: Yup.string().required("El campo Tipo de sanción es requerido"),
                tsdescripcion: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').trim()
            })
        ),
        tsdescripcion:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,50}$'),'No se permiten cadenas vacías, máximo 50 caracteres').trim(),
        causaMotivoHechos:  Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\n ]{1,500}$'),'No se permiten cadenas vacías, máximo 500 caracteres').required("El campo Causa o motivo de la sanción es requerido").trim(),
        resolucionURL: Yup.string()
            .matches(/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                'Introduce una direccion de internet valida'
            ).trim(),
        resolucionFecha:  Yup.string().trim().nullable(true)
            .when('resolucionURL',  (resolucionURL) => {
                if(resolucionURL)
                    return  Yup.string().required("El campo Fecha de resolución es requerido").trim()
            }),
        multa:Yup.object().shape({
            monto: Yup.string().matches(new RegExp("^([0-9]*[.])?[0-9]+$"),'Solo se permiten números enteros o decimales').trim()
                .when('moneda',  (moneda) => {
                    if(moneda)
                        return Yup.string().matches(new RegExp("^([0-9]*[.])?[0-9]+$"),'Solo se permiten números enteros o decimales').trim().required("El campo monto es requerido ")
                }),
            moneda: Yup.string()
                .when('monto',  (monto) => {
                    if(monto)
                        return Yup.string().trim().required("El campo moneda es requerido ")
                }),
        }, ['moneda','monto']),
        inhabilitacionPlazo:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]*$'),'No se permiten cadenas vacías').trim(),
        inhabilitacionFechaInicial:  Yup.string().trim().nullable(true),
        inhabilitacionFechaFinal:  Yup.string().trim().nullable(true)
            .when('inhabilitacionFechaInicial',(inhabilitacionFechaInicial) => {
                return Yup.date().min(inhabilitacionFechaInicial, 'La fecha final no pude ser anterior a la fecha inicial')
            }),
        observaciones: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\n\/ ]{1,500}$'),'No se permiten cadenas vacías, máximo 500 caracteres').trim(),
        documents: Yup.array().of(
            Yup.object().shape({
                id: Yup.string().trim(),
                titulo: Yup.string().required('El campo Título de la sección Documentos es requerido ').max(50, 'Máximo 50 caracteres').trim(),
                descripcion: Yup.string().required('El campo Descripción de la sección Documentos es requerido ').max(200, 'Máximo 200 caracteres').trim(),
                url: Yup.string()
                    .matches(/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                        'Introduce una dirección de internet valida'
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
        boton1:{
            marginTop:'16px',
            marginLeft:'16px',
            marginRight:'16px',
            marginBottom:'16px',
            backgroundColor:'#ffe01b',
            color: '#666666'
        },
        boton2:{
            marginTop:'16px',
            marginLeft:'16px',
            marginRight:'-10px',
            marginBottom:'16px',
            backgroundColor:'#ffe01b',
            color: '#666666'
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
    });


    const redirectToRoute = (path) =>{
        history.push(path);
        dispatch(alertActions.clear());
    }

    const verifyTipoSancion= (values, push) => {
        if(values.tipoSancionArray.length < catalogos.tipoSancion.length-1 ){
            push('tipoSancionArray', undefined);
        }
    }

    const removeElementTipoSancion = (fields,index,values) => {
        fields.remove(index)
        if(values.tipoSancionArray[index]){

        }

        console.log(values.tipoSancionArray[index].tipoSancion);
        let value = JSON.parse(values.tipoSancionArray[index].tipoSancion).clave;
        let array =tipoSancion ;
        // @ts-ignore
        var index = tipoSancion.indexOf(value)
        if (index !== -1) {
            array.splice(index, 1);
            setTipoSancion(array);
            console.log(array);
        }
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
            dispatch(S3SActions.requestCreationS3S({...values, _id : id}));
        }else{
            dispatch(S3SActions.requestCreationS3S(values));
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
                    <b>Sistema de los Servidores Públicos Sancionados</b>
                </Typography>
            </Grid>
            <Grid  container justify={"center"}>
                <Typography  noWrap variant="h6" className={cla.fontblack}>
                    <b>{id != undefined ? "Edición" :  "Captura" }</b>
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
                            <Grid className= {cla.gridpadding} spacing={3} container >
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titulo} align={'center'}>
                                        Datos generales
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField required={true} label="Nombre(s)" name="SPSnombres"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField required={true} label="Primer apellido" name="SPSprimerApellido"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Segundo apellido" name="SPSsegundoApellido" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Select  name = "SPSgenero" label="Género" data={catalogos.genero}/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="RFC" name="SPrfc" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="CURP" name="SPcurp" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField required={true} label="Puesto nombre"  name="SPSpuesto"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Puesto nivel"  name="SPSnivel"  />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.subtitulo}>
                                        Institución / Dependencia
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField required={true} label="Nombre" name="idnombre" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Siglas" name="idsiglas"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Clave" name="idclave" />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titulo} align={'center'}>
                                        Datos de la sanción
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Expediente" name="expediente"  />
                                </Grid>
                                {catalogos.tipoFalta &&
                                <Grid item xs={12} md={3}>
                                    <Select required={true} name="tipoFalta" label="Tipo de falta" data={catalogos.tipoFalta}
                                            renderValue={(value: any) => {
                                                return (
                                                    <Tooltip title={JSON.parse(value).valor}>
                                                        <Typography noWrap={true}> {JSON.parse(value).valor} </Typography>
                                                    </Tooltip>)
                                            }}
                                    />
                                </Grid>
                                }
                                <Grid item xs={12} md={6}>
                                    <TextField label="Descripción"  name="tpfdescripcion"  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField label="Causa, motivo o hechos"  name="causaMotivoHechos" required={true} multiline={true}/>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField label="Observaciones"  name="observaciones"  multiline={true}/>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.subtitulo}>
                                        Resolución
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Autoridad sancionadora"  name="autoridadSancionadora"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <DatePicker
                                        locale={deLocale}
                                        format={"yyyy-MM-dd"}
                                        label="Fecha de resolución"
                                        name="resolucionFecha"
                                        dateFunsUtils={DateFnsUtils}
                                        clearable={true}
                                        cancelLabel={"Cancelar"}
                                        clearLabel={"Limpiar"}
                                        okLabel={"Aceptar"}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="URL"  name="resolucionURL"  />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.subtitulo}>
                                        Inhabilitación
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Plazo"  name="inhabilitacionPlazo"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <DatePicker
                                        locale={deLocale}
                                        format={"yyyy-MM-dd"}
                                        label="Fecha Inicial"
                                        name="inhabilitacionFechaInicial"
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
                                        name="inhabilitacionFechaFinal"
                                        dateFunsUtils={DateFnsUtils}
                                        clearable={true}
                                        cancelLabel={"Cancelar"}
                                        clearLabel={"Limpiar"}
                                        okLabel={"Aceptar"}
                                        minDate={values.inhabilitacionFechaInicial}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.subtitulo}>
                                        Multa
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Monto"  name="multa.monto"  />
                                </Grid>
                                {catalogos.moneda &&
                                <Grid item xs={12} md={3}>
                                    <Select name="multa.moneda" label="Moneda" data={catalogos.moneda}></Select>
                                </Grid>
                                }
                                <Grid item md={6}/>
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.subtitulo} >
                                        Tipo sanción
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Button  type="button"   onClick={() =>{
                                        verifyTipoSancion(values, push);
                                       }} variant="contained"  className={cla.marginright}>
                                        Agregar Tipo de sanción
                                    </Button>
                                </Grid>
                                <FieldArray name="tipoSancionArray">
                                    {({ fields }) =>
                                        fields.map((name, index) => (
                                            <Grid item xs={12} md={3} key={name}>
                                                <Grid container >
                                                    <Grid item xs={8} md={11} alignContent={"flex-start"}>
                                                        <Typography className={cla.titleCategory} variant="body1" gutterBottom>
                                                            Tipo de sanción: #{index + 1}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={3} md={1} alignContent={"flex-end"}>
                                                        <Tooltip title="Remover sanción" placement="left">
                                                         <span
                                                             onClick={() => removeElementTipoSancion (fields, index, values ) }
                                                             style={{ cursor: 'pointer' }}
                                                         >
                                                          ❌
                                                        </span>
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid>
                                                {catalogos.tipoSancion &&
                                                <Grid item xs={12} md={12}>
                                                    <Select required={true}  name={`tipoSancionArray.${index}.tipoSancion`} label="Tipo de sanción" data={catalogos.tipoSancion} ></Select>
                                                </Grid>}
                                                <Grid item xs={12} md={12}>
                                                    <TextField label="Descripción" name={`tipoSancionArray.${index}.tsdescripcion`} />
                                                </Grid>
                                            </Grid>
                                        ))
                                    }
                                </FieldArray>
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titulo} align={'center'}>
                                        Documentos
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={12}>
                                <Button  type="button"   onClick={() => push('documents', undefined)} variant="contained"  className={cla.marginright}>
                                    Agregar Documento
                                </Button>
                                </Grid>

                                    <FieldArray name="documents">
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
                                                    <TextField label="Id" name={`documents.${index}.id`} fieldProps= {{initialValue : index}}  />
                                                </Grid>
                                                <Grid key={`${name}.GridTitulo`} item xs={12} md={12}>
                                                    <TextField label="Título"  name={`documents.${index}.titulo`} />
                                                </Grid>
                                                {catalogos.tipoDoc &&
                                                <Grid item xs={12} md={12}>
                                                    <Select name={`documents.${index}.tipo`} label="Tipo de documento" data={catalogos.tipoDoc}></Select>
                                                </Grid>
                                                }
                                                <Grid key={`${name}.GridDes`} item xs={12} md={12}>
                                                    <TextField label="Descripción" name={`documents.${index}.descripcion`} />
                                                </Grid>
                                                <Grid  key={`${name}.GridUrl`} item xs={12} md={12}>
                                                    <TextField label="URL"   name={`documents.${index}.url`}  />
                                                </Grid>
                                                <Grid  key={`${name}.GridFecha`} item xs={12} md={12}>
                                                    <DatePicker
                                                        locale={deLocale}
                                                        format={"yyyy-MM-dd"}
                                                        label="Fecha"
                                                        name={`documents.${index}.fecha`}
                                                        dateFunsUtils={DateFnsUtils}
                                                        clearable={true}
                                                        cancelLabel={"Cancelar"}
                                                        clearLabel={"Limpiar"}
                                                        okLabel={"Aceptar"}
                                                    />
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

                                <Button  onClick={ () => redirectToRoute("/consulta/S3S")} variant="contained"  className={cla.boton1}>
                                    Cancelar
                                </Button>
                                <Button  className={cla.boton2}  variant="contained"
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
                                <Button disabled={!alert.status} onClick={ () => redirectToRoute("/consulta/S3S")} color="primary" autoFocus>
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
