import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import User from './schemas/model.user';
const mongoose = require('mongoose');
const yaml = require('js-yaml')
const fs = require('fs');
const SwaggerClient = require('swagger-client');
var Validator = require('swagger-model-validator');
var validator = new Validator(SwaggerClient);
var swaggerValidator = require('swagger-object-validator');


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


async function validateSchema(doc,schema,validacion){
     let result =  await validacion.validateModel(doc, schema);
     if(result){
        let objError={};
        let arrayErrors = result.errorsWithStringTypes();
        let textErrors;
        objError["docId"]= doc.id;
        objError["valid"] =  arrayErrors.length === 0 ? true : false;
        objError["errorCount"]= arrayErrors.length;

        let errors= [];
        for(let error of arrayErrors){
            let obj={};
            obj["typeError"]= error.errorType;
            let path = "";
            for(let ruta of error.trace){
                path = path+ ruta.stepName + "/";
            }
            obj["pathError"]= path;
            errors.push(obj);
        }
        objError["errors"]= errors;
        objError["errorsHumanReadable"]= result.humanReadable();
        return objError;
    }
}

app.post('/validateSchemaS2',async (req,res)=>{
    let fileContents = fs.readFileSync( path.resolve(__dirname, '../app/resource/openapis2.yaml'), 'utf8');
    let data = yaml.safeLoad(fileContents);
    let schemaS2 =  data.components.schemas.respSpic_inner;
    let validacion = new swaggerValidator.Handler();

    let newdocument = req.body;
    let respuesta=[];
    if(Array.isArray(newdocument)){
        for (let doc of newdocument){
            respuesta.push(await validateSchema(doc,schemaS2,validacion));
        }
    }else{
            respuesta.push(await validateSchema(newdocument,schemaS2,validacion));
    }
    res.status(200).json(respuesta);
});


app.post('/create/user',async (req,res)=>{
   console.log(req.body);
   try {
       const alldocs = await User.find({});
       const nuevoUsuario = new User(req.body);
       let savedUser = await nuevoUsuario.save();
       res.status(200).json("OK");
   }catch (e) {
       console.log(e);
   }

});


app.post('/getUsers',async (req,res)=>{
    try {

        let sortObj = req.body.sort  === undefined ? {} : req.body.sort;
        let page = req.body.page === undefined ? 1 : req.body.page ;  //numero de pagina a mostrar
        let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
        let query = req.body.query === undefined ? {} : req.body.query;
        console.log({page :page , limit: pageSize, sort: sortObj});
        const paginationResult = await User.paginate(query, {page :page , limit: pageSize, sort: sortObj}).then();
        let objpagination ={hasNextPage : paginationResult.hasNextPage, page:paginationResult.page, pageSize : paginationResult.limit, totalRows: paginationResult.totalDocs }
        let objresults = paginationResult.docs;

        let objResponse= {};
        objResponse["pagination"] = objpagination;
        objResponse["results"]= objresults;

        res.status(200).json(objResponse);
    }catch (e) {
        console.log(e);
    }

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
