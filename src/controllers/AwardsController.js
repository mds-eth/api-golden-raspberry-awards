import AwardsService from "../service/AwardsService";

class AwardsController {
  async list(req, res) {

    const { page, size, winner, year } = req.query;

    const response = await AwardsService.listFilms({ page, size, winner, year });

    if (!response) {
      return res.status(400).json({
        status: false,
        message: "Dados não localizados para os parametros informados.",
      });
    }
    return res.status(200).json(response);
  }

  async getMoviesByYear(req, res) {

    const { year } = req.query;

    const response = await AwardsService.getMoviesByYearService(year);

    if (!response) {
      return res.status(400).json({
        status: false,
        message: "Dados não localizados para os parametros informados.",
      });
    }
    return res.status(200).json(response);
  }

  async projection(req, res) {

    const { projection } = req.query;

    const response = await AwardsService.listProjection(projection);

    if (!response) {
      return res.status(400).json({
        status: false,
        message: "Dados não localizados para os parametros informados.",
      });
    }
    return res.status(200).json(response);
  }
}

export default new AwardsController();
