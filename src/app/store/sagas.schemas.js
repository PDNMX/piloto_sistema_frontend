
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
import {REQUEST_TOKEN_AUTH, requestTokenAuth, REQUEST_RESET_PASSWORD, USER_VIGENCIACONTRASENA_SET,REQUEST_PERMISOS_SISTEMA_SET} from "./mutations";
import {catalogConstants} from "../_constants/catalogs.constants";
import {catalogActions} from "../_actions/catalog.action";
import {S2Constants} from "../_constants/s2.constants";
import {storeValidate} from "./index";
import {S2Actions} from "../_actions/s2.action";
import {bitacoraActions} from "../_actions/bitacora.action";
import {S3SConstants} from "../_constants/s3s.constants";
import {S3SActions} from "../_actions/s3s.action";
import {S3PConstants} from "../_constants/s3p.constants";
import {S3PActions} from "../_actions/s3p.action";
const qs = require('querystring')
const jwt = require('jsonwebtoken');
const _ = require('underscore');
import { formatISO } from 'date-fns'
import {forEach} from "underscore";


const host = process.env.URLAPI;
const urOauth2 = host+process.env.PORTOAUTH
const ur= host+process.env.PORTAPI;
const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;


export function* validationErrors(){
    while (true) {
        const {schema,systemId} = yield take (mutations.REQUEST_VALIDATION_ERRORS);
        const token = localStorage.token;
        if(token){
            let payload = jwt.decode(token);
            yield put (userActions.setUserInSession(payload.idUser));
            var usuario=payload.idUser;
            let SCHEMA;
            try {
                SCHEMA = JSON.parse(schema);
            }catch (e) {
                yield put(alertActions.error("Error encontrado en sintaxis del archivo Json "+ e));
            }

            try{
                let respuestaArray;
                let urlValidation;

                if(systemId === "S2"){
                    urlValidation= `/validateSchemaS2`;
                }else if(systemId === "S3S"){
                    urlValidation= `/validateSchemaS3S`;
                }else if(systemId === "S3P"){
                    urlValidation= `/validateSchemaS3P`;
                }

                respuestaArray = yield axios.post(ur + urlValidation ,SCHEMA, { headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'usuario':usuario
                    }});

                if(respuestaArray.data.Status === 500){
                    console.log(respuestaArray.data.response);
                    yield put(mutations.setErrorsValidation(respuestaArray.data.response));
                    yield put(alertActions.error("No se realizó el registro ya que se encontraron errores en la validación, favor de verificar"));
                }else{
                    let numeroRegistros= respuestaArray.data.detail.numeroRegistros;
                    yield put(alertActions.success("Se insertaron "+ numeroRegistros+" registros correctamente"));
                }

            }catch (e) {
                yield put(alertActions.error("Error encontrado en la petición hacia el servidor "+ e));
            }
        }else{
            console.log("error in token");
        }
    }
}

export function* requestUserPerPage(){
    while (true) {
        const {objPaginationReq} = yield take(userConstants.USERS_PAGINATION_REQUEST);
        const token = localStorage.token;
        const respuestaArray = yield axios.post(ur + `/getUsersFull`,objPaginationReq,{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        yield put(userActions.setPerPageSucces(respuestaArray.data.results));

    }
}


export function* requestProviderPerPage(){
    while (true) {
        const {objPaginationReq} = yield take(providerConstants.PROVIDERS_PAGINATION_REQUEST);
        const token = localStorage.token;
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser));
        let query = { "usuario":payload.idUser};
        const respuestaArray = yield axios.post(ur + `/getProvidersFull`,objPaginationReq, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        yield put(providerActions.setPerPageSucces(respuestaArray.data.results));

    }
}

export function* fillTemporalUser(){
    while (true) {
        const {id} = yield take(userConstants.USER_TEMPORAL_REQUEST);
        const token = localStorage.token;
        if(token){
            let query = {"query" : {"_id" : id}};
            const respuestaArray = yield axios.post(ur + `/getUsers`, query, { headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }});
            yield put(userActions.setPerPageSucces(respuestaArray.data.results));
        }
    }
}

export function* fillTemporalProvider(){
    while (true) {
        const {id} = yield take(providerConstants.PROVIDER_TEMPORAL_REQUEST);
        const token = localStorage.token;
        if(token){
            let query = {"query" : {"_id" : id}};
            const respuestaArray = yield axios.post(ur + `/getProviders`, query,{ headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }});
            yield put(providerActions.setPerPageSucces(respuestaArray.data.results));
        }
    }
}

export function* fillAllProviders(){
    while (true){
        yield take(providerConstants.PROVIDERS_GETALL);

        const token = localStorage.token;
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser));
        let query = { "usuario":payload.idUser};

        const respuestaArray = yield axios.post(ur + `/getProvidersFull`,query,{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        yield put(providerActions.setProvidersAll(respuestaArray.data.results));
    }
}

export function* fillAllProvidersEnabled(){
    while (true){
        yield take(providerConstants.PROVIDERS_GETALL_ENABLED);

        const token = localStorage.token;
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser));
        let query = { "usuario":payload.idUser};

        const respuestaArray = yield axios.post(ur + `/getProvidersFull`,query,{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        var arrdata=[];
        respuestaArray.data.results.forEach(function(row){
            if(row.estatus==true){
                arrdata.push({label:row.label,value:row.value, sistemas:row.sistemas});
            }
        });

        yield put(providerActions.setProvidersAllEnable(arrdata));
    }
}

export function* fillAllUsers(){
    while (true){
        yield take(userConstants.USERS_GETALL);

        const token = localStorage.token;
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser));
        let query = { "usuario":payload.idUser};

        const respuestaArray = yield axios.post(ur + `/getUsersAll`,query,{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        respuestaArray.data.results.push({label: "NINGUNO", value:""});
        yield put(userActions.setUsersAll(respuestaArray.data.results));
    }
}


export function* deleteUser(){
    while (true) {
        const {id} = yield take (userConstants.DELETE_REQUEST);
        const token = localStorage.token;
        if(token){
            let request = {"_id": id};
            try{
                let payload = jwt.decode(token);
                yield put (userActions.setUserInSession(payload.idUser))
                console.log(payload.idUser);
                let request = {"_id": id,"user":payload.idUser};
                const {status} = yield axios.delete(ur + `/deleteUser`, { data : {request} , headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': `Bearer ${token}`
                    } , validateStatus: () => true});
                if(status === 200){
                    yield put(userActions.deleteUserDo(id));
                    yield put(alertActions.success("Se elimino el usuario con éxito"));
                }else{
                    //error in response
                    yield put(alertActions.error("El usuario NO fue eliminado"));
                }
            }catch (e) {
                yield put(alertActions.error("El usuario NO fue eliminado"));
            }
        }


    }
}

