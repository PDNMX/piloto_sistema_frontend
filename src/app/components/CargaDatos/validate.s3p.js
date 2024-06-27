import * as Yup from 'yup';

const curp =
	'[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$';
const rfc = '[A-ZÑ&]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9A]';

const soloTexto = "^['A-zÀ-ú-. ]{1,100}$";

export default Yup.object().shape({
	expediente: Yup.string()
		.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,50}$'), 'No se permiten cadenas vacías, máximo 50 caracteres')
		.trim(),
	institucionDependencia: Yup.object().shape({
		nombre: Yup.string()
			.matches(new RegExp("^[A-zÀ-ú-0-9_.' ]{1,100}$"), 'No se permiten cadenas vacías, máximo 100 caracteres')
			.required('El campo Nombre de la sección Institución Dependencia es requerido')
			.trim(),
		siglas: Yup.string()
			.matches(new RegExp("^[A-zÀ-ú-0-9_.' ]{1,50}$"), 'No se permiten cadenas vacías, máximo 50 caracteres ')
			.trim(),
		clave: Yup.string()
			.matches(new RegExp("^[A-zÀ-ú-0-9_.' ]{1,50}$"), 'No se permiten cadenas vacías, máximo 50 caracteres')
			.trim()
	}),
	particularSancionado: Yup.object().shape({
		nombreRazonSocial: Yup.string()
			.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,100}$'), 'No se permiten cadenas vacías, máximo 100 caracteres')
			.required('El campo Nombre razon social de Particular sancionado es requerido')
			.trim(),
		objetoSocial: Yup.string()
			.matches(new RegExp('^[A-zÀ-ú-0-9\n/ ]{1,200}$'), 'No se permiten cadenas vacías, máximo 200 caracteres')
			.trim(),
		rfc: Yup.string()
			.matches(new RegExp(rfc), 'No se permiten puntos ,apóstrofes ni cadenas vacías máximo 13 caracteres')
			.trim(),
		tipoPersona: Yup.object().required('El campo Tipo persona de la sección particular sancionado es requerido'),
		telefono: Yup.string()
			.matches(new RegExp('^[0-9]{12}$'), 'Inserta un número de teléfono válido, 12 caracteres')
			.trim(),
		domicilioMexico: Yup.object().shape({
			pais: Yup.object(),
			entidadFederativa: Yup.object(),
			municipio: Yup.object(),
			codigoPostal: Yup.string()
				.matches(new RegExp('^[0-9]{5}$'), 'Inserta un código postal válido, 5 caracteres máximo')
				.trim(),
			localidad: Yup.object(),
			vialidad: Yup.object(),
			descripcionVialidad: Yup.string()
				.matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,100}$'), 'No se permiten cadenas vacías, máximo 100 caracteres')
				.trim(),
			numeroExterior: Yup.string()
				.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,50}$'), 'No se permiten cadenas vacías, máximo 50 caracteres')
				.trim(),
			numeroInterior: Yup.string()
				.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,50}$'), 'No se permiten cadenas vacías, máximo 50 caracteres')
				.trim()
		}),
		domicilioExtranjero: Yup.object().shape({
			calle: Yup.string()
				.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,100}$'), 'No se permiten cadenas vacías, máximo 100 caracteres')
				.trim(),
			numeroExterior: Yup.string()
				.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,50}$'), 'No se permiten cadenas vacías, máximo 50 caracteres')
				.trim(),
			numeroInterior: Yup.string()
				.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,50}$'), 'No se permiten cadenas vacías, máximo 50 caracteres')
				.trim(),
			ciudadLocalidad: Yup.string()
				.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,100}$'), 'No se permiten cadenas vacías, máximo 100 caracteres')
				.trim(),
			estadoProvincia: Yup.string()
				.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,100}$'), 'No se permiten cadenas vacías, máximo 100 caracteres')
				.trim(),
			pais: Yup.object(),
			codigoPostal: Yup.string()
				.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,20}$'), 'No se permiten cadenas vacías, máximo 20 caracteres')
				.trim()
		}),
		directorGeneral: Yup.object().shape({
			nombres: Yup.string()
				.matches(
					new RegExp("^['A-zÀ-ú-. ]{1,100}$"),
					'No se permiten números, ni cadenas vacías máximo 100 caracteres'
				)
				.trim(),
			primerApellido: Yup.string()
				.matches(
					new RegExp("^['A-zÀ-ú-. ]{1,100}$"),
					'No se permiten números, ni cadenas vacías máximo 100 caracteres'
				)
				.trim(),
			segundoApellido: Yup.string()
				.matches(
					new RegExp("^['A-zÀ-ú-. ]{1,100}$"),
					'No se permiten números, ni cadenas vacías máximo 100 caracteres'
				)
				.trim(),
			curp: Yup.string().matches(new RegExp(curp), 'Introducir un CURP valido')
		}),

		apoderadoLegal: Yup.object().shape({
			nombres: Yup.string()
				.matches(
					new RegExp("^['A-zÀ-ú-. ]{1,100}$"),
					'No se permiten números, ni cadenas vacías máximo 100 caracteres'
				)
				.trim(),
			primerApellido: Yup.string()
				.matches(
					new RegExp("^['A-zÀ-ú-. ]{1,100}$"),
					'No se permiten números, ni cadenas vacías máximo 100 caracteres'
				)
				.trim(),
			segundoApellido: Yup.string()
				.matches(
					new RegExp("^['A-zÀ-ú-. ]{1,100}$"),
					'No se permiten números, ni cadenas vacías máximo 100 caracteres'
				)
				.trim(),
			curp: Yup.string().matches(new RegExp(curp), 'Introducir un CURP valido')
		})
	}),
	objetoContrato: Yup.string()
		.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,300}$'), 'No se permiten cadenas vacías, máximo 300 caracteres')
		.trim(),
	autoridadSancionadora: Yup.string()
		.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,200}$'), 'No se permiten cadenas vacías, máximo 200 caracteres')
		.required('El campo Autoridad sancionadora es requerido')
		.trim(),
	tipoFalta: Yup.string()
		.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,200}$'), 'No se permiten cadenas vacías, máximo 200 caracteres')
		.required('El campo tipo Falta es requerido')
		.trim(),
	tipoSancion: Yup.array().min(1, 'Se debe registrar al menos una sanción'),
	// tipoSancion: Yup.array().of(
	//     Yup.object().shape({
	//         tipoSancion: Yup.object().required("El campo Tipo de sanción es requerido"),
	//         descripcion: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,50}$'), 'No se permiten cadenas vacías, máximo 50 caracteres').trim()
	//     })
	// ).required("Se requiere seleccionar mínimo una opción del campo Tipo sanción"),
	causaMotivoHechos: Yup.string()
		.matches(new RegExp('^[A-zÀ-ú-0-9\n ]{1,400}$'), 'No se permiten cadenas vacías, máximo 400 caracteres')
		.required('El campo Causa o motivo de la sanción es requerido')
		.trim(),
	acto: Yup.string()
		.matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,400}$'), 'No se permiten cadenas vacías, máximo 400 caracteres')
		.trim(),
	responsableSancion: Yup.object().shape(
		{
			nombres: Yup.string()
				.matches(
					new RegExp("^['A-zÀ-ú-. ]{1,100}$"),
					'No se permiten números, ni cadenas vacías máximo 100 caracteres'
				)
				.trim()
				.when('primerApellido', (primerApellido) => {
					if (primerApellido)
						return Yup.string()
							.matches(
								new RegExp("^['A-zÀ-ú-. ]{1,100}$"),
								'No se permiten números, ni cadenas vacías máximo 100 caracteres'
							)
							.required('El campo nombres de la sección Responsable sanción es requerido')
							.trim();
				}),
			primerApellido: Yup.string()
				.matches(
					new RegExp("^['A-zÀ-ú-. ]{1,100}$"),
					'No se permiten números, ni cadenas vacías máximo 100 caracteres'
				)
				.trim()
				.when('nombres', (nombres) => {
					if (nombres)
						return Yup.string()
							.matches(
								new RegExp("^['A-zÀ-ú-. ]{1,100}$"),
								'No se permiten números, ni cadenas vacías máximo 100 caracteres'
							)
							.required('El campo Primer apellido de la sección Responsable sanción es requerido')
							.trim();
				}),
			segundoApellido: Yup.string()
				.matches(
					new RegExp("^['A-zÀ-ú-. ]{1,100}$"),
					'No se permiten números, ni cadenas vacías máximo 100 caracteres'
				)
				.trim()
		},
		[ 'nombres', 'primerApellido' ]
	),
	resolucion: Yup.object().shape({
		sentido: Yup.string()
			.matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,400}$'), 'No se permiten cadenas vacías, máximo 400 caracteres')
			.trim(),
		url: Yup.string()
			.matches(
				/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9_\-.#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
				'Introduce una direccion de internet valida'
			)
			.trim(),
		fechaNotificacion: Yup.string().trim().nullable(true)
	}),
	multa: Yup.object().shape(
		{
			monto: Yup.string()
				.matches(new RegExp('^([0-9]*[.])?[0-9]+$'), 'Solo se permiten números enteros o decimales')
				.trim()
				.when('moneda', (moneda) => {
					if (moneda)
						return Yup.string()
							.matches(new RegExp('^([0-9]*[.])?[0-9]+$'), 'Solo se permiten números enteros o decimales')
							.trim()
							.required('El campo monto es requerido ');
				}),
			moneda: Yup.string().when('monto', (monto) => {
				if (monto) return Yup.string().trim().required('El campo moneda es requerido ');
			})
		},
		[ 'moneda', 'monto' ]
	),
	inhabilitacion: Yup.object().shape({
		plazo: Yup.string()
			.matches(new RegExp('^[A-zÀ-ú-0-9 ]{1,400}$'), 'No se permiten cadenas vacías, máximo 400 caracteres')
			.trim(),
		fechaInicial: Yup.date().nullable(true).when('fechaFinal', (fechaFinal) => {
			if (fechaFinal)
				return Yup.date().max(fechaFinal, 'La fecha inicial no puede ser posterior a la fecha final');
		}),
		fechaFinal: Yup.date().nullable(true)
	}),
	domicilio: Yup.string(),
	observaciones: Yup.string()
		.matches(new RegExp('^[A-zÀ-ú-0-9\n ]{1,1000}$'), 'No se permiten cadenas vacías, máximo 1000 caracteres')
		.trim()
	// documentos: Yup.array().of(
	//     Yup.object().shape({
	//         id: Yup.string().trim(),
	//         titulo: Yup.string().required('El campo Título de la sección Documentos es requerido ').max(50, 'Máximo 50 caracteres').trim(),
	//         descripcion: Yup.string().required('El campo Descripción de la sección Documentos es requerido ').max(200, 'Máximo 200 caracteres').trim(),
	//         url: Yup.string()
	//             .matches(/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9_\-.#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
	//                 'Introduce una direccion de internet valida'
	//             )
	//             .required('El campo URL de la sección Documentos es requerido').trim(),
	//         fecha: Yup.string().required("El campo Fecha de la sección Documentos es requerido").trim(),
	//         tipo: Yup.object()
	//     })
	// )
});
