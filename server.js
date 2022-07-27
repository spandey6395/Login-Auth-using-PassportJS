const express = require("express");
const app = express();
const db = require("./config/mongoose");
const expressLayouts = require("express-ejs-layouts");

//used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-strategy");
const MongoStore = require('connect-mongodb-session')(session);


//flash notifications

const flash = require("connect-flash");
const customMWare = require("./config/middleware");

require("dotenv").config();
const port = process.env.PORT  || 8000;

// middleware
app.use(express.urlencoded());

app.use(express.static("./assets"));

app.use(expressLayouts);
//extract styles and scripts from sub pages into layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//mongo store is used to store the session cookie in db
app.use(session({
  name: 'LoginWithPassport',
  secret: 'MastMola',
  saveUninitialized: false,
  resave: false,
  cookie: {
      maxAge: (1000 * 60 * 100),
  },
  store: new MongoStore(
      {
          uri: 'mongodb+srv://spandey6395:R43s8If0R4EpfraA@cluster0.mknlo.mongodb.net/Saurabh5678',
          collection: 'mySessions',
      },
      function (err) {
          console.log(err || ("Cookie Stored Success"));
      }
  )
}));

// for passport session
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// for flash middleware
app.use(flash());
app.use(customMWare.setFlash);

// use express router
app.use("/", require("./routes"));

//encrypt
app.use('/encrypt',(req,res)=>{
  let username = req.username
  let msg = req.message

  user && msg && (message = encrypt(message))
  !user && res.send({message: 'Invalid User'})
  !msg && res.send({message: 'Invalid message'})
  res.send({result: 'success', data: {message}})
})

const encrypt = (text = "")=>{
  console.log(text)
  return text.split("").reverse().join("");
}


app.listen(port, (err) => {
  if (err) console.log(`Error running the server: ${err}`);

  console.log(`Server is up and running on port: ${port}`);
});
