import { userConstants } from "../_constants/user.constants";

export function userPassword(state = "", action) {
    switch (action.type) {
        case userConstants.USER_PASSWORD_SET:
            return action.user;
        default:
            return state
    }
}