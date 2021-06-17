var express = require('express');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var moment = require('moment')
const { body, validationResult } = require('express-validator');
var router = express.Router();
// jwt.decode(token[1]).specifier == "Login"
var encryption = require("./encryption");
var Authentication = require("./auth")
var db = require("../models");


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jay@yopmail.com', // here use your real email
    pass: '123'// put your password correctly (not in this question please)
  }
});

const Emailvalidation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passvalidation = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"

// User Registration

// {
//   "email":"jayb@gmail.com",
//   "password":"Jayss15@",
//   "confirm_password":"Jayss15@",
//   "role_id":"60af962c6b7bd3fdf7fe74a4"
// }
router.post("/api/users/signup", async (req, res, next) => {
  try {

    if (!req.body.email) {
      res.json({ 'res': '0', 'data': "Please enter proper email address." })
    } else if (!Emailvalidation.test(req.body.email)) {
      res.json({ 'res': '0', 'data': "Invalid email address." })
    } else if (!req.body.password.match(passvalidation)) {
      res.json({ 'res': '0', 'data': "Password must be atlest one number one special character and one capital letter." })
    } else if (req.body.password != req.body.confirm_password) {
      res.json({ 'res': '0', 'msg': "Password and confirm password not same." })
    } else if (!req.body.role_id) {
      res.json({ 'res': '0', 'msg': "Please enter role" })
    } else {
      var obj = {
        email: req.body.email,
        password: encryption.Encrypt(req.body.password),
        name: req.body.name,
      }
      var user_available = await db.users.findOne({ email: req.body.email })
      if (!user_available) {
        var user_data = await db.users.create(obj);
        var token = jwt.sign({ "user_id": user_data.id, "identifier": "user identifier", 'time': moment(new Date()).format('YYYY-MM-DD HH:mm:ss') }, process.env.Jwt_token);
        res.json({ 'res': '1', 'msg': "User has been register successfully." })
      } else {
        res.json({ 'res': '0', 'msg': "User is already register." })
      }

    }

  } catch (err) {
    res.json({ 'res': '0', 'msg': err });
  }
});

// Login

// {
//   "email":"jayb@gmail.com",
//   "password":"Jayss15@"
// }
router.post("/api/users/login", async (req, res, next) => {
  try {
    if (!req.body.email) {
      res.json({ 'res': '0', 'data': "Please enter proper email address." })
    } else if (!req.body.password) {
      res.json({ 'res': '0', 'data': "Please enter password." })
    } else {
      var user_data = await db.users.findOne({ email: req.body.email, is_active: 1 });
      if (user_data) {
        if (req.body.password == encryption.Decrypt(user_data.password)) {
          var user_data = await db.users.update({ _id: req.body.user_id })
          var access_token = jwt.sign({ "user_id": user_data._id, "identifier": "Login" }, process.env.Jwt_token, {
            expiresIn: "48h"
          });
          res.json({ 'res': '1', 'msg': 'Success', 'token': access_token })
        } else {
          res.json({ 'res': '0', 'msg': "Invalid password" });
        }
      } else {
        res.json({ 'res': '0', 'msg': "Invalid user name" });
      }
    }
  } catch (err) {
    res.json({ 'res': '0', 'msg': err });
  }
});

// Get user data
router.get("/api/users/me", Authentication, async (req, res, next) => {
  try {
    var user_data = await db.users.find({ _id: req.body.user_id })
    res.json({ 'res': '1', 'msg': "Success", 'data': user_data })
  } catch (err) {
    res.json({ 'res': '0', 'msg': err });
  }
})

// Get user data
router.get("/api/users/me", Authentication, async (req, res, next) => {
  try {
    var request = require("request");

    var options = {
      method: 'GET',
      url: 'https://api.chucknorris.io/jokes/random',
      headers:
      {
        'postman-token': '9fd9f020-5646-cdd6-c666-ab31cf80db92',
        'cache-control': 'no-cache'
      }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.json({ 'res': '1', 'msg': "Success", 'data': body })
      console.log(body);
    });

    
  } catch (err) {
    res.json({ 'res': '0', 'msg': err });
  }
})

// Logout
router.get("/Logout", Authentication, async (req, res, next) => {
  try {
    var auth = req.headers.authorization.toString().split(" ");
    var user_data = jwtr.destroy(auth[1])
    res.json({ 'res': '1', 'msg': "Success", 'data': user_data })
  } catch (err) {
    res.json({ 'res': '0', 'msg': err });
  }
})
module.exports = router;

