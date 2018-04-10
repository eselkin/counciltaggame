import React from "react";
import ReactDOM from "react-dom";
import { combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { auth } from "./redux-reducers/auth.reducers";
import registerServiceWorker from "./registerServiceWorker";
let store = createStore(combineReducers({ auth }));
// const unsubscribe = store.subscribe(() => console.log(store.getState()));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
