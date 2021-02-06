export const REQUEST_TASK_CREATION = `REQUEST_TASK_CREATION`;
export const CREATE_TASK = `CREATE_TASK`;
export const SET_TASK_COMPLETE = 'SET_TASK_COMPLETE';
export const SET_TASK_GROUP = 'SET_TASK_GROUP';
export const SET_TASK_NAME = 'SET_TASK_NAME';
export const REQUEST_SCHEMA_S2_CREATION = 'REQUEST_SCHEMA_S2_CREATION';
export const CREATE_SCHEMA_S2 = 'CREATE_SCHEMA_S2';
export const REQUEST_VALIDATION_ERRORS = 'REQUEST_VALIDATION_ERRORS';
export const SET_ERRORS_VALIDATION = 'SET_ERRORS_VALIDATION ';
export const REQUEST_AUTHENTICATE_USER = `REQUEST_AUTHENTICATE_USER`;
export const PROCESSING_AUTHENTICATE_USER = `PROCESSING_AUTHENTICATE_USER`;
export const AUTHENTICATING = `AUTHENTICATING`;
export const AUTHENTICATED = `AUTHENTICATED`;
export const NOT_AUTHENTICATED = `NOT_AUTHENTICATED`;
export const SET_STATE = `SET_STATE`;
export const USERNAME_RESERVED = `USERNAME_RESERVED`;
export const REQUEST_USER_ACCOUNT_CREATION = `REQUEST_USER_ACCOUNT_CREATION`;
export const REQUEST_CREATION_USER = 'REQUEST_CREATION_USER';
export const REQUEST_EDIT_USER = 'REQUEST_EDIT_USER';
export const SET_DATABASE_USER = 'SET_DATABASE_USER';
export const REQUEST_CREATION_PROVIDER = 'REQUEST_CREATION_PROVIDER';
export const REQUEST_EDIT_PROVIDER = 'REQUEST_EDIT_PROVIDER';
export const REQUEST_TOKEN_AUTH = 'REQUEST_TOKEN_AUTH' ;
export const REQUEST_CONSULT_BITACORA = 'REQUEST_CONSULT_BITACORA';

export const requestCreationUser = (usuarioJson) => ({
    type: REQUEST_CREATION_USER,
    usuarioJson
});

export const requestEditUser = (usuarioJson) => ({
    type : REQUEST_EDIT_USER,
    usuarioJson
});

export const requestTokenAuth = (credentialUser) => ({
    type: REQUEST_TOKEN_AUTH,
    credentialUser
});

export const requestErrorsValidation = (schema,systemId) =>({
    type: REQUEST_VALIDATION_ERRORS,
    schema,
    systemId
});

export const setErrorsValidation = (respuestaArray) =>({
    type: SET_ERRORS_VALIDATION,
    respuestaArray
})

export const requestSchemaS2Creation = (schema,systemId) =>({
    type: CREATE_SCHEMA_S2,
    schema,
    systemId
});

export const requestTaskCreation = (groupID)=>({
    type:REQUEST_TASK_CREATION,
    groupID
});

export const createTask = (taskID, groupID, ownerID)=>({
    type:CREATE_TASK,
    taskID,
    groupID,
    ownerID
});

export const setTaskCompletion = (id, isComplete) => ({
    type: SET_TASK_COMPLETE,
    taskID : id,
    isComplete
});

export const setTaskName = (id, name) => ({
    type: SET_TASK_NAME,
    taskID : id,
    name
})

export const setTaskGroup = (id, groupID) => ({
    type: SET_TASK_GROUP,
    taskID : id,
    groupID
})

export const requestCreationProvider = (usuarioJson) => ({
    type: REQUEST_CREATION_PROVIDER,
    usuarioJson
});

export const requestEditProvider = (usuarioJson) => ({
    type: REQUEST_EDIT_PROVIDER,
    usuarioJson
});

export const requestConsultBitacora = (usuarioJson) => ({
    type: REQUEST_CONSULT_BITACORA,
    usuarioJson
});