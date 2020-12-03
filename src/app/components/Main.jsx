import React from 'react';
import {storeValidate} from "../store";
import {Provider} from 'react-redux';
import {ConnectedDashboard} from './Dashboard';
import {Router, Route} from "react-router-dom";
import {history} from "../store/history";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {LoadFileV} from "./UploadFile/LoadFileV";
import {CreateUser} from "./users/createUser";
import { Redirect } from 'react-router';
import { ListUser} from "./users/listUser";
import {userActions} from "../_actions/user.action";

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



const RouteGuard = Component =>({match})=>{
    if(!store.getState().session.authenticated ){
        return <Redirect to="/"/> ;
    }else{
        return <Component match={match}/>;
    }
}

export const Main = ()=> (
    <Router history={history}>
        <div>
        <Provider store = {storeValidate}>
            <div>
                <Route exact
                       path= "/uploadFile"
                       render={() => ( <ThemeProvider theme = {theme}> <LoadFileV/></ThemeProvider>)}
                />
                <Route exact
                       path= "/createUser"
                       render={() => ( <CreateUser/>)}
                />
                <Route exact
                       path= "/user/edit/:id"
                       render={({match}) => ( <CreateUser match ={match} />)}
                />
                <Route exact
                       path= "/users"
                       render={() => {
                           storeValidate.dispatch(userActions.requestPerPage({page : 1, pageSize: 10 }));
                         return(<ListUser/>)
                       }}
                />

            </div>
        </Provider>
        </div>
    </Router>
)
