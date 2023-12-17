const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'My API',
        description: 'API Description',
    },
    host: 'localhost:5000',
    schemes: ['http'],
};

const outputFile = './src/swagger.json';
const endpointsFiles = ['./src/app.ts']; // compiled JavaScript files

swaggerAutogen(outputFile, endpointsFiles, doc);
