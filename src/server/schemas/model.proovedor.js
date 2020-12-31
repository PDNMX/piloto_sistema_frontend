const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema({
    dependencia:String,
    fechaAlta:String,
    fechaBaja:String,
    fechaActualizacion:String,
    estatus:Boolean,
    sistemas: { type: [], default: void 0 }
});

userSchema.plugin(mongoosePaginate);

let Proovedor = model('Proovedores', userSchema, 'proovedores');

module.exports = Proovedor;
