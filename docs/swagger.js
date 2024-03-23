const swaggerJsdoc = require("swagger-jsdoc");
const PUBLIC_URL = process.env.PUBLIC_URL;
/**
 * API Config Info
 */

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Documentación Api eventos coordinadora",
        version: "1.0.0",
        contact: {
            email: "santiagopalacioalzate@gmail.com@gmail.com"
        }

    },
    servers: [
        {
            url: `${PUBLIC_URL}/api`,
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer"
            }
        },
        schemas: {

        },
    },
};

/**
 * Opciones
 */
const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"],
};

const openApiConfigration = swaggerJsdoc(options);

module.exports = openApiConfigration;