import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import a1 from "../../assets/fedora.svg";
import a2 from "../../assets/baseball.svg";
import "./MainMenu.scss";

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.getImage = this.getImage.bind(this);
    this.getAvatar = this.getAvatar.bind(this);
  }
  getImage(id) {
    switch (id) {
      case 1:
        return a1;
      case 2:
        return a2;
      default:
        return a1;
    }
  }
  getAvatar() {
    console.log(this.props);
    // let sets = [[0, 1, 2], [100, 101, 102], [200, 201, 202]];
    let avatars = [];
    for (let i = 0; i < this.props.avatar.length; i += 1) {
      console.log("Avatar:", this.props.avatar[i]);
      if ([1, 2].includes(this.props.avatar[i])) {
        avatars.push(
          <img
            key="base0"
            src={this.getImage(this.props.avatar[i])}
            className="avatar-image"
            alt="baselayer"
            styles={{ zIndex: 0 }}
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
            <img src={logo} alt="engage branding" className="menu-logo" />
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
                    {link.to === "/user" && this.getAvatar()}
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
