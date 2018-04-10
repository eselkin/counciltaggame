import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { loggedIn } from "../../redux-actions/auth.action.creators";
import { withFormik } from "formik";
import superagent from "superagent";
import logo from "../../assets/logo.svg";
import "./Login.scss";

let HOST_AUTH;
if (process.env.STAGE === "prod") {
  HOST_AUTH = "https://engaged.today";
} else {
  HOST_AUTH = "http://localhost:8082";
}
// component function
const LoginForm = ({
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
      placeholder="username or email address"
      autoCapitalize="none"
      autoCorrect={values.username.toString() ? values.username : undefined}
      autoComplete="username"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.username}
    />
    {touched.username &&
      errors.username && <div className="error-label">{errors.username}</div>}
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
      Login
    </button>
  </form>
);

const FormikLoginForm = withFormik({
  mapPropsToValues: props => ({ username: "", password: "" }),
  validate: (values, props) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Required";
    } else if (
      values.username.includes("@") &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)
    ) {
      errors.username = "Invalid email address";
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
})(LoginForm);

class Login extends Component {
  constructor(props) {
    super(props);
    this.formHandler = this.formHandler.bind(this);
    this.state = {
      username: "",
      password: ""
    };
  }

  formHandler(evt, formProps) {
    superagent
      .post(HOST_AUTH + "/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ username: evt.username, password: evt.password })
      .then(res => {
        formProps.setSubmitting(false);
        console.log(res);
        if (res.body.success === 1) {
          this.props.dispatch(loggedIn(res.body));
          this.props.history.push("/tag");
        }
      })
      .catch(err => {
        alert("Error signing in");
      });
  }
  render() {
    return (
      <div className="login-holder">
        <div className="login">
          <img src={logo} alt="engage" className="login-logo" />
          <br />
          <h2 className="login-header">Log in to tag agendas</h2>
          <FormikLoginForm handleSubmit={this.formHandler} />
        </div>
      </div>
    );
  }
}
Login = connect()(Login);

export default withRouter(Login);
