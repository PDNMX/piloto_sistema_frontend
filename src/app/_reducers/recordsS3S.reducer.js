import {userConstants} from "../_constants/user.constants";

export function recordsS3S(state = [], action) {
    switch (action.type) {
        case userConstants.REQUEST_RECORDS_S3S_SET:
            return action.recordsS3S;
        default:
            return state
    }
}