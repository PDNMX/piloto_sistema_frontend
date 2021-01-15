import { catalogConstants } from "../_constants/catalogs.constants";

export const catalogActions = {
    requestGenero,
    setGeneroSucces,
};

function requestGenero(){
    return {
        type : catalogConstants.GENERO_REQUEST,
    }
}

function setGeneroSucces(generos){
    return {
        type : catalogConstants.GENERO_SET,
        generos
    }
}
