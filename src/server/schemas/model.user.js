const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema({
    nombre:String,
    apellidoUno:String,
    apellidoDos:String,
    cargo:String,
    correoElectronico:String,
    telefono:String,
    extension:String,
    usuario:String,
    constraseña:String,
    sistemas: { type: [], default: void 0 },
    fechaAlta:String,
    fechaBaja:String,
    estatus:String,
    vigenciaContrasena:String,
    rol: { type: [], default: void 0 },
});

userSchema.plugin(mongoosePaginate);

let User = model('Usuarios', userSchema, 'usuarios');

module.exports = User;

