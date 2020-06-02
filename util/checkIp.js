const internalIps = [
  '::1',
  '127.0.0.1',
  '192.168.1.220',
  '::ffff:192.168.1.220',
];

exports.checkIp = (ip) => {
  if (internalIps.includes(ip)) return false;
  else return true;
};
