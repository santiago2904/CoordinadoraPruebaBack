require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { dbConnectMySql } = require('./config/mysql')
const app = express() // Motor de bases de datos a utilizar 
const swaggerUI = require("swagger-ui-express")
const openApiConfigration = require("./docs/swagger")

const allowedOrigins = [
    'http://localhost:4200',
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("ORIGEN:", origin)
            callback(new Error('Acceso no permitido por CORS'));
        }
    }
};

app.use(express.json());
app.use(express.static("storage"));

app.use(cors());

const port = process.env.PORT || 3000

app.use('/documentacion', swaggerUI.serve, swaggerUI.setup(openApiConfigration))


app.use("/api", require("./routes"));//TODO hace referencia al index.js de la carpeta routes


app.listen(port, () => {
    console.log('Tu app esta lista por http://localhost:' + port)
});

dbConnectMySql();