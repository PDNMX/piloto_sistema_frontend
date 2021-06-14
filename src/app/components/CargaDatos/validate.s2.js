import * as Yup from 'yup';

const curp =
	'[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$';
const rfc = '[A-ZÑ&]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9A]';

const soloTexto = "^['A-zÀ-ú-. ]{1,100}$";

export default Yup.object().shape({
	ejercicioFiscal: Yup.string().matches(new RegExp('^[0-9]{4}$'), 'Debe tener 4 dígitos'),
	ramo: Yup.string(),
	rfc: Yup.string()
		.matches(new RegExp(rfc), 'No se permiten puntos ,apóstrofes ni cadenas vacías máximo 13 caracteres')
		.trim(),
	curp: Yup.string().matches(new RegExp(curp), 'Introducir un CURP valido'),
	nombres: Yup.string()
		.matches(new RegExp(soloTexto), 'No se permiten números, ni cadenas vacías ')
		.required('El campo Nombres es requerido')
		.trim(),
	primerApellido: Yup.string()
		.matches(new RegExp(soloTexto), 'No se permiten números, ni cadenas vacías ')
		.required('El campo Primer apellido es requerido')
		.trim(),
	segundoApellido: Yup.string().matches(new RegExp(soloTexto), 'No se permiten números, ni cadenas vacías ').trim(),
	genero: Yup.object(),
	idnombre: Yup.string()
		.matches(new RegExp("^[A-zÀ-ú-0-9_.' ]{1,100}$"), 'No se permiten cadenas vacías, máximo 100 caracteres')
		.required('El campo Nombres de la sección Institución Dependencia es requerido')
		.trim(),
	idsiglas: Yup.string()
		.matches(new RegExp("^[A-zÀ-ú-0-9_.' ]{1,50}$"), 'No se permiten cadenas vacías, máximo 50 caracteres ')
		.trim(),
	idclave: Yup.string()
		.matches(new RegExp("^[A-zÀ-ú-0-9_.' ]{1,50}$"), 'No se permiten cadenas vacías, máximo 50 caracteres')
		.trim(),
	puestoNombre: Yup.string()
		.matches(new RegExp(soloTexto), 'No se permiten cadenas vacías, máximo 100 caracteres')
		.trim()
		.when('puestoNivel', (puestoNivel) => {
			if (!puestoNivel)
				return Yup.string()
					.matches(new RegExp(soloTexto), 'No se permiten números, ni cadenas vacías, máximo 100 caracteres ')
					.trim()
					.required('Al menos un campo de la sección Puesto, es requerido ');
		}),
	puestoNivel: Yup.string()
		.matches(new RegExp('^[a-zA-Z0-9 ]{1,100}$'), 'No se permiten números, ni cadenas vacías ')
		.trim(),
	tipoArea: Yup.array(),
	nivelResponsabilidad: Yup.array(),
	tipoProcedimiento: Yup.array()
		.min(1)
		.required('Se requiere seleccionar mínimo una opción del campo Tipo de procedimiento'),
	sinombres: Yup.string()
		.matches(new RegExp(soloTexto), 'No se permiten números, ni cadenas vacías, máximo 100 caracteres ')
		.trim(),
	siPrimerApellido: Yup.string()
		.matches(new RegExp(soloTexto), 'No se permiten números, ni cadenas vacías, máximo 100 caracteres ')
		.trim(),
	siSegundoApellido: Yup.string()
		.matches(new RegExp(soloTexto), 'No se permiten números, ni cadenas vacías, máximo 100 caracteres ')
		.trim(),
	siRfc: Yup.string()
		.matches(new RegExp(rfc), 'No se permiten puntos ,apóstrofes ni cadenas vacías máximo 13 caracteres')
		.trim(),
	siCurp: Yup.string().matches(new RegExp(curp), 'Introducir un CURP valido'),
	siPuestoNombre: Yup.string()
		.matches(new RegExp(soloTexto), 'No se permiten números, ni cadenas vacías, máximo 100 caracteres ')
		.trim(),
	siPuestoNivel: Yup.string()
		.matches(
			new RegExp('^[a-zA-Z0-9 ]{1,100}$'),
			'No se permiten números, ni cadenas vacías, máximo 100 caracteres'
		)
		.trim()
});
