import {createStore, applyMiddleware, combineReducers } from 'redux'
import {defaultState} from "../../server/defaultState";
import {dStateValidateUpload} from "../../server/errorValidator/defaultStateValidator";
import {createLogger} from "redux-logger";
import  createSagaMiddleware from 'redux-saga';
import * as sagas from './sagas.schemas';
import * as mutations from './mutations';
import {SET_ERRORS_VALIDATION} from "./mutations";
import rootReducer from "../_reducers";

const sagaMiddleware = createSagaMiddleware();


export const storeValidate = createStore(
    rootReducer,
    applyMiddleware(
        createLogger(),sagaMiddleware
    )
);

for (let saga in sagas){
    sagaMiddleware.run(sagas[saga]);
}
