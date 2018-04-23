import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import superagent from "superagent";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import { withFormik } from "formik";
import { updateScore } from "../../redux-actions/auth.action.creators";
import Modal from "react-modal";
import loading from "../../assets/loading.svg";
import "./Tagging.scss";
let HOST_AUTH;
if (process.env.STAGE === "prod") {
  HOST_AUTH = "https://engaged.today";
} else {
  HOST_AUTH = "http://localhost:8082";
}

const styles = {
  modalStyle: {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(120, 60, 120, 0.85)",
      textAlign: "center"
    },
    content: {
      position: "absolute",
      top: "15vh",
      left: "5vw",
      border: "none",
      background: "rgba(0,0,0,0.9)",
      width: "80vw",
      height: "60vh",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      borderRadius: "8px",
      outline: "none",
      padding: "20px",
      textAlign: "center"
    }
  }
};

// component function
const TaggingForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <form onSubmit={handleSubmit} className="tag-form">
    <div className="tag-form-tags">
      <div className="tag-form-column">
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Community"
              onChange={handleChange}
              value={values.Community}
            />
          </div>
          <div className="tag-form-label">Community</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Learning"
              onChange={handleChange}
              value={values.Learning}
            />
          </div>
          <div className="tag-form-label">Learning</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Health"
              onChange={handleChange}
              value={values.Health}
            />
          </div>
          <div className="tag-form-label">Health</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Economic"
              onChange={handleChange}
              value={values.Economic}
            />
          </div>
          <div className="tag-form-label">Economic opportunity</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Responsive"
              onChange={handleChange}
              value={values.Responsive}
            />
          </div>
          <div className="tag-form-label">Responsive Government</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Environment"
              onChange={handleChange}
              value={values.Environment}
            />
          </div>
          <div className="tag-form-label">Environment</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Sustainability"
              onChange={handleChange}
              value={values.Sustainability}
            />
          </div>
          <div className="tag-form-label">Sustainability</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Sanitations"
              onChange={handleChange}
              value={values.Sanitation}
            />
          </div>
          <div className="tag-form-label">Sanitation</div>
        </div>
      </div>
      <div className="tag-form-column">
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Public"
              onChange={handleChange}
              value={values.Public}
            />
          </div>
          <div className="tag-form-label">Public Safety</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Parks"
              onChange={handleChange}
              value={values.Parks}
            />
          </div>
          <div className="tag-form-label">Parks &amp; Recreation</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Free"
              onChange={handleChange}
              value={values.Free}
            />
          </div>
          <div className="tag-form-label">Free Speech</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Housing"
              onChange={handleChange}
              value={values.Housing}
            />
          </div>
          <div className="tag-form-label">Housing</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Mobility"
              onChange={handleChange}
              value={values.Mobility}
            />
          </div>
          <div className="tag-form-label">Mobility</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Pets"
              onChange={handleChange}
              value={values.Pets}
            />
          </div>
          <div className="tag-form-label">Pets</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Zoning"
              onChange={handleChange}
              value={values.Zoning}
            />
          </div>
          <div className="tag-form-label">Zoning</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="Infrastructure"
              onChange={handleChange}
              value={values.Infrastructure}
            />
          </div>
          <div className="tag-form-label">Infrastructure</div>
        </div>
        <div className="tag-form-group">
          <div className="tag-form-checkbox">
            <input
              type="checkbox"
              name="None"
              onChange={handleChange}
              value={values.None}
            />
          </div>
          <div className="tag-form-label">None of these tags fit</div>
        </div>
      </div>
    </div>
    <button type="submit" disabled={isSubmitting}>
      Submit
    </button>
  </form>
);

const FormikTagForm = withFormik({
  // Transform outer props into form values
  mapPropsToValues: props => ({
    Community: false,
    Learning: false,
    Health: false,
    Economic: false,
    Responsive: false,
    Environment: false,
    Sustainability: false,
    Public: false,
    Parks: false,
    Free: false,
    Housing: false,
    Mobility: false,
    Pets: false,
    Zoning: false,
    Infrastructure: false,
    Sanitation: false,
    None: false
  }),
  // Add a custom validation function (this can be async too!)
  validate: (values, props) => {
    const errors = {};
    return errors;
  },
  handleSubmit: (values, props) => {
    props.props.handleSubmit(values, props, 0, 4);
  }
})(TaggingForm);

