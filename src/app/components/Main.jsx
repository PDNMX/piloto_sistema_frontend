import React from 'react';
import {storeValidate} from "../store";
import {Provider} from 'react-redux';
import {ConnectedDashboard} from './Dashboard';
import {Router, Route} from "react-router-dom";
import {history} from "../store/history";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {LoadFileV} from "./UploadFile/LoadFileV";
import {Connected} from "./users/createUser";
import { Redirect } from 'react-router';
import { ListUser} from "./users/listUser";
import {userActions} from "../_actions/user.action";
import {catalogActions} from "../_actions/catalog.action";
import {alertActions} from "../_actions/alert.actions";
import {ConnectedMenuV} from "./Menu/MenuV";
import {ListProvider} from "./providers/ListProvider";
import {providerActions} from "../_actions/provider.action";
import {ConnectedCreateProvider} from "./providers/CreateProvider";
import {LoginV} from "./Login/Login";
import {S2Actions} from "../_actions/s2.action";
import {ConnectedConsultarBitacora} from "./Bitacora/ConsultarBitacora";
import {bitacoraActions} from "../_actions/bitacora.action";
import {ListBitacora} from "./Bitacora/ListBitacora";

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
        fontFamily: ["Noto Sans SC", '"Helvetica"', '"Arial"', '"sans-serif"'].join(","),
    },
    palette: {
        primary: {
            main: "#00695c",
            light: "#439889",
            dark: "#003d33",
            contrastText: "#ffffff"
        },
        secondary: {
            main: "#0097a7",
            light: "#56c8d8",
            dark: "#006978",
            contrastText: "#000000"
        },
        white: "#ffffff",
        grey: {
            dark: "#666666",
            light: "#f2f2f2"
        },
        contrastThreshold: 3,
    },
});




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
                       path= "/cargamasiva"
                       render={() => {
                           if ( localStorage.token){
                               storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                               storeValidate.dispatch((alertActions.clear()));
                               return <ConnectedMenuV propiedades = {{renderView : "cargamasiva"}} />
                           }else{
                               return <Redirect to="/login"/> ;
                           }
                       }}
                />
                <Route exact
                       path= "/captura/S2"
                       render={() => {
                           if ( localStorage.token){
                               storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
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
                       }}
                />
                <Route exact
                       path= "/consulta/S2"
                       render={() => {
                           if (localStorage.token) {
                               storeValidate.dispatch(S2Actions.requestListS2({}));
                               storeValidate.dispatch((alertActions.clear()));
                               return (<ConnectedMenuV propiedades={{renderView: "S2Schema"}}/>)
                           } else {
                               return <Redirect to="/login"/>;
                           }
                       }}
                />
                <Route exact
                       path= "/editar/S2/:id"
                       render={({match}) => {
                           if ( localStorage.token){
                               storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
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
                       }}
                />
                <Route exact
                       path= "/usuario/crear"
                       render={() => {
                           if ( localStorage.token){
                               storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                           storeValidate.dispatch(providerActions.requestAllProviders());
                           storeValidate.dispatch((alertActions.clear()));
                           return <ConnectedMenuV propiedades = {{renderView : "createuser"}} />
                           }else{
                               return <Redirect to="/login"/> ;
                           }
                       }}
                />
                <Route exact
                       path= "/usuario/editar/:id"
                       render={({match}) => {
                           if ( localStorage.token){
                                storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                                storeValidate.dispatch(userActions.fillUserUpdate(match.params.id));
                                storeValidate.dispatch(providerActions.requestAllProviders());
                                storeValidate.dispatch((alertActions.clear()));
                               return (<ConnectedMenuV propiedades = {{renderView : "edituser"}} match = {match} /> )
                           }else{
                               return <Redirect to="/login"/> ;
                           }
                       }}
                />
                <Route exact
                       path= "/usuarios"
                       render={() => {
                           storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                           if (localStorage.token) {
                               storeValidate.dispatch(providerActions.requestAllProviders());
                               storeValidate.dispatch(userActions.requestPerPage({page: 1, pageSize: 10}));
                               storeValidate.dispatch((alertActions.clear()));
                               return (<ConnectedMenuV propiedades={{renderView: "users"}}/>)
                           } else {
                               return <Redirect to="/login"/>;
                           }
                       }}
                />

                <Route exact
                       path= "/proveedor/crear"
                       render={() =>{
                           if ( localStorage.token){
                               storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                           return (<ConnectedMenuV propiedades = {{renderView : "createprovider"}} /> )
                           }else{
                               return <Redirect to="/login"/> ;
                           }
                       }}
                />

                <Route exact
                       path= "/proveedor/editar/:id"
                       render={({match}) => {
                           if ( localStorage.token){
                               storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                           storeValidate.dispatch(providerActions.fillProviderUpdate(match.params.id));
                           storeValidate.dispatch((alertActions.clear()));
                           return (<ConnectedMenuV propiedades = {{renderView : "editprovider"}} match = {match} /> )
                           }else{
                               return <Redirect to="/login"/> ;
                           }
                       }}
                />

                <Route exact
                       path= "/proveedores"
                       render={() => {
                           if ( localStorage.token) {
                               storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                               storeValidate.dispatch(providerActions.requestPerPage({page: 1, pageSize: 10}));
                               return (<ConnectedMenuV propiedades={{renderView: "providers"}}/>)
                           }else{
                               return <Redirect to="/login"/> ;
                           }
                       }}
                />
                <Route exact
                       path= "/bitacora"
                       render={() =>{
                           if ( localStorage.token){
                               storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                               storeValidate.dispatch(userActions.requestAllUsers());
                               storeValidate.dispatch(providerActions.requestAllProviders());
                               storeValidate.dispatch(bitacoraActions.requestAllBitacora());
                               storeValidate.dispatch((alertActions.clear()));
                               return (<ConnectedMenuV propiedades = {{renderView : "consultarbitacora"}} /> )
                           }else{
                               return <Redirect to="/login"/> ;
                           }
                       }}
                />
                <Route exact
                       path= "/reportebitacora"
                       render={() => {
                           if ( localStorage.token) {
                               storeValidate.dispatch(userActions.requesUserInSession(localStorage.token));
                               storeValidate.dispatch(bitacoraActions.requestAllBitacora());
                               storeValidate.dispatch(providerActions.requestPerPage({page: 1, pageSize: 10}));
                               return (<ConnectedMenuV propiedades={{renderView: "reportebitacora"}}/>)
                           }else{
                               return <Redirect to="/login"/> ;
                           }
                       }}
                />
            </div>
        </Provider>
        </div>
    </Router>
)
