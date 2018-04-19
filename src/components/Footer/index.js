import React, { Component } from "react";
import hfla from "../../assets/hfla.svg";
import "./Footer.scss";

class Footer extends Component {
  render() {
    return <div className="footer-holder">Made with love during meetups for Hack for L.A. a brigade of Code for America<a href="https://hackforla.org"><img src={hfla} alt="hack for la" className="sponsorish"/></a></div>;
  }
}

export default Footer;