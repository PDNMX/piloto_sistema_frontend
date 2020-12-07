
import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from "@material-ui/core/Grid";
import BINARIO from "../../resource/assets/binario.jpg"



const style = theme => ({
    root: {
        flexGrow: 1,
    },
    space: {
        flexGrow: 1,
    },
    toolbar: {
        maxWidth: 1200,
    },
    container1: {
        paddingTop: '75px',
        paddingBottom: '75px',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        position: 'relative',
        backgroundImage: `url(${BINARIO})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
    },
    item2: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2)
    },
    whiteText:{
        color: theme.palette.white
    },

    purpleText:{
        color: '#FFFFFF'
    }

}
);


class Header extends React.Component{
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Grid container alignItems={"center"} justify={"center"} className={classes.root}>
                    <Grid item className={classes.toolbar} xs={12}>
                    </Grid>
                </Grid>
                <Grid container spacing={0} className={classes.container1} justify='center'>
                    <Grid item xs={12} md={6} className={classes.item2}>
                        <Typography variant="h4" paragraph className={classes.purpleText} style={{fontWeight: 600}}>
                            Sistema de captura
                        </Typography>
                        <Typography variant="h4" paragraph className={classes.purpleText} style={{fontWeight: 300}}>
                            
                        </Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default (withStyles(style)(Header));

