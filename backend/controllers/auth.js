const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../models/user');

exports.signUp = async (req, res) => {
  // Save User to Database
  const userCheck = await User.findOne({ email : req.body.email});
  if (userCheck){
    return res.status(400).send({
        message: "Email is already in use!"
      });
  }
  try {
    const user = await User.create({
      email: req.body.email,
      username : req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      unreadMessages : 0
    });

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 99999999, 
    });


    res.send({ message: "User registered successfully!",
              token : token, userId : user._id  });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.signIn = async (req, res) => {
  try {
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) {
      return res.status(401).send({ message: "User Not found." });
    }
    const passwordChecker = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordChecker) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 99999999, 
    });
    
    return res.status(201).send({
      userId: user.id,
      email: user.email,
      role : user.role,
      token : token
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

