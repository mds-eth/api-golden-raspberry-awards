import express from "express";
import swaggerUi from 'swagger-ui-express';

require('express-async-errors');

import cors from "cors";

import "./database";

import routes from "./routes";
import swaggerDocument from './docs/swagger_output.json';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.createCors();
    this.createRoutes();

    this.configureSwagger();

    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(express.json());

    this.server.disable('x-powered-by');
  }

  createCors() {

    this.server.use(cors());
  }

  createRoutes() {
    this.server.use(routes);
  }

  configureSwagger() {
    this.server.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (err instanceof Error) {
        return res.status(400).json({ status: false, message: err.message });
      }

      if (process.env.NODE_ENV === 'development') {
        const errors = JSON.stringify(err);
        return res.status(500).json(errors);
      }
      return res.status(500).json({ status: false, message: 'Internal Server Error' })
    });
  }
}

export default new App().server;
