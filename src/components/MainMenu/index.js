import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import a1 from "../../assets/fedora.svg";
import a1i from "../../assets/fedora-i.svg";
import a2 from "../../assets/baseball.svg";
import a2i from "../../assets/baseball-i.svg";
import a3 from "../../assets/beret.svg";
import a3i from "../../assets/beret-i.svg";
import a4 from "../../assets/cloche.svg";
import a4i from "../../assets/cloche-i.svg";
import "./MainMenu.scss";

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.getImage = this.getImage.bind(this);
    this.getAvatar = this.getAvatar.bind(this);
  }
  getImage(id, active) {
    switch (id) {
      case 1:
        if (active) {
          return a1i;
        } else {
          return a1;
        }
      case 2:
        if (active) {
          return a2i;
        } else {
          return a2;
        }
      case 3:
        if (active) {
          return a3i;
        } else {
          return a3;
        }
      case 4:
        if (active) {
          return a4i;
        } else {
          return a4;
        }
      default:
        if (active) {
          return a1i;
        } else {
          return a1;
        }
    }
  }
  getAvatar(active) {
    console.log(this.props);
    // let sets = [[1, 2, 3, 4], [100, 101, 102], [200, 201, 202]];
    let avatars = [];
    for (let i = 0; i < this.props.avatar.length; i += 1) {
      if ([1, 2, 3, 4].includes(this.props.avatar[i])) {
        avatars.push(
          <img
            key="base0"
            src={this.getImage(this.props.avatar[i], active)}
            className="avatar-image"
            alt="baselayer"
            styles={{ zIndex: this.props.avatar[i] }}
          />
        );
      } else if ([100, 101, 102].includes(this.props.avatar[i])) {
      }
    }
    console.log("avatars", avatars);
    this.avatars = avatars;
    return (
      <div className="avatar">
        {this.avatars}
        {this.props.username}
      </div>
    );
  }
  avatars = null;
  render() {
    if (window.innerWidth > 640) {
      return (
        <div className="main-menu-holder">
          <div className="main-menu">
            <a href="https://engage-santa-monica.herokuapp.com/">
              <img src={logo} alt="engage branding" className="menu-logo" />
            </a>
            {this.props.menu
              .map(link => {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={
                      this.props.history.location.pathname === link.to
                        ? "active-link"
                        : "link"
                    }
                  >
                    {link.to === "/user" &&
                      this.props.history.location.pathname === "/user" &&
                      this.getAvatar(true)}
                    {link.to === "/user" &&
                      this.props.history.location.pathname !== "/user" &&
                      this.getAvatar(false)}
                    {link.to !== "/user" && link.contents}
                  </Link>
                );
              })
              .reduce((prev, curr) => [prev, " ", curr])}
            <div className="score">Score: {this.props.score}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="main-menu-holder-center">
          <div className="main-menu">
            <img src={logo} alt="engage branding" className="menu-logo" />
          </div>
        </div>
      );
    }
  }
}
export default withRouter(MainMenu);
