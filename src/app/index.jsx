import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import {Main} from "./components/Main";
import { createMuiTheme,MuiThemeProvider } from '@material-ui/core/styles';
import { esES } from '@material-ui/core/locale';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#1976d2'
        }
    }
}, esES);


ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Main/>
    </MuiThemeProvider>,
    document.getElementById("app")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
