import { S2Constants } from "../_constants/s2.constants";
import {S3SConstants} from "../_constants/s3s.constants";

export function pagination(state = {}, action) {
    switch (action.type) {
        case S2Constants.PAGINATION_SET_SCHEMA2:
            return action.pagination;
        case S3SConstants.PAGINATION_SET_SCHEMA3S:
            return action.pagination;
        default:
            return state

    }
}
