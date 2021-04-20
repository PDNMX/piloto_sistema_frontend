import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import { Checkboxes ,TextField,  makeValidate,makeRequired, Select, Switches} from 'mui-rff';
import {MenuItem, Grid, Button, TableCell, Switch, IconButton, Tooltip, Snackbar} from "@material-ui/core";
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
import { OnChange } from 'react-final-form-listeners'
import {Alert} from "@material-ui/lab";
import {providersEnabled} from "../../_reducers/providerEnabled.reducer";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

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
    alerta: { status: boolean, message:string };
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
            dispatch(requestEditUser({...values, _id : id}));
        }else{
            dispatch(requestCreationUser(values));
        }

    }
    const schema = Yup.object().shape({
        nombre: Yup.string().matches(new RegExp("^['A-zÀ-ú ]*$"),'no se permiten números, ni cadenas vacías' ).required("El campo nombre es requerido").trim(),
        apellidoUno: Yup.string().matches(new RegExp('^[\'A-zÀ-ú ]*$'),'no se permiten números, ni cadenas vacías' ).required("El campo Primer apellido es requerido").trim(),
        apellidoDos: Yup.string().matches(new RegExp('^[\'A-zÀ-ú ]*$'),'no se permiten números, ni cadenas vacías' ).trim(),
        cargo: Yup.string().matches(new RegExp('^[\'A-zÀ-ú ]*$'),'no se permiten números, ni cadenas vacías' ).required("El campo Cargo es requerido").trim(),
        correoElectronico: Yup.string().required("El campo Correo electrónico es requerido").email(),
        telefono:  Yup.string().matches(new RegExp('^[0-9]{10}$'), 'Inserta un número de teléfono válido, 10 caracteres').required("El campo Número de teléfono es requerido").trim(),
        extension: Yup.string().matches(new RegExp('^[0-9]{0,10}$'), 'Inserta un número de extensión valido , máximo 10 caracteres').trim(),
        usuario: Yup.string().matches(new RegExp('^[a-zA-Z0-9]{8,}$'),'Inserta al menos 8 caracteres, no se permiten caracteres especiales' ).required("El campo Nombre de usuario es requerido").trim(),
        sistemas: Yup.array().min(1).required("El campo Sistemas aplicables es requerido"),
        proveedorDatos: Yup.string().required("El campo Proveedor de datos es requerido")
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);


    const styles = makeStyles({
        boton:{
            marginTop:'16px',
            marginLeft:'16px',
            marginRight:'16px',
            backgroundColor:'#ffe01b',
            color: '#666666'
        },
        boton2:{
            marginTop:'16px',
            marginLeft:'16px',
            marginRight:'10px',
            backgroundColor:'#ffe01b',
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
        fontblack:{
            color: '#666666'
        }
    });

    const {alerta2} = useSelector(state => ({
        alerta2 : state.alert,
    }));

    const handleCloseSnackbar = () => {
        dispatch(alertActions.clear());
    };

    const redirectToRoute = (path) =>{
        history.push(path);
    }

    const cla = styles();

    let sistemasData = [
        {label: 'Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación', value: 'S2'},
        {label: 'Sistema de los Servidores Públicos Sancionados', value: 'S3S'},
        {label: 'Sistema de los Particulares Sancionados', value: 'S3P'}
    ];
    var sistemaspro=[];
    for(let pro of providers){
        if(pro['value']==initialValues.proveedorDatos){
            sistemaspro=pro['sistemas'];
            var sistemasNew=[];
            for (let sistema of sistemaspro){
                if(sistema === "S2"){
                    // @ts-ignore
                    sistemasNew.push({label : 'Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación', value: 'S2'})
                }else if(sistema === "S3S"){
                    // @ts-ignore
                    sistemasNew.push({label: 'Sistema de los Servidores Públicos Sancionados', value: 'S3S'});
                }else if(sistema === "S3P"){
                    // @ts-ignore
                    sistemasNew.push( {label: 'Sistema de los Particulares Sancionados', value: 'S3P'});
                }
            }
            sistemasData= sistemasNew;
        }
    }

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
            <Grid item xs={12}>
                <Typography variant={"h6"} paragraph className={cla.fontblack} align={"center"}>
                    {id != null ? <b>Editar usuario</b> :  <b>Crear usuario</b> }
                </Typography>
            </Grid>
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={alerta2.status}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Resultado"}</DialogTitle>
                <DialogContent>
                    <DialogContent id="alert-dialog-description">
                        <Typography  noWrap variant="h6" className={cla.fontblack}>
                            {alerta2.message}
                        </Typography>
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button disabled={!alerta2.status} onClick={ () => redirectToRoute("/usuarios")} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

        <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
            render={({ handleSubmit,values, submitting   }) => (
                <form  onSubmit={handleSubmit} noValidate>
                    {alerta2.status === undefined &&
                        <div>
                        <Grid spacing={3} container >
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
                            {id != null ? <TextField label="Correo electrónico" name="correoElectronico" required={true} InputProps={{readOnly: true}}/> :
                                <TextField label="Correo electrónico" name="correoElectronico" required={true} />
                            }

                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Número de teléfono" name="telefono" required={true} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Extensión" name="extension"  />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            {id != null ? <TextField label="Nombre de usuario" name="usuario" required={true} InputProps={{readOnly: true}}/>
                            :  <TextField label="Nombre de usuario" name="usuario" required={true} /> }
                        </Grid>
                            {id != null &&
                            <Grid item xs={12} md={3}>
                                <Switches label="Estatus" name="estatus" required={true} data={estatus}/>
                            </Grid>}
                            <Grid item xs={12} md={3}>
                                <Select  name = "proveedorDatos" label="Proveedor de datos" required={true} data={providers} defaultValue={""}></Select>
                                <OnChange name="proveedorDatos">
                                    {(value, previous) => {
                                        let sistemasDataNew: [] = [];
                                        let sistemasDisponibles: string[] = [];
                                        for(let prov of providers){
                                            let obj: {value:string, sistemas:[]}= prov;
                                            if(value == obj.value){
                                                sistemasDisponibles= obj.sistemas;
                                            }
                                        }

                                        for (let sistema of sistemasDisponibles){
                                            if(sistema === "S2"){
                                                // @ts-ignore
                                                sistemasDataNew.push({label : 'Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación', value: 'S2'})
                                            }else if(sistema === "S3S"){
                                                // @ts-ignore
                                                sistemasDataNew.push({label: 'Sistema de los Servidores Públicos Sancionados', value: 'S3S'});
                                            }else if(sistema === "S3P"){
                                                // @ts-ignore
                                                sistemasDataNew.push( {label: 'Sistema de los Particulares Sancionados', value: 'S3P'});
                                            }
                                        }
                                        sistemasData= sistemasDataNew;
                                    }}
                                </OnChange>

                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Select  name = "sistemas" label="Selecciona los sistemas aplicables" required={true} data={sistemasData} multiple={true}></Select>
                            </Grid>

                        </Grid>
                            <Grid spacing={3} container justify="flex-end" >
                                <Tooltip title="Cancelar" placement="left">
                                    <Button  onClick={ () => redirectToRoute("/usuarios")} variant="contained"  className={cla.boton}
                                             type="submit">
                                        Cancelar
                                    </Button>
                                </Tooltip>

                                <Tooltip title="Guardar" placement="right">
                                    <Button  className={cla.boton2}  variant="contained"
                                             type="submit"
                                             disabled={submitting}> Guardar
                                    </Button>
                                </Tooltip>
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
    let providers = state.providersEnabled;
    if( ownProps.match != undefined ){
        let id = ownProps.match.params.id;
        let user = state.users.find(user=>user._id === id);
        let idUser = state.setUserInSession;
        return {
            id,
            user,
            alert,
            providers,
            idUser
        }
    }else{
        return {alert, providers};
    }
}


function mapDispatchToProps(dispatch, ownProps){
        return {};
}

export const ConnectedCreateUser = connect(mapStateToProps,mapDispatchToProps)(CreateUser);
