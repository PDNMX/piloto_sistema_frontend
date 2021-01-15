import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import { Checkboxes ,TextField,  makeValidate,makeRequired, Select, Switches} from 'mui-rff';
import {MenuItem, Grid, Button, TableCell, Switch, IconButton} from "@material-ui/core";
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import {requestCreationUser, requestEditUser} from "../../store/mutations";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import Typography from "@material-ui/core/Typography";
import { connect } from 'react-redux';
import {userActions} from "../../_actions/user.action";
import {alertActions} from "../../_actions/alert.actions";
import {Link} from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {makeStyles} from "@material-ui/core/styles";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {history} from "../../store/history";
import ListItem from "@material-ui/core/ListItem";


const CreateUser = ({id, esquema,alert,generos, ramos , instituciones, puestos}) => {
    return <MyForm initialValues={esquema} generos={generos} ramos={ramos} instituciones={instituciones} puestos={puestos} id={id} alerta={alert}/>;
}

interface FormDataEsquemaS2 {
    fechaCaptura: string,
    ejercicioFiscal: string,
    ramo: { clave: Number, valor: String },
    rfc: string,
    curp: string,
    nombres: string,
    primerApellido: string,
    segundoApellido: string,
    genero: {},
    institucionDependencia:{ },
    puesto:{},
    tipoArea: [],
    tipoProcedimiento:[],
    nivelResponsabilidad: [],
}

interface MyFormProps {
    initialValues: FormDataEsquemaS2;
    id: string;
    alerta: { status: boolean };
    generos:[];
    ramos:[];
    instituciones:[];
    puestos:[];
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function MyForm(props: MyFormProps ) {
    let { initialValues , id , alerta, generos, instituciones , puestos , ramos } = props;
    const alert = alerta;
    const dispatch = useDispatch();

    // yes, this can even be async!
    async function onSubmit(values: FormDataEsquemaS2) {
        alert.status =false;
        if(id != undefined){
            dispatch(requestEditUser({...values, _id : id}));
        }else{
            dispatch(requestCreationUser(values));
        }
    }

    const schema = Yup.object().shape({
        fechaCaptura:Yup.string().required(),
        ejercicioFiscal: Yup.string().required(),
        ramo: Yup.array().min(1).required(),
        rfc : Yup.string().required(),
        curp: Yup.string().required(),
        nombres : Yup.string().required(),
        primerApellido : Yup.string().required(),
        segundoApellido :Yup.string().required(),
        genero : Yup.object().required,
        institucionDependencia : Yup.object().required,
        puesto : Yup.object().required,
        tipoArea: Yup.array().min(1).required(),
        tipoProcedimiento :Yup.array().min(1).required(),
        nivelResponsabilidad : Yup.array().min(1).required(),
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);


    const styles = makeStyles({
        boton:{
            backgroundColor:'#ffe01b',
            color: '#666666'
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

    const sistemasData = [
        {label: 'Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación', value: 'S2'},
        {label: 'Sistema de los Servidores Públicos Sancionados', value: 'S3S'},
        {label: 'Sistema de los Particulares Sancionados', value: 'S3P'}
    ];


    const estatus = [
        {label: 'Vigente', value: true},
    ];
    const buttonSubmittProps = { // make sure all required component's inputs/Props keys&types match
        variant:"contained",
        color:"primary",
        type:"submit"
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
                                    <TextField label="Fecha de captura" name="fechaCaptura" required={true} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Ejercicio fiscal" name="ejercicioFiscal" required={true} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Ramo" name="ramo" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Cargo" name="cargo" required={true} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Rfc" name="rfc" required={true} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Curp" name="curp" required={true} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Nombres" name="nombres" required={true} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Primer apellido" name="primerApellido" required={true} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Segundo apellido" name="segundoApellido" required={true} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Select  name = "genero" label="Genero" required={true} data={generos} ></Select>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Select  name = "ramo" label="Ramo" required={true} data={ramos} ></Select>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Select  name = "institucionDependencia" label="Institución dependencia" required={true} data={instituciones} ></Select>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Select  name = "puesto" label="Puesto" required={true} data={puestos} ></Select>
                                </Grid>
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
    let generos = state.generos;
    let ramos = state.ramos;
    let instituciones = state.instituciones;
    let puestos = state.puestos;
    if( ownProps.match != undefined ){
        let id = ownProps.match.params.id;
        let user = state.users.find(user=>user._id === id);
        return {
            id,
            user,
            alert,
            generos,
            ramos,
            instituciones,
            puestos
        }
    }else{
        return {alert, generos, ramos,  instituciones,  puestos};
    }
}


function mapDispatchToProps(dispatch, ownProps){
    return {};
}

export const ConnectedCreateUser = connect(mapStateToProps,mapDispatchToProps)(CreateUser);
