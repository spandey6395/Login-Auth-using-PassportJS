const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

require("dotenv").config();

//tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID: process.env.Client_Id,
      clientSecret: process.env.Client_Secret,
      callbackURL: process.env.Callback_URL
    },
    (accessToken, refreshToken, profile, done) => {
      //find a user
      User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
        if (err) {
          console.log("Error in google strategy passport", err);
          return;
        }

        // console.log(profile);

        if (user) {
          //if found, set this as req.user
          return done(null, user);
        } else {
          //if not found, create user and set it as req.user
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            },
            (err, user) => {
              if (err) {
                console.log("Error in creating user!", err);
                return;
              }

              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
