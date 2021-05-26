# Sistema de Carga de Datos del S2 y S3 - Frontend

Este sistema está diseñado para la carga y administración de datos del Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación (S2) y el Sistema de los Servidores Públicos y Particulares Sancionados (S3)

El sistema de carga de datos  permite a los generadores de datos transferir a las Secretarías Ejecutivas Anticorrupción Estatales los datos de los sistemas 2 y 3, que serán consultados desde la PDN a través de los mecanismos de comunicación desarrollados.

Por su parte, las Secretarías Ejecutivas Anticorrupción Estatales fungirán dentro del sistema como entidades concentradoras de los datos, sin embargo, el control y administración de los mismos será responsabilidad de los generadores/proveedores de datos.

## Dependencias 

| Dependencia | Versión |
|----------------|-------------------------------|
| @date-io/date-fns | ^1.3.13 | 
| @date-io/moment | ^1.3.13 | 
| @material-ui/core | ^4.11.1 | 
| @material-ui/icons | ^4.9.1 | 
| @material-ui/lab | ^4.0.0-alpha.56 | 
| @material-ui/pickers | ^3.2.10 | 
| @testing-library/jest-dom | ^5.11.5 | 
| @testing-library/react | ^11.1.0 | 
| @testing-library/user-event | ^12.1.10 | 
| @types/material-ui | ^0.21.8 | 
| axios | ^0.18.0 | 
| body-parser | ^1.18.3 | 
| bootstrap | ^4.1.3 | 
| ckey | ^1.0.2 | 
| cors | ^2.8.4 | 
| date-fns | ^2.21.1 | 
| dotenv | ^8.2.0 | 
| dotenv-webpack | ^6.0.0 | 
| express | ^4.16.3 | 
| final-form | ^4.20.1 | 
| final-form-arrays | ^3.0.2 | 
| find-config | ^1.0.0 | 
| history | ^4.7.2 | 
| i | ^0.3.6 | 
| ibm-openapi-validator | ^0.31.1 | 
| js-yaml | ^3.14.0 | 
| jsonwebtoken | ^8.5.1 | 
| md5 | ^2.2.1 | 
| moment | ^2.29.1 | 
| moment-timezone | ^0.5.33 | 
| mongoose | ^5.9.26 | 
| mongoose-paginate-v2 | ^1.3.9 | 
| mui-rff | ^2.5.6 | 
| npm | ^7.11.1 | 
| react | ^17.0.1 | 
| react-csv | ^2.0.3 | 
| react-dom | ^17.0.1 | 
| react-final-form | ^6.5.2 | 
| react-final-form-arrays | ^3.1.3 | 
| react-final-form-listeners | ^1.0.3 | 
| react-number-format | ^4.4.4 | 
| react-redux | ^7.2.2 | 
| react-router | ^5.2.0 | 
| react-router-dom | ^5.2.0 | 
| react-scripts | 4.0.0 | 
| react-spinners | ^0.9.0 | 
| redux | ^4.0.0 | 
| redux-form | ^8.3.7 | 
| redux-logger | ^3.0.6 | 
| redux-saga | ^1.1.3 | 
| tslib | ^2.0.3 | 
| underscore | ^1.12.0 | 
| uuid | ^3.3.2 | 
| web-vitals | ^0.2.4 | 
| webpack | ^4.17.2 | 
| yaml-schema-validator | ^1.2.2 | 
| yup | ^0.31.0| 

## Primeros pasos

### Descargar repositorio
```bash
git clone https://github.com/PDNMX/piloto_sistema_frontend.git
```

### Variables de entorno
```bash
vim .env
```
```bash
URLAPI=
PORTOAUTH=
PORTAPI=
CLIENTID=
CLIENTSECRET=
```
### Habilitar acceso desde cualquier IP
Edite el archivo <b>webpack.config.js</b>
```bash
vim webpack.config.js
```
En la sección <b>devServer</b>, modifique el valor de <b>Host</b> para que se vea como en el siguiente ejemplo
```JavaScript
 devServer: {
    	host:'0.0.0.0',
    	port: 3000,
    	historyApiFallback: true
	},
```




### Archivo docker-compose.yml, para agregar junto a los demás servicios

Si está siguiendo la guía puede deberá agregar la siguiente sección a su archivo docker-compose.yml general.

```YAML
  frontend:
    restart: always
    container_name: frontend
    build:
      context: piloto_sistema_frontend
      dockerfile: Dockerfile
    ports:
      - 3000:3000
```

### Archivo docker-compose.yml, para usar de forma independiente
Si lo que desea es hacer un despliegue independiente puede crear un archivo docker-compose.yml dentro de la carpeta del código.
```YAML
version: '3.1'
services:
  frontend:
    restart: always
    container_name: frontend
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - 3000:3000
```

### Construir el contenedor
```bash
docker-compose build frontend
```

### Iniciar el contenedor
```bash
docker-compose up -d frontend
```

### Consultar los logs
```bash
docker-compose logs -f frontend
```
