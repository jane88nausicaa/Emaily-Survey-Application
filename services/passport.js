const passport = require("passport"); // helper Express to authenticate
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");
// poll a model out of mongoose
const User = mongoose.model("users");
/* turn mongo model instance into id
user is the user we just pulled out of the database in callback function
done is callback function that we have to call after we have done some
work of nudging passport a lot
Take user model and put some identifying infor into the cookie
*/
passport.serializeUser((user, done) => {
  // user.id: user id identified by mongo ("_id")
  // cannot use profile.id since not every have googleid, some may login with facebook
  done(null, user.id);
});
/* turn id to mongo model instance
done function: we call after we have successfully turned the id back to user
pull the infor in the cookie back out & turn it back into a user
*/
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      /* Any time we access MongoDB, it is always an asynchromous action,
      to deal with this we assume that it returns a promise that will be
      resolved after googleId is found
      findOne return promise. existingUser is mongo model instance or null
      */
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        // we have a record with the given a profile ID. error message: null
        done(null, existingUser);
      }
      // create model instance & save to mongoDB
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);
