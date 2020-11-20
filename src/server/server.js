import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
const mongoose = require('mongoose');
const yaml = require('js-yaml')
const fs = require('fs');
const validateSchema = require('yaml-schema-validator');
const SwaggerClient = require('swagger-client');

var Validator = require('swagger-model-validator');
var validator = new Validator(SwaggerClient);

console.log(path.resolve(__dirname, '../utils/.env'));

require('dotenv').config({ path: path.resolve(__dirname, '../utils/.env')});

//connection mongo db
console.log('mongodb://'+process.env.USERMONGO+':'+process.env.PASSWORDMONGO+'@'+process.env.HOSTMONGO+'/'+process.env.DATABASE);
const db = mongoose.connect('mongodb://'+process.env.USERMONGO+':'+process.env.PASSWORDMONGO+'@'+process.env.HOSTMONGO+'/'+process.env.DATABASE, { useNewUrlParser: true,  useUnifiedTopology: true  })
    .then(() => console.log('Connect to MongoDB..'))
    .catch(err => console.error('Could not connect to MongoDB..', err))


let port = process.env.PORT || 7777;
let app = express();
app.use(
    cors(),
    bodyParser.urlencoded({extended:true}),
    bodyParser.json()
);

let server = app.listen(3004, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log(' function cloud Server is listening at http://%s:%s', host, port);
});


app.post('/validateSchemaS2',async (req,res)=>{
    let fileContents = fs.readFileSync( path.resolve(__dirname, '../app/resource/openapis2.yaml'), 'utf8');
    let data = yaml.safeLoad(fileContents);
    let schemaS2 =  data.components.schemas.respSpic_inner;

    let newdocument = req.body;
    let respuesta=[];
    if(Array.isArray(newdocument)){
        for (let doc of newdocument){
            var validation = validator.validate(doc, schemaS2);
            respuesta.push(validation);
        }
    }else{
        var validation = validator.validate(newdocument, schemaS2);
        respuesta.push(validation);
    }

    res.status(200).json(respuesta);
});


if (process.env.NODE_ENV == `production`) {
    app.use(express.static(path.resolve(__dirname,'../../dist')));
    app.get('/*',(req,res)=>{
        res.sendFile(path.resolve('index.html'));
    });
}

app.post('/task/new',async (req,res)=>{
    // let task = req.body.task;
    await addNewTask(req.body.task);
    res.status(200).send();
});



app.post('/task/update',async (req,res)=>{
    let db = await connectDB();
    await updateTask(req.body.task);
    res.status(200).send();
});

app.post('/comment/new',async (req,res)=>{
    let comment = req.body.comment;
    let db = await connectDB();
    let collection = db.collection(`comments`);
    await collection.insertOne(comment);
    res.status(200).send();
});
