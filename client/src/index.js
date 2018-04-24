/* This top level index.js
responsible for all of our redux setup, where all kind of data setup
*/
import "materialize-css/dist/css/materialize.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";

import App from "./components/App";
import reducers from "./reducers";

import axios from "axios";
window.axios = axios;

/* create action creator
where we initiate change inside of the redux side of our application. So they are
used to modify the state that is contained inside of a redux store
see actions/index.js
*/

/*
1 arg: all the different reducers that we have inside our application
2 arg: inital state of my application
3 arg: middleware
*/
const store = createStore(reducers, {}, applyMiddleware(reduxThunk));
/* 2 args: (root component, where render the component to inside DOM)
1: a component instance created by jsx
2: reference to an existing DOM node inside of HTML document
  (public, index.html, <div id="root"></div>)
Provider: a react component that knows how to read changes from our redux store
any time the redux store gets some new states produced insdie of it. The Provider
will inform all its children component.
So everything App renders that some new state is available and it will update all
of different components with the new state
pass atore as a prop.
*/
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
