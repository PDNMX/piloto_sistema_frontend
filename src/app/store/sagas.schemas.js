import { take, put, select } from 'redux-saga/effects';
import uuid from 'uuid';
import axios from 'axios';

import { history } from './history'
import * as mutations from './mutations';
import path from "path";

require('dotenv').config({ path: path.resolve(__dirname, '../../utils/.env')});
const url = process.env.URLAPI;
const ur= "http://localhost:3004";

export function* createSchemaS2(){
    while (true) {
        const {schema,systemId} = yield take (mutations.CREATE_SCHEMA_S2);
        if(systemId === "s2"){
            let SCHEMA = JSON.parse(schema);
            const respuesta = axios.post(ur + `/validateSchemaS2`,SCHEMA);
            console.info("got responce",respuesta);
        }
    }
}
