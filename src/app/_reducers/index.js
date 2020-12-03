import { combineReducers } from 'redux';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import {pagination} from "./pagination.reducer";
import { alert } from './alert.reducer';
import {errors} from "./uploadfile.reducer";

const rootReducer = combineReducers({
    users,
    alert,
    registration,
    pagination,
    errors
});

export default rootReducer;
