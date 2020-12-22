import { userConstants } from '../_constants/user.constants';
export const userActions = {
    requestPerPage,
    setPerPageSucces,
    setPagination,
    fillUserUpdate,
    deleteUser,
    deleteUserDo
};

function deleteUser(id){
    return{
        type: userConstants.DELETE_REQUEST,
        id
    }
}

function deleteUserDo(id){
    return{
        type: userConstants.DELETE_OPERATION,
        id
    }
}

function fillUserUpdate(id){
    return {
        type: userConstants.USER_TEMPORAL_REQUEST,
        id
    }
}

function requestPerPage(objPaginationReq) {
    return {
        type: userConstants.USERS_PAGINATION_REQUEST,
        objPaginationReq
    };
}

function setPagination(objPagination){
    return {type : userConstants.PAGINATION_SET , objPagination}
}



function setPerPageSucces(users) {
    return {type : userConstants.USERS_PAGINATION_SUCCESS, users}
}


