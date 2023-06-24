// HomeController.js

const intError = {}

intError.triggerError = (req, res, next) => {
  next(new Error('Intentional error'));
};

module.exports = intError;
  