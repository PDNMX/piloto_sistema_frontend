import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import { Checkboxes ,TextField,  makeValidate,makeRequired,Select } from 'mui-rff';
import {MenuItem, Grid, Button, Paper} from "@material-ui/core";
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import {requestCreationProvider} from "../../store/mutations";
import { makeStyles } from '@material-ui/core/styles';


export const CreateProvider = () => {
    return <MyForm initialValues={{}} />;
}

interface FormProvider {
    dependencia?:string;
    sistemas?:string[];
    estatus?:string;
}



interface MyFormProps {
    initialValues: FormProvider;
}

function MyForm(props: MyFormProps) {
    const { initialValues } = props;
    const dispatch = useDispatch();

    // yes, this can even be async!
    async function onSubmit(values: FormProvider) {
        console.log(values);
        dispatch(requestCreationProvider(values));
        
      
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
            <form onSubmit={handleSubmit} noValidate>
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
                      <pre>{JSON.stringify(values)}</pre>
                    </Paper>
                </Grid>
              </Grid>
            </form>
            )}
        />
    );
}