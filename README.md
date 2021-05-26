# Sistema de Carga de Datos del S2 y S3 - Frontend

Este sistema está diseñado para la carga y administración de datos del Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación (S2) y el Sistema de los Servidores Públicos y Particulares Sancionados (S3)

El sistema de carga de datos  permite a los generadores de datos transferir a las Secretarías Ejecutivas Anticorrupción Estatales los datos de los sistemas 2 y 3, que serán consultados desde la PDN a través de los mecanismos de comunicación desarrollados.

Por su parte, las Secretarías Ejecutivas Anticorrupción Estatales fungirán dentro del sistema como entidades concentradoras de los datos, sin embargo, el control y administración de los mismos será responsabilidad de los generadores/proveedores de datos.

## Tecnologías utilizadas

|Tecnología|Versión|Descripción|
|----------------|-------------------------------|
|Node.js|12.18.2|Entorno base de JavaScript, se usa como motor de ejecución para otras tecnologías del proyecto.|
|Express.js|4.16.3|Se usa como servidor para las solicitudes de API REST|
|React |17.0.1|Biblioteca JavaScript de código abierto diseñada para crear interfaces de usuario, con el objetivo de facilitar el desarrollo de aplicaciones en una sola página.|
|Mongoose|5.9.26|Funciona como biblioteca para realizar la conexión e interacción con la base de datos.|
|Webpack|4.17.2|Empaquetador de módulos.|
|Babel|7.0.0|Herramienta que nos permite transformar el código JS|
|Redux|4.0.0|Manejo del estado de las variables en React|
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
