import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import { Checkboxes ,TextField,  makeValidate,makeRequired, Select, Switches} from 'mui-rff';
import {MenuItem, Grid, Button, TableCell, Switch, IconButton, Tooltip, Snackbar} from "@material-ui/core";
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import {requestChangePassword, requestCreationUser, requestEditUser} from "../../store/mutations";
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
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

const ChangePassword = ({id, user,alert}) => {
    return <MyForm initialValues={user}  id={id} alerta={alert}/>;
}

interface FormDataUser {
    constrasena?:string;
}

interface MyFormProps {
    initialValues: FormDataUser;
    id: string;
    alerta: { status: boolean };
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function MyForm(props: MyFormProps ) {
    let { initialValues , id   } = props;

    const {alerta} = useSelector(state => ({
        alerta : state.alert,
    }));

    const dispatch = useDispatch();

    // yes, this can even be async!
    async function onSubmit(values: FormDataUser) {
        alerta.status =false;
        if(id != undefined){
            dispatch(requestEditUser({...values, _id : id}));
        }else{
            dispatch(requestChangePassword(values));
        }
    }

    const schema = Yup.object().shape({
        constrasena: Yup.string().matches(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*()_+,.\\\\\\/;\':"-]).{8,}$'),'Inserta al menos 8 caracteres, al menos una mayúscula, al menos un número, al menos un carácter especial ' ).required("El campo Contraseña es requerido").trim(),
        passwordConfirmation: Yup.string().required("Confirmar contraseña es un campo requerido").when('constrasena', (password, field) =>
            password ? field.required("Confirmar contraseña es un campo requerido").oneOf([Yup.ref('constrasena')],"Este campo tiene que coincidir con el campo contraseña") : field
        ),
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);

    const handleCloseSnackbar = () => {
        dispatch(alertActions.clear());
    };



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
        },
        fontblack:{
            color: '#666666'
        }
    });


    const redirectToRoute = (path) =>{
        let rol=localStorage.getItem("rol");
        if(rol=="1"){
            history.push("/usuarios");
        }else{
            history.push("/cargamasiva");
        }
    }

    const changepassword=()=>{
        history.push("/usuario/cambiarcontrasena");
    }

    const cla = styles();

    const buttonSubmittProps = { // make sure all required component's inputs/Props keys&types match
        variant:"contained",
        color:"primary",
        type:"submit"
    }



    return (


        <div>
            <Grid item xs={12}>
                <Typography variant={"h6"} paragraph className={cla.fontblack} align={"center"}>
                    <b>Cambiar contraseña</b>
                </Typography>
            </Grid>

            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={alerta.status}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Resultado"}</DialogTitle>
                <DialogContent>
                    <DialogContent id="alert-dialog-description">
                        <Typography  noWrap variant="h6" className={cla.fontblack}>
                            {alerta.message}
                        </Typography>
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button disabled={!alerta.status} onClick={ () => changepassword()} color="primary" autoFocus>
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
                        {alerta.status === undefined &&
                        <div>
                            <Grid className= {cla.gridpadding} spacing={3} container >
                                <Grid item xs={12} md={3}>
                                    <TextField label="Contraseña" name="constrasena"  type="password" required={true} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="Confirmar contraseña" name="passwordConfirmation"  type="password" required={true} />
                                </Grid>
                            </Grid>
                            <Grid  style={{marginBottom: "15px"}}
                                spacing={3} justify="flex-end"
                                   alignItems="flex-end"
                                   container
                                   item
                                   xs={12}
                                   md={12}>
                                <Tooltip title="Cancelar" placement="left">
                                    <Button  onClick={ () => redirectToRoute("/usuarios")} variant="contained"  className={cla.marginright}
                                             type="submit">
                                        Cancelar
                                    </Button>
                                </Tooltip>

                                <Tooltip title="Cambiar" placement="right">
                                    <Button  className={cla.boton}  variant="contained"
                                             type="submit"
                                             disabled={submitting}> Cambiar
                                    </Button>
                                </Tooltip>
                            </Grid>
                        </div>
                        }
                    </form>
                )}
            />
        </div>
    );
}

function mapStateToProps(state,ownProps){
    let alert = state.alert;
    if( ownProps.match != undefined ){
        let id = ownProps.match.params.id;
        let user = state.users.find(user=>user._id === id);
        let idUser = state.setUserInSession;
        return {
            id,
            user,
            alert,
            idUser
        }
    }else{
        return {alert};
    }
}


function mapDispatchToProps(dispatch, ownProps){
    return {};
}

export const ConnectedChangePassword = connect(mapStateToProps,mapDispatchToProps)(ChangePassword);
