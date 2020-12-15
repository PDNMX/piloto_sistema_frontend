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
import {providerConstants} from "../_constants/provider.constants";
import {providerActions} from "../_actions/provider.action";

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
        console.log("->>>>>>>>>>>>>>"+url);
        const respuestaArray = yield axios.post(ur + `/getUsers`,objPaginationReq);
        yield put(userActions.setPagination(respuestaArray.data.pagination));
        yield put(userActions.setPerPageSucces(respuestaArray.data.results));
    }
}

export function* requestProviderPerPage(){
    while (true) {
        const {objPaginationReq} = yield take(providerConstants.PROVIDERS_PAGINATION_REQUEST);
        const respuestaArray = yield axios.post(ur + `/getProviders`,objPaginationReq);
        yield put(providerActions.setPagination(respuestaArray.data.pagination));
        yield put(providerActions.setPerPageSucces(respuestaArray.data.results));
        
    }
}

export function* fillTemporalUser(){
    while (true) {
        const {id} = yield take(userConstants.USER_TEMPORAL_REQUEST);
        let query = {"query" : {"_id" : id}};
        const respuestaArray = yield axios.post(ur + `/getUsers`, query);
        yield put(userActions.setPerPageSucces(respuestaArray.data.results));
    }
}

export function* fillTemporalProvider(){
    while (true) {
        const {id} = yield take(providerConstants.PROVIDER_TEMPORAL_REQUEST);
        let query = {"query" : {"_id" : id}};
        const respuestaArray = yield axios.post(ur + `/getProviders`, query);
        yield put(providerActions.setPerPageSucces(respuestaArray.data.results));
    }
}

export function* fillAllProviders(){
    while (true){
        yield take(providerConstants.PROVIDERS_GETALL);
        const respuestaArray = yield axios.post(ur + `/getProvidersFull`);
        yield put(providerActions.setProvidersAll(respuestaArray.data.results));
    }
}
export function* deleteUser(){
    while (true) {
        const {id} = yield take (userConstants.DELETE_REQUEST);
        let request = {"_id": id};
        try{
            const {status} = yield axios.post(ur + `/deleteUser`,request, {validateStatus: () => true});
            if(status === 200){
                yield put(userActions.deleteUserDo(id));
                yield put(alertActions.success("Usuario eliminado con exito"));
            }else{
                //error in responce
                yield put(alertActions.error("El usuario NO fue eliminado"));
            }
        }catch (e) {
            yield put(alertActions.error("El usuario NO fue eliminado"));
        }

    }
}

export function* deleteProvider(){
    while (true) {
        const {id} = yield take (providerConstants.DELETE_REQUEST);
        let request = {"_id": id};
        const {status} = yield axios.post(ur + `/deleteProvider`,request, {validateStatus: () => true});
        if(status === 200){
            yield put(providerActions.deleteProviderDo(id));
            yield put(alertActions.success("Proveedor eliminado con exito"));
        }else{
            //error in responce
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
        const {status} = yield axios.post(ur + `/create/user`,usuarioJson, {validateStatus: () => true});
        if(status === 200){
            //all OK
            yield put(alertActions.success("Usuario creado con exito"));
            history.push('/usuarios');
            yield put(alertActions.clear());
        }else{
            //error in responce
        }
    }
}

export function* creationProvider(){
    while(true){
        const {usuarioJson} = yield take (mutations.REQUEST_CREATION_PROVIDER);
        let fechaActual =moment();
        usuarioJson["fechaAlta"]=fechaActual.format();
        const {status}  =yield axios.post(ur + `/create/provider`, usuarioJson);
        if(status === 200){
            //all OK
            yield put(alertActions.success("Proovedor creado con exito"));
            history.push('/providers');
            yield put(alertActions.clear());
        }else{
            //error in responce
        }

    }
}
