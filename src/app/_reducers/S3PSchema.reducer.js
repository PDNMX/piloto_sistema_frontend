import {S3PConstants} from "../_constants/s3p.constants";

export function S3P(state = [] ,action){
    switch (action.type){
        case S3PConstants.SET_LIST_S3P :
            return  action.list;
        case S3PConstants.DELETE_OPERATION:
            let array = [];
            if(Array.isArray(action.id)){
                for(let i =0 ; i < state.length; i++){
                    if( action.id.indexOf(state[i]._id.trim()) === -1 ){
                        array.push(state[i]);
                    }
                }
                state=array;
            }else{
                for(let i =0 ; i < state.length; i++){
                    if(state[i]._id === action.id){
                        state.splice(i,1);
                    }
                }
            }
            return state;
    }
    return state;
}