export function* deleteProvider(){
    while (true) {
        const {id} = yield take (providerConstants.DELETE_REQUEST);
        const token = localStorage.token;
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser))
        let request = {"_id": id,"usuario":payload.idUser};
        const {status} = yield axios.delete(ur + `/deleteProvider`, { data : {request} ,headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            },validateStatus: () => true});
        if(status === 200){
            yield put(providerActions.deleteProviderDo(id));
            yield put(alertActions.success("Proveedor eliminado con éxito"));
        }else{
            //error in response
        }
    }
}

export function* loginUser(){
    while (true){
        const {credentialUser} = yield take (mutations.REQUEST_TOKEN_AUTH);
        let userName = credentialUser.username;
        let password = credentialUser.password;

        const requestBody = {
            client_id: clientId,
            grant_type: 'password',
            username: userName,
            password: password,
            client_secret: clientSecret
        }

        try{
            const token = yield axios.post(urOauth2 + `/oauth/token`, qs.stringify(requestBody), { headers: {validateStatus: () => true ,'Content-Type': 'application/x-www-form-urlencoded' } });
            localStorage.setItem("token", token.data.access_token);

            const toke = localStorage.token;
            let payload = jwt.decode(toke);
            const usuario={id_usuario: payload.idUser};
            usuario["id_usuario"]=payload.idUser;

            const status = yield axios.post(ur + `/validationpassword`,usuario, {headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${toke}`
                } , validateStatus: () => true});

            if(status.data.estatus===false){
                history.push('/login');
                yield put(alertActions.error("Usuario desactivado.¡Debes contactar al administrador!."));
            }else{
                localStorage.setItem("cambiarcontrasena", status.data.contrasenaNueva);

                yield put (userActions.setVigenciaPass(status.data.contrasenaNueva));
                yield put (userActions.setRol(status.data.rol));
                yield put (userActions.setPermisosSistema(status.data.sistemas));
                yield put (userActions.setProvider(status.data.proveedor));

                localStorage.setItem("rol",status.data.rol);
                localStorage.setItem("sistemas",status.data.sistemas);

                if(status.data.contrasenaNueva===true){
                    history.push('/usuario/cambiarcontrasena');
                    yield put(alertActions.error("Debes cambiar tu contraseña de manera obligatoria."));
                }else
                if(status.data.rol=="2"){
                    history.push('/cargamasiva');
                }else{
                    history.push('/usuarios');
                }
            }



        }catch (err) {
            if(err.response){
                yield put(alertActions.error(err.response.data.message));
            }else{
                yield put(alertActions.error(err.toString()));
            }
        }
    }
}

export function* permisosSistemas(){
    while(true){
        yield take (userConstants.REQUEST_PERMISOS_SISTEMA);
        const toke = localStorage.token;
        let payload = jwt.decode(toke);

        const usuario={id_usuario: payload.idUser};
        usuario["id_usuario"]=payload.idUser;

        const status = yield axios.post(ur + `/validationpassword`,usuario, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${toke}`
            } , validateStatus: () => true});

        localStorage.setItem("cambiarcontrasena", status.data.contrasenaNueva);

        yield put (userActions.setVigenciaPass(status.data.contrasenaNueva));
        yield put (userActions.setRol(status.data.rol));
        yield put (userActions.setPermisosSistema(status.data.sistemas));
        yield put (userActions.setProvider(status.data.proveedor));

        localStorage.setItem("rol",status.data.rol);
        localStorage.setItem("sistemas",[status.data.sistemas]);
        localStorage.setItem("S2",false);
        localStorage.setItem("S3S",false);
        localStorage.setItem("S3P",false);
        let permisos=[];
        permisos=status.data.sistemas;
        let permiso=false;

        permisos.map((item)=>{
            if(item=="S2"){
                localStorage.setItem("S2",true);
            }else if(item=="S3S"){
                localStorage.setItem("S3S",true);
            }else if(item=="S3P"){
                localStorage.setItem("S3P",true);
            }
        });

    }
}


export function* verifyTokenGetUser(){
    while(true){
        const {token} = yield take (userConstants.USER_REQUEST_SESSION_SET);
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser));
    }
}

export function* closeSession(){
    while (true){
        yield take (userConstants.USER_SESSION_REMOVE);
        localStorage.removeItem("token");
        localStorage.removeItem("cambiarcontrasena");
        localStorage.removeItem("rol");
        localStorage.clear();
        history.push('/login');
    }
}

export function* creationUser(){
    while (true) {
        const {usuarioJson} = yield take (mutations.REQUEST_CREATION_USER);
        const token = localStorage.token;
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser))

        if(payload.contrasenaNueva===true){
            history.push('/usuario/cambiarcontrasena');
            yield put(alertActions.error("Debes cambiar tu contraseña de manera obligatoria."));
        }

        usuarioJson["user"]=payload.idUser;
        const status = yield axios.post(ur + `/create/user`,usuarioJson, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            } , validateStatus: () => true});

        if(status.data.Status===500){
            yield put(alertActions.clear());
            history.push('/usuario/crear');
            yield put(alertActions.error("El nombre de usuario y/o correo electrónico ya han sido registrados anteriormente."));
        }else if(status.status === 200){
            //all OK
            yield put(alertActions.clear());
            history.push('/usuarios');
            yield put(alertActions.success("Usuario creado con éxito"));


        }else{
            //error in response
        }
    }
}



export function* editUser(){
    while (true) {
        const {usuarioJson} = yield take (mutations.REQUEST_EDIT_USER);
        let fechaActual = moment();
        const token = localStorage.token;
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser))

        usuarioJson["user"]=payload.idUser;
        const status = yield axios.put(ur + `/edit/user`,usuarioJson, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            } , validateStatus: () => true});

        if(status.data.Status===500){
            yield put(alertActions.error(status.data.message));
            history.push('/usuarios');

        }else if(status.status === 200){
            //all OK

            yield put(alertActions.success("Usuario editado con éxito"));
            history.push('/usuarios');

        }else{
            //error in response
        }
    }
}


export function* creationProvider(){
    while(true){
        const {usuarioJson} = yield take (mutations.REQUEST_CREATION_PROVIDER);
        let fechaActual =moment();
        if(usuarioJson["estatus"]==undefined || usuarioJson["estatus"]==null){
            usuarioJson["estatus"]=true;
            usuarioJson["fechaAlta"]=fechaActual.format();
        }else{
            usuarioJson["fechaActualizacion"]=fechaActual.format();
        }
        const token = localStorage.token;
        //const {token} = yield take (userConstants.USER_REQUEST_SESSION_SET);
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser))
        usuarioJson["usuario"]=payload.idUser;
        const {status}  =yield axios.post(ur + `/create/provider`, usuarioJson, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            } ,validateStatus: () => true});
        if(status === 200){
            //all OK
            yield put(alertActions.success("Proveedor creado con éxito"));
        }else{
            //error in response
        }

    }
}

