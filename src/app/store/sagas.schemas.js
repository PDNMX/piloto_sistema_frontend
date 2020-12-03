import { take, put, select } from 'redux-saga/effects';
import uuid from 'uuid';
import axios from 'axios';
import * as mutations from './mutations';
import path from "path";
import moment from 'moment'
import {alertActions} from "../_actions/alert.actions";
import {history} from "./history";
import {userConstants} from "../_constants/user.constants";
import {userActions} from "../_actions/user.action";


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

export function* requestUserPerPage(){
    while (true) {
        const {objPaginationReq} = yield take(userConstants.USERS_PAGINATION_REQUEST);
        const respuestaArray = yield axios.post(ur + `/getUsers`,objPaginationReq);
        yield put(userActions.setPagination(respuestaArray.data.pagination));
        yield put(userActions.setPerPageSucces(respuestaArray.data.results));
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
        const {status} = yield axios.post(ur + `/create/user`,usuarioJson, {validateStatus: () => true});
        if(status === 200){
            //all OK
            yield put(alertActions.success("Usuario creado con exito"));
            history.push('/uploadFile');
        }else{
            //error in responce
        }


    }
}
