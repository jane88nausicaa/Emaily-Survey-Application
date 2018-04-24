import React, { Component } from "react";
// want to call action creator to fetch list of surveys
import { connect } from "react-redux";
import { fetchSurveys } from "../../actions";

class SurveyList extends Component {
  /* life cycle method
  make sure that any time this component is rendered to the screen, we call
  fetchSurveys action creator
  */
  componentDidMount() {
    this.props.fetchSurveys();
  }
  // reverse() : show the newest survey at the top
  renderSurveys() {
    return this.props.surveys.reverse().map(survey => {
      return (
        <div className="card darken-1" key={survey._id}>
          <div className="card-content">
            <span className="card-title">{survey.title}</span>
            <p>{survey.body}</p>
            <p className="right">
              Send On: {new Date(survey.dateSent).toLocaleDateString()}
            </p>
          </div>
          <div className="card-action">
            <a>Yes: {survey.yes}</a>
            <a>No: {survey.no}</a>
          </div>
        </div>
      );
    });
  }

  render() {
    return <div>{this.renderSurveys()}</div>;
  }
}

// function mapStateToProps(state) {
//   return { surveys: state.surveys };
// }
function mapStateToProps({ surveys }) {
  return { surveys };
}

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);
