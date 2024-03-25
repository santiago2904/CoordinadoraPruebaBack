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
                    location: {
                        type: "string"
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
                    location: "cra 41#49-52, medellin, antioquia, colombia",
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
                    location: {
                        type: "string"
                    },
                    id_role: {
                        type: "integer"
                    }
                },
                example: {
                    name: "John Doe",
                    identification: "123456789",
                    birthdate: "1990-01-01",
                    email: "john.doe@example.com",
                    password: "password",
                    location: "cra 41#49-52, medellin, antioquia, colombia",
                    id_role: 1
                }
            },
            getAllUserData: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/getUserData"
                }
            },
            getEventData: {
                type: "object",
                properties: {
                    id: {
                        type: "integer"
                    },
                    name: {
                        type: "string"
                    },
                    description: {
                        type: "string"
                    },
                    start_date: {
                        type: "string",
                        format: "date"
                    },
                    end_date: {
                        type: "string",
                        format: "date"
                    },
                    location: {
                        type: "string"
                    },
                    max_attendees: {
                        type: "integer"
                    },
                    created_by: {
                        type: "integer"
                    },
                },
                example: {
                    id: 1,
                    name: "Evento 1",
                    description: "Evento de prueba",
                    start_date: "2021-01-01",
                    end_date: "2021-01-02",
                    location: "cra 41#49-52, medellin, antioquia, colombia",
                    max_attendees: 10,
                    created_by: 1,
                }
            },
            createEventData: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    description: {
                        type: "string"
                    },
                    start_date: {
                        type: "string",
                        format: "date"
                    },
                    end_date: {
                        type: "string",
                        format: "date"
                    },
                    location: {
                        type: "string"
                    },
                    max_attendees: {
                        type: "integer"
                    },
                    created_by: {
                        type: "integer"
                    },
                },
                example: {
                    name: "Evento 1",
                    description: "Evento de prueba",
                    start_date: "2021-01-01",
                    end_date: "2021-01-02",
                    location: "cra 41#49-52, medellin, antioquia, colombia",
                    max_attendees: 10,
                    created_by: 1,
                }
            },
            getAllEventsData: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/getEventData"
                }

            },
            dataPlaces: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string"
                        },
                        category: {
                            type: "string"
                        },
                        address: {
                            type: "string"
                        }
                    },
                    example: {
                        name: "Centro Formativo De Antioquia CEFA",
                        category: "high school, highschool, secondary school, school",
                        address: "cra 41#49-52, medellin, antioquia, colombia"
                    }

                }
            },
            createAttendeeData: {
                type: "object",
                properties: {
                    user_id: {
                        type: "integer"
                    },
                    event_id: {
                        type: "integer"
                    },
                    attendance_date: {
                        type: "string",
                        format: "date"
                    }
                },
                example: {
                    user_id: 1,
                    event_id: 1,
                    attendance_date: "2021-01-01"
                }
            },
            getCountAttendeesData: {
                type: "object",
                properties: {
                    total: {
                        type: "integer"
                    },
                    data: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                date: {
                                    type: "string",
                                    format: "date"
                                },
                                count: {
                                    type: "integer"
                                }
                            }
                        }
                    }
                },
                example: {
                    total: 10,
                    data: [
                        {
                            date: "2024-03-23",
                            count: 5
                        },
                        {
                            date: "2024-03-22",
                            count: 5
                        }
                    ]
                }
            },
            responseMessage: {
                type: "object",
                properties: {
                    status: {
                        type: "string"
                    },
                    message: {
                        type: "string"
                    }
                },
                example: {
                    status: "ok",
                    message: "Data processed successfully."
                }
            }
        }
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