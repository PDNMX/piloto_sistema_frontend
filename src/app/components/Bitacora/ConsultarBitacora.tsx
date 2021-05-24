import React from 'react';
import { Form } from 'react-final-form';
import {  makeValidate,makeRequired, Select} from 'mui-rff';
import {Grid, Button, Tooltip} from "@material-ui/core";
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import {requestConsultBitacora} from "../../store/mutations";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import Typography from "@material-ui/core/Typography";
import { connect } from 'react-redux';
import {makeStyles} from "@material-ui/core/styles";
import {history} from "../../store/history";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {DateTimePicker } from 'mui-rff';
import deLocale from "date-fns/locale/es";

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
        fechaInicial: Yup.string().required("Fecha inicial es obligatoria.")
            .when('fechaFinal',(fechaFinal)=>{
                if(fechaFinal)
                    return Yup.date().max(fechaFinal, 'La fecha inicial no puede ser posterior a la fecha final')
            }),
        fechaFinal: Yup.string().required("Fecha final es obligatoria."),
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);


    const styles = makeStyles({
        boton:{
            backgroundColor:'#ffe01b',
            color: '#666666',
            display:'flex'
        },
        marginright:{
            marginRight: '30px',
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
        },
        btnContainer:{
            display:'flex',
            justifyContent:'center'
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


    const buttonSubmittProps = { // make sure all required component's inputs/Props keys&types match
        variant:"contained",
        color:"primary",
        type:"submit"
    }

    function resetForm (form){
        form.reset();

    }

    return (
        <div >
            <Grid item xs={12}>
                <Typography variant={"h6"} paragraph className={cla.fontblack} align={"center"}>
                    <b>Consultar bitácora</b>
                </Typography>
            </Grid>
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={validate}
                render={({ handleSubmit,values, submitting, form }) => (
                    <form  onSubmit={handleSubmit} noValidate>
                        {alert.status === undefined &&
                        <div>
                            <Grid className= {cla.gridpadding} spacing={3} container>
                                <Grid item xs={12} md={3}>
                                    <DateTimePicker
                                        locale={deLocale}
                                        format={"yyyy-MM-dd'T'HH:mm:ss"}
                                        label="Fecha Inicial *"
                                        name="fechaInicial"
                                        dateFunsUtils={DateFnsUtils}
                                        clearable={true}
                                        cancelLabel={"Cancelar"}
                                        clearLabel={"Limpiar"}
                                        okLabel={"Aceptar"}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <DateTimePicker
                                        locale={deLocale}
                                        format={"yyyy-MM-dd'T'HH:mm:ss"}
                                        label="Fecha Final *"
                                        name="fechaFinal"
                                        dateFunsUtils={DateFnsUtils}
                                        clearable={true}
                                        cancelLabel={"Cancelar"}
                                        clearLabel={"Limpiar"}
                                        okLabel={"Aceptar"}
                                        minDate={values.fechaInicial}
                                    />
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
                                <Grid md={9}/>
                                <Grid md={10}/>

                                <Grid item xs={12} md={1} justify={"flex-end"} className={cla.btnContainer}>
                                    {
                                        <Tooltip title="Limpiar" placement="right">
                                            <Button className={cla.boton}  variant="contained"
                                                    onClick={()=> {resetForm(form)}}> LIMPIAR </Button>
                                        </Tooltip>
                                    }
                                </Grid>
                                <Grid item xs={12} md={1} className={cla.btnContainer}>
                                    <Tooltip title="Generar" placement="right">
                                        <Button  className={cla.boton}  variant="contained"
                                                 type="submit"
                                                 disabled={submitting}> Generar
                                        </Button>
                                    </Tooltip>
                                </Grid>
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
