import {userConstants} from "../_constants/user.constants";

export function recordsS2(state = [], action) {
    switch (action.type) {
        case userConstants.REQUEST_RECORDS_S2_SET:
            return action.recordsS2;
        default:
            return state
    }
}