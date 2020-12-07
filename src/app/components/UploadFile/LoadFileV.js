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
import { TextField } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export const LoadFileV = () => {
    let fileReader;
    const dispatch = useDispatch();
    const errors = useSelector(state => state.errors);
    let systemChosen;
    let contentFileJson;
    let rowsError=[];


    const style = theme => ({
        root: {
            maxWidth: 1200,
            margin: '0 auto',
        },
        paper: {
            padding: theme.spacing(3),
            maxWidth: 1200,
            margin: '0 auto',
            marginBottom: theme.spacing(8)
        },
        field: {
            width: '100%'
        },
        botonera: {
            textAlign: "right"
        },
        boton: {
            margin: theme.spacing(2)
        }

    });



    const setValueSystem= (value) => {
        systemChosen = value;
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


    const classes = {};

    return (
        <div>
            <Header/>
            <Grid container className={style.root}>
                <Grid item xs={12}>
                    <Typography variant={"h6"} paragraph color={"primary"} align={"center"}>
                        <b>Carga de datos</b>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography paragraph color={"textPrimary"}>
                        Importa un archivo .json para guardar la información del sistema seleccionado en la base de datos correspondiente.
                    </Typography>
                </Grid>
            </Grid>

            <Paper elevation={3} className={classes.paper} >
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <FormControl required className={classes.field}>
                            <InputLabel shrink htmlFor="system-native-required">
                                Sistema
                            </InputLabel>
                            <select inputProps={{
                                id: 'system-native-required',
                            }}
                                    onChange={e => setValueSystem(e.target.value) }>
                                <option aria-label="None" value="" />
                                <option value="s2">Servidores públicos que intervienen en contrataciones</option>
                                <option value="s31">Públicos Sancionados</option>
                                <option value="s32">Particulares Sancionados</option>
                            </select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <input type="file"
                               accept='.json'
                               id='file'
                               onChange={e => handleFileChosen(e.target.files[0])} />
                    </Grid>

                    <Grid item xs={12} className={classes.botonera} >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => dispatch(requestErrorsValidation(contentFileJson , systemChosen))} className={classes.button}>
                            Guardar
                        </Button>
                    </Grid>

                    {errors && <Grid aling="center" item xs={8} >
                        <TableContainer component={Paper}>
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">Id</TableCell>
                                        <TableCell align="right">Número de errores</TableCell>
                                        <TableCell align="right">Estatus</TableCell>
                                        <TableCell align="right">Descripción error </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {errors.map((row) => (
                                        <TableRow key={row.docId}>
                                            <TableCell align="right">{row.docId}</TableCell>
                                            <TableCell align="right">{row.errorCount}</TableCell>
                                            <TableCell align="right">{row.valid === true ? 'valido' : 'invalido'}</TableCell>
                                            <TableCell align="right">
                                                <TextField multiline  id="filled-read-only-input"
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





