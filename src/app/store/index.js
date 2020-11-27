import {createStore, applyMiddleware, combineReducers } from 'redux'
import {defaultState} from "../../server/defaultState";
import {dStateValidateUpload} from "../../server/errorValidator/defaultStateValidator";
import {createLogger} from "redux-logger";
import  createSagaMiddleware from 'redux-saga';
import * as sagas from './sagas.schemas';
import * as mutations from './mutations';
import {SET_ERRORS_VALIDATION} from "./mutations";

const sagaMiddleware = createSagaMiddleware();

export const storeValidate = createStore(
    combineReducers({
        errors(errors = null ,action){
            switch (action.type){
                case mutations.SET_ERRORS_VALIDATION :
                    return  action.respuestaArray;
            }
            return errors;
        }
    }), applyMiddleware(createLogger(),sagaMiddleware)
)

for (let saga in sagas){
    sagaMiddleware.run(sagas[saga]);
}
