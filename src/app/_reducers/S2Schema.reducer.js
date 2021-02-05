import {S2Constants} from "../_constants/s2.constants";
import {userConstants} from "../_constants/user.constants";

export function S2(state = [] ,action){
    switch (action.type){
        case S2Constants.SET_LIST_S2 :
            return  action.list;
        case S2Constants.DELETE_OPERATION:
            for(let i =0 ; i < state.length; i++){
                if(state[i]._id === action.id){
                    state.splice(i,1);
                }
            }
            return state;
    }
    return state;
}