export function* editProvider(){
    while(true){
        const {usuarioJson} = yield take (mutations.REQUEST_EDIT_PROVIDER);
        let fechaActual =moment();
        if(usuarioJson["estatus"]==undefined || usuarioJson["estatus"]==null){
            usuarioJson["estatus"]=true;
            usuarioJson["fechaAlta"]=fechaActual.format();
        }else{

            usuarioJson["fechaActualizacion"]=fechaActual.format();
        }
        const token = localStorage.token;
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser));
        usuarioJson["usuario"]=payload.idUser;
        const {status}  =yield axios.put(ur + `/edit/provider`, usuarioJson, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            } ,validateStatus: () => true});
        if(status === 200){
            //all OK

            yield put(alertActions.success("Proveedor editado con éxito"));

        }else{
            //error in response
        }
    }
}

export function* getCatalogRamo(){
    while(true){
        const {docType} = yield take (catalogConstants.RAMO_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        respuestaArray.data.results.push({label: "NINGUNO", value:""});

        yield put (catalogActions.setRamoSucces(respuestaArray.data.results));

    }
}


export function* getCatalogGenero(){
    while(true){
        const {docType} = yield take (catalogConstants.GENERO_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        respuestaArray.data.results.push({label: "NINGUNO", value:""});
        yield put (catalogActions.setGeneroSucces(respuestaArray.data.results));
    }
}


export function* getCatalogPuesto(){
    while(true){
        const {docType} = yield take (catalogConstants.PUESTO_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        respuestaArray.data.results.push({label: "NINGUNO", value:""});
        yield put (catalogActions.setPuestoSucces(respuestaArray.data.results));
    }
}


export function* getCatalogTipoArea(){
    while(true){
        const {docType} = yield take (catalogConstants.TIPO_AREA_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        respuestaArray.data.results.push({label: "NINGUNO", value:""});
        yield put (catalogActions.setTipoAreaSucces(respuestaArray.data.results));
    }
}

export function* getCatalogNivelResponsabilidad(){
    while(true){
        const {docType} = yield take (catalogConstants.NIVEL_RESPONSABILIDAD_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        respuestaArray.data.results.push({label: "NINGUNO", value:""});
        yield put (catalogActions.setNivelResponsabilidadSucces(respuestaArray.data.results));
    }
}

export function* getCatalogTipoProcedimiento(){
    while(true){
        const {docType} = yield take (catalogConstants.TIPO_PROCEDIMIENTO_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        // respuestaArray.data.results.push({label: "NINGUNO", value:""});
        yield put (catalogActions.setTipoProcedimientoSucces(respuestaArray.data.results));
    }
}

// ----------------------------------------------- catalogos S3S


export function* getCatalogTipoFalta(){
    while(true){
        const {docType} = yield take (catalogConstants.TIPO_FALTA_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        respuestaArray.data.results.push({label: "NINGUNO", value:""});
        yield put (catalogActions.setTipoFaltaSucces(respuestaArray.data.results));
    }
}

export function* getCatalogTipoSancion(){
    while(true){
        const {docType} = yield take (catalogConstants.TIPO_SANCION_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        respuestaArray.data.results.push({label: "NINGUNO", value:""});
        yield put (catalogActions.setTipoSancionSucces(respuestaArray.data.results));
    }
}

export function* getCatalogMoneda(){
    while(true){
        const {docType} = yield take (catalogConstants.MONEDA_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        yield put (catalogActions.setMonedaSucces(respuestaArray.data.results));
    }
}

export function* getCatalogPais(){
    while(true){
        const {docType} = yield take (catalogConstants.PAIS_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        yield put (catalogActions.setPaisSucces(respuestaArray.data.results));
    }
}

export function* getCatalogEstado(){
    while(true){
        const {docType} = yield take (catalogConstants.ESTADO_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        yield put (catalogActions.setEstadoSucces(respuestaArray.data.results));
    }
}
export function* getCatalogMunicipio(){
    while(true){
        const {idEstado} = yield take (catalogConstants.MUNICIPIO_REQUEST);
        const token = localStorage.token;
        const respuestaArray = yield axios.post(ur + `/getCatalogsMunicipiosPorEstado`,{idEstado: idEstado},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        yield put (catalogActions.setMunicipioSucces(respuestaArray.data.results));
    }
}
export function* getCatalogVialidad(){
    while(true){
        const {docType} = yield take (catalogConstants.VIALIDAD_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        yield put (catalogActions.setVialidadSucces(respuestaArray.data.results));
    }
}
export function* getCatalogTipoDocumento(){
    while(true){
        const {docType} = yield take (catalogConstants.TIPO_DOCUMENTO_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        respuestaArray.data.results.push({label: "NINGUNO", value:""});
        yield put (catalogActions.setTipoDocumentoSucces(respuestaArray.data.results));
    }
}

export function* getCatalogTipoPersona(){
    while(true){
        const {docType} = yield take (catalogConstants.TIPO_PERSONA_REQUEST);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: docType},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        yield put (catalogActions.setTipoPersonaSucces(respuestaArray.data.results));
    }
}

export function* creationS3PSchema(){
    while (true) {
        const {values} = yield take(S3PConstants.REQUEST_CREATION_S3P);
        const token = localStorage.token;
        let payload = jwt.decode(token);
        yield put(userActions.setUserInSession(payload.idUser));
        let usuario = payload.idUser;


        if(values.domicilio === 'mex'){
            delete values.particularSancionado.domicilioExranjero;
        }else if(values.domicilio === 'ext'){
            delete values.particularSancionado.domicilioMexico;
        }

        delete values.domicilio;
        let arrayObjTipoSancion = [];
        if (values.tipoSancion) {
            for (let sancion of values.tipoSancion) {
                let tipoSancion = JSON.parse(sancion.tipoSancion);
                arrayObjTipoSancion.push({...tipoSancion, descripcion: sancion.descripcion ? sancion.descripcion : ""});
            }
        }
        values.tipoSancion = arrayObjTipoSancion;
        if(values.multa){
            if (values.multa.moneda) {
                values.multa.moneda = JSON.parse(values.multa.moneda);
            }
            if (values.multa.monto) {
                values.multa.monto = parseFloat(values.multa.monto);
            }
        }
        if (values.documentos) {
            if (Array.isArray(values.documentos)) {
                for (let i of values.documentos) {
                    i.id = i.id.toString();
                    i.tipo = JSON.parse(i.tipo).clave;
                    let fecha = Date.parse(i.fecha);
                    i.fecha = formatISO(fecha, {representation: 'date'});
                }
            }
        }
        if (values.resolucion) {
            if (values.resolucion.fechaNotificacion) {
                let fecha = Date.parse(values.resolucion.fechaNotificacion);
                values.resolucion.fechaNotificacion = formatISO(fecha, {representation: 'date'})
            }
        }
        if (values.inhabilitacion) {
            if (values.inhabilitacion.fechaInicial) {
                let fecha = Date.parse(values.inhabilitacion.fechaInicial);
                values.inhabilitacion.fechaInicial = formatISO(fecha, {representation: 'date'})
            }
            if (values.inhabilitacion.fechaFinal) {
                let fecha = Date.parse(values.inhabilitacion.fechaFinal);
                values.inhabilitacion.fechaFinal = formatISO(fecha, {representation: 'date'})
            }
        }

        if (values.particularSancionado) {
            if (values.particularSancionado.tipoPersona) {
                let tipoPersona = JSON.parse(values.particularSancionado.tipoPersona);
                values.particularSancionado.tipoPersona = tipoPersona.clave;
            }
            if (values.particularSancionado.domicilioMexico) {
                if (values.particularSancionado.domicilioMexico.pais) {
                    let paisDomMex = JSON.parse(values.particularSancionado.domicilioMexico.pais);
                    values.particularSancionado.domicilioMexico.pais = paisDomMex;
                }
                if (values.particularSancionado.domicilioMexico.entidadFederativa) {
                    let estadoDomMex = JSON.parse(values.particularSancionado.domicilioMexico.entidadFederativa);
                    values.particularSancionado.domicilioMexico.entidadFederativa = estadoDomMex;
                }
                if (values.particularSancionado.domicilioMexico.municipio) {
                    let municipioDomMex = JSON.parse(values.particularSancionado.domicilioMexico.municipio);
                    values.particularSancionado.domicilioMexico.municipio = municipioDomMex;
                }
                if (values.particularSancionado.domicilioMexico.localidad) {
                    let localidadDomMex = JSON.parse(values.particularSancionado.domicilioMexico.localidad);
                    values.particularSancionado.domicilioMexico.localidad = localidadDomMex;
                }
                if (values.particularSancionado.domicilioMexico.vialidad) {
                    let vialidadDomMex = JSON.parse(values.particularSancionado.domicilioMexico.vialidad);
                    values.particularSancionado.domicilioMexico.vialidad = {
                        clave: vialidadDomMex.valor,
                        valor: values.particularSancionado.domicilioMexico.descripcionVialidad ? values.particularSancionado.domicilioMexico.descripcionVialidad : ""
                    };
                    if (values.particularSancionado.domicilioMexico.descripcionVialidad) {
                        delete values.particularSancionado.domicilioMexico.descripcionVialidad;
                    }
                }
            }
        }

        console.log(JSON.stringify(values));

        delete values.__v;
        if (values._id) {
            values["_id"] = values._id;
            const {status} = yield axios.post(ur + `/updateS3PSchema`, {...values, usuario: usuario}, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }, validateStatus: () => true
            });
            if (status === 200) {
                //all OK
                yield put(alertActions.success("Registro actualizado con éxito"));
            } else {
                yield put(alertActions.error("Error al crear"));
                //error in response
            }
        } else {
            const {status} = yield axios.post(ur + `/insertS3PSchema`, {...values, usuario: usuario}, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }, validateStatus: () => true
            });
            if (status === 200) {
                //all OK
                yield put(alertActions.success("Registro creado con éxito"));
            } else {
                yield put(alertActions.error("Error al crear"));
                //error in response
            }
        }
    }
}

export function* creationS3SSchema(){
    while (true) {
        const {values} = yield take (S3SConstants.REQUEST_CREATION_S3S);
        const token = localStorage.token;
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser));
        let usuario=payload.idUser;

        let docSend={};
        if (values.expediente) {
            docSend["expediente"] = values.expediente;
        }

        //-----------------INSTITUCION DEPENDENCIA
        let ObjInstitucionDepe = {};
        if (values.idnombre) {
            ObjInstitucionDepe = {...ObjInstitucionDepe, nombre: values.idnombre}
        }
        if (values.idclave) {
            ObjInstitucionDepe = {...ObjInstitucionDepe, clave: values.idclave}
        }
        if (values.idsiglas) {
            ObjInstitucionDepe = {...ObjInstitucionDepe, siglas: values.idsiglas}
        }
        docSend["institucionDependencia"] = ObjInstitucionDepe;

        //----------------SERVIDOR PUBLICO SANCIONADO

        let ObjServidorSancionado = {};
        if (values.SPrfc) {
            ObjServidorSancionado = {...ObjServidorSancionado, rfc: values.SPrfc}
        }
        if (values.SPcurp) {
            ObjServidorSancionado = {...ObjServidorSancionado, curp: values.SPcurp}
        }
        if (values.SPSnombres) {
            ObjServidorSancionado = {...ObjServidorSancionado, nombres: values.SPSnombres}
        }
        if (values.SPSprimerApellido) {
            ObjServidorSancionado = {...ObjServidorSancionado, primerApellido: values.SPSprimerApellido}
        }
        if (values.SPSsegundoApellido) {
            console.log(values.SPSsegundoApellido);
            ObjServidorSancionado = {...ObjServidorSancionado, segundoApellido: values.SPSsegundoApellido}
        }
        if (values.SPSgenero) {
            let genero = JSON.parse(values.SPSgenero);
            ObjServidorSancionado = {...ObjServidorSancionado, genero: {clave: genero.clave, valor: genero.valor}}
        }
        if (values.SPSpuesto) {
            ObjServidorSancionado = {...ObjServidorSancionado, puesto: values.SPSpuesto}
        }
        if (values.SPSnivel) {
            ObjServidorSancionado = {...ObjServidorSancionado, nivel: values.SPSnivel}
        }

        docSend["servidorPublicoSancionado"] = ObjServidorSancionado;

        //-----------------

        if (values.autoridadSancionadora) {
            docSend["autoridadSancionadora"] = values.autoridadSancionadora;
        }

        //----------------- TIPO FALTA

        let ofalta={};
        if (values.tipoFalta) {
            let falta = JSON.parse(values.tipoFalta);
            ofalta = {clave: falta.clave, valor: falta.valor};
            if (values.tpfdescripcion) {
                ofalta["descripcion"] = values.tpfdescripcion;
            }
        }
        docSend["tipoFalta"] = ofalta;

        console.log("tipo falta"+ JSON.stringify(docSend.tipoFalta));
        let arrayObjTipoSancion= [] ;
        if(values.tipoSancionArray){
            for(let sancion of values.tipoSancionArray){
                let tipoSancion = JSON.parse(sancion.tipoSancion);
                arrayObjTipoSancion.push({...tipoSancion, descripcion : sancion.tsdescripcion ? sancion.tsdescripcion : "" });
            }
        }
        docSend["tipoSancion"]= arrayObjTipoSancion;

        if (values.causaMotivoHechos) {
            docSend["causaMotivoHechos"] = values.causaMotivoHechos;
        }

        //-----------------RESOLUCION
        let ObjResolucion = {};
        if (values.resolucionURL) {
            ObjResolucion = {...ObjResolucion, url: values.resolucionURL}
        }
        if (values.resolucionFecha) {
            let fecha = Date.parse(values.resolucionFecha);
            fecha = formatISO(fecha, { representation: 'date' });
            ObjResolucion = {...ObjResolucion, fechaResolucion: fecha}
        }
        if(!_.isEmpty(ObjResolucion)){
            docSend["resolucion"] = ObjResolucion;
        }

        //-----------------MULTA
        let ObjMulta = {};
        if (values.multa) {
            if(values.multa.monto){
                ObjMulta = {...ObjMulta, monto: parseFloat(values.multa.monto)}
            }
            if(values.multa.moneda){
                let multaMoneda = JSON.parse(values.multa.moneda);
                ObjMulta = {...ObjMulta, moneda: {clave: multaMoneda.clave, valor: multaMoneda.valor}}
            }
            docSend["multa"] = ObjMulta;
        }

        //-------------------INHABILITACION
        let ObjInhabilita = {};
        if (values.inhabilitacionPlazo) {
            ObjInhabilita = {...ObjInhabilita, plazo: values.inhabilitacionPlazo}
        }
        if (values.inhabilitacionFechaInicial) {
            let fecha = Date.parse(values.inhabilitacionFechaInicial);
            fecha = formatISO(fecha, { representation: 'date' });
            ObjInhabilita = {...ObjInhabilita, fechaInicial: fecha}
        }
        if (values.inhabilitacionFechaFinal) {
            let fecha = Date.parse(values.inhabilitacionFechaFinal);
            fecha = formatISO(fecha, { representation: 'date' });
            ObjInhabilita = {...ObjInhabilita, fechaFinal: fecha}
        }


            docSend["inhabilitacion"] = ObjInhabilita;

        //-------------------
        if (values.observaciones) {
            docSend["observaciones"] = values.observaciones;
        }
        //-------------------DOCUMENTOS

        if (values.documents) {
            if (Array.isArray(values.documents)) {
                for (let i of values.documents) {
                    i.id= i.id.toString();
                    i.tipo = JSON.parse(i.tipo).clave;
                    let fecha = Date.parse(i.fecha);
                    i.fecha = formatISO(fecha, { representation: 'date' });
                }
            }
        }
        docSend["documentos"] = values.documents;

        console.log("DOC SEND "+ JSON.stringify(docSend));
        if(values._id){
            docSend["_id"] = values._id;
            const {status} = yield axios.post(ur + `/updateS3SSchema`,{...docSend, usuario:usuario}, {headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                } , validateStatus: () => true});
            if(status === 200){
                //all OK
                yield put(alertActions.success("Registro actualizado con éxito"));
            }else{
                yield put(alertActions.error("Error al crear"));
                //error in response
            }
        }else{
            const {status} = yield axios.post(ur + `/insertS3SSchema`,{...docSend, usuario:usuario}, {headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                } , validateStatus: () => true});
            if(status === 200){
                //all OK
                yield put(alertActions.success("Registro creado con éxito"));
            }else{
                yield put(alertActions.error("Error al crear"));
                //error in response
            }
        }


    }
}

export function* creationS2Schema(){
    while (true) {
        const {values} = yield take (S2Constants.REQUEST_CREATION_S2);
        let docSend = {};
        const token = localStorage.token;

        docSend["ejercicioFiscal"]= values.ejercicioFiscal;
        if(values.ramo){
            let ramoObj = JSON.parse(values.ramo);
            docSend["ramo"]= {clave:  parseInt(ramoObj.clave) , valor: ramoObj.valor };
        }
        if(values.rfc){ docSend["rfc"]= values.rfc}
        if(values.curp){ docSend["curp"]= values.curp}
        docSend["nombres"]= values.nombres;
        docSend["primerApellido"] =values.primerApellido;
        docSend["segundoApellido"]= values.segundoApellido;
        if(values.genero){
            docSend["genero"]= JSON.parse(values.genero);
        }
        docSend["institucionDependencia"] = {nombre : values.idnombre , clave: values.idclave, siglas: values.idsiglas};
        docSend["puesto"]= {nombre: values.puestoNombre, nivel: values.puestoNivel};
        if(values.tipoArea){
            docSend["tipoArea"]=JSON.parse("["+values.tipoArea+"]");
        }
        if(values.tipoProcedimiento){
            let ObjTipoProcedimiento= JSON.parse("["+values.tipoProcedimiento+"]");
            docSend["tipoProcedimiento"]= getArrayFormatTipoProcedimiento(ObjTipoProcedimiento);
        }
        if(values.nivelResponsabilidad){
            docSend["nivelResponsabilidad"] = JSON.parse("[" + values.nivelResponsabilidad + "]");
        }

        docSend["superiorInmediato"]= {rfc : values.siRfc , curp: values.siCurp , nombres: values.sinombres, primerApellido: values.siPrimerApellido, segundoApellido : values.siSegundoApellido,
            puesto: {nombre:values.siPuestoNombre, nivel: values.siPuestoNivel}};

        console.log(docSend);
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser));
        let usuario=payload.idUser;
        docSend["usuario"]=usuario;

        const {status} = yield axios.post(ur + `/insertS2Schema`,docSend, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            } , validateStatus: () => true});
        if(status === 200){
            //all OK
            yield put(alertActions.success("Registro creado con éxito "));
        }else{
            yield put(alertActions.error("Error al crear"));
            //error in response
        }
    }
}


export function* updateS2Schema(){
    while (true) {
        const {values} = yield take (S2Constants.UPDATE_REG_S2);
        const token = localStorage.token;
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser));
        let usuario=payload.idUser;
        const {status} = yield axios.post(ur + `/updateS2Schema`,{...values,usuario:usuario}, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            } , validateStatus: () => true});
        if(status === 200){
            //all OK
            yield put(alertActions.success("Registro actualizado con éxito "));
        }else{
            yield put(alertActions.error("Error al crear"));
            //error in response
        }

    }
}



