import { alertConstants } from '../_constants/alert.constants';

export function alert(state = {}, action) {
    switch (action.type) {
        case alertConstants.SUCCESS:
            return {
                type: 'alert-success',
                message: action.message,
                status: true
            };
        case alertConstants.ERROR:
            return {
                type: 'alert-danger',
                message: action.message,
                status: false
            };
        case alertConstants.CLEAR:
            return {};
        default:
            return state
    }
}
