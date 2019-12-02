import {
  INCREMENT,
  INCREMENT_10,
  DECREMENT,
  DECREMENT_10
} from "./actionTypes";

export const increment = () => ({ type: INCREMENT, payload: 1 });
export const increment_10 = () => ({ type: INCREMENT_10, payload: 10 });
export const decrement = () => ({ type: DECREMENT, payload: -1 });
export const decrement_10 = () => ({ type: DECREMENT_10, payload: -10 });
