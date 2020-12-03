import { userConstants } from "../_constants/user.constants";

export function pagination(state = {}, action) {
    switch (action.type) {
        case userConstants.PAGINATION_SET:
            return action.objPagination;
        default:
            return state
    }
}
