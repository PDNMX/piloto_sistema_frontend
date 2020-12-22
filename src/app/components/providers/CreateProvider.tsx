import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import { Checkboxes ,TextField,  makeValidate,makeRequired, Select} from 'mui-rff';
import {MenuItem, Grid, Button,Paper, FormControlLabel} from "@material-ui/core";
import { FormControl } from '@material-ui/core';
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import {requestCreationProvider, requestCreationUser} from "../../store/mutations";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {providerActions} from "../../_actions/provider.action";
import {alertActions} from "../../_actions/alert.actions";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';



const CreateProvider = ({id, provider,alert }) => {
    return <MyForm initialValues={provider}  id={id} alerta={alert}/>;
}


interface FormProvider {
    dependencia?:string;
    sistemas?:string[];
    estatus?:string;
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
            dispatch(requestCreationProvider({...values, _id : id}));
        }else{
            dispatch(requestCreationProvider(values));
        }

    }

    const [state, setState] = React.useState({
        estado: false
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        console.log( event.target.name+" "+event.target.checked);
        setState({estado:event.target.checked});
    };

      const schema = Yup.object().shape({
        dependencia:  Yup.string().required().matches(new RegExp('^[ñáéíóúáéíóúÁÉÍÓÚa-zA-Z ]*$'), 'Inserta solamente caracteres'),
        sistemas: Yup.array().min(1).required(),
        estatus: Yup.boolean(),
        fechaAlta: Yup.string(),
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);


    const sistemasData = [
        {label: 'Servidores públicos que intervienen en contrataciones', value: 's2'},
        {label: 'Públicos Sancionados', value: 's31'},
        {label: 'Particulares Sancionados', value: 's32'}
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
            <Grid container>
                <Link component={RouterLink}  to={`/proveedores`}>
                    <Button style = {{}}><ArrowBackIcon fontSize="large"/></Button>
                </Link>
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
                            <Grid item xs={12} md={3}>
                                <TextField label="Dependencia" name="dependencia" required={true} />
                            </Grid>
                            <Grid item xs={12} md={5} className={classes.fontblack}>
                                <Select  name = "sistemas" label="Selecciona los sistemas aplicables"  required={true} data={sistemasData} multiple={true}></Select>
                            </Grid>
                            { id!=null ?
                            <Grid item xs={12} md={4} >
                                {/*<Select name="estatus" label="Estatus" className={classes.fontblack}>
                                     <MenuItem value="true">Vigente</MenuItem>
                                     <MenuItem value="false">No vigente</MenuItem>
                                 </Select>
                                 */}
                                <Switch
                                   
                                    onChange={handleChange}
                                    color="primary"
                                    name="estatus"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </Grid>
                            :
                                <Grid >

                                    {/* <Switch
                                        checked={state.estatus}
                                        value={state.estatus}
                                        onChange={handleChange}
                                        color="primary"
                                        name="estatus"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                   <Select name="estatus" value="true" formControlProps={{ value:"true" }}>
                                        <MenuItem value="true" >Vigente</MenuItem>
                                        <MenuItem value="false">No vigente</MenuItem>
                                    </Select>
                                        */}

                                    {/*<TextField  name="estatus" required={false} value={true} />*/}
                                </Grid>
                            }

                        </Grid>
                        <Grid  spacing={3} justify="flex-end" className={classes.gridpadding}
                                   alignItems="flex-end"
                                   container
                                   item
                                   xs={12}
                                   md={12}>

                            <Link component={RouterLink}  to={`/proveedores`}>
                                <Button  variant="contained"
                                         className={classes.marginright}
                                         > Cancelar
                                </Button>
                            </Link>
                              <Button  variant="contained"
                                    className={classes.boton}
                                    type="submit"
                                    disabled={submitting}> Guardar
                              </Button>
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
                                                                                                     