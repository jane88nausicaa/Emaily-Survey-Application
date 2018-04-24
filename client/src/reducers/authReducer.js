import { FETCH_USER } from "../actions/types";
// default: no clue whether login or not
export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER: // if logout, the action.payload will be "", "" || false return false;
      return action.payload || false;
    default:
      return state;
  }
}