function getArrayFormatTipoProcedimiento(array){
    _.each(array, function(p){
        p.clave = parseInt(p.clave);
    });
    return array;
}

export function* getListSchemaS2(){
    while(true){
        const {filters} = yield take (S2Constants.REQUEST_LIST_S2);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/listSchemaS2`,filters,{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        yield put (S2Actions.setListS2(respuestaArray.data.results));
        yield put (S2Actions.setpaginationS2(respuestaArray.data.pagination));

    }
}


export function* getListSchemaS3S(){
    while(true){
        const {filters} = yield take (S3SConstants.REQUEST_LIST_S3S);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/listSchemaS3S`,filters,{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        yield put (S3SActions.setListS3S(respuestaArray.data.results));
        console.log(respuestaArray.data.pagination);
        yield put (S3SActions.setpaginationS3S(respuestaArray.data.pagination));

    }
}

export function* getListSchemaS3P(){
    while(true){
        const {filters} = yield take (S3PConstants.REQUEST_LIST_S3P);
        const token = localStorage.token;

        const respuestaArray = yield axios.post(ur + `/listSchemaS3P`,filters,{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

       /* const respuestaArrayTipoPersona = yield axios.post(ur + `/getCatalogs`, {docType: "tipoPersona"}, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        let arrayFormatS3P = [] ;
        for(let elementS3P of respuestaArray.data.results){
            arrayFormatS3P.push(yield formatS3PField(elementS3P,respuestaArrayTipoPersona));
        }
                yield put (S3PActions.setListS3P(arrayFormatS3P));
                */

        yield put (S3PActions.setListS3P(respuestaArray.data.results));
        yield put (S3PActions.setpaginationS3P(respuestaArray.data.pagination));

    }
}

async function formatS3PField(registro, respuestaArrayTipoPersona) {
    let token = localStorage.token;
    for (let [key, row] of Object.entries(registro)) {
        if (key === "particularSancionado") {
            if (row.tipoPersona) {
                let tipoPersona = row.tipoPersona;

                for (let persona of respuestaArrayTipoPersona.data.results) {
                    if (persona.clave === tipoPersona) {
                        row.tipoPersona = JSON.stringify({clave: persona.clave, valor: persona.valor})
                    }
                }
            }
            if (row.domicilioMexico) {
                if (row.domicilioMexico.pais) {
                    row.domicilioMexico.pais = JSON.stringify(row.domicilioMexico.pais);
                }
                if (row.domicilioMexico.entidadFederativa) {
                    row.domicilioMexico.entidadFederativa = JSON.stringify(row.domicilioMexico.entidadFederativa);
                }
                if (row.domicilioMexico.municipio) {
                    row.domicilioMexico.municipio = JSON.stringify(row.domicilioMexico.municipio);
                }
                if (row.domicilioMexico.localidad) {
                    row.domicilioMexico.localidad = JSON.stringify(row.domicilioMexico.localidad);
                }
                if (row.domicilioMexico.vialidad) {
                    row.domicilioMexico.descripcionVialidad = row.domicilioMexico.vialidad.valor;
                    row.domicilioMexico.vialidad = JSON.stringify({
                        clave: row.domicilioMexico.vialidad.clave,
                        valor: row.domicilioMexico.vialidad.clave
                    });
                }
            }
        } else if (key === "multa") {
            if (row.moneda) {
                row.moneda = JSON.stringify(row.moneda);
            }
        } else if (key === "documentos") {
            if (Array.isArray(row)) {
                for (let i of row) {
                    i.tipo = JSON.stringify({clave: i.tipo, valor: i.tipo});
                }
            }
        } else if (key === "tipoSancion") {
            let arraySanciones = [];
            for (let objTipoSancion of row) {
                let obj = {};
                if (objTipoSancion.clave && objTipoSancion.valor) {
                    obj["tipoSancion"] = JSON.stringify({clave: objTipoSancion.clave, valor: objTipoSancion.valor});
                }
                if (objTipoSancion.descripcion) {
                    obj["descripcion"] = objTipoSancion.descripcion;
                }

                arraySanciones.push(obj);
            }
            registro.tipoSancion = arraySanciones;
        }
    }
    return registro;
}

export function* fillUpdateRegS3P() {
    while (true) {
        const {id} = yield take(S3PConstants.FILL_REG_S3P_EDIT);
        const token = localStorage.token;
        let query = {"query": {"_id": id}};

        const respuestaArray = yield axios.post(ur + `/listSchemaS3P`, query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        let registro = respuestaArray.data.results[0];

        for (let [key, row] of Object.entries(registro)) {

            if (key === "particularSancionado") {
                if (row.tipoPersona) {

                    let tipoPersona = row.tipoPersona;

                    const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: "tipoPersona"},{ headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'Authorization': `Bearer ${token}`
                        }});

                    for(let persona of respuestaArray.data.results){
                        if(persona.clave === tipoPersona){
                            row.tipoPersona =  JSON.stringify({clave:persona.clave ,valor : persona.valor})
                        }
                    }
                }
                if(row.domicilioMexico){
                    registro.domicilio= 'mex';
                    if(row.domicilioMexico.pais){
                        row.domicilioMexico.pais= JSON.stringify(row.domicilioMexico.pais);
                    }
                    if(row.domicilioMexico.entidadFederativa){
                        row.domicilioMexico.entidadFederativa = JSON.stringify(row.domicilioMexico.entidadFederativa);
                    }
                    if(row.domicilioMexico.municipio){
                        row.domicilioMexico.municipio= JSON.stringify(row.domicilioMexico.municipio);
                    }
                    if(row.domicilioMexico.localidad){
                        row.domicilioMexico.localidad= JSON.stringify(row.domicilioMexico.localidad);
                    }
                    if(row.domicilioMexico.vialidad){
                        row.domicilioMexico.descripcionVialidad= row.domicilioMexico.vialidad.valor;
                        row.domicilioMexico.vialidad= JSON.stringify({clave: row.domicilioMexico.vialidad.clave, valor: row.domicilioMexico.vialidad.clave});
                    }
                }
                if(row.domicilioExranjero){
                    registro.domicilio= 'mex';
                }
            } else if (key === "multa") {
                if(row.moneda){
                    row.moneda = JSON.stringify(row.moneda);
                }
            } else if (key === "documentos") {
                if (Array.isArray(row)) {
                    for (let i of row) {
                        i.tipo = JSON.stringify({clave: i.tipo, valor: i.tipo});
                        console.log("TIPOOOO----"+ i.tipo);
                    }
                }
            }else if(key === "tipoSancion"){
                let arraySanciones= [];
                for(let objTipoSancion of row){
                    console.log("---------------------------------------"+JSON.stringify(row));
                    let obj={};
                    if(objTipoSancion.clave && objTipoSancion.valor){
                        obj["tipoSancion"] = JSON.stringify({clave:objTipoSancion.clave ,valor : objTipoSancion.valor});
                    }
                    if(objTipoSancion.descripcion){obj["descripcion"] = objTipoSancion.descripcion;}

                    arraySanciones.push(obj);
                }
                registro.tipoSancion = arraySanciones;
            }
        }
        yield put (S3PActions.setListS3P([registro]));
    }
}

export function* fillUpdateRegS3S(){
    while(true){
        const {id} = yield take (S3SConstants.FILL_REG_S3S_EDIT);
        const token = localStorage.token;
        let query = {"query" : {"_id" : id}};

        const respuestaArray = yield axios.post(ur + `/listSchemaS3S`,query,{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        let registro = respuestaArray.data.results[0];
        let newRow={};

        for (let [key, row] of Object.entries(registro)) {
            if (key === "expediente") {
                newRow[key] = row;
            }else if(key === "institucionDependencia"){
                if(row.nombre){ newRow["idnombre"] = row.nombre;}
                if(row.clave){ newRow["idclave"] = row.clave;}
                if(row.siglas){ newRow["idsiglas"] = row.siglas;}
            }else if(key === "servidorPublicoSancionado") {
                if(row.rfc){ newRow["SPrfc"] = row.rfc;}
                if(row.curp){ newRow["SPcurp"] = row.curp;}
                if(row.nombres){ newRow["SPSnombres"] = row.nombres;}
                if(row.primerApellido){ newRow["SPSprimerApellido"] = row.primerApellido;}
                if(row.segundoApellido){ newRow["SPSsegundoApellido"] = row.segundoApellido;}
                if(row.genero){ newRow["SPSgenero"] = JSON.stringify({clave:row.genero.clave.toString() ,valor : row.genero.valor});}
                if(row.puesto){ newRow["SPSpuesto"] = row.puesto;}
                if(row.nivel){ newRow["SPSnivel"] = row.nivel;}
            }else if(key === "autoridadSancionadora"){
                newRow[key] = row;
            }else if(key === "tipoFalta"){
                if(row.descripcion){ newRow["tpfdescripcion"] = row.descripcion;}
                if(row.clave && row.valor){newRow["tipoFalta"] = JSON.stringify({clave:row.clave ,valor : row.valor});}
            }else if(key === "tipoSancion"){
                let arraySanciones= [];
                for(let objTipoSancion of row){
                    let obj={};
                    if(objTipoSancion.clave && objTipoSancion.valor){
                        obj["tipoSancion"] = JSON.stringify({clave:objTipoSancion.clave ,valor : objTipoSancion.valor});
                    }
                    if(objTipoSancion.descripcion){obj["tsdescripcion"] = objTipoSancion.descripcion;}
                    arraySanciones.push(obj);
                }
                newRow["tipoSancionArray"]= arraySanciones;
            }else if(key === "causaMotivoHechos"){
                newRow[key] = row;
            }else if(key === "resolucion"){
                if(row.url){ newRow["resolucionURL"] = row.url;}
                if(row.fechaResolucion){ newRow["resolucionFecha"] = row.fechaResolucion;}
            }else if(key === "multa"){
                let objMulta= {};
                if(row.moneda){ objMulta["moneda"] = JSON.stringify({clave:row.moneda.clave.toString().toUpperCase() ,valor : row.moneda.valor.toUpperCase()});}
                if(row.monto){ objMulta["monto"] = row.monto;}
                newRow["multa"]= objMulta;
            }else if(key === "inhabilitacion"){
                if(row.plazo){ newRow["inhabilitacionPlazo"] = row.plazo;}
                if(row.fechaInicial){ newRow["inhabilitacionFechaInicial"] = row.fechaInicial;}
                if(row.fechaFinal){ newRow["inhabilitacionFechaFinal"] = row.fechaFinal;}
            }else if(key === "observaciones"){
                newRow[key] = row;
            }else if(key === "documentos"){
                let arrayDocumentos= [];
                for(let objDocumentos of row){
                    let obj={};
                    if(objDocumentos.id){ obj["id"] = objDocumentos.id;}
                    if(objDocumentos.titulo){ obj["titulo"] = objDocumentos.titulo;}
                    if(objDocumentos.descripcion){ obj["descripcion"] = objDocumentos.descripcion;}
                    if(objDocumentos.url){ obj["url"] = objDocumentos.url;}
                    if(objDocumentos.fecha){ obj["fecha"] = objDocumentos.fecha;}
                    if(objDocumentos.tipo){ obj["tipo"] = JSON.stringify({clave:objDocumentos.tipo ,valor : objDocumentos.tipo});}
                    console.log("ARRAYY DOCUMENTOS "+ JSON.stringify(obj));
                    arrayDocumentos.push(obj);
                }

                newRow["documents"]= arrayDocumentos;
            }else {
                newRow[key] = row ;
            }
        }
        yield put (S3SActions.setListS3S([newRow]));
    }
}

export function* fillUpdateRegS2(){
    while(true){
        const {id} = yield take (S2Constants.FILL_REG_S2_EDIT);
        const token = localStorage.token;
        let query = {"query" : {"_id" : id}};

        const respuestaArray = yield axios.post(ur + `/listSchemaS2`,query,{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});

        let registro = respuestaArray.data.results[0];

        let newRow={};
        for (let [key, row] of Object.entries(registro)) {

            if(key ===  "genero" || key === "ramo"){
                newRow[key]=  JSON.stringify({clave:row.clave.toString() ,valor : row.valor});
            }else if(key === "tipoArea" || key === "nivelResponsabilidad" || key === "tipoProcedimiento") {
                let newArray=[];
                for(let item of row){
                    newArray.push(JSON.stringify({clave:item.clave.toString() ,valor : item.valor}));
                }
                newRow[key]= newArray;
            }else if (key === "superiorInmediato") {
                if(row.nombres){ newRow["sinombres"] = row.nombres ;}
                if(row.rfc){ newRow["siRfc"] = row.rfc;}
                if(row.curp){ newRow["siCurp"] = row.curp;}
                if(row.primerApellido){ newRow["siPrimerApellido"] = row.primerApellido;}
                if(row.segundoApellido){ newRow["siSegundoApellido"] = row.segundoApellido;}
                if(row.puesto){
                    if(row.puesto.nombre){ newRow["siPuestoNombre"] = row.puesto.nombre;}
                    if(row.puesto.nivel){ newRow["siPuestoNivel"] = row.puesto.nivel;}
                }
            } else if (key === "puesto" ) {
                if(row.nombre){ newRow["puestoNombre"] = row.nombre ; }
                if(row.nivel){newRow["puestoNivel"] = row.nivel ;}
            }else if(key === "institucionDependencia" ){
                if(row.nombre ){newRow["idnombre"] = row.nombre ;}
                if(row.siglas ){newRow["idsiglas"] = row.siglas ;}
                if(row.clave ){ newRow["idclave"] = row.clave ;}
            }else {
                newRow[key] = row ;
            }
        }
        yield put (S2Actions.setListS2([newRow]));
    }
}


export function* deleteSchemaS2(){
    while (true) {
        const {id} = yield take (S2Constants.DELETE_REQUEST);
        const token = localStorage.token;
        if(token){
            let request = {"_id": id};
            let payload = jwt.decode(token);
            yield put (userActions.setUserInSession(payload.idUser));
            request["usuario"]=payload.idUser;
            try{
                const {status, data} = yield axios.delete(ur + `/deleteRecordS2`, { data : {request} , headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': `Bearer ${token}`
                    } , validateStatus: () => true});
                if(status === 200){
                    console.log("Response",  );
                    yield put(S2Actions.deleteRecordDo(id));
                    yield put(alertActions.success(data.messageFront));
                }else{
                    //error in response
                    yield put(alertActions.error("El Registro NO fue eliminado"));
                }
            }catch (e) {
                yield put(alertActions.error("El Registro NO fue eliminado"));
            }
        }


    }
}

export function* deleteSchemaS3S(){
    while (true) {
        const {id} = yield take (S3SConstants.DELETE_REQUEST);
        const token = localStorage.token;
        if(token){
            let request = {"_id": id};
            let payload = jwt.decode(token);
            yield put (userActions.setUserInSession(payload.idUser));
            request["usuario"]=payload.idUser;
            try{
                const {status, data} = yield axios.delete(ur + `/deleteRecordS3S`, { data : {request} , headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': `Bearer ${token}`
                    } , validateStatus: () => true});
                if(status === 200){
                    console.log("Response",  );
                    yield put(S2Actions.deleteRecordDo(id));
                    yield put(alertActions.success(data.messageFront));
                }else{
                    //error in response
                    yield put(alertActions.error("El Registro NO fue eliminado"));
                }
            }catch (e) {
                yield put(alertActions.error("El Registro NO fue eliminado"));
            }
        }


    }
}

export function* deleteSchemaS3P(){
    while (true) {
        const {id} = yield take (S3PConstants.DELETE_REQUEST);
        const token = localStorage.token;
        if(token){
            let request = {"_id": id};
            let payload = jwt.decode(token);
            yield put (userActions.setUserInSession(payload.idUser));
            request["usuario"]=payload.idUser;
            try{
                const {status, data} = yield axios.delete(ur + `/deleteRecordS3P`, { data : {request} , headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': `Bearer ${token}`
                    } , validateStatus: () => true});
                if(status === 200){
                    console.log("Response",  );
                    yield put(S2Actions.deleteRecordDo(id));
                    yield put(alertActions.success(data.messageFront));
                }else{
                    //error in response
                    yield put(alertActions.error("El Registro NO fue eliminado"));
                }
            }catch (e) {
                yield put(alertActions.error("El Registro NO fue eliminado"));
            }
        }


    }
}

