import { catalogConstants } from "../_constants/catalogs.constants";

export function catalogs(state = {}, action) {
    switch (action.type) {
        case catalogConstants.GENERO_SET:
            return state ["genero"] = action.genero;
        default:
            return state
    }
}
