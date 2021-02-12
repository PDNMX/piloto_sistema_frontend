import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import { Checkboxes ,TextField,  makeValidate,makeRequired, Select, Switches} from 'mui-rff';
import {MenuItem, Grid, Button, TableCell, Switch, IconButton, Tooltip} from "@material-ui/core";
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import {requestConsultBitacora} from "../../store/mutations";
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
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker,TimePicker,DateTimePicker } from 'mui-rff';

const ConsultarBitacora = ({id, user,alert, providers, users }) => {
    return <MyForm initialValues={user}  id={id} alerta={alert} providers={providers} users={users}  />;
}

interface FormBitacora {
    sistema?:string[];
    fechaInicial:string;
    fechaFinal:string;
}

interface MyFormProps {
    initialValues: FormBitacora;
    id: string;
    alerta: { status: boolean };
    providers : [];
    users:[]
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function MyForm(props: MyFormProps ) {
    let { initialValues , id , alerta ,  users } = props;
    const alert = alerta;
    const dispatch = useDispatch();

    // yes, this can even be async!
    async function onSubmit(values: FormBitacora) {
        alert.status =false;
        dispatch(requestConsultBitacora(values));
        history.push('/reportebitacora');
    }



    const schema = Yup.object().shape({
        fechaInicial: Yup.string().required(),
        fechaFinal: Yup.string().required(),
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
        },
        fontblack:{
            color: '#666666'
        },
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


    const buttonSubmittProps = { // make sure all required component's inputs/Props keys&types match
        variant:"contained",
        color:"primary",
        type:"submit"
    }

    const reset = () => {
        dispatch({ type: 'reset' })
    }

    return (
        <div>
            <Grid item xs={12}>
                <Typography variant={"h6"} paragraph className={cla.fontblack} align={"center"}>
                    <b>Consultar bitácora</b>
                </Typography>
            </Grid>
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={validate}
                render={({ handleSubmit,values, submitting }) => (
                    <form  onSubmit={handleSubmit} noValidate>
                        {alert.status === undefined &&
                        <div>
                            <Grid className= {cla.gridpadding} spacing={3} container >
                                <Grid item xs={12} md={3}>
                                    <DateTimePicker
                                        format={"yyyy-MM-dd'T'HH:mm:ss"}
                                        label="Fecha Inicial *"
                                        name="fechaInicial"
                                        dateFunsUtils={DateFnsUtils} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <DateTimePicker
                                        format={"yyyy-MM-dd'T'HH:mm:ss"}
                                        label="Fecha Final *"
                                        name="fechaFinal"
                                        dateFunsUtils={DateFnsUtils} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Select
                                        name = "sistema"
                                        label="Selecciona el sistema aplicable"
                                        data={sistemasData}
                                        multiple={true}>
                                    </Select>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Select
                                        name = "usuarioBitacora"
                                        label="Selecciona el usuario"
                                        data={users} >
                                    </Select>
                                </Grid>
                            </Grid>
                            <Grid  spacing={3} justify="flex-end"
                                   alignItems="flex-end"
                                   container
                                   item
                                   xs={12}
                                   md={12}>
                                {/*
                                <Tooltip title="Limpiar" placement="right">
                                    <Button  className={cla.boton}  variant="contained"
                                             onClick={ reset }
                                             disabled={submitting}> Limpiar
                                    </Button>
                                </Tooltip>
                                */}
                                <Tooltip title="Generar" placement="right">
                                <Button  className={cla.boton}  variant="contained"
                                         type="submit"
                                         disabled={submitting}> Generar
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
    let providers = state.providerSelect;
    let users = state.userSelect;
    if( ownProps.match != undefined ){
        let users = state.userSelect;
        return {
            alert,
            providers,
            users
        }
    }else{
        return {alert, providers,users};
    }
}


function mapDispatchToProps(dispatch, ownProps){
    return {};
}

export const ConnectedConsultarBitacora = connect(mapStateToProps,mapDispatchToProps)(ConsultarBitacora);
