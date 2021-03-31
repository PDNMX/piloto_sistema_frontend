import {userConstants} from "../_constants/user.constants";

export function recordsS3P(state = [], action) {
    switch (action.type) {
        case userConstants.REQUEST_RECORDS_S3P_SET:
            return action.recordsS3P;
        default:
            return state
    }
}