class Tagging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: null,
      title: null,
      recommendations: null,
      _id: null
    };
    this.formHandler = this.formHandler.bind(this);
    this.shouldExpand = this.shouldExpand.bind(this);
  }
  dictToArray(dict) {
    let tags = [];
    if (dict.Community) {
      tags.push("Community");
    }
    if (dict.Economic) {
      tags.push("Economic opportunity");
    }
    if (dict.Environment) {
      tags.push("Environment");
    }
    if (dict.Free) {
      tags.push("Free Speech");
    }
    if (dict.Health) {
      tags.push("Health");
    }
    if (dict.Housing) {
      tags.push("Housing");
    }
    if (dict.Infrastructure) {
      tags.push("Infrastructure");
    }
    if (dict.Learning) {
      tags.push("Learning");
    }
    if (dict.Mobility) {
      tags.push("Mobility");
    }
    if (dict.Parks) {
      tags.push("Parks & Recreation");
    }
    if (dict.Pets) {
      tags.push("Pets");
    }
    if (dict.Public) {
      tags.push("Public Safety");
    }
    if (dict.Responsive) {
      tags.push("Responsive government");
    }
    if (dict.Sanitation) {
      tags.push("Sanitation");
    }
    if (dict.Sustainability) {
      tags.push("Sustainability");
    }
    if (dict.Zoning) {
      tags.push("Zoning");
    }
    if (dict.None) {
      tags = [];
    }
    return tags;
  }
  formHandler(evt, formProps, tries, maxtries) {
    console.log(evt);
    this.displayPending();
    let tags = this.dictToArray(evt);
    if (this.state._id !== null) {
      superagent
        .post(HOST_AUTH + "/addAgendaItemTag")
        .set("Accept-Content", "application/json")
        .set("Authorization", "Bearer " + this.props.token)
        .send({ ItemId: this.state._id, tags })
        .then(result => {
          console.log("RESULT:", result, formProps);
          this.hidePending();
          formProps.setSubmitting(false);
          if (result.body.success) {
            this.props.dispatch(updateScore(result.body));
            this.getAgendaItem();
          } else {
            if (result.body.errorType === 0) {
              alert(
                "Could not yet give you points for that, but that may change later."
              );
              this.getAgendaItem();
            } else {
              alert("Something went wrong. Try again later");
            }
          }
        })
        .catch(err => {
          console.log(err);
          if (tries + 1 < maxtries) {
            // exponential backoff
            console.log("Submitting again");
            let formHandler = this.formHandler.bind(this);
            setTimeout(function() {
              formHandler(evt, formProps, tries + 1, maxtries);
            }, Math.pow(2, tries + 1) * 1000);
          } else {
            this.hidePending();
            formProps.setSubmitting(false);
            alert(
              "There was an error submitting the form for this item, maybe try a bit later or contact: eli.j.selkin@gmail.com if you see this multiple times."
            );
          }
        });
    }
  }
  hidePending() {
    this.setState({
      showPending: false
    });
  }

  displayPending() {
    this.setState({
      showPending: true
    });
  }

  componentDidMount() {
    // get agenda
    this.getAgendaItem();
  }
  
  shouldExpand(recommendations) {
    return !recommendations || recommendations.length < 500;
  }

  render() {
    return (
      <div className="tagging-holder">
        <Modal
          isOpen={this.state.showPending}
          style={styles.modalStyle}
          contentLabel="Modal"
        >
          <h2>Please wait...</h2>
          <div className="loading-holder">
            <div className="loading-div">
              <div>
                <img
                  src={loading}
                  className="loading"
                  alt="loading next item..."
                />
                <br />
              </div>
            </div>
          </div>
        </Modal>
        <h2>Help us tag this item:</h2>
        <Accordion>
          <AccordionItem
            expanded={this.shouldExpand(this.state.recommendations)}
          >
            <AccordionItemTitle className="accordion__title accordion__title--animated">
              <h3 className="u-position-relative">
                {this.state.title}
                <div className="accordion__arrow" role="presentation" />
              </h3>
            </AccordionItemTitle>
            {this.state.recommendations && (
              <AccordionItemBody>
                {this.state.recommendations}
              </AccordionItemBody>
            )}
            {!this.state.recommendations && (
              <AccordionItemBody>
                Sorry, this item has no recommendations section, try to select
                based on the title.
              </AccordionItemBody>
            )}
            <div className="block">
              Check all that apply:<br />
              {this.state.formikform}
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
  getAgendaItem() {
    superagent
      .get(HOST_AUTH + "/getAgendaItem")
      .set("Accept-Content", "application/json")
      .set("Authorization", "Bearer " + this.props.token)
      .then(result => {
        if (result.body.success) {
          this.setState({
            _id: result.body._id,
            body: result.body.Body,
            title: result.body.Title,
            recommendations: result.body.Recommendations,
            formikform: (
              <FormikTagForm
                key={result.body._id}
                handleSubmit={this.formHandler}
              />
            )
          });
        } else {
          this.setState({
            _id: null,
            body: null,
            title: null,
            recommendations: null
          });
        }
      });
  }
}
Tagging = connect()(Tagging);

export default withRouter(Tagging);
