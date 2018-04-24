//middleware: check if sign in.   401 -- Unauthorized
//next: function that we call when our middleware is complete, pass onto next middleware
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: "You must log in!" });
  }

  next(); // if good, continue to the actually request handler
};
