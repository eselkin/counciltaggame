import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signedUp } from "../../redux-actions/auth.action.creators";
import { withFormik } from "formik";
import superagent from "superagent";
import logo from "../../assets/logo.svg";
import "./Signup.scss";

let HOST_AUTH;
if (process.env.STAGE === "prod") {
  HOST_AUTH = "https://engaged.today";
} else {
  HOST_AUTH = "http://localhost:8082";
}
// component function
const SignupForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      name="username"
      placeholder="username"
      autoCapitalize="none"
      autoComplete="username"
      autoCorrect={values.username.toString() ? values.username : undefined}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.username}
    />
    {touched.username &&
      errors.username && <div className="error-label">{errors.username}</div>}
    <input
      type="text"
      name="email"
      autoComplete="email"
      placeholder="email"
      autoCapitalize="none"
      autoCorrect={values.email.toString() ? values.email : undefined}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.email}
    />
    {touched.email &&
      errors.email && <div className="error-label">{errors.email}</div>}
    <input
      type="password"
      name="password"
      placeholder="password"
      autoComplete="password"
      autoCorrect={values.password.toString() ? values.password : undefined}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.password}
    />
    {touched.password &&
      errors.password && <div className="error-label">{errors.password}</div>}
    <button type="submit" disabled={isSubmitting}>
      Signup
    </button>
  </form>
);

const FormikSignupForm = withFormik({
  mapPropsToValues: props => ({ username: "", password: "", email: "" }),
  validate: (values, props) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Required";
    }
    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 9 || values.password.length > 60) {
      errors.password = "Password is between 9 and 60 characters";
    }
    return errors;
  },
  handleSubmit: (values, props) => {
    props.props.handleSubmit(values, props);
  }
})(SignupForm);

class Signup extends Component {
  constructor(props) {
    super(props);
    this.formHandler = this.formHandler.bind(this);
    this.state = {
      username: "",
      password: "",
      email: ""
    };
  }

  formHandler(evt, formProps) {
    superagent
      .post(HOST_AUTH + "/signup")
      .send({
        username: evt.username,
        email: evt.email,
        password: evt.password
      })
      .set("Content-Type", "application/x-www-form-urlencoded")
      .end((err, res) => {
        formProps.setSubmitting(false);
        if (err) {
          alert("Error in sending password. Try again in a minute.");
          return;
        }
        if (res.body.success === 1) {
          // emit the action
          this.props.dispatch(signedUp(res.body));
          this.props.history.push("/login");
          return;
        } else {
          switch (res.body.success) {
            case 0:
              alert("No information was provided");
              break;
            case -1:
              alert("That username was already taken, sorry :-(");
              break;
            case -2:
              alert("Email already exists, have to use another.");
              break;
            case -3:
              alert(
                "Somehow the password you used was not between 16 and 50 characters"
              );
              break;
            case -4:
              alert("Email was not a correct email somehow... Not sure how");
              break;
            default:
              alert("There was an error signing in, check your password.");
              break;
          }
        }
      });
  }
  render() {
    return (
      <div className="signup-holder">
        <div className="signup">
          <img src={logo} alt="engage" className="signup-logo" />
          <br />
          <h2 className="signup-header">Sign up for tagging agendas</h2>
          <FormikSignupForm handleSubmit={this.formHandler} />
        </div>
      </div>
    );
  }
}
Signup = connect()(Signup);

export default withRouter(Signup);
