export const middlewareValidation = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.query);
    return next();
  } catch (err) {
    return res.status(400).json({ status: false, message: err.message });
  }
};