export function* consultBitacora(){
    while(true){
        const {usuarioJson} = yield take (mutations.REQUEST_CONSULT_BITACORA);
        let fechaActual =moment();
        const token = localStorage.token;
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser));
        //usuarioJson["usuario"]=payload.idUser;
        const respuestaArray  =yield axios.post(ur + `/getBitacora`, usuarioJson, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            } ,validateStatus: () => true});
        yield put(bitacoraActions.setBitacoraAll(respuestaArray.data.results));
        yield put(alertActions.success("Consulta realizada con éxito"));
        yield put(alertActions.clear());

    }
}

export function* ResetPassword(){
    while (true){
        const {credentialUser} = yield take (mutations.REQUEST_RESET_PASSWORD);
        let correo = credentialUser.correo;
        let status;

        const requestBody = {
            correo: correo
        }

        try{
            status = yield axios.post(ur + `/resetpassword`, qs.stringify(requestBody), { headers: {validateStatus: () => true ,'Content-Type': 'application/x-www-form-urlencoded' } });
            //localStorage.setItem("token", token.data.access_token);
            if(credentialUser.sistema===true){
                history.push('/usuarios');
            }else{
                history.push('/restaurarpassword');
            }

            if(status.data.Status === 200){
                yield put(alertActions.success(status.data.message));
            }else{
                //error in response
                yield put(alertActions.error(status.data.message));
            }
        }catch (err) {
            yield put(alertActions.error("El Registro modificado"));
        }
    }
}

