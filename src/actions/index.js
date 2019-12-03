import {
  INCREMENT,
  INCREMENT_10,
  DECREMENT,
  DECREMENT_10,
  INCREMENT_10_ASYNC,
  DECREMENT_10_ASYNC
} from "./actionTypes";

export const increment = () => ({ type: INCREMENT, payload: 1 });
export const increment_10 = () => ({ type: INCREMENT_10, payload: 10 });
export const decrement = () => ({ type: DECREMENT, payload: -1 });
export const decrement_10 = () => ({ type: DECREMENT_10, payload: -10 });

// 새로 추가된 부분 
export const increment_10_async = () => ({ type: INCREMENT_10_ASYNC, payload: 10 });
export const decrement_10_async = () => ({ type: DECREMENT_10_ASYNC, payload: -10 });
