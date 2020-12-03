import { userConstants } from '../_constants/user.constants';
export const userActions = {
    requestPerPage,
    setPerPageSucces,
    setPagination
};

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


