# Proyecto de API Node.js

Este proyecto consiste en una API desarrollada en Node.js que proporciona servicios para interactuar con una base de datos MySQL y una instancia de Node-RED.

### Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno en un archivo `.env` en la raíz del proyecto:

este es un ejemplo de como debería ser, está con el valor de las variables con intención de que se pruebe con los mismos valores para testear la prueba 
```dotenv
PORT=3001
MAPBOX_TOKEN=sk.eyJ1Ijoic2FwYWxhY2lvYTE1MDYiLCJhIjoiY2x1NGloZ2phMTk1ZzJrbzZhcnpiY3N5cyJ9.qzHHBwicO9lY6yxkCLR2Tw
PUBLIC_URL=http://localhost:3001
EMAIL_SUPORT=pruebacoordinadoramailer@gmail.com
EMAIL_SUPORT_PASS=zarco1234
JWT_SECRET=LlaveMaestra
JWT_SECRET_RESET=LlaveMaestra*
MYSQL_DATABASE=coordinadora_prueba
MYSQL_USER=root
MYSQL_HOST=host.docker.internal
ENGINE_DB=mysql
MYSQL_PASSWORD=zarco
```

## Swagger
La documentación de la API se encuentra disponible en la ruta `/documentacion` de tu servidor. Puedes acceder a ella desde [http://localhost:3001/documentacion/](http://localhost:3001/documentacion/). 

## Comandos para Ejecutar el Proyecto
1. **Construir la Imagen del Contenedor**: El siguiente comando construirá una imagen llamada `api-coordinadora` utilizando el Dockerfile presente en el directorio actual (`.`).
    ```bash
    docker build -t api-coordinadora .
    ```

2. **Inicializar Docker Swarm**: Este comando inicializará un clúster de Docker Swarm en el nodo actual.
    ```bash
    docker swarm init
    ```

3. **Despliegue de la Aplicación en Docker Swarm**: Este comando despliega la aplicación definida en el archivo docker-compose.yml en un clúster de Docker Swarm con el nombre coordinadora. Los servicios desplegados se ejecutarán como una aplicación distribuida en el clúster.
    ```bash
     docker stack deploy -c docker-compose.yml coordinadora
    ```
4. **Ver los Servicios en el Stack**: Este comando mostrará información sobre los servicios del stack llamado `coordinadora` en el clúster de Docker Swarm.
    ```bash
    docker stack ps coordinadora
    ```
5. **Manejo de Errores**: En caso de que ocurra un error durante el despliegue o funcionamiento de la aplicación, puedes detener temporalmente las réplicas del servicio api estableciendo su cantidad en 0 y luego volver a configurarlo en 5 para reiniciar el servicio. Esto se puede lograr mediante los siguientes comandos:
    ```bash
    docker service scale coordinadora_api=0
    docker service scale coordinadora_api=5
    ```

## Docker Compose
El archivo `docker-compose.yml` describe los servicios que componen tu aplicación y cómo se ejecutan. aquí una muestra de como debería ser el  `docker-compose.yml`:

```yaml
services:
  mysql:
    image: mysql
    container_name: mysql-container
    environment:
      MYSQL_ROOT_PASSWORD: 'zarco'
      MYSQL_DATABASE: 'coordinadora_prueba'
    ports:
      - "3306:3306"
  nodered:
    image: nodered/node-red
    container_name: nodered-container
    ports:
      - "1880:1880"
    depends_on:
      - mysql
  api:
    image: api-coordinadora
    container_name: api-coordinadora
    ports:
      - "3001:3001"
    deploy:
      replicas: 5
    depends_on:
      - mysql
      - nodered
```

Este archivo define tres servicios: mysql, nodered y api. El servicio api tiene cinco réplicas y depende de los servicios mysql y nodered.

## Archivo datos.txt

En la raíz del proyecto se encuentra un archivo llamado `datos.txt`. Este archivo contiene los scripts SQL para crear las tablas necesarias de la base de datos y también cuenta con inserciones de datos para efectos de prueba.

## Plantilla de Excel
La plantilla de Excel se encuentra en la raíz del proyecto con el nombre `template-upload.xlsx`. El endpoint para la carga de datos se puede encontrar en  ` localhost:3001/api/events/excel/id`.

## Configuración de Node-RED
Antes de importar el flujo `node-flow.json` en Node-RED, asegúrate de instalar el nodo `node-red-node-email`. Puedes hacerlo desde la interfaz de Node-RED en la pestaña "Manage palette".

El archivo `node-flow.json` se encuentra en la raíz del proyecto y contiene un flujo de Node-RED. Este flujo espera una solicitud POST en la ruta `/send-email` (`http://localhost:1880/send-email`). El cuerpo de la solicitud debe contener los siguientes datos:

```json
{
    "destinationEmail":"santiagopalacioalzate@gmail.com",
    "subjectEmail":"test",
    "textEmail":"this is a test from node-red"
}
```
Además, debes configurar el nodo de correo electrónico (email) en Node-RED con las siguientes credenciales:

Correo Electrónico: pruebacoordinadoramailer@gmail.com
Contraseña: kovr wuyk fyij vulk

este flujo es util para el envío de notificiones a los usuarios

## Con estos pasos, deberías poder configurar y ejecutar el proyecto 

    
