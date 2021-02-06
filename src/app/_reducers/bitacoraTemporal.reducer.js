import {bitacoraConstants} from "../_constants/bitacora.constants";

export function bitacora(state = [], action) {
    switch (action.type) {
        case bitacoraConstants.BITACORA_GETALL_SET:
            return action.bitacora;
        default:
            return state
    }
}