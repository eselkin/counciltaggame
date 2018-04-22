import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import levels from "./levels";
import a1 from "../../assets/fedora.svg";
import a2 from "../../assets/baseball.svg";
import a3 from "../../assets/beret.svg";
import a4 from "../../assets/cloche.svg";
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

  getImage(segment) {
    switch (segment) {
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
  findSegmentSection(components, segment) {
    for (let section of components) {
      if (section.includes(segment)) {
        return section;
      }
    }
  }

  changeComponent(event, segment) {
    let available_components = [[1, 2, 3, 4], [100, 101, 102]];
    let similar_components = this.findSegmentSection(
      available_components,
      segment
    );
    this.setState({ currentOption: segment });
    let images = similar_components.map(image => {
      return { id: image, image: this.getImage(image) };
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
            src={this.getImage(segment)}
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
          <div className="user-current-avatar">
            {"Click on an image to see what other options there are:"}
            {this.getAvatarComponents()}
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
