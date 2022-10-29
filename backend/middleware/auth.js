const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const User = require('../models/user');
verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token = null;
    if (authHeader) {
        token = authHeader.split(' ')[1];
    } else {
        res.sendStatus(401);
    }
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};
isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role === "admin") {
        return next();
    }
    return res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin
};
module.exports = authJwt;