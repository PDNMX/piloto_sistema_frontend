import { take, put, select } from 'redux-saga/effects';
import uuid from 'uuid';
import axios from 'axios';
import * as mutations from './mutations';
import path from "path";
import moment from 'moment'

require('dotenv').config({ path: path.resolve(__dirname, '../../utils/.env')});
const url = process.env.URLAPI;
const ur= "http://localhost:3004";

export function* validationErrors(){
    while (true) {
        const {schema,systemId} = yield take (mutations.REQUEST_VALIDATION_ERRORS);
        if(systemId === "s2"){
            let SCHEMA = JSON.parse(schema);
            const respuestaArray = yield axios.post(ur + `/validateSchemaS2`,SCHEMA);
            yield put(mutations.setErrorsValidation(respuestaArray.data));
            console.info("got responce",respuestaArray);
        }
    }
}

export function* creationUser(){
    while (true) {
        const {usuarioJson} = yield take (mutations.REQUEST_CREATION_USER);
        let fechaActual = moment();
        usuarioJson["fechaAlta"]= fechaActual.format();
        usuarioJson["estatus"] = true; // true is active
        usuarioJson["vigenciaContrasena"] = fechaActual.add(3 , 'months').format().toString();
        usuarioJson["rol"]= [{clave  :  2, valor : "proveedor",  descripcion : "Contraloría del Estado de Oaxaca"}];
        const respuestaAlta = yield axios.post(ur + `/create/user`,usuarioJson);


    }
}
