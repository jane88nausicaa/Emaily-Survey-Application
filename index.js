/* const express = require("express");
require() to get access to the express library
use commonjs modules on the server side
since at present the nodejs rutime only has support for commonjs modules.
common js modules is a system implemneted in nodejs for requiring or
sharing code between diffrent files

if use <import express from 'express'>, its ES2015 modules.
nodejs has no support for it.
On the react side we use ES2015
*/

/* app const app = express();
used to set up configuration that will listen for incoming
requests that being routed to the Express side of the out
from the node side and then route those requests on to diffrent
route  handlers
*/

/* route handler
app.get("/", (req, res) => {
  res.send({ bye: "buddy" });
});
get(): create new route handler
/: watch for requests trying to access '/' (localhost:5000/)
req: object representing the incoming request
res: object representing the outgoing response
res.send({ hi: "there" }): immediately send some JSON data back
      to whoever made this request
*/
const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
require("./models/User"); // put this before passport
require("./models/Survey");
require("./services/passport");

mongoose.connect(keys.mongoURI);
/*
const authRoutes = require("./routes/authRoutes");
const app = express();
authoRoutes(app);
above can be replace as below
*/
const app = express();

/* app.use() are middleware inside of our application
middleware are small functions that used to modify incoming requests to
our app before they are send off to route handlers
*/

// middleware parse the body then assign it to req.body property of the incoming
// request object
app.use(bodyParser.json());
// enable cookies
app.use(
  cookieSession({
    // how long cookie can exist inside browser before automatically expired
    // 30 day: milliseconds
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // key to encrypt cookie
    keys: [keys.cookieKey]
  })
);
// tell passport to use cookies to manage authentication
app.use(passport.initialize());
app.use(passport.session());
// reuire() return a function, then call this function with app object
require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);
require("./routes/surveyRoutes")(app);

// run only in production (Heroku)
if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets like our main.js, or main.class
  // if any get request comes in we do not understand what it is lookin for,
  // then look to the client/build dir
  app.use(express.static("client/build"));
  // Express will serve up the index.html if it doesn't recognize the route
  // if no file in client/build dir
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// if not find the environment val provided  by Heroku, set port to 5000
const PORT = process.env.PORT || 5000;
// tell the node to listen to port 5000
app.listen(PORT);
