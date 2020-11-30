import * as mutations from "../store/mutations";

export function errors(errors = null ,action){
            switch (action.type){
                case mutations.SET_ERRORS_VALIDATION :
                    return  action.respuestaArray;
            }
            return errors;
}
