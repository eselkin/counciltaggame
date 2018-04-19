import React, { Component } from "react";
import { stack as Menu } from "react-burger-menu";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Tagging from "./components/Tagging";
import User from "./components/User";
import MainMenu from "./components/MainMenu";
import Leaderboard from "./components/Leaderboard";
import Footer from "./components/Footer";
import "./App.scss";
const Tough = require("tough-cookie");
const Store = new Tough.MemoryCookieStore();
const fetch = require("fetch-cookie")(
  require("isomorphic-fetch"),
  new Tough.CookieJar(Store)
);
global.fetch = fetch;
global.cookieStore = Store;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: 80,
      width: window.innerWidth,
      height: window.innerHeight,
      menuOpen: false,
      menuLinks: [
        { to: "/", contents: "Leaderboard", click: this.hideMenu },
        { to: "/login", contents: "Login", click: this.hideMenu },
        { to: "/signup", contents: "Signup", click: this.hideMenu }
      ]
    };
    this.resizeWindow = this.resizeWindow.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
  }
  hideMenu(evt) {
    this.setState({ menuOpen: false });
  }
  resizeWindow(evt) {
    if (typeof this.setState === "function") {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
  }
  componentWillMount() {
    window.addEventListener("resize", this.resizeWindow);
    this.resizeWindow();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeWindow);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.logged_in) {
      this.setState({
        menuLinks: [
          { to: "/", contents: "Leaderboard", click: this.hideMenu },
          { to: "/user", contents: nextProps.username, click: this.hideMenu },
          { to: "/tag", contents: "Tag Agendas", click: this.hideMenu }
        ]
      });
    } else {
      this.setState({
        menuLinks: [
          { to: "/", contents: "Leaderboard", click: this.hideMenu },
          { to: "/login", contents: "Login", click: this.hideMenu },
          { to: "/signup", contents: "Signup", click: this.hideMenu }
        ]
      });
    }
  }
  render() {
    return (
      <BrowserRouter>
        <div
          id="outer-container"
          className="App"
          ref={ref => {
            this.appScroll = ref;
          }}
        >
          <MainMenu
            username={this.props.username}
            avatar={this.props.avatar}
            menu={this.state.menuLinks}
            score={this.props.score}
          />

          {this.state.width < 640 && (
            <Menu
              pageWrapId={"page-wrap"}
              outerContainerId={"outer-container"}
              isOpen={this.state.menuOpen}
            >
              <div className="burger-holder">
                {this.state.menuLinks.map(link => {
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={link.click}
                      className={
                        window.location.pathname === link.to
                          ? "active-link"
                          : "link"
                      }
                    >
                      {link.contents}
                    </Link>
                  );
                })}
              </div>
            </Menu>
          )}
          <main id="page-wrap">
            {!this.props.logged_in && (
              <Switch>
                <Route
                  exact
                  path="/"
                  render={props => <Leaderboard props={props} />}
                />
                <Route
                  exact
                  path="/login"
                  render={props => <Login props={props} />}
                />
                <Route
                  exact
                  path="/signup"
                  render={props => <Signup props={props} />}
                />
              </Switch>
            )}
            {this.props.logged_in && (
              <Switch>
                <Route
                  exact
                  path="/"
                  render={props => (
                    <Leaderboard username={this.props.username} />
                  )}
                />

                <Route
                  exact
                  path="/tag"
                  render={props => <Tagging token={this.props.token} />}
                />
                <Route
                  exact
                  path="/user"
                  render={props => (
                    <User
                      username={this.props.username}
                      score={this.props.score}
                      avatar={this.props.avatar}
                      token={this.props.token}
                      dispatch={this.props.dispatch}
                    />
                  )}
                />
              </Switch>
            )}
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  console.log("APP STATE:", state);
  return {
    logged_in: state.auth.logged_in,
    signed_up: state.auth.signed_up,
    token: state.auth.token,
    score: state.auth.score,
    avatar: state.auth.avatar,
    username: state.auth.username,
    email: state.auth.email
  };
};
const mapDispatchToProps = dispatch => {
  return { dispatch };
};

App = connect(mapStateToProps, mapDispatchToProps)(App);
export default App;
