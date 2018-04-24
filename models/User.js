const mongoose = require("mongoose");
// poll Schema property out of this mognoose object
const { Schema } = mongoose; // const Schema = mongoose.Schema;
// create a schema indicate what the user looks like
const userSchema = new Schema({
  googleId: String,
  credits: { type: Number, default: 0 }
});
/* create a model class
tell mongo to create a new collection called users
only create if not exist, not overwrite
*/
mongoose.model("users", userSchema); // load schema into mongoose
