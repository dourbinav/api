const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
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
  const user=User.findOne({ username: req.body.username })
    
  try{ if (!user) {
        return res.status(401).json({
          msg: "user not exist",
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (!result) {
          return res.status(401).json({
            msg: "invalid credentials",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              username: user.username,
              email: user.email,
              phone: user.phone
            },
            "this is dummy text",
            {
              expiresIn: "24h",
            }
          );
          res.status(200).json({
            username: user.username,
            email: user.email,
            phone: user.phone,
            token: token,
          });
        }
      });
}catch(err){
  res.status(500).json({
    error: err,
    });
}
});

module.exports = router;
