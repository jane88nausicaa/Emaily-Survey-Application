// take the token that got from frontend and exchanging it for an actual charge
// to the user's credit card
const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require("../middlewares/requireLogin");

module.exports = app => {
  /* route handler: only "/api/stripe" need user to be authenticated (requireLogin)
  2 arg -- response handler, which is our arrow function that gets called with
  the req and res object
  */
  app.post("/api/stripe", requireLogin, async (req, res) => {
    /* console.log(req.body); // display what the token
    create charge object: make a req over to Stripe API and tell it we want to
    finalize this transaction, build the user for 500 cents
    */
    const charge = await stripe.charges.create({
      amount: 500,
      currency: "usd",
      description: "$5 for 5 credits",
      source: req.body.id
    });
    // console.log(charge);
    // req.user is the user who pay $5 (passport.initialize() && session())
    req.user.credits += 5;
    const user = await req.user.save(); // save to DB, is asynchronous request
    // make sure that we actually repond to the request with the updated user
    res.send(user);
  });
};
