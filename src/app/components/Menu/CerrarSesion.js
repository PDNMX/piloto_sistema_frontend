import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import BallotIcon from '@material-ui/icons/Ballot';

export default function CerrarSesion() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <BallotIcon color="secondary" fontSize="large" />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Perfil</MenuItem>
        <MenuItem onClick={handleClose}>Avanzadas</MenuItem>
        <MenuItem onClick={handleClose}>Cerrar sesión</MenuItem>
      </Menu>
    </div>
  );
}