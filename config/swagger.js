import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Horarios API',
      version: '1.0.0',
      description: 'A simple Express API for managing schedules',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The user ID.',
              example: '629f8b9b9b9b9b9b9b9b9b9b',
            },
            name: {
              type: 'string',
              description: 'The user name.',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              description: 'The user email.',
              example: 'johndoe@example.com',
            },
          },
        },
        ScheduleData: {
          type: 'object',
          properties: {
            schedules: {
              type: 'array',
            },
            activeScheduleIndex: {
              type: 'number',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/api/*.js'],
};

const specs = swaggerJsDoc(options);

export default specs;
