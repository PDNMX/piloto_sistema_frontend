import React, { useState } from 'react';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import {Form} from "react-final-form";
import {requestResetPassword} from "../../store/mutations";
import {TextField , makeRequired, makeValidate} from "mui-rff";
import {Tooltip } from "@material-ui/core";

import * as Yup from 'yup';
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {alertActions} from "../../_actions/alert.actions";
import {history} from "../../store/history";

export const ResetPasswordV = ({}) => {
    return <MyForm initialValues={{correo: ""}} />;
}


interface FormDataResetUser {
    correo?:string;
}


interface MyFormProps {
    initialValues: FormDataResetUser;
}

function MyForm(props: MyFormProps ) {

    let { initialValues } = props;

    const style = makeStyles((theme) => ({

        gridpadding: {
            padding: '30px',
        },

        primary: {
            main: "#89d4f2",
            light: "#bdffff",
            dark: "#34b3eb"
        },


        container1: {
            paddingTop: '75px',
            paddingBottom: '75px',
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            position: 'relative',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
        },

        root: {
            maxWidth: 1200,
            margin: '0 auto',
        },
        paper: {
            //marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            //paddingTop: '-100px'
        },
        field: {
            width: '100%'
        },
        item2: {
            paddingRight: theme.spacing(2),
            paddingLeft: theme.spacing(2)
        },

        fontblack:{
            color: '#666666'
        },
        purpleText:{
            color: '#FFFFFF'
        },


        avatar: {
            margin: theme.spacing(1),
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(2),

        },
        submit: {
            margin: theme.spacing(3, 0, 2),
            backgroundColor: '#34b3eb',
            color: '#666666'
        },
        logo:{
            margin: 'auto',
            display: 'block',
            maxWidth: '15%',
            maxHeight: '15%',

        },
        textfield:{
            '&.Mui-focused fieldset': {
                borderColor: '#666666',
            },
            '& label.Mui-focused': {
                color: '#666666',
            },
            '& .MuiInput-underline:after': {
                borderBottomColor: '#34b3eb',
            },
            '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                    borderColor: '#34b3eb',
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#34b3eb',
                },}
        },
        boton:{
            backgroundColor:'#ffe01b',
            color: '#666666',
            marginTop: '10px'
        },
    }));

    const {alerta} = useSelector(state => ({
        alerta : state.alert,
    }));

    const dispatch = useDispatch();

    const handleCloseSnackbar = () => {
        dispatch(alertActions.clear());
    };

    const redirectToRoute = (path) =>{
        history.push(path);
    }

    const {alert} = useSelector(state => ({
        alert : state.alert
    }));

    const schema = Yup.object().shape({
        correo: Yup.string().required().email()
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);

    // yes, this can even be async!
    async function onSubmit(values: FormDataResetUser) {
        alert.status =false;
        dispatch(requestResetPassword(values));
    }

    const classes = style();

    return (


        <div>
            <Grid item xs={12}>
                <Snackbar anchorOrigin={ { vertical: 'top', horizontal: 'center' }}  open={alerta.status} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={alerta.type}>
                        {alerta.message}
                    </Alert>
                </Snackbar>
            </Grid>


            <Grid container spacing={0} className={classes.container1} justify='center'>
                <Grid item xs={12} md={6} className={classes.item2} container direction="row" justify="center" alignItems="center">
                    <Typography variant="h4" paragraph className={classes.fontblack} style={{fontWeight: 600}}>
                        Restablecer Contraseña
                    </Typography>
                </Grid>
            </Grid>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography className={classes.fontblack} component="h1" variant="h5">
                        Introduce tu correo electrónico.
                    </Typography>


                    <Form
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                        validate={validate}
                        render={({ handleSubmit,values, submitting   }) => (
                            <form  onSubmit={handleSubmit} noValidate>
                                <Grid className= {classes.gridpadding} spacing={3} container >
                                    <Grid item xs={12} md={12}>
                                        <TextField label="Correo electrónico" name="correo" required={true} />
                                    </Grid>
                                    <Grid item xs={12} md={6} container direction="row" justify="center" alignItems="center">
                                        <Tooltip title="Restablecer contraseña" placement="right">
                                        <Button
                                            className= {classes.boton}  variant="contained"
                                            type="submit"
                                            disabled={submitting}> Restablecer contraseña
                                        </Button>
                                        </Tooltip>

                                    </Grid>
                                    <Grid item xs={12} md={6} container direction="row" justify="center" alignItems="center">
                                        <Tooltip title="Cancelar" placement="right">
                                        <Button onClick={ () => redirectToRoute("/login")}
                                                className= {classes.boton}  variant="contained"
                                                type="submit"
                                                disabled={submitting}>Cancelar
                                        </Button>
                                    </Tooltip>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    />

                </div>
            </Container>
        </div>
    );
}
