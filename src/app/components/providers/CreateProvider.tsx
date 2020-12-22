import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import { Checkboxes ,TextField,  makeValidate,makeRequired, Select} from 'mui-rff';
import {MenuItem, Grid, Button,Paper} from "@material-ui/core";
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


const CreateProvider = ({id, provider,alert }) => {
    return <MyForm initialValues={provider}  id={id} alerta={alert}/>;
}

interface FormProvider {
    dependencia?:string;
    sistemas?:string[];
    estatus?:string;
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

    const schema = Yup.object().shape({
        dependencia: Yup.string().required(),
        sistemas: Yup.array().min(1).required(),
        estatus: Yup.boolean().required(),
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
          backgroundColor:'#34b3eb',
          color: '#666666'
        }
        
      }));
      
    const classes = useStyles();

    return (
        <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
            render={({ handleSubmit,values, submitting   }) => (
                <form  onSubmit={handleSubmit} noValidate>
                    {alert.status === undefined &&  <div>
                        <Grid container spacing={3} className={classes.fontblack}>
                <Grid item xs>
                  <Paper elevation={0}>
                    <TextField label="Dependencia" name="dependencia" required={true} />
                  </Paper>
                </Grid>
                <Grid item xs >
                  <Paper elevation={0} className={classes.fontblack}>
                  <Checkboxes  name = "sistemas" label="Selecciona los sistemas aplicables"  required={true} data={sistemasData} ></Checkboxes>
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper elevation={0}>
                    <Select name="estatus" label="Estatus" formControlProps={{margin:'normal'}} className={classes.fontblack}>
                        <MenuItem value="true">Vigente</MenuItem>
                        <MenuItem value="false">No vigente</MenuItem>
                    </Select>
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper elevation={0}>
                      <Button  variant="contained"
                            className={classes.boton}
                            type="submit"
                            disabled={submitting}> Guardar 
                      </Button>
                      
                    </Paper>
                </Grid>
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
