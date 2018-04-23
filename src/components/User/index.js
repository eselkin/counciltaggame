import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import levels from "./levels";
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
import Modal from "react-modal";
import superagent from "superagent";
import { updateScore } from "../../redux-actions/auth.action.creators";
import "./User.scss";
let HOST_AUTH;
if (process.env.STAGE === "prod") {
  HOST_AUTH = "https://engaged.today";
} else {
  HOST_AUTH = "http://localhost:8082";
}

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      radios: null,
      modalContent: null,
      optionSelected: null,
      currentOption: null
    };
    this.getImage = this.getImage.bind(this);
    this.getAvatarComponents = this.getAvatarComponents.bind(this);
    this.findSegmentSection = this.findSegmentSection.bind(this);
    this.changeComponent = this.changeComponent.bind(this);
    this.displayModalImages = this.displayModalImages.bind(this);
    this.cancelImage = this.cancelImage.bind(this);
    this.selectChanged = this.selectChanged.bind(this);
    this.changeImage = this.changeImage.bind(this);
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

  findSegmentSection(components, segment) {
    for (let section of components) {
      if (section.includes(segment)) {
        return section;
      }
    }
  }

  changeComponent(event, segment) {
    let available_components = [[0, 1, 2, 3, 4], [100, 101, 102, 103, 104]];
    let similar_components = this.findSegmentSection(
      available_components,
      segment
    );
    this.setState({ currentOption: segment });
    let images = similar_components.map(image => {
      return { id: image, image: this.getImage(image, false) };
    });
    this.displayModalImages(images);
  }

  cancelImage(evt) {
    evt.preventDefault();
    this.setState({
      showModal: false,
      modalContent: null,
      optionSelected: null,
      currentOption: null
    });
  }

  selectChanged(evt) {
    this.setState({ optionSelected: evt.target.value });
  }

  changeImage(evt) {
    evt.preventDefault();
    // console.log(this.state.optionSelected)
    if (!this.props.avatar.includes(this.state.optionSelected)) {
      superagent
        .post(HOST_AUTH + "/changeHat")
        .set("Authorization", "Bearer " + this.props.token)
        .set("Content-Type", "application/json")
        .send({
          old: parseInt(this.state.currentOption, 10),
          new: parseInt(this.state.optionSelected, 10)
        })
        .then(result => {
          if (result.body.success) {
            this.props.dispatch(updateScore(result.body));
            this.setState({
              showModal: false,
              optionSelected: null,
              currentOption: null,
              modalContent: null
            });
          }
        })
        .catch(err => {
          alert("could not change hat, sorry");
        });
    }
  }
  displayModalImages(images) {
    let radios = [];
    for (let image of images) {
      radios.push(
        <div className="radio-group">
          {(this.state.optionSelected === image.id ||
            this.props.avatar.includes(image.id)) && (
            <input
              type="radio"
              key={image.id}
              value={image.id}
              id={image.id}
              name="imageSelect"
              onChange={this.selectChanged}
              checked
            />
          )}
          {this.state.optionSelected !== image.id &&
            !this.props.avatar.includes(image.id) && (
              <input
                type="radio"
                key={image.id}
                value={image.id}
                id={image.id}
                name="imageSelect"
                onChange={this.selectChanged}
              />
            )}
          <div className="radio-label">
            <label htmlFor={image.id}>
              <img src={image.image} className="radio-image" alt={image.id} />
            </label>
          </div>
        </div>
      );
    }
    this.setState({
      radios,
      showModal: true,
      modalContent: (
        <form onSubmit={this.changeImage}>
          <div className="radios">
            <div className="radio-scroll">{radios}</div>
          </div>
          <button type="submit" className="change-image-button">
            Change Image
          </button>
          <button
            type="cancel"
            className="cancel-image-button"
            onClick={this.cancelImage}
          >
            Cancel
          </button>
        </form>
      )
    });
  }
  getAvatarComponents() {
    let components = [];
    for (let segment of this.props.avatar) {
      components.push(
        <div key={segment}>
          <img
            onClick={evt => {
              this.changeComponent(evt, segment);
            }}
            src={this.getImage(segment, false)}
            alt="hat"
            key={segment}
            className="user-avatar-component"
          />
        </div>
      );
    }
    return components;
  }
  render() {
    return (
      <div className="user-holder">
        <Modal
          isOpen={this.state.showModal}
          contentLabel="Modal"
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className="Content">{this.state.modalContent}</div>
        </Modal>
        <div className="user-avatar">
          <div className="user-avatar-info">
            You currently have {this.props.avatar.length} hat component. To get
            the next, you need{" "}
            {levels[this.props.avatar.length + 1] - this.props.score} more
            points.
          </div>
          <div className="user-current-avatar-holder">
            {"Click on an image to see what other options there are:"}
            <div className="user-current-avatar">
              {this.getAvatarComponents()}
            </div>
          </div>
        </div>
        <div className="logout">
          <a href="https://engaged.today/logout">Logout</a>
        </div>
      </div>
    );
  }
}
User = connect()(User);

export default withRouter(User);
