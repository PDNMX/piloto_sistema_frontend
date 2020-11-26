import React, { useState } from 'react';
import {withStyles} from "@material-ui/core/styles";
import Header from "../Header/Header"
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from "@material-ui/core/Grid";
import { Alert } from '@material-ui/lab';
//import Banner from "../assets/banner.jpg"
import DBZ from "../assets/dbz.jpg";
import TWD from "../assets/TWD2.jpg";
import BINARIO from "../assets/binario.jpg";
import LOGO from "../assets/pdn.png";

import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';


export const LoginV = () => {

const style = makeStyles((theme) => ({
  root: {
      maxWidth: 1200,
      margin: '0 auto',
  },
  paper: {
    //marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    //paddingTop: '-100px'
  },
  field: {
      width: '100%'
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
    },
    imglogo:{
      paddingTop: '100px',
      position: 'absolute',
      backgroundImage: `url(${LOGO})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      backgroundSize: "cover",
      width: '10%',
      height: '10%',
    },

    avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  logo:{
    margin: 'auto',
    display: 'block',
    maxWidth: '15%',
    maxHeight: '15%',
   
  }
}));



const [msjrequired,setmsj] = useState("");
const [alert,setalert] = useState(false);

const onChange = (e) => {
  setmsj("");
  setalert(false);
};

const handleSubmit = (e) => {
  if(e.target.usuario.value=="" || e.target.password.value==""){    
    setmsj("Usuario y/o contraseña requeridos.");
    setalert(true);
  }
  e.preventDefault();
  return false;
};

const classes = style();

return (
<div>
    <Grid container spacing={0} className={classes.container1} justify='center'>
      <Grid item xs={12} md={6} className={classes.item2}>
          <Typography variant="h4" paragraph className={classes.purpleText} style={{fontWeight: 600}}>
              Sistema de carga de datos S2 Y S3
          </Typography>                        
        </Grid>
    </Grid>
    <Grid container  justify='center'>                    
        <img className={classes.logo} src={LOGO} />                               
    </Grid>
  <Container component="main" maxWidth="xs">
    <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Inicio de sesión
        </Typography>
        <Typography component="h1" variant="h5">         
          { alert ?  <Alert severity="error">{ msjrequired }</Alert> : "" }
        </Typography>

        
        <form className={classes.form} onSubmit={e => handleSubmit(e)}>
          <TextField
            variant="outlined"
            margin="normal"            
            fullWidth
            id="usuario"
            label="Usuario"
            name="usuario"
            autoComplete="usuario"
            autoFocus
            onChange={e => onChange(e)}
          />
          <TextField
            variant="outlined"
            margin="normal"            
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={e => onChange(e)}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Aceptar
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Recuperar contraseña
              </Link>
            </Grid>
            
          </Grid>
        </form>
      </div>
  </Container>
</div>
        );
}
