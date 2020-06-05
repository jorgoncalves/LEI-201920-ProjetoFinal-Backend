exports.catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      console.log(error);

      next(error);
    }
  };
};
