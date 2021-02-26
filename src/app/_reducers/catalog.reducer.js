import { catalogConstants } from "../_constants/catalogs.constants";

export function catalogs(state = {genero: [], ramo: [], puesto: [] }, action) {
    switch (action.type) {
        case catalogConstants.GENERO_SET:
            return {...state , genero : action.generos};
        case catalogConstants.RAMO_SET:
            return {...state , ramo : action.ramos};
        case catalogConstants.PUESTO_SET:
            return {...state , puesto : action.puestos};
        case catalogConstants.TIPO_AREA_SET:
            return {...state , tipoArea : action.areas};
        case catalogConstants.NIVEL_RESPONSABILIDAD_SET:
            return {...state, nivelResponsabilidad : action.niveles}
        case catalogConstants.TIPO_PROCEDIMIENTO_SET:
            return {...state , tipoProcedimiento : action.procedimientos}
        case catalogConstants.TIPO_FALTA_SET:
            return {...state , tipoFalta : action.falta}
        case catalogConstants.TIPO_SANCION_SET:
            return {...state , tipoSancion : action.sancion}
        case catalogConstants.MONEDA_SET:
            return {...state , moneda : action.moneda}
        default:
            return state
    }
}
