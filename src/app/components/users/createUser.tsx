import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import { Checkboxes ,TextField,  makeValidate,makeRequired, } from 'mui-rff';
import {MenuItem, Grid, Button} from "@material-ui/core";
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import {requestCreationUser} from "../../store/mutations";

export const CreateUser = () => {
    return <MyForm initialValues={{}} />;
}

interface FormDataUser {
    nombre?:string;
    apellido1?:string;
    apellido2?:string;
    cargo?:string;
    correo?:string;
    telefono?:string;
    extencion?:string;
    usuario?:string;
    password?:string;
    sistemas?:string[];
}

interface MyFormProps {
    initialValues: FormDataUser;
}

function MyForm(props: MyFormProps) {
    const { initialValues } = props;
    const dispatch = useDispatch();

    // yes, this can even be async!
    async function onSubmit(values: FormDataUser) {
        console.log(values);
        dispatch(requestCreationUser(values));

    }

    const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/

    const schema = Yup.object().shape({
        nombre: Yup.string().required(),
        apellido1: Yup.string().required(),
        apellido2: Yup.string().required(),
        cargo: Yup.string().required(),
        correo: Yup.string().required().email(),
        telefono:  Yup.string().matches(new RegExp('[0-9]{10}'), 'Inserta un número de teléfono valido'),
        extencion: Yup.string().required(),
        usuario: Yup.string().required(),
        password: Yup.string().required(),
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
                <form onSubmit={handleSubmit} noValidate>
                    <TextField label="Hello world" name="hello" required={true} />
                    <TextField label="Nombre" name="nombre" required={true} />
                    <TextField label="Primer apellido" name="apellido1" required={true} />
                    <TextField label="Segundo apellido" name="apellido2" />
                    <TextField label="cargo" name="cargo" required={true} />
                    <TextField label="Correo electronico" name="correo" required={true} />
                    <TextField label="Número de teléfono" name="telefono" required={true} />
                    <TextField label="Extención" name="extencion" required={true} />
                    <TextField label="Nombre de usuario" name="usuario" required={true} />
                    <TextField label="Contraseña" name="password"  type="password" required={true} />
                    <Checkboxes name = "sistemas" label="Selecciona los sistemas aplicables" required={true} data={sistemasData}></Checkboxes>
                    <Button  variant="contained"
                             color="primary"
                             type="submit"
                             disabled={submitting}> Guardar </Button>
                    <pre>{JSON.stringify(values)}</pre>
                </form>
            )}
        />
    );
}
