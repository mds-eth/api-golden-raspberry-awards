import { Router } from "express";

import AwardsController from "./controllers/AwardsController";
import { middlewareValidation } from "./middlewares/middlewareValidation";
import { awardsListSchema, awardsByYearSchema, awardsProjectionSchema } from "./validation/awardsValidation";

class Routes {
  constructor() {
    this.routes = Router();
    this.createRoutes();
  }

  createRoutes() {

    this.routes.get('/api/v1/awards-list', middlewareValidation(awardsListSchema), AwardsController.list);

    this.routes.get('/api/v1/awards-by-year', middlewareValidation(awardsByYearSchema), AwardsController.getMoviesByYear);
    this.routes.get('/api/v1/awards-projection', middlewareValidation(awardsProjectionSchema), AwardsController.projection);
  }
}

export default new Routes().routes;
