import { combineReducers } from 'redux';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import {pagination} from "./pagination.reducer";
import { alert } from './alert.reducer';
import {errors} from "./uploadfile.reducer";
import { providers } from './providers.reducer';
import {providerSelect } from './providerTemporal.reducer';
import {userSelect } from './userTemporal.reducer';
import {userInSession} from './userInSession.reducer';
import {catalogs} from './catalog.reducer';
import {S2} from './S2Schema.reducer';
import {S3S} from './S3SSchema.reducer';
import {bitacora} from './bitacoraTemporal.reducer';
const rootReducer = combineReducers({
    users,
    alert,
    registration,
    pagination,
    errors,
    providers,
    providerSelect,
    catalogs,
    S2,
    S3S,
    userInSession,
    userSelect,
    bitacora
});

export default rootReducer;
