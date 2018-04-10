import { LOGGED_IN, SIGNED_UP } from "../redux-actions/auth.action.creators";

const initialState = {
  logged_in: false,
  signed_up: false,
  username: null,
  email: null,
  token: null,
  score: 0
};

export function auth(state = initialState, action) {
  console.log("ACTION", action)
  switch (action.type) {
    case LOGGED_IN:
      if (action.status.success === 1) {
        return Object.assign({}, state, {
          username: action.status.username,
          email: action.status.email,
          score: parseInt(action.status.score, 10),
          token: action.status.token,
          avatar: action.status.avatar,
          logged_in: true,
          signed_up: false
        });
      }
      return state;
    case SIGNED_UP:
      if (action.status.success === 1) {
        return Object.assign({}, state, {
          logged_in: false,
          signed_up: true,
        });
      }
      return state;
    default:
      return state;
  }
}
