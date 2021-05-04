import React from 'react';
import {makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    nota: {
        color: '#bfac31',
    },
});

export default function Nota() {
    const classes = useStyles();
    return(
        <div className={classes.nota}>
            (DNC)
        </div>
    );
}
