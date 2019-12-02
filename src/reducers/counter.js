import {
  INCREMENT,
  INCREMENT_10,
  DECREMENT,
  DECREMENT_10
} from "../actions/actionTypes";

const initialState = {
  num: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return { num: state.num + action.payload };
    case INCREMENT_10:
      return { num: state.num + action.payload };
    case DECREMENT:
      return { num: state.num + action.payload };
    case DECREMENT_10:
      return { num: state.num + action.payload };
    default:
      return state;
  }
};

export default reducer;
