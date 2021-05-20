import React from 'react';
import {storeValidate} from "../store";
import {Provider} from 'react-redux';
import {Router, Route} from "react-router-dom";
import {history} from "../store/history";
import { Redirect } from 'react-router';
import {userActions} from "../_actions/user.action";
import {catalogActions} from "../_actions/catalog.action";
import {alertActions} from "../_actions/alert.actions";
import {ConnectedMenuV} from "./Menu/MenuV";
import {providerActions} from "../_actions/provider.action";
import {LoginV} from "./Login/Login";
import {S2Actions} from "../_actions/s2.action";
import {clearErrorsValidation} from "../store/mutations"
import {bitacoraActions} from "../_actions/bitacora.action";
import {S3SActions} from "../_actions/s3s.action";
import {S3PActions} from "../_actions/s3p.action";
import {ResetPasswordV} from "./Login/ResetPassword";

export const Main = ()=> (
    <Router history={history}>
        <div>
            <Provider store = {storeValidate}>
                <div>
                    <Route exact
                           path= "/login"
                           render={() => (<LoginV/>)}
                    />
                    <Route exact
                           path= "/restaurarpassword"
                           render={() => (<ResetPasswordV/>)}
                    />

                    <Route exact
                           path= "/cargamasiva"
                           render={() => {

                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="2"){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(userActions.requestPermisosSistema());
                                           storeValidate.dispatch((alertActions.clear()));
                                           storeValidate.dispatch(clearErrorsValidation());
                                           return <ConnectedMenuV propiedades = {{renderView : "cargamasiva"}} />
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/captura/S2"
                           render={() => {
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="2" && localStorage.S2=="true"){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(userActions.requestPermisosSistema());
                                           storeValidate.dispatch(catalogActions.requestCatalogoByType("genero"));
                                           storeValidate.dispatch(catalogActions.requestRamoCatalogo("ramo"));
                                           storeValidate.dispatch(catalogActions.requestPuestoCatalogo("puesto"));
                                           storeValidate.dispatch(catalogActions.requestTipoAreaCatalogo("tipoArea"));
                                           storeValidate.dispatch(catalogActions.requestNivelResponsabilidadCatalogo("nivelResponsabilidad"));
                                           storeValidate.dispatch(catalogActions.requestTipoProcedimientoCatalogo("tipoProcedimiento"));
                                           storeValidate.dispatch((alertActions.clear()));
                                           return <ConnectedMenuV propiedades = {{renderView : "createReg"}} />
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/captura/S3S"
                           render={() => {
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="2" && localStorage.S3S=="true"){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(userActions.requestPermisosSistema());
                                           storeValidate.dispatch(catalogActions.requestCatalogoByType("genero"));
                                           storeValidate.dispatch(catalogActions.requestTipoFaltaCatalogo("tipoFalta"));
                                           storeValidate.dispatch(catalogActions.requestTipoSancionCatalogo("tipoSancion"));
                                           storeValidate.dispatch(catalogActions.requestMonedaCatalogo("moneda"));
                                           storeValidate.dispatch(catalogActions.requesTipoDocumentoCatalogo("tipoDocumento"));
                                           storeValidate.dispatch((alertActions.clear()));
                                           return <ConnectedMenuV propiedades = {{renderView : "createRegS3S"}} />
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/captura/S3P"
                           render={() => {
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="2" && localStorage.S3P=="true"){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(userActions.requestPermisosSistema());
                                           storeValidate.dispatch((alertActions.clear()));
                                           storeValidate.dispatch(catalogActions.requestTipoSancionCatalogo("tipoSancionS3P"));
                                           storeValidate.dispatch(catalogActions.requesTipoPersonaCatalogo("tipoPersona"));
                                           storeValidate.dispatch(catalogActions.requestMonedaCatalogo("moneda"));
                                           storeValidate.dispatch(catalogActions.requestPaisCatalogo("pais"));
                                           storeValidate.dispatch(catalogActions.requestEstadoCatalogo("estado"));
                                           storeValidate.dispatch(catalogActions.requestVialidadCatalogo("vialidad"));
                                           storeValidate.dispatch(catalogActions.requesTipoDocumentoCatalogo("tipoDocumento"));
                                           return <ConnectedMenuV propiedades = {{renderView : "createRegS3P"}} />
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/consulta/S2"
                           render={() => {
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="2" && localStorage.S2=="true"){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(S2Actions.setclearS2());
                                           storeValidate.dispatch(userActions.requestPermisosSistema());
                                           storeValidate.dispatch(S2Actions.requestListS2({}));
                                           storeValidate.dispatch((alertActions.clear()));
                                           return (<ConnectedMenuV propiedades={{renderView: "S2Schema"}}/>)
                                       }else{
                                           return <Redirect to="/login"/>;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/editar/S2/:id"
                           render={({match}) => {
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="2" && localStorage.S2=="true"){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(userActions.requestPermisosSistema());
                                           storeValidate.dispatch(catalogActions.requestCatalogoByType("genero"));
                                           storeValidate.dispatch(catalogActions.requestRamoCatalogo("ramo"));
                                           storeValidate.dispatch(catalogActions.requestPuestoCatalogo("puesto"));
                                           storeValidate.dispatch(catalogActions.requestTipoAreaCatalogo("tipoArea"));
                                           storeValidate.dispatch(catalogActions.requestNivelResponsabilidadCatalogo("nivelResponsabilidad"));
                                           storeValidate.dispatch(catalogActions.requestTipoProcedimientoCatalogo("tipoProcedimiento"));
                                           storeValidate.dispatch(S2Actions.fillRegEdit(match.params.id));
                                           return <ConnectedMenuV propiedades = {{renderView : "editRegS2"}} match = {match} />
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/editar/S3P/:id"
                           render={({match}) => {
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="2"){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch((alertActions.clear()));
                                           storeValidate.dispatch(catalogActions.requestTipoSancionCatalogo("tipoSancionS3P"));
                                           storeValidate.dispatch(catalogActions.requesTipoPersonaCatalogo("tipoPersona"));
                                           storeValidate.dispatch(catalogActions.requestMonedaCatalogo("moneda"));
                                           storeValidate.dispatch(catalogActions.requestPaisCatalogo("pais"));
                                           storeValidate.dispatch(catalogActions.requestEstadoCatalogo("estado"));
                                           storeValidate.dispatch(catalogActions.requestVialidadCatalogo("vialidad"));
                                           storeValidate.dispatch(catalogActions.requesTipoDocumentoCatalogo("tipoDocumento"));
                                           storeValidate.dispatch(S3PActions.fillRegEdit(match.params.id));
                                           match.params.flagOnlyRead = false;
                                           return <ConnectedMenuV propiedades = {{renderView : "editRegS3P"}} match = {match} />
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/editar/S3S/:id"
                           render={({match}) => {
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="2" && localStorage.S3S=="true"){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(userActions.requestPermisosSistema());
                                           storeValidate.dispatch(catalogActions.requestCatalogoByType("genero"));
                                           storeValidate.dispatch(catalogActions.requestTipoFaltaCatalogo("tipoFalta"));
                                           storeValidate.dispatch(catalogActions.requestTipoSancionCatalogo("tipoSancion"));
                                           storeValidate.dispatch(catalogActions.requestMonedaCatalogo("moneda"));
                                           storeValidate.dispatch(catalogActions.requesTipoDocumentoCatalogo("tipoDocumento"));
                                           storeValidate.dispatch(S3SActions.fillRegEdit(match.params.id));
                                           return <ConnectedMenuV propiedades = {{renderView : "editRegS3S"}} match = {match} />
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/consulta/S3S"
                           render={() => {

                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if (localStorage.token && localStorage.rol =="2" && localStorage.S3S=="true") {
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(S3SActions.setclearS3S());
                                           storeValidate.dispatch(userActions.requestPermisosSistema());
                                           storeValidate.dispatch(catalogActions.requestTipoSancionCatalogo("tipoSancion"));
                                           S3SActions.setListS3S([]);
                                           storeValidate.dispatch(S3SActions.requestListS3S({}));

                                           storeValidate.dispatch((alertActions.clear()));
                                           return (<ConnectedMenuV propiedades={{renderView: "S3SSchema"}}/>)
                                       } else {
                                           return <Redirect to="/login"/>;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/consulta/S3P"
                           render={() => {

                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if (localStorage.token && localStorage.rol =="2" && localStorage.S3P=="true") {
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(userActions.requestPermisosSistema());
                                           storeValidate.dispatch(S3PActions.setclearS3P());
                                           storeValidate.dispatch(catalogActions.requestTipoSancionCatalogo("tipoSancionS3P"));
                                           storeValidate.dispatch(catalogActions.requesTipoPersonaCatalogo("tipoPersona"));
                                           storeValidate.dispatch(S3PActions.requestListS3P({}));
                                           storeValidate.dispatch((alertActions.clear()));
                                           return (<ConnectedMenuV propiedades={{renderView: "S3PSchema"}}/>)
                                       }else{
                                           return <Redirect to="/login"/>;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/usuario/crear"
                           render={() => {
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="1"){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(providerActions.requestAllProvidersEnabled());
                                           storeValidate.dispatch((alertActions.clear()));
                                           return <ConnectedMenuV propiedades = {{renderView : "createuser"}} />
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/usuario/editar/:id"
                           render={({match}) => {

                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="1"){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(userActions.fillUserUpdate(match.params.id));
                                           storeValidate.dispatch(providerActions.requestAllProvidersEnabled());
                                           storeValidate.dispatch((alertActions.clear()));
                                           return (<ConnectedMenuV propiedades = {{renderView : "edituser"}} match = {match} /> )
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/usuarios"
                           render={() => {
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                       if (localStorage.token && localStorage.rol =="1") {
                                           storeValidate.dispatch(providerActions.requestAllProviders());
                                           storeValidate.dispatch(userActions.requestPerPage({page: 1, pageSize: 10}));
                                           return (<ConnectedMenuV propiedades={{renderView: "users"}}/>)
                                       } else {
                                           return <Redirect to="/login"/>;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />

                    <Route exact
                           path= "/proveedor/crear"
                           render={() =>{
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="1"){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch((alertActions.clear()));
                                           return (<ConnectedMenuV propiedades = {{renderView : "createprovider"}} /> )
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />

                    <Route exact
                           path= "/proveedor/editar/:id"
                           render={({match}) => {
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="1"){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(providerActions.fillProviderUpdate(match.params.id));
                                           storeValidate.dispatch((alertActions.clear()));
                                           return (<ConnectedMenuV propiedades = {{renderView : "editprovider"}} match = {match} /> )
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />

                    <Route exact
                           path= "/proveedores"
                           render={() => {
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="1") {
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(providerActions.requestPerPage({page: 1, pageSize: 10}));
                                           storeValidate.dispatch((alertActions.clear()));
                                           return (<ConnectedMenuV propiedades={{renderView: "providers"}}/>)
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/bitacora"
                           render={() =>{
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="1"){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(userActions.requestAllUsers());
                                           storeValidate.dispatch(providerActions.requestAllProviders());
                                           storeValidate.dispatch(bitacoraActions.requestAllBitacora());
                                           storeValidate.dispatch((alertActions.clear()));
                                           return (<ConnectedMenuV propiedades = {{renderView : "consultarbitacora"}} /> )
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/reportebitacora"
                           render={() => {
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token && localStorage.rol =="1") {
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(bitacoraActions.setBitacoraClear());
                                           storeValidate.dispatch(bitacoraActions.requestAllBitacora());
                                           storeValidate.dispatch(providerActions.requestPerPage({page: 1, pageSize: 10}));
                                           return (<ConnectedMenuV propiedades={{renderView: "reportebitacora"}}/>)
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                    <Route exact
                           path= "/usuario/cambiarcontrasena"
                           render={() => {
                               if(localStorage.token){
                                   let base64Url = localStorage.token.split('.')[1];
                                   let payload = JSON.parse(window.atob(base64Url));
                                   if(payload.exp < (new Date().getTime() + 1) / 1000){
                                       storeValidate.dispatch(alertActions.error("La sesión ha expirado, favor de iniciar sesión de nuevo"));
                                       localStorage.clear();
                                       return <Redirect to="/login"/>;
                                   }else{
                                       if ( localStorage.token){
                                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                           storeValidate.dispatch(providerActions.requestAllProviders());
                                           storeValidate.dispatch((alertActions.clear()));
                                           return <ConnectedMenuV propiedades = {{renderView : "cambiarcontrasena"}} />
                                       }else{
                                           return <Redirect to="/login"/> ;
                                       }
                                   }
                               }else{
                                   storeValidate.dispatch(alertActions.error("No se ha iniciado sesión "));
                                   return <Redirect to="/login"/>;
                               }
                           }}
                    />
                </div>
            </Provider>
        </div>
    </Router>
)
