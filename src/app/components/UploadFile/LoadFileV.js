import React from 'react';
import Header from "../Header/Header"
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from "@material-ui/core/Grid";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import {requestErrorsValidation} from '../../store/mutations'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {MenuItem, Select, TextField} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const LoadFileV = () => {
    let fileReader;
    const dispatch = useDispatch();
    const errors = useSelector(state => state.errors);
    let systemChosen;
    let contentFileJson;
    let rowsError=[];



    const useStyles = makeStyles({
        root: {
            maxWidth: 1200,
            margin: '0 auto',
            color: '#666666',
        },
        field: {
            width: '100%'
        },
        botonera: {
            textAlign: "right"
        },
        boton:{
            backgroundColor:'#ffe01b',
            color: '#666666',
            marginBottom:'15pt',
        },
        gridpadding: {
            padding: '30px',
        },
        marginright:{
            marginRight: '30px',
            backgroundColor:'#ffe01b',
            color: '#666666'
        },
        marginleft:{
            marginLeft: '30pt',
        },
        paddingLeft:{
            paddingLeft:'30pt',
        },
        fontblack:{
            color: '#666666'
        },
        paper: {
            padding: '10pt',
            maxWidth: 1200,
            margin: '30px',
            marginBottom: '10pt'

        },

    });

    const style=useStyles();

    const setValueSystem= (value) => {
        systemChosen = value;
        console.log(value);
    }

    const handleFileRead = (e) => {
        const content = fileReader.result;
        contentFileJson= content;
    };

    const handleFileChosen= (file) => {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    }



    return (
        <div>
            
            <Grid container className={style.root}>
                <Grid item xs={12}>
                    <Typography variant={"h6"} paragraph className={style.fontblack} align={"center"}>
                        <b>Carga de datos</b>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography paragraph className={style.fontblack}>
                        Importa un archivo .json para guardar la información del sistema seleccionado en la base de datos correspondiente.
                    </Typography>
                </Grid>
            </Grid>

            <Paper elevation={0} >
                <Grid  container className={style.root}>
                    <Grid item xs={12} md={8} >
                        <FormControl required className={style.field}>

                            <Select inputProps={{
                                id: 'system-native-required',
                            }} label="Sistema" className={style.marginLeft}  required={true} onChange={e => setValueSystem(e.target.value) }>
                                <MenuItem value={'S2'}>Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación</MenuItem>
                                <MenuItem value={'S3S'}>Sistema de los Servidores Públicos Sancionados</MenuItem>
                                <MenuItem value={'S3P'}>Sistema de los Particulares Sancionados</MenuItem>
                            </Select>
                            {/*<select inputProps={{
                                id: 'system-native-required',
                            }}
                                    onChange={e => setValueSystem(e.target.value) }>
                                <option aria-label="None" value="" />
                                <option value="s2">Servidores públicos que intervienen en contrataciones</option>
                                <option value="s31">Públicos Sancionados</option>
                                <option value="s32">Particulares Sancionados</option>
                            </select>
                            */}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4} >
                        <input type="file"
                               className={style.paddingLeft}
                               accept='.json'
                               id='file'
                               onChange={e => handleFileChosen(e.target.files[0])} />
                    </Grid>

                    <Grid item xs={12} className={style.botonera} >
                        <Button
                            variant="contained"
                            onClick={() => dispatch(requestErrorsValidation(contentFileJson , systemChosen))} className={style.boton}>
                            Guardar
                        </Button>
                    </Grid>

                    {errors && <Grid container item md={12} className={style.paper}>
                            <TableContainer component={Paper}>
                                <Table className={style.table} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Id</TableCell>
                                            <TableCell align="center">Número de errores</TableCell>
                                            <TableCell align="center">Estatus</TableCell>
                                            <TableCell align="center">Descripción error </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {errors.map((row) => (
                                            <TableRow key={row.docId}>
                                                <TableCell style={{width: 160}} align="center">{row.docId}</TableCell>
                                                <TableCell style={{width: 160}} align="center">{row.errorCount}</TableCell>
                                                <TableCell  style={{width: 160}} align="center">{row.valid === true ? 'valido' : 'invalido'}</TableCell>
                                                <TableCell style={{width: 260}} align="center">
                                                    <TextField style={{width: '100%'}} multiline  id="filled-read-only-input"
                                                               InputProps={{
                                                                   readOnly: true,
                                                               }}
                                                               variant="filled"
                                                               defaultValue={row.errorsHumanReadable} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                    </Grid>}
                </Grid>

            </Paper>

        </div>
    );
}





