import React, { Component } from "react";
import superagent from "superagent";
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
      const avatarImageDiv = this.getAvatar(user.avatar, false);
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
  getAvatar(avatar, active) {
    console.log("AVATAR:", avatar);
    // 0, 100, 200 are always blank
    // let sets = [[0, 1, 2, 3, 4], [100, 101, 102], [200, 201, 202]];
    let avatars = [];
    for (let i = 0; i < avatar.length; i += 1) {
      avatars.push(
        <img
          key={avatar[i]}
          src={this.getImage(avatar[i], active)}
          className="leader-avatar-image"
          alt={"layer" + i}
          styles={{
            zIndex: avatar[i],
            position: "absolute",
            top: 0,
            left: 0
          }}
        />
      );
    }
    return <div className="leader-avatar">{avatars}</div>;
  }
  render() {
    console.log(this.state.leaderlist);
    return <div className="leaderboard-holder">{this.state.leaderlist}</div>;
  }
}
export default Leaderboard;
