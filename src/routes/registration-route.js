var express = require("express");
var router = express.Router();
var db = require("./../../config/db.config");

// to display registration form
router.get("/register", function (req, res, next) {
  res.render("registration-form");
});

// to store user input detail on post request
router.post("/register", function (req, res, next) {
  console.log(req.body);
  inputData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email_address: req.body.email_address,
    gender: req.body.gender,
    password: req.body.password,
    confirm_password: req.body.confirm_password,
  };
  // check unique email address
  var sql = "SELECT * FROM users WHERE email_address =?";
  db.query(sql, [inputData.email_address], function (err, data, fields) {
    if (err) throw err;
    if (data.length > 0) {
      var msg = inputData.email_address + "was already exist";
    } else if (inputData.confirm_password != inputData.password) {
      var msg = "Password & Confirm Password is not Matched";
    } else {
      // save users data into database
      var sql = "INSERT INTO users SET ?";
      delete inputData.confirm_password;
      db.query(sql, inputData, function (err, data) {
        console.log('err', err);
        console.log('data',data);
        if (err) throw err;
      });
      var msg = "Your are successfully registered";
    }
    res.render("registration-form", { alertMsg: msg });
  });
});
module.exports = router;
