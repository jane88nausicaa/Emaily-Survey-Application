const passport = require("passport");
module.exports = app => {
  /* add route handler
whenever user come to this route, we want them into waterflow, whic is
entirely managed by passport: tell passport attempt to authenticate
the user use the strategy called google
*/
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"] // ask google to give us profile infor & email
    })
  );

  /* set request to google with the code
After google see response, the google strategy accessToken (in passport.js) will
execute the acessToken function is the opportunity to take the identifying user
infor and save it to our database

passport.authenticate("google") is middleware - a function takes incoming request
, it further authenticates the user (take code out of URL and fetch user profile
and the nit callas callback in googleStrategy)
After authentication, it passes request onto next middleware (req, res) => {}
*/
  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/surveys");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout(); // kill the cookie
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
