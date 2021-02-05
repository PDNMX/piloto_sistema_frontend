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


const CreateReg = ({alert, catalogos, registry}) => {
    return <MyForm initialValues={registry} catalogos={catalogos}  alerta={alert}/>;
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
    alerta: { status: boolean };
    catalogos:{genero: [], ramo: [], puesto: [], tipoArea: [], nivelResponsabilidad:[], tipoProcedimiento:[] };
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function MyForm(props: MyFormProps ) {
    let { initialValues ,  alerta, catalogos } = props;
    const alert = alerta;
    const dispatch = useDispatch();

    const schema = Yup.object().shape({
        ejercicioFiscal: Yup.string().matches(new RegExp('^[0-9]{4}$'),'Debe tener 4 dígitos'),
        ramo: Yup.string(),
        nombres : Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'no se permiten números, ni cadenas vacias ' ).required().trim(),
        primerApellido : Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'no se permiten números, ni cadenas vacias ' ).required().trim(),
        segundoApellido :Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'no se permiten números, ni cadenas vacias ' ).trim(),
        genero : Yup.object(),
        idnombre:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,50}$'),'no se permiten cadenas vacias , max 50 caracteres ').required().trim(),
        idsiglas: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,50}$'),'no se permiten cadenas vacias , max 50 caracteres ').trim(),
        idclave: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,50}$'),'no se permiten cadenas vacias , max 50 caracteres ').trim(),
        puestoNombre: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'no se permiten números, ni cadenas vacias ' ).trim()
            .when('puestoNivel',  (puestoNivel) => {
            if(!puestoNivel)
                return Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'no se permiten números, ni cadenas vacias, max 25 caracteres ' ).trim().required("Al menos un campo seccion Puesto, es requerido ")
        }),
        puestoNivel :Yup.string().matches(new RegExp("^[a-zA-Z0-9 ]{1,25}$"),'no se permiten números, ni cadenas vacias ' ).trim(),
        tipoArea: Yup.array(),
        nivelResponsabilidad : Yup.array(),
        tipoProcedimiento :Yup.array().min(1).required(),
        sinombres: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'no se permiten números, ni cadenas vacias, max 25 caracteres ' ).trim() ,
        siPrimerApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'no se permiten números, ni cadenas vacias, max 25 caracteres ' ).trim() ,
        siSegundoApellido:Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'no se permiten números, ni cadenas vacias, max 25 caracteres ' ).trim() ,
        siPuestoNombre: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'no se permiten números, ni cadenas vacias, max 25 caracteres ' ).trim(),
        siPuestoNivel: Yup.string().matches(new RegExp("^[a-zA-Z0-9 ]{1,25}$"),'no se permiten números, ni cadenas vacias ' ).trim()
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
        }
    });


    const redirectToRoute = (path) =>{
        history.push(path);
    }

    const cla = styles();

    const buttonSubmittProps = { // make sure all required component's inputs/Props keys&types match
        variant:"contained",
        color:"primary",
        type:"submit"
    }

    // yes, this can even be async!
    async function onSubmit(values: FormDataEsquemaS2) {
        console.error("entre al submit ");
        dispatch(S2Actions.requestCreationS2(values));
    }

    return (


        <div>
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={validate}
                render={({ handleSubmit,values, submitting   }) => (
                    <form  onSubmit={handleSubmit} noValidate>
                        {alert.status === undefined &&
                        <div>
                            <Grid className= {cla.gridpadding} spacing={3} container >
                                <Grid item xs={12} md={3}>
                                    <TextField label="Ejercicio fiscal"  name="ejercicioFiscal"  />
                                </Grid>
                                {catalogos.ramo &&
                                <Grid item xs={12} md={3}>
                                    <Select  name = "ramo" label="Ramo" data={catalogos.ramo} ></Select>
                                </Grid>}
                                {catalogos.tipoArea &&
                                <Grid item xs={12} md={3}>
                                    <Select  name = "tipoArea" label="Tipo de area" data={catalogos.tipoArea} multiple={true} ></Select>
                                </Grid>}

                                {catalogos.nivelResponsabilidad &&
                                <Grid item xs={12} md={3}>
                                    <Select  name = "nivelResponsabilidad" label="Nivel de responsabilidad" data={catalogos.nivelResponsabilidad} multiple={true} ></Select>
                                </Grid>}
                                <Grid item xs={12} md={3}>
                                    <TextField label="Nombres" name="nombres"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Primer apellido" name="primerApellido"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Segundo apellido" name="segundoApellido" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Select  name = "genero" label="Genero" data={catalogos.genero} ></Select>
                                </Grid>
                                {catalogos.tipoProcedimiento &&
                                <Grid item xs={12} md={6}>
                                    <Select  name = "tipoProcedimiento" label="Tipo de procedimiento" data={catalogos.tipoProcedimiento} multiple={true} ></Select>
                                </Grid>}

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
                                <Grid item xs={12} md={12}>
                                    <Typography className={cla.titleCategory} variant="h6" gutterBottom>
                                       Puesto
                                    </Typography>
                                    <Divider className={cla.boton} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Nombre" name="puestoNombre" />
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
                                    <TextField label="Nombres" name="sinombres" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Primer apellido" name="siPrimerApellido"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Segundo apellido" name="siSegundoApellido" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Puesto nombre" name="siPuestoNombre"  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Puesto nivel" name="siPuestoNivel"  />
                                </Grid>
                            <pre>{JSON.stringify(values)}</pre>

                            </Grid>
                            <Grid  spacing={3} justify="flex-end"
                                   alignItems="flex-end"
                                   container
                                   item
                                   xs={12}
                                   md={12}>

                                <Button  onClick={ () => redirectToRoute("/usuarios")} variant="contained"  className={cla.marginright}
                                         type="submit">
                                    Cancelar
                                </Button>
                                <Button  className={cla.boton}  variant="contained"
                                         type="submit"
                                         disabled={submitting}> Guardar </Button>
                            </Grid>
                        </div>
                        }

                        <div className="sweet-loading">
                            {alert.status != undefined && <div><Grid item xs={12}>
                                <Typography variant={"h5"} paragraph color={"primary"} align={"center"}>
                                    <b>Cargando ...</b>
                                </Typography>
                            </Grid>
                            </div>}
                            <ClipLoader
                                css={override}
                                size={150}
                                color={"#123abc"}
                                loading={alert.status === undefined ? false : !alert.status }
                            />
                        </div>
                        <pre>{alert.status}</pre>
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
