import {
  INCREMENT,
  INCREMENT_10,
  DECREMENT,
  DECREMENT_10,
  INCREMENT_10_ASYNC,
  INCREMENT_10_DONE,
  DECREMENT_10_ASYNC,
  DECREMENT_10_DONE
} from "../actions/actionTypes";

// loading 상태를 추가합니다. 
const initialState = {
  num: 0,
  loading: false
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

    //   새로 추가된 부분 
    case INCREMENT_10_ASYNC:
      return { ...state, loading: true };
    case INCREMENT_10_DONE:
      return { num: state.num + action.payload, loading: false };
    case DECREMENT_10_ASYNC:
      return { ...state, loading: true };
    case DECREMENT_10_DONE:
      return { num: state.num + action.payload, loading: false };
    default:
      return state;
  }
};

export default reducer;
