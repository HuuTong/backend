const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const User = require("../../model/user/User");
const router = express.Router();

const AuthService = require("../../src/service/authService");
const service = new AuthService();


// register
router.post("/register", async (req, res) => {
  let params = req.body;

  service
    .register(params)
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send({
      success: false, data: [], message: err.message
    }))  
});

// login
router.post("/login", (req, res) => {
  let params = req.body;
 
  service
    .login(params)
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send({
      success: false, data: [], message: err.message
    }))  
});

// forget password
router.post("/forget-password", (req, res) => {
  let params = req.body;

  service
    .forgetPassword(params)
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send({
      success: false, data: [], message: err.message
    }))
});

// pasword reset 
router.post("/reset-password/:token", (req, res) => {
  let token = req.params.token;
  let params = req.body;

  service
    .resetPassword(params, token)
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send({
      success: false, data: [], message: err.message
    }))
})




module.exports = router;
