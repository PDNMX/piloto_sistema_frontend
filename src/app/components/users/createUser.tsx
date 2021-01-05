import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import { Checkboxes ,TextField,  makeValidate,makeRequired, Select, Switches} from 'mui-rff';
import {MenuItem, Grid, Button, TableCell, Switch, IconButton} from "@material-ui/core";
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import {requestCreationUser} from "../../store/mutations";
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


const CreateUser = ({id, user,alert, providers }) => {
    return <MyForm initialValues={user}  id={id} alerta={alert} providers={providers}/>;
}

interface FormDataUser {
    nombre?:string;
    apellidoUno?:string;
    apellidoDos?:string;
    cargo?:string;
    correoElectronico?:string;
    telefono?:string;
    extension?:string;
    usuario?:string;
    constrasena?:string;
    sistemas?:string[];
    proveedorDatos?:string;
    estatus?:Boolean;
}

interface MyFormProps {
    initialValues: FormDataUser;
    id: string;
    alerta: { status: boolean };
    providers : [];
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function MyForm(props: MyFormProps ) {
    let { initialValues , id , alerta , providers } = props;
    const alert = alerta;
    const dispatch = useDispatch();

    // yes, this can even be async!
    async function onSubmit(values: FormDataUser) {
        alert.status =false;
        if(id != undefined){
            dispatch(requestCreationUser({...values, _id : id}));
        }else{
            dispatch(requestCreationUser(values));
        }
    }

    const schema = Yup.object().shape({
        nombre: Yup.string().matches(new RegExp("^['A-zÀ-ú ]*$"),'no se permiten números, ni cadenas vacias' ).required().trim(),
        apellidoUno: Yup.string().matches(new RegExp('^[\'A-zÀ-ú ]*$'),'no se permiten números, ni cadenas vacias' ).required().trim(),
        apellidoDos: Yup.string().matches(new RegExp('^[\'A-zÀ-ú ]*$'),'no se permiten números, ni cadenas vacias' ).required().trim(),
        cargo: Yup.string().matches(new RegExp('^[\'A-zÀ-ú ]*$'),'no se permiten números, ni cadenas vacias' ).required().trim(),
        correoElectronico: Yup.string().required().email(),
        telefono:  Yup.string().matches(new RegExp('^[0-9]{10}$'), 'Inserta un número de teléfono valido, 10 caracteres').required().trim(),
        extension: Yup.string().matches(new RegExp('^[0-9]{0,10}$'), 'Inserta un número de extensión valido , maximo 10 caracteres').required().trim(),
        usuario: Yup.string().matches(new RegExp('^[a-zA-Z0-9]{8,}$'),'Inserta al menos 8 caracteres, no se permiten caracteres especiales' ).required().trim(),
        constrasena: Yup.string().matches(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*()_+,.\\\\\\/;\':"-]).{8,}$'),'Inserta al menos 8 caracteres, al menos un número, almenos un caracter especial ' ).required().trim(),
        sistemas: Yup.array().min(1).required(),
        proveedorDatos: Yup.string().required()
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
                            <TextField label="Nombre" name="nombre" required={true} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Primer apellido" name="apellidoUno" required={true} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Segundo apellido" name="apellidoDos" />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Cargo" name="cargo" required={true} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Correo electronico" name="correoElectronico" required={true} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Número de teléfono" name="telefono" required={true} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Extensión" name="extension" required={true} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Nombre de usuario" name="usuario" required={true} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Contraseña" name="constrasena"  type="password" required={true} />
                        </Grid>
                            {id != null &&
                            <Grid item xs={12} md={3}>
                                <Switches label="estatus" name="estatus" required={true} data={estatus}/>
                            </Grid>}
                            <Grid item xs={12} md={3}>
                                <Select  name = "sistemas" label="Selecciona los sistemas aplicables" required={true} data={sistemasData} multiple={true}></Select>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Select  name = "proveedorDatos" label="Proveedor de datos" required={true} data={providers} ></Select>
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
    let providers = state.providerSelect;
    if( ownProps.match != undefined ){
        let id = ownProps.match.params.id;
        let user = state.users.find(user=>user._id === id);
        return {
            id,
            user,
            alert,
            providers
        }
    }else{
        return {alert, providers};
    }
}


function mapDispatchToProps(dispatch, ownProps){
        return {};
}

export const ConnectedCreateUser = connect(mapStateToProps,mapDispatchToProps)(CreateUser);
