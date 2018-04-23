import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import blank from "../../assets/blank.svg";
import a1 from "../../assets/fedora.svg";
import a1i from "../../assets/fedora-i.svg";
import a2 from "../../assets/baseball.svg";
import a2i from "../../assets/baseball-i.svg";
import a3 from "../../assets/beret.svg";
import a3i from "../../assets/beret-i.svg";
import a4 from "../../assets/cloche.svg";
import a4i from "../../assets/cloche-i.svg";
import b1 from "../../assets/flower1.svg";
import b2 from "../../assets/la.svg";
import b3 from "../../assets/law.svg";
import b4 from "../../assets/labow.svg";
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
      case 101:
        return b1;
      case 102:
        return b2;
      case 103:
        return b3;
      case 104:
        return b4;
      default:
        return blank;
    }
  }
  getAvatar(active) {
    // 0, 100, 200 are always blank
    // let sets = [[0, 1, 2, 3, 4], [100, 101, 102], [200, 201, 202]];
    let avatars = [];
    for (let i = 0; i < this.props.avatar.length; i += 1) {
      avatars.push(
        <img
          key={this.props.avatar[i]}
          src={this.getImage(this.props.avatar[i], active)}
          className="avatar-image"
          alt={"layer" + i}
          styles={{
            zIndex: this.props.avatar[i],
            position: "absolute",
            top: 0,
            left: 0
          }}
        />
      );
    }
    console.log("avatars", avatars);
    this.avatars = avatars;
    return (
      <div className="avatar">
        {this.avatars}
        <div className="avatar-username">{this.props.username}</div>
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
                    <div className="link-contents">
                      {link.to === "/user" &&
                        this.props.history.location.pathname === "/user" &&
                        this.getAvatar(true)}
                      {link.to === "/user" &&
                        this.props.history.location.pathname !== "/user" &&
                        this.getAvatar(false)}
                      {link.to !== "/user" && link.contents}
                    </div>
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
