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
import {requestSchemaS2Creation} from '../../store/mutations'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export const LoadFileV = () => {
    let fileReader;
    const dispatch = useDispatch();
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


    const getErrorsFileUpload = async (contentFileJson, systemChosen) => {
        const ur= "http://localhost:3004";

        if(systemChosen === "s2"){
            let SCHEMA = JSON.parse(contentFileJson);
            const respuesta = await axios.post(ur + `/validateSchemaS2`,SCHEMA);
            console.info("got responce",respuesta);

            for (let errors of respuesta.data){
                console.log(errors.valid);
                if(!errors.valid){
                    let idDoc = errors.idDoc;
                    let errorCount = errors.errorCount;
                    rowsError.push({idDoc,errorCount});
                }
            }

        }
    }

    const setValueSystem= (value) => {
        systemChosen= value;
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
                        <FormControl className={classes.field}>
                            <InputLabel id="sistema-label"></InputLabel>
                            <select onChange={e => setValueSystem(e.target.value) }>
                                <option selected value="s2">Servidores públicos que intervienen en contrataciones</option>
                                <option value="s31">Públicos Sancionados</option>
                                <option value="s32">Particulares Sancionados</option>
                            </select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={1}>

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
                            onClick={() => getErrorsFileUpload(contentFileJson , systemChosen)} className={classes.button}>
                            Guardar
                        </Button>
                    </Grid>

                    {rowsError.length > 0 && <Grid item xs={12} >
                        <TableContainer component={Paper}>
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">Id</TableCell>
                                        <TableCell align="right">Number errors</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rowsError.map((row) => (
                                        <TableRow key={row.idDoc}>
                                            <TableCell component="th" scope="row">
                                                {row.idDoc}
                                            </TableCell>
                                            <TableCell align="right">{row.errorCount}</TableCell>
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





