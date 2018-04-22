import React, { Component } from "react";
import superagent from "superagent";
import a1 from "../../assets/fedora.svg";
import a2 from "../../assets/baseball.svg";
import a3 from "../../assets/beret.svg";
import a4 from "../../assets/cloche.svg";

import "./Leaderboard.scss";
let HOST_AUTH;
if (process.env.STAGE === "prod") {
  HOST_AUTH = "https://engaged.today";
} else {
  HOST_AUTH = "http://localhost:8082";
}

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaderlist: null
    };
    this.getImage = this.getImage.bind(this);
    this.getAvatar = this.getAvatar.bind(this);
    this.processData = this.processData.bind(this);
  }
  processData(data) {
    let results = [];
    let i = 0;
    for (let user of data) {
      i += 1;
      // user has {username, score, avatar}
      const avatarImageDiv = this.getAvatar(user.avatar);
      if (!this.props.username || this.props.username !== user.username) {
        results.push(
          <div className="leader-user" key={user.username}>
            <div className="leader-place"> {i + "."} </div>
            {avatarImageDiv}
            <div className="leader-name">{user.username}</div>
            <div className="leader-score">{user.score}</div>
          </div>
        );
      } else {
        results.push(
          <div className="leader-user-you" key={user.username}>
            <div className="leader-place"> {i + "."} </div>
            {avatarImageDiv}
            <div className="leader-name">{user.username}</div>
            <div className="leader-score">{user.score}</div>
          </div>
        );
      }
    }
    this.setState({ leaderlist: <div className="leader-list">{results}</div> });
    console.log(this.state);
  }
  componentDidMount() {
    console.log(this.props);
    superagent
      .get(HOST_AUTH + "/getLeaderboard")
      .then(res => {
        if (res.body.success) {
          console.log("this processdata");
          this.processData(res.body.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getImage(id) {
    switch (id) {
      case 1:
        return a1;
      case 2:
        return a2;
      case 3:
        return a3;
      case 4:
        return a4;
      default:
        return a1;
    }
  }
  getAvatar(avatarlist) {
    // let sets = [[0, 1, 2], [100, 101, 102], [200, 201, 202]];
    let avatars = [];
    for (let i = 0; i < avatarlist; i += 1) {
      if ([1, 2, 3, 4].includes(avatarlist[i])) {
        avatars.push(
          <img
            key="base0"
            src={this.getImage(avatarlist[i])}
            alt="baselayer"
            styles={{ zIndex: avatarlist[i] }}
            className="leader-avatar-image"
          />
        );
      } else if ([100, 101, 102].includes(avatarlist[i])) {
      }
    }
    return <div className="leader-avatar">{avatars}</div>;
  }
  render() {
    console.log(this.state.leaderlist);
    return <div className="leaderboard-holder">{this.state.leaderlist}</div>;
  }
}
export default Leaderboard;
