import React from 'react';
import {Form} from 'react-final-form';
import {TextField, makeValidate, makeRequired, Select} from 'mui-rff';
import {Grid, Button} from "@material-ui/core";
import {S2Actions} from "../../_actions/s2.action";
import {css} from "@emotion/core";
import Typography from "@material-ui/core/Typography";
import {connect} from 'react-redux';
import {makeStyles} from "@material-ui/core/styles";
import {history} from "../../store/history";
import {useDispatch} from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {alertActions} from "../../_actions/alert.actions";
import {OnChange} from 'react-final-form-listeners'

import schema from './validate.s2';

const CreateReg = ({id, alert, catalogos, registry}) => {
    return <MyForm initialValues={registry} catalogos={catalogos} alerta={alert} id={id}/>;
}

interface FormDataEsquemaS2 {
    ejercicioFiscal: string,
    ramo?: string,
    nombres?: string,
    primerApellido?: string,
    segundoApellido?: string,
    genero?: {},
    institucionDependencia?: {},
    tipoArea?: [],
    tipoProcedimiento?: [],
    nivelResponsabilidad?: [],
    idnombre?: string,
    idsiglas?: string,
    idclave?: string,
    puestoNombre?: string,
    puestoNivel?: string,
    sinombres?: string,
    siPrimerApellido?: string,
    siSegundoApellido?: string,
    siPuestoNombre?: string,
    siPuestoNivel?: string,
    observaciones?: string
}

interface MyFormProps {
    initialValues: FormDataEsquemaS2;
    alerta: { status: boolean, message: "" };
    catalogos: { genero: [], ramo: [], puesto: [], tipoArea: [], nivelResponsabilidad: [], tipoProcedimiento: [] };
    id: string;
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function MyForm(props: MyFormProps) {
    let {initialValues, alerta, catalogos, id} = props;
    const alert = alerta;
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);

    const validate = makeValidate(schema);
    const required = makeRequired(schema);


    const styles = makeStyles({
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
            color: '#666666',
        },
        marginright: {
            marginRight: '30px',
            backgroundColor: '#ffe01b',
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

    // yes, this can even be async!
    async function onSubmit(values: FormDataEsquemaS2) {
        if (id != undefined) {
            dispatch(S2Actions.requestEditDo({...values, _id: id}));
        } else {
            dispatch(S2Actions.requestCreationS2(values));
        }
        setOpen(true);

    }

    return (
        <div>
            <Grid container justify={"center"}>
                <Typography noWrap variant="h6" className={cla.fontblack}>
                    <b>Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación</b>
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
                render={({handleSubmit, values, submitting}) => (
                    <form onSubmit={handleSubmit} noValidate>
                        {alert.status === undefined &&
                        <div>
                            <Grid className={cla.gridpadding} spacing={3} container>
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titulo} align={'center'}>
                                        Datos generales
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField required={true} label="Nombre(s)" name="nombres"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField required={true} label="Primer apellido" name="primerApellido"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Segundo apellido" name="segundoApellido"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Select name="genero" label="Género" data={catalogos.genero}></Select>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="RFC" name="rfc"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="CURP" name="curp"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField required={true} label="Puesto nombre" name="puestoNombre"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Puesto nivel" name="puestoNivel"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Ejercicio fiscal" name="ejercicioFiscal"/>
                                </Grid>
                                {catalogos.ramo &&
                                <Grid item xs={12} md={9}>
                                    <Select name="ramo" label="Ramo" data={catalogos.ramo}
                                    />
                                </Grid>}
                                <Grid item xs={12} md={12}>
                                    <TextField label="Observaciones" name="observaciones" multiline={true} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className={cla.subtitulo} align={"left"}>
                                        Institución / Dependencia
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField required={true} label="Nombre" name="idnombre"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Siglas" name="idsiglas"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Clave" name="idclave"/>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titulo} align={'center'}>
                                        Superior Inmediato
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Nombre(s)" name="sinombres"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Primer apellido" name="siPrimerApellido"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Segundo apellido" name="siSegundoApellido"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="RFC" name="siRfc"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="CURP" name="siCurp"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Puesto nombre" name="siPuestoNombre"/>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Puesto nivel" name="siPuestoNivel"/>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titulo} align={'center'}>
                                        Procedimientos
                                    </Typography>
                                </Grid>
                                {catalogos.tipoProcedimiento &&
                                <Grid item xs={12} md={6}>
                                    <Select required={true} name="tipoProcedimiento" label="Tipo de procedimiento"
                                            data={catalogos.tipoProcedimiento} multiple={true}

                                    />
                                </Grid>}
                                {catalogos.tipoArea &&
                                <Grid item xs={12} md={6}>
                                    <Select name="tipoArea" label="Tipo de área" data={catalogos.tipoArea}
                                            multiple={true}

                                    />
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
                                    <Select name="nivelResponsabilidad" label="Nivel de responsabilidad"
                                            data={catalogos.nivelResponsabilidad} multiple={true}
                                            // renderValue={(value: any) => {
                                            //     return value.map(e =>
                                            //         <Tooltip title={JSON.parse(e).valor}>
                                            //             <Typography noWrap={true}> {JSON.parse(e).valor} </Typography>
                                            //         </Tooltip>)
                                            // }}
                                    />
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

                            </Grid>
                            <Grid spacing={3} justify="flex-end"
                            alignItems="flex-end"
                            container
                            item
                            xs={12}
                            md={12}>

                            <Button onClick={() => redirectToRoute("/consulta/S2")} variant="contained"
                            className={cla.boton1}
                            type="submit">
                            Cancelar
                        </Button>
                            <Button className={cla.boton2} variant="contained"
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
                            <Typography noWrap variant="h6" className={cla.fontblack}>
                        {alert.message}
                            </Typography>
                            </DialogContent>
                            </DialogContent>
                            <DialogActions>
                            <Button disabled={!alert.status} onClick={() => redirectToRoute("/consulta/S2")}
                            color="primary" autoFocus>
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

function mapStateToProps(state, ownProps) {
    let alert = state.alert;
    let catalogos = state.catalogs;
    if (ownProps.match != undefined) {
        let id = ownProps.match.params.id;
        let registry = state.S2.find(reg => reg._id === id);
        return {
            id,
            registry,
            alert,
            catalogos
        }
    } else {
        return {alert, catalogos};
    }
}


function mapDispatchToProps(dispatch, ownProps)
{
    return {};
}

export const ConnectedCreateReg = connect(mapStateToProps, mapDispatchToProps)(CreateReg);
