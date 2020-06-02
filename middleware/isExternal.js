const requestIp = require('request-ip');

module.exports = (req, res, next) => {
  const clientIp = requestIp.getClientIp(req);
  req.clientIp = clientIp;
  next();
};