export function* changePassword(){
    while (true) {
        const {usuarioJson} = yield take (mutations.REQUEST_CHANGEPASSWORD_USER);
        const token = localStorage.token;
        let payload = jwt.decode(token);
        let status;
        yield put (userActions.setUserInSession(payload.idUser))
        console.log(payload.idUser);
        usuarioJson["user"]=payload.idUser;


        try{
            status = yield axios.post(ur + `/changepassword`,usuarioJson, {headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                } , validateStatus: () => true});

            if(status.data.Status === 200){
                yield put(alertActions.success(status.data.message));

            }else{
                //error in response
                yield put(alertActions.error(status.data.message));
            }
        }catch (err) {
            yield put(alertActions.error("El Registro no fue modificado"));
        }
    }
}

export function* getRecordsS2(){
    while(true){
        yield take (userActions.requestRecordsS2);
        const {token} = yield take (userConstants.USER_REQUEST_SESSION_SET);

        const respuestaArray = yield axios.post(ur + `/getrecordsbysystem`,{sistema: "S2"},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        yield put (userActions.setRecordsS2(respuestaArray.data.results));

    }
}

export function* getRecordsS3S(){
    while(true){
        yield take (userActions.requestRecordsS3S);
        const {token} = yield take (userConstants.USER_REQUEST_SESSION_SET);

        const respuestaArray = yield axios.post(ur + `/getrecordsbysystem`,{sistema: "S3S"},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            },validateStatus: () => true});
        yield put (userActions.setRecordsS3S(respuestaArray.data.results));

    }
}

export function* getRecordsS3P(){
    while(true){
        yield take (userActions.requestRecordsS3P);
        const {token} = yield take (userConstants.USER_REQUEST_SESSION_SET);

        const respuestaArray = yield axios.post(ur + `/getrecordsbysystem`,{sistema: "S3P"},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            },validateStatus: () => true});
        yield put (userActions.setRecordsS3P(respuestaArray.data.results));
    }
}
