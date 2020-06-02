const jwt = require('jsonwebtoken');

const jwtSecret = 'supersecretsecret';

exports.createToken = (ip, id, email, name) => {
  const token = jwt.sign(
    {
      userID: id,
      email: email,
      name: name,
      isExternal: checkIp(ip),
    },
    jwtSecret,
    { expiresIn: '1h' }
  );
  return token;
};

const internalIps = [
  '::1',
  '127.0.0.1',
  '192.168.1.220',
  '::ffff:192.168.1.220',
];

const checkIp = (ip) => {
  if (internalIps.includes(ip)) return false;
  else return true;
};
