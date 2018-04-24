import axios from "axios"; // make Ajax request
import { FETCH_USER, FETCH_SURVEYS } from "./types";

/* creator： make a request to backend API and then communicate to our authentic
authReducer whether or not the user is currently signed in
The applyMiddleware(reduxThunk) in src/index.js is to inspect whatever value we return
from the action creator fetchUser. If reduxThunk sees that we return a function instead of
a normal action, reduxThunk will automatically call this function and pass in that
dispatch function as an argument
only when the axios.get() resolved, we dispatch action
*/
export const fetchUser = () => async dispatch => {
  const res = await axios.get("/api/current_user");
  dispatch({ type: FETCH_USER, payload: res.data }); // res.data contains googleid
};

/*
post to backend with token, after get response from server, update header content
*/
export const handleToken = token => async dispatch => {
  // res is new user model with the new numebr of credits
  const res = await axios.post("/api/stripe", token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async dispatch => {
  const res = await axios.post("/api/surveys", values);

  // push: navigate around application
  history.push("/surveys");
  dispatch({ type: FETCH_USER, payload: res.data });
};
// get a list of all surveys
// first arrow function => return asynchronous function
export const fetchSurveys = () => async dispatch => {
  const res = await axios.get("/api/surveys");
  dispatch({ type: FETCH_SURVEYS, payload: res.data });
};
