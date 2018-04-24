import { combineReducers } from "redux";
import { reducer as reduxForm } from "redux-form"; // import reducer function
import authReducer from "./authReducer";
import surveysReducer from "./surveysReducer";

/* the object passing in, whatever keys we provide to this object are going to
represent the keys that exist inside of our state object.
assigned authReducer to key auth. the key is that authReducer output will be
stored on in our state object maintained by Redux
*/
export default combineReducers({
  auth: authReducer, //auth state is being produced by the authReducer
  form: reduxForm,
  surveys: surveysReducer
});
