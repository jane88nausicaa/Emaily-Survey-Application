// SurveyField contains logic to render a single label & text input
import React from "react";

// {...input} : have this object in all the keys and values that are in it
// = to onBlur={input.onBlur} onChange={input.onChange} ......
// if touched is true, javascript interpreter will evaluate the entire statement
export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBottom: "5px" }} />
      <div className="red-text" style={{ marginBottom: "20px" }}>
        {touched && error}
      </div>
    </div>
  );
};
