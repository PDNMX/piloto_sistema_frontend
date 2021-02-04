import { bitacoraConstants } from '../_constants/bitacora.constants';

export const bitacoraActions = {
    requestPerPage,
    setPerPageSucces,
    setPagination,
    requestAllBitacora,
    setBitacoraAll
};

function requestAllBitacora(){
    return {
        type :  bitacoraConstants.BITACORA_GETALL,
    }
}

function requestPerPage(objPaginationReq) {
    return {
        type: bitacoraConstants.BITACORA_PAGINATION_REQUEST,
        objPaginationReq
    };
}

function setPagination(objPagination){
    return {type : bitacoraConstants.PAGINATION_SET , objPagination}
}

function setPerPageSucces(bitacora) {
    return {type : bitacoraConstants.BITACORA_PAGINATION_SUCCESS, bitacora}
}

function setBitacoraAll (bitacora){
    return {type : bitacoraConstants.BITACORA_GETALL_SET, bitacora}
}
