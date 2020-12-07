import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import { Checkboxes ,TextField,  makeValidate,makeRequired, } from 'mui-rff';
import {MenuItem, Grid, Button} from "@material-ui/core";
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import {requestCreationUser} from "../../store/mutations";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import Typography from "@material-ui/core/Typography";
import { connect } from 'react-redux';
import {userActions} from "../../_actions/user.action";
import {alertActions} from "../../_actions/alert.actions";


const CreateUser = ({id, user,alert }) => {
    return <MyForm initialValues={user}  id={id} alerta={alert}/>;
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
    let { initialValues , id , alerta } = props;
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
        nombre: Yup.string().required(),
        apellidoUno: Yup.string().required(),
        apellidoDos: Yup.string().required(),
        cargo: Yup.string().required(),
        correoElectronico: Yup.string().required().email(),
        telefono:  Yup.string().matches(new RegExp('[0-9]{10}'), 'Inserta un número de teléfono valido'),
        extension: Yup.string().required(),
        usuario: Yup.string().required(),
        constrasena: Yup.string().required(),
        sistemas: Yup.array().min(1).required(),
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

    return (
        <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
            render={({ handleSubmit,values, submitting   }) => (
                <form  onSubmit={handleSubmit} noValidate>
                    {alert.status === undefined &&  <div>
                        <TextField label="Hello world" name="hello" required={true} />
                        <TextField label="Nombre" name="nombre" required={true} />
                        <TextField label="Primer apellido" name="apellidoUno" required={true} />
                        <TextField label="Segundo apellido" name="apellidoDos" />
                        <TextField label="cargo" name="cargo" required={true} />
                        <TextField label="Correo electronico" name="correoElectronico" required={true} />
                        <TextField label="Número de teléfono" name="telefono" required={true} />
                        <TextField label="Extensión" name="extension" required={true} />
                        <TextField label="Nombre de usuario" name="usuario" required={true} />
                        <TextField label="Contraseña" name="constrasena"  type="password" required={true} />
                        <Checkboxes name = "sistemas" label="Selecciona los sistemas aplicables" required={true} data={sistemasData}></Checkboxes>
                        <Button  variant="contained"
                                 color="primary"
                                 type="submit"
                                 disabled={submitting}> Guardar </Button>
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
                    <pre>{alert.status}</pre>
                </form>
            )}
        />
    );
}

function mapStateToProps(state,ownProps){
    let alert = state.alert;
    if( ownProps.match != undefined ){
        let id = ownProps.match.params.id;
        let user = state.users.find(user=>user._id === id);
        return {
            id,
            user,
            alert
        }
    }else{
        return {alert};
    }
}


function mapDispatchToProps(dispatch, ownProps){
    if(ownProps.match != undefined){
        if(ownProps.match.params.id){
            let id = ownProps.match.params.id;
            dispatch(userActions.fillUserUpdate(id));
            dispatch((alertActions.clear()));
        }
    }else{
        return {};
    }

}

export const ConnectedCreateUser = connect(mapStateToProps,mapDispatchToProps)(CreateUser);
