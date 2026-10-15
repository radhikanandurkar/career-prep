const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'careerprep_super_secret_jwt_key_2026_secure', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
