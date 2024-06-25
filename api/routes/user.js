const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const checkauth = require("../middleware/checkauth");
const user = require("../models/user");

router.get("/",(req,res,next) => {
  res.status(200).json({
    msg:"successful"
  })
})

router.post("/signup", (req, res, next) => {
  
  User.findOne({email:req.body.email})
  .exec()
  .then((user) => {
    if (user) {
      return res.status(401).json({
        msg: "email already exist",
      });
    }
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          username: req.body.username,
          password: hash,
          phone: req.body.phone,
          email: req.body.email
        });
        user
          .save()
          .then((result) => {
            res.status(200).json({
              new_user: result,
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      }
    })
  })
  .catch((err) => {
    res.status(500).json({
      error: err,
    });
  });
});
router.post("/login", (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          msg: "user not exist",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
          return res.status(401).json({
            msg: "invalid credentials",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              username: user[0].username,
              email: user[0].email,
              phone: user[0].phone
            },
            "this is dummy text",
            {
              expiresIn: "24h",
            }
          );
          res.status(200).json({
            username: user[0].username,
            email: user[0].email,
            phone: user[0].phone,
            token: token,
          });
        }
      });
    })
    .catch((err) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
    });
});

module.exports = router;
