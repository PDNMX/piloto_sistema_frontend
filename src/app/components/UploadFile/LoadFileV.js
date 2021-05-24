import React from 'react';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';
import Grid from "@material-ui/core/Grid";
import {useDispatch, useSelector} from "react-redux";
import {clearErrorsValidation, requestErrorsValidation} from '../../store/mutations'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {MenuItem, Select, TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {alertActions} from "../../_actions/alert.actions";

export const LoadFileV = () => {
    let fileReader;
    const dispatch = useDispatch();

    const {errors, alert, permisos} = useSelector(state => ({
        errors: state.errors,
        alert: state.alert,
        permisos: state.permisos
    }));

    const [open, setOpen] = React.useState(false);
    const fileInputRef = React.useRef();
    const [system, setSystem] = React.useState("");
    const [docText, setDocText] = React.useState(false);
    const [contentFileJson, setContentFileJson] = React.useState("");
    const useStyles = makeStyles({
        root: {
            maxWidth: 1200,
            margin: '0 auto',
            color: '#666666',
        },
        field: {
            width: '100%'
        },
        boton: {
            marginTop: '16px',
            marginLeft: '16px',
            marginRight: '16px',
            marginBottom: '16px',
            backgroundColor: '#ffe01b',
            color: '#666666'
        },
        marginleft: {
            marginLeft: '30pt',
        },
        paddingLeft: {
            paddingLeft: '30pt',
        },
        fontblack: {
            color: '#666666'
        },
        tableHead: {
            backgroundColor: '#34b3eb'
        },
        tableHeaderColumn: {
            color: '#ffff'
        },

    });
    const style = useStyles();

    const closeDialog = () => {
        setOpen(false);
    }

    const setValueSystem = (value) => {
        setSystem(value);
    }

    const handleFileRead = (e) => {
        const content = fileReader.result;
        setContentFileJson(content);
    };

    const handleFileChosen = (file) => {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
        setDocText(true);
    }

    return (
        <div>
            <div>
                <Paper elevation={0}>
                    <Grid container className={style.root}>
                        <Grid item xs={12}>
                            <Typography variant={"h6"} paragraph className={style.fontblack} align={"center"}>
                                <b>Carga de datos</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography paragraph className={style.fontblack}>
                                Importa un archivo .json para guardar la información del sistema seleccionado en la base de
                                datos correspondiente.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl required className={style.field}>
                                <Select inputProps={{
                                    id: 'system-native-required',
                                }} label="Sistema" className={style.marginLeft} required={true} value={system}
                                        onChange={e => setValueSystem(e.target.value)}>
                                    {permisos.map(item => (
                                        item === "S2" ?
                                            <MenuItem key={'s2'} value={'S2'}>Sistema de Servidores Públicos que
                                                Intervienen en Procedimientos de Contratación</MenuItem> :
                                            item === "S3S" ?
                                                <MenuItem key={'s3s'} value={'S3S'}>Sistema de los Servidores Públicos
                                                    Sancionados</MenuItem> :
                                                item === "S3P" ?
                                                    <MenuItem key={'s3p'} value={'S3P'}>Sistema de los Particulares
                                                        Sancionados</MenuItem> : ""
                                    ))}
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
                        <Grid item xs={12} md={6}>
                            <input type="file"
                                   className={style.paddingLeft}
                                   accept='.json'
                                   id='file'
                                   name='fileInput'
                                   ref={fileInputRef}
                                   onChange={e => handleFileChosen(e.target.files[0])}/>
                        </Grid>

                        <Grid spacing={3} container justify="flex-end">
                            <Button
                                className={style.boton}
                                variant="contained"
                                disabled={!docText || !(system != "")}
                                onClick={() => {
                                    dispatch(clearErrorsValidation());
                                    dispatch(alertActions.clear());
                                    setDocText(false);
                                    fileInputRef.current.value = "";
                                    setOpen(true);
                                    dispatch(requestErrorsValidation(contentFileJson, system))
                                }} className={style.boton}>
                                Guardar
                            </Button>
                        </Grid>

                        {errors &&
                        <Grid container item md={12}>
                            <Grid item xs={12}>
                                <Typography noWrap variant="h6" className={style.fontblack}>
                                    <b>Errores</b>
                                </Typography>
                            </Grid>
                            <TableContainer component={Paper}>
                                <Table aria-label="a dense table">
                                    <TableHead className={style.tableHead}>
                                        <TableRow key={'tableHead'}>
                                            <TableCell align="center"
                                                       className={style.tableHeaderColumn}><b>Identificador</b></TableCell>
                                            <TableCell align="center" className={style.tableHeaderColumn}><b>No. errores</b></TableCell>
                                            <TableCell align="center" className={style.tableHeaderColumn}><b>Estatus</b></TableCell>
                                            <TableCell align="center" className={style.tableHeaderColumn}><b>Detalle</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {errors.map((row) => (
                                            <TableRow key={row.docId}>
                                                <TableCell style={{width: '10%'}} align="center">{row.docId}</TableCell>
                                                <TableCell style={{width: '10%'}}
                                                           align="center">{row.errorCount}</TableCell>
                                                <TableCell style={{width: '10%'}}
                                                           align="center">{row.valid === true ? 'Válido' : 'Inválido'}</TableCell>
                                                <TableCell  style={{width: '70%'}} align="center">
                                                    <TextField style={{width: '100%'}} multiline
                                                               id="filled-read-only-input"
                                                               InputProps={{
                                                                   readOnly: true,
                                                               }}
                                                               variant="filled"
                                                               defaultValue={row.errorsHumanReadable}/>
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


            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={open && alert.message ? true : false}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Resultado"}</DialogTitle>
                <DialogContent>
                    <DialogContent id="alert-dialog-description">
                        <Typography variant="h6" className={style.fontblack}>
                            {alert.message}
                        </Typography>
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => closeDialog()} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}





