const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wellness Tracker API",
      version: "1.0.0",
      description: "API documentation for Wellness Tracker Backend",
    },
    servers: [
      {
        url: "https://wellness-tracker-backend-4if1.onrender.com",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
