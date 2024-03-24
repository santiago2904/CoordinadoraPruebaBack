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
            getUserData: {
                type: "object",
                properties: {
                    id: {
                        type: "integer"
                    },
                    name: {
                        type: "string"
                    },
                    identification: {
                        type: "string"
                    },
                    birthdate: {
                        type: "string"
                    },
                    email: {
                        type: "string"
                    },
                    longitude: {
                        type: "number"
                    },
                    latitude: {
                        type: "number"
                    },
                    rol: {
                        type: "string"
                    }
                },
                example: {
                    id: 1,
                    name: "John Doe",
                    identification: "123456789",
                    birthdate: "1990-01-01",
                    email: "john.doe@example.com",
                    longitude: -74.005912,
                    latitude: 40.712865,
                    rol: "Admin"
                }
            },
            createUserData: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    identification: {
                        type: "string"
                    },
                    birthdate: {
                        type: "string",
                        format: "date"
                    },
                    email: {
                        type: "string"
                    },
                    password: {
                        type: "string"
                    },
                    longitude: {
                        type: "number",
                    },
                    latitude: {
                        type: "number"
                    },
                    id_rol: {
                        type: "integer"
                    }
                },
                example: {
                    name: "John Doe",
                    identification: "123456789",
                    birthdate: "1990-01-01",
                    email: "john.doe@example.com",
                    password: "password",
                    longitude: -74.005912,
                    latitude: 40.712865,
                    id_rol: 1
                }
            },
            getAllUserData: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/getUserData"
                }
            },

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