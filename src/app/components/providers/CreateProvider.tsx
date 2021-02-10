import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import { Checkboxes ,TextField,  makeValidate,makeRequired, Select, Switches} from 'mui-rff';
import {MenuItem, Grid, Button,Paper, FormControlLabel,Tooltip} from "@material-ui/core";
import { FormControl } from '@material-ui/core';
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import {requestCreationProvider, requestEditProvider} from "../../store/mutations";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {providerActions} from "../../_actions/provider.action";
import {alertActions} from "../../_actions/alert.actions";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import {history} from "../../store/history";



const CreateProvider = ({id, provider,alert }) => {
    return <MyForm initialValues={provider}  id={id} alerta={alert}/>;
}


interface FormProvider {
    dependencia?:string;
    sistemas?:string[];
    estatus?:Boolean;
    fechaAlta?:string;
}

interface MyFormProps {
    initialValues: FormProvider;
    id: string;
    alerta: { status: boolean };
}



const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function MyForm(props: MyFormProps ) {
    let { initialValues , id , alerta } = props;
    const alert = alerta;
    const dispatch = useDispatch();

    // yes, this can even be async!
    async function onSubmit(values: FormProvider) {
        alert.status =false;
        if(id != undefined){
            dispatch(requestEditProvider({...values, _id : id}));
        }else{
            dispatch(requestCreationProvider(values));
        }

    }

    const estatus = [
        {label: 'Vigente', value: true},
    ];

    const schema = Yup.object().shape({
        dependencia:  Yup.string().required().matches(new RegExp('^[ñáéíóúáéíóúÁÉÍÓÚa-zA-Z ]*$'), 'Inserta solamente caracteres'),
        sistemas: Yup.array().min(1).required(),
        //estatus: Yup.boolean(),
        fechaAlta: Yup.string(),
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);

    const redirectToRoute = (path) =>{
        history.push(path);
    }

    const sistemasData = [
        {label: 'Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación', value: 'S2'},
        {label: 'Sistema de los Servidores Públicos Sancionados', value: 'S3S'},
        {label: 'Sistema de los Particulares Sancionados', value: 'S3P'}
    ];

    const buttonSubmittProps = { // make sure all required component's inputs/Props keys&types match
        variant:"contained",
        color:"primary",
        type:"submit"
    }

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
        },
        fontblack:{
            color: '#666666'
        },
        boton:{
            backgroundColor:'#ffe01b',
            color: '#666666'
        },
        gridpadding: {
            padding: '30px',
        },
        marginright:{
            marginRight: '30px',
            backgroundColor:'#ffe01b',
            color: '#666666'
        }

    }));

    const classes = useStyles();

    return (
        <div>
            <Grid item xs={12}>
                <Typography variant={"h6"} paragraph className={classes.fontblack} align={"center"}>
                    <b>Crear proveedor</b>
                </Typography>
            </Grid>
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={validate}
                render={({ handleSubmit,values, submitting   }) => (
                    <form  onSubmit={handleSubmit} noValidate>
                        {alert.status === undefined &&
                        <div>
                            <Grid className= {classes.gridpadding} spacing={3} container >
                                <Grid item xs={12} md={6}>
                                    <TextField label="Proveedor" name="dependencia" required={true} />
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.fontblack}>
                                    <Select  name = "sistemas" label="Selecciona los sistemas aplicables"  required={true} data={sistemasData} multiple={true}></Select>
                                </Grid>
                                {id != null &&
                                <Grid item xs={12} md={3}>
                                    <Switches label="Estatus" name="estatus" required={true} data={estatus}/>
                                </Grid>}
                            </Grid>
                            <Grid  spacing={3} justify="flex-end" className={classes.gridpadding}
                                   alignItems="flex-end"
                                   container
                                   item
                                   xs={12}
                                   md={12}>
                                <Tooltip title="Cancelar" placement="left">
                                <Button  onClick={ () => redirectToRoute("/proveedores")}  variant="contained"
                                         className={classes.marginright}
                                > Cancelar
                                </Button>
                                </Tooltip>
                                <Tooltip title="Guardar" placement="right">
                                <Button  variant="contained"
                                         className={classes.boton}
                                         type="submit"
                                         disabled={submitting}> Guardar
                                </Button>
                                </Tooltip>
                            </Grid>

                        </div>}
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
        let provider = state.providers.find(provider=>provider._id === id);
        return {
            id,
            provider,
            alert
        }
    }else{
        return {alert};
    }
}


function mapDispatchToProps(dispatch, ownProps){
    return {};
}

export const ConnectedCreateProvider = connect(mapStateToProps,mapDispatchToProps)(CreateProvider);
