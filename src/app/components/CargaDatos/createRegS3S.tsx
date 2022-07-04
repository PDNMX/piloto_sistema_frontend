import React from 'react';
import { Form, Field } from 'react-final-form';
import { TextField, makeValidate, makeRequired, Select, DatePicker } from 'mui-rff';
import { Grid, Button, Tooltip } from '@material-ui/core';
import * as Yup from 'yup';
import { css } from '@emotion/core';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { history } from '../../store/history';
import { useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { alertActions } from '../../_actions/alert.actions';
import DateFnsUtils from '@date-io/date-fns';
import arrayMutators from 'final-form-arrays';
import { S3SActions } from '../../_actions/s3s.action';
import deLocale from 'date-fns/locale/es';

import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@material-ui/core';

import schema from './validate.s3s';
import document from './validate.document';

const CreateReg = ({ id, alert, catalogos, registry }) => {
    let data = { ...registry, tipoSancionArray: [], documents: [] };


    return (
        <MyForm
            initialValues={registry != undefined ? registry : data}
            catalogos={catalogos}
            alerta={alert}
            id={id}
        />
    );
};

interface FormDataEsquemaS3S {
    fechaCaptura?: String;
    expediente?: String;
    idnombre?: String;
    idsiglas?: String;
    idclave?: String;
    SPSnombres?: String;
    SPSprimerApellido?: String;
    SPSsegundoApellido?: String;
    SPSgenero?: {};
    SPSpuesto?: String;
    SPSnivel?: String;
    autoridadSancionadora?: String;
    tipoFalta?: { clave: string; valor: string; descripcion?: string };
    tpfdescripcion?: String;
    tipoSancionArray?: [{ clave: string; valor: string; descripcion?: string }];
    tipoSancionElement?: { clave: string; valor: string; descripcion?: string };
    tsdescripcion?: String;
    causaMotivoHechos?: String;
    resolucionURL?: String;
    resolucionFecha?: String;
    multa?: {
        monto: Number;
        moneda?: {
            clave: String;
            valor: String;
        };
    };
    inhabilitacionPlazo?: String;
    inhabilitacionFechaInicial?: String;
    inhabilitacionFechaFinal?: String;
    observaciones?: String;
    documents?: [{ id: String; titulo: String; descripcion: String; url: String; fecha: String; tipo: {} }];
    documentElement?: { id: String; titulo: String; descripcion: String; url: String; fecha: String; tipo: {} };
}

interface MyFormProps {
    initialValues: FormDataEsquemaS3S;
    alerta: { status: boolean; message: '' };
    catalogos: { genero: []; tipoFalta: []; tipoSancion: []; moneda: []; tipoDoc: [] };
    id: string;
}

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
`;

function MyForm(props: MyFormProps) {
    let { initialValues, alerta: alert, catalogos, id } = props;
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
            marginBottom: '16px',
            backgroundColor: '#ffe01b',
            color: '#666666'
        },
        boton2: {
            marginTop: '16px',
            marginLeft: '16px',
            marginRight: '-10px',
            marginBottom: '16px',
            backgroundColor: '#ffe01b',
            color: '#666666'
        },
        boton: {
            backgroundColor: '#ffe01b',
            color: '#666666'
        },
        marginright: {
            marginRight: '30px',
            backgroundColor: '#ffe01b',
            color: '#666666'
        },
        gridpadding: {
            padding: '30px'
        },
        primary: {
            main: '#89d4f2',
            light: '#bdffff',
            dark: '#34b3eb'
        },
        secondary: {
            main: '#ffe01b',
            light: '#ffff5c',
            dark: '#c8af00'
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
            fontWeight: 'bold',
            textDecoration: 'underline',
            textDecorationColor: '#34b3eb',
            color: '#34b3eb'
        },
        subtitulo: {
            fontSize: 15,
            fontWeight: 'bold',
            textDecoration: 'underline',
            textDecorationColor: '#585858',
            color: '#585858'
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
    };

    const clear = ([name], state, { changeValue }) => {
        changeValue(state, name, () => undefined);
    };

    const addSancion = (values, push, clear) => {

        let schema = Yup.object().shape({
            tipoSancion: Yup.string().required('El campo Tipo de sanción es requerido')
        });

        schema.validate(values.tipoSancionElement).then((result) => {

            let data = { ...JSON.parse(values.tipoSancionElement.tipoSancion), descripcion: values.tipoSancionElement.descripcion }

            let registrados = values.tipoSancionArray.map(e => e.clave.toLowerCase());

            if (registrados.indexOf(data.clave.toLowerCase()) !== -1) {
                setErrors({
                    ...errors,
                    tipoSancionElement: { ...errors.tipoSancionElement, ['tipoSancion']: "Tipo de sanción duplicado" }
                });
            } else {
                push('tipoSancionArray', data);
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
        let schema = document;
        
        try {
            await schema.validate(values.documentElement, { abortEarly: false });
            
            let id = values.documents.length ? parseInt(values.documents[values.documents.length - 1].id) + 1 : 1;

            let { titulo, descripcion, url, fecha } = values.documentElement;
            let tipo = typeof values.documentElement.tipo === 'undefined' ? '' : JSON.parse(values.documentElement.tipo).valor;

            let datos = {};

            if (tipo === '') {
                datos = { id, titulo, descripcion, url, fecha };
            } else {
                datos = { id, titulo, tipo, descripcion, url, fecha };
            }

            push('documents', datos);
            clear('documentElement');
            setErrors({
                ...errors,
                documentElement: {}
            });
        } catch (err) {
            let errores = {};

            err.inner && err.inner.forEach(e => { errores = { ...errores, [e.path]: e.message } })

            setErrors({
                ...errors,
                documentElement: errores
            });
        }        
    };

    const cla = styles();

    // const buttonSubmittProps = {
    //     // make sure all required component's inputs/Props keys&types match
    //     variant: 'contained',
    //     color: 'primary',
    //     type: 'submit'
    // };

    // yes, this can even be async!
    async function onSubmit(values: FormDataEsquemaS3S) {
        if (id != undefined) {
            dispatch(S3SActions.requestCreationS3S({ ...values, _id: id }));
        } else {
            dispatch(S3SActions.requestCreationS3S(values));
        }
        setOpen(true);
    }

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <Grid container justify={'center'}>
                <Typography noWrap variant="h6" className={cla.fontblack}>
                    <b>Sistema de los Servidores Públicos Sancionados</b>
                </Typography>
            </Grid>
            <Grid container justify={'center'}>
                <Typography noWrap variant="h6" className={cla.fontblack}>
                    <b>{id != undefined ? 'Edición' : 'Captura'}</b>
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
                render={({ handleSubmit, form: { mutators: { push, pop, clear, remove } }, values, submitting }) => (

                    <form onSubmit={handleSubmit} noValidate>
                        {alert.status === undefined && (
                            <div>
                                <Grid className={cla.gridpadding} spacing={3} container>
                                    <Grid item xs={12} md={12}>
                                        <Typography className={cla.titulo} align={'center'}>
                                            Datos generales
										</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField required={true} label="Nombre(s)" name="SPSnombres" />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField required={true} label="Primer apellido" name="SPSprimerApellido" />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField label="Segundo apellido" name="SPSsegundoApellido" />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Select name="SPSgenero" label="Género" data={catalogos.genero} />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField label="RFC" name="SPrfc" />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField label="CURP" name="SPcurp" />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField required={true} label="Puesto nombre" name="SPSpuesto" />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField label="Puesto nivel" name="SPSnivel" />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Typography className={cla.subtitulo}>Institución / Dependencia</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField required={true} label="Nombre" name="idnombre" />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField label="Siglas" name="idsiglas" />
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
                                        <TextField label="Expediente" name="expediente" />
                                    </Grid>
                                    {catalogos.tipoFalta && (
                                        <Grid item xs={12} md={3}>
                                            <Select
                                                required={true}
                                                name="tipoFalta"
                                                label="Tipo de falta"
                                                data={catalogos.tipoFalta}
                                            // renderValue={(value: any) => {
                                            //     return (
                                            //         <Tooltip title={JSON.parse(value).valor}>
                                            //             <Typography noWrap={true}>
                                            //                 {' '}
                                            //                 {JSON.parse(value).valor}{' '}
                                            //             </Typography>
                                            //         </Tooltip>
                                            //     );
                                            // }}
                                            />
                                        </Grid>
                                    )}
                                    <Grid item xs={12} md={6}>
                                        <TextField label="Descripción" name="tpfdescripcion" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Causa, motivo o hechos"
                                            name="causaMotivoHechos"
                                            required={true}
                                            multiline={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField label="Observaciones" name="observaciones" multiline={true} />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Typography className={cla.subtitulo}>Resolución</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField label="Autoridad sancionadora" name="autoridadSancionadora" />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <DatePicker
                                            locale={deLocale}
                                            format={'yyyy-MM-dd'}
                                            label="Fecha de resolución"
                                            name="resolucionFecha"
                                            dateFunsUtils={DateFnsUtils}
                                            clearable={true}
                                            cancelLabel={'Cancelar'}
                                            clearLabel={'Limpiar'}
                                            okLabel={'Aceptar'}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField label="URL" name="resolucionURL" />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Typography className={cla.subtitulo}>Inhabilitación</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField label="Plazo" name="inhabilitacionPlazo" />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <DatePicker
                                            locale={deLocale}
                                            format={'yyyy-MM-dd'}
                                            label="Fecha Inicial"
                                            name="inhabilitacionFechaInicial"
                                            dateFunsUtils={DateFnsUtils}
                                            clearable={true}
                                            cancelLabel={'Cancelar'}
                                            clearLabel={'Limpiar'}
                                            okLabel={'Aceptar'}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <DatePicker
                                            locale={deLocale}
                                            format={'yyyy-MM-dd'}
                                            label="Fecha Final"
                                            name="inhabilitacionFechaFinal"
                                            dateFunsUtils={DateFnsUtils}
                                            clearable={true}
                                            cancelLabel={'Cancelar'}
                                            clearLabel={'Limpiar'}
                                            okLabel={'Aceptar'}
                                            minDate={values.inhabilitacionFechaInicial}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Typography className={cla.subtitulo}>Multa</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField label="Monto" name="multa.monto" />
                                    </Grid>
                                    {catalogos.moneda && (
                                        <Grid item xs={12} md={3}>
                                            <Select name="multa.moneda" label="Moneda" data={catalogos.moneda} />
                                        </Grid>
                                    )}
                                    <Grid item md={6} />
                                    <Grid item xs={12} md={12}>
                                        <Typography className={cla.subtitulo}>Tipo sanción</Typography>
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
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                addSancion(values, push, clear);
                                            }}
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
                                                        values?.tipoSancionArray?.map((sancion, index) => (
                                                            <TableRow key={`tiposancion-${index}`}>
                                                                <TableCell>{sancion.valor}</TableCell>
                                                                <TableCell>{sancion.descripcion}</TableCell>
                                                                <TableCell>
                                                                    <Tooltip title="Remover sanción" placement="left">
                                                                        <span
                                                                            onClick={() => remove('tipoSancionArray', index)}
                                                                            style={{ cursor: 'pointer' }}
                                                                        >
                                                                            ❌
																			</span>
                                                                    </Tooltip>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                    <Field name={'tipoSancionArray'} render={({ input, meta }) => (
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
                                    {values?.documents?.length ? (
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
                                                        {values?.documents?.map((value, index) => (
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
                                                                            onClick={() =>
                                                                                remove('documents', index)}
                                                                            style={{
                                                                                cursor: 'pointer'
                                                                            }}
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

                                <Grid
                                    spacing={3}
                                    justify="flex-end"
                                    alignItems="flex-end"
                                    container
                                    item
                                    xs={12}
                                    md={12}
                                >
                                    <Button
                                        onClick={() => redirectToRoute('/consulta/S3S')}
                                        variant="contained"
                                        className={cla.boton1}
                                    >
                                        Cancelar
									</Button>
                                    <Button
                                        className={cla.boton2}
                                        variant="contained"
                                        type="submit"
                                        disabled={submitting}
                                    >
                                        {' '}
										Guardar{' '}
                                    </Button>
                                </Grid>
                            </div>
                        )}
                        <Dialog
                            disableBackdropClick
                            disableEscapeKeyDown
                            open={open}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{'Resultado'}</DialogTitle>
                            <DialogContent>
                                <DialogContent id="alert-dialog-description">
                                    <Typography noWrap variant="h6" className={cla.fontblack}>
                                        {alert.message}
                                    </Typography>
                                </DialogContent>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    disabled={!alert.status}
                                    onClick={() => redirectToRoute('/consulta/S3S')}
                                    color="primary"
                                    autoFocus
                                >
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
        let registry = state.S3S.find((reg) => reg._id === id);
        return {
            id,
            registry,
            alert,
            catalogos
        };
    } else {

        return { alert, catalogos };
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {};
}

export const ConnectedCreateRegS3S = connect(mapStateToProps, mapDispatchToProps)(CreateReg);
