import * as Yup from 'yup';


export default Yup.object().shape({
	expediente: Yup.string()
		.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,50}$'), 'No se permiten cadenas vacías, máximo 50 caracteres')
		.trim(),
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
	SPrfc: Yup.string()
		.matches(
			new RegExp('[A-ZÑ&]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9A]'),
			'No se permiten puntos ,apóstrofes ni cadenas vacías máximo 13 caracteres'
		)
		.trim(),
	SPcurp: Yup.string().matches(
		new RegExp(
			'[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])' +
				'(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT' +
				'|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$'
		),
		'Introducir un CURP valido'
	),
	SPSnombres: Yup.string()
		.matches(
			new RegExp("^['A-zÀ-ú-. ]{1,100}$"),
			'No se permiten números, ni cadenas vacías máximo 100 caracteres '
		)
		.required('El campo Nombres de Servidor público es requerido')
		.trim(),
	SPSprimerApellido: Yup.string()
		.matches(new RegExp("^['A-zÀ-ú-. ]{1,100}$"), 'No se permiten números, ni cadenas vacías máximo 100 caracteres')
		.required('El campo Primer apellido de Servidor público es requerido')
		.trim(),
	SPSsegundoApellido: Yup.string()
		.matches(new RegExp("^['A-zÀ-ú-. ]{1,100}$"), 'No se permiten números, ni cadenas vacías máximo 100 caracteres')
		.trim(),
	SPSgenero: Yup.object(),
	SPSpuesto: Yup.string()
		.matches(new RegExp("^['A-zÀ-ú-. ]{1,100}$"), 'No se permiten números, ni cadenas vacías máximo 100 caracteres')
		.required('El campo Puesto de Servidor público es requerido')
		.trim(),
	SPSnivel: Yup.string()
		.matches(new RegExp("^[A-zÀ-ú-0-9_.' ]{1,50}$"), 'No se cadenas vacías, máximo 50 caracteres')
		.trim(),
	autoridadSancionadora: Yup.string()
		.matches(new RegExp("^['A-zÀ-ú-. ]{1,200}$"), 'No se permiten números, ni cadenas vacías máximo 200 caracteres')
		.trim(),
	tipoFalta: Yup.object().required('El campo Tipo de falta es requerido'),
	tpfdescripcion: Yup.string()
		.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,400}$'), 'No se permiten cadenas vacías, máximo 400 caracteres')
		.trim(),
	tipoSancionArray: Yup.array().min(1, 'Se debe registrar al menos una sanción'),
	// tipoSancionArray: Yup.array().of(
	//     Yup.object().shape({
	//         tipoSancion: Yup.string().required('El campo Tipo de sanción es requerido'),
	//         descripcion: Yup.string()
	//             .matches(
	//                 new RegExp('^[A-zÀ-ú-0-9/ ]{1,50}$'),
	//                 'No se permiten cadenas vacías, máximo 50 caracteres'
	//             )
	//             .trim()
	//     })
	// ),

	tsdescripcion: Yup.string()
		.matches(new RegExp('^[A-zÀ-ú-0-9/ ]{1,400}$'), 'No se permiten cadenas vacías, máximo 400 caracteres')
		.trim(),
	causaMotivoHechos: Yup.string()
		.matches(new RegExp('^[A-zÀ-ú-0-9\n ]{1,1000}$'), 'No se permiten cadenas vacías, máximo 1000 caracteres')
		.required('El campo Causa o motivo de la sanción es requerido')
		.trim(),
	resolucionURL: Yup.string()
		.matches(
			/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
			'Introduce una direccion de internet valida'
		)
		.trim(),
	resolucionFecha: Yup.string().trim().nullable(true).when('resolucionURL', (resolucionURL) => {
		if (resolucionURL) return Yup.string().required('El campo Fecha de resolución es requerido').trim();
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
	inhabilitacionPlazo: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9/ ]*$'), 'No se permiten cadenas vacías').trim(),
	// inhabilitacionFechaInicial: Yup.date().nullable(true)
	//     .max(Yup.ref('inhabilitacionFechaFinal'), 'La fecha inicial no puede ser posterior a la fecha final'),
	// inhabilitacionFechaFinal: Yup.date().nullable(true),
	inhabilitacionFechaInicial: Yup.date()
		.nullable(true)
		.when('inhabilitacionFechaFinal', (inhabilitacionFechaFinal) => {
			if (inhabilitacionFechaFinal)
				return Yup.date().max(
					inhabilitacionFechaFinal,
					'La fecha inicial no puede ser posterior a la fecha final'
				);
		}),
	inhabilitacionFechaFinal: Yup.date().nullable(true),

	// inhabilitacionFechaInicial: Yup.string().trim().nullable(true),
	// inhabilitacionFechaFinal: Yup.string()
	//     .trim()
	//     .nullable(true)
	//     .when('inhabilitacionFechaInicial', (inhabilitacionFechaInicial) => {
	//         return Yup.date().min(
	//             inhabilitacionFechaInicial,
	//             'La fecha final no pude ser anterior a la fecha inicial'
	//         );
	//     }),
	observaciones: Yup.string()
		.matches(new RegExp('^[A-zÀ-ú-0-9\n/ ]{1,1000}$'), 'No se permiten cadenas vacías, máximo 1000 caracteres')
		.trim()
	// documents: Yup.array().of(
	//     Yup.object().shape({
	//         id: Yup.string().trim(),
	//         titulo: Yup.string()
	//             .required('El campo Título de la sección Documentos es requerido ')
	//             .max(50, 'Máximo 50 caracteres')
	//             .trim(),
	//         descripcion: Yup.string()
	//             .required('El campo Descripción de la sección Documentos es requerido ')
	//             .max(200, 'Máximo 200 caracteres')
	//             .trim(),
	//         url: Yup.string()
	//             .matches(
	//                 /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
	//                 'Introduce una dirección de internet valida'
	//             )
	//             .required('El campo URL de la sección Documentos es requerido')
	//             .trim(),
	//         fecha: Yup.string().required('El campo Fecha de la sección Documentos es requerido').trim(),
	//         tipo: Yup.object()
	//     })
	// )
});
