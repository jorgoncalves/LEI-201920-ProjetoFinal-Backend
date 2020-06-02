const jwt = require('jsonwebtoken');
const { checkIp } = require('../util/checkIp');
const jwtSecret = 'supersecretsecret';

exports.createToken = (ip, id, email, name, isAdmin) => {
  const token = jwt.sign(
    {
      isExternal: checkIp(ip),
      userID: id,
      email,
      name,
      isAdmin,
    },
    jwtSecret,
    { expiresIn: '1h' }
  );
  return token;
};
