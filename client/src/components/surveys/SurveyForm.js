// SurveyForm shows a form for a user to add input
// reduxForm allow redux form to communicate with Redux store
import _ from "lodash";
import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";
import SurveyField from "./SurveyField";
import validateEmails from "../../utils/validateEmails";
import formFields from "./formFields";

class SurveyForm extends Component {
  renderFields() {
    return _.map(formFields, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }

  /* () => this.props.onSurveySubmit()
  ()=> used only to call another function, So -> this.props.onSurveySubmit()
  for this.props.onSurveySubmit(), we are not invoking on survey submit. So
  we donot have () here  -> this.props.onSurveySubmit
  if using (), the callback function would be called the instant that our js interpreter
  evaluated this "<form>" line of code below.
  We want to only call this function after the user has submitted the form
  */
  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}
/* values is the object containing all the different
values that are coming off of our form
How redux form show errors to user?
redux form automatically passes errors as a prop to the Field component
*/
function validate(values) {
  const errors = {};

  errors.recipients = validateEmails(values.recipients || "");

  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = "You must provide a value";
    }
  });

  return errors;
}

/*destroyOnUnmount: false
Redux does not kill the SurveyForm when the survey form is unmounted
or no longer shown on the screen
So when user press 'Back' button, they can still see what they write
*/
export default reduxForm({
  validate, // validate: validate
  form: "surveyForm",
  destroyOnUnmount: false
})(SurveyForm);
