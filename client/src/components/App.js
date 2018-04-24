/*
Apps.js: all the configuration around the different navigation states of our application
into this file. It is responsible for all the initial view layer setup

"capital A": if a given file is exploring a class or a react component of nay type,
be it a functional component or a class based component.
But if the file returns just a function or just a series of functions, we label it
with a lowercase (eg. index.js)
*/

import React, { Component } from "react";
/* BrowserRouter: brain of react router, tell react router how to behave, is the thing
looks like current URL and then changes a set of components that are visible on the screen
at any given time
Route: react component that is used to set up a rule between a certain route that the user
might visit inside an application and a set of components that will be actually visible
*/
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import Header from "./Header";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import SurveyNew from "./surveys/SurveyNew";

// class based component
class App extends Component {
  /* lifecycle method
  fetch the current user. the instance this component has been mounted or rendered
  onto the screen go in attempt to fetch the current user or figure out whether or
  not our current user is actually signed in
  */
  componentDidMount() {
    this.props.fetchUser();
  }
  render() {
    // jsx. BrowserRouter has at most one child
    // exact: if not when enter /surveys, we still see Landing on screen
    return (
      <BrowserRouter>
        <div className="container">
          <Header />
          <Route exact path="/" component={Landing} />
          <Route exact path="/surveys" component={Dashboard} />
          <Route path="/surveys/new" component={SurveyNew} />
        </div>
      </BrowserRouter>
    );
  }
}
/* 1 arg: map state to props arguments or the map state to prop function
2 arg: different action creators. assigned to the app component as props
so can be called in componentDidMount() above
*/
export default connect(null, actions)(App);
