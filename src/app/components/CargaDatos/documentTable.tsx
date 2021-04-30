import React from 'react';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: '#ffe01b',
            color: '#666666'
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow);

function createData(id: string, tipo: string, titulo: string, url: string, fecha: string, descripcion: string) {
    return { id, tipo, titulo, url, fecha, descripcion};
}



const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

export default function DocumentTable(props) {
    const classes = useStyles();
    const rows = props.documents.map(e => createData(e.id, e.tipo, e.titulo, e.url, e.fecha, e.descripcion));
    console.log(rows)
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell><b>Tipo</b></StyledTableCell>
                        <StyledTableCell align="right"><b>Título</b></StyledTableCell>
                        <StyledTableCell align="right"><b>URL</b></StyledTableCell>
                        <StyledTableCell align="right"><b>Fecha</b></StyledTableCell>
                        <StyledTableCell align="right"><b>Descripción</b></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell component="th" scope="row">
                                {row.tipo}
                            </StyledTableCell>
                            <StyledTableCell align="right">{row.titulo}</StyledTableCell>
                            <StyledTableCell align="right">{row.url}</StyledTableCell>
                            <StyledTableCell align="right">{row.fecha}</StyledTableCell>
                            <StyledTableCell align="right">{row.descripcion}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}