// SurveyNew shows SurveyForm & SurveyFormReview
import React, { Component } from "react";
import { reduxForm } from "redux-form";
import SurveyForm from "./SurveyForm";
import SurveyFormReview from "./SurveyFormReview";

class SurveyNew extends Component {
  /* In React, initialising component level state is by adding on constructor
  function calling super with props and then assigning your state object

  constructor(props) {
    super(props);
    this.state = { new: true };
  }

  equal to the statement below
  */

  state = { showFormReview: false };
  renderContent() {
    if (this.state.showFormReview) {
      return (
        <SurveyFormReview
          onCancel={() => this.setState({ showFormReview: false })}
        />
      );
    }
    /* callback: onSurveySubmit will update state inside of SurveyNew &
    cause the SurveyFormReview to be shown instead
    when a user try to submit form, we will run this callback onSurveySubmit
    which will update state inside of SurveyNew & cause the SurveyFormReview
    to be shown instead
    */
    return (
      <SurveyForm
        onSurveySubmit={() => this.setState({ showFormReview: true })}
      />
    );
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default reduxForm({
  form: "surveyForm"
})(SurveyNew);
