import { combineReducers } from 'redux';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import {pagination} from "./pagination.reducer";
import { alert } from './alert.reducer';
import {errors} from "./uploadfile.reducer";
import { providers } from './providers.reducer';
import {providerSelect } from './providerTemporal.reducer';
import {userInSession} from './userInSession.reducer';
import {catalogs} from './catalog.reducer';
import {S2} from './S2Schema.reducer'
const rootReducer = combineReducers({
    users,
    alert,
    registration,
    pagination,
    errors,
    providers,
    providerSelect,
    userInSession,
    catalogs,
    S2
});

export default rootReducer;
