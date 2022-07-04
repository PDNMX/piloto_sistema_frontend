import * as Yup from 'yup';

const emailRegrex = /^((https?):\/\/)(www.)?([a-zA-Z0-9.-])+(.[a-zA-Z]{3})(\/[a-zA-Z0-9_:=?.-]+)+$/;

export default Yup.object().shape({
  id: Yup.string().trim(),
  titulo: Yup.string().required('El campo Título es requerido').max(100, 'Máximo 100 caracteres').trim(),
  descripcion: Yup.string().required('El campo Descripción es requerido').max(200, 'Máximo 200 caracteres').trim(),
  url: Yup.string().matches(emailRegrex, 'Introduce una dirección de internet valida').required('El campo URL es requerido').trim(),
  fecha: Yup.string().required('El campo Fecha es requerido').trim(),
  tipo: Yup.object()
});
