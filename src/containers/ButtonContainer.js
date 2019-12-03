import React from "react";
import { connect } from "react-redux";
import {
  increment,
  increment_10,
  decrement,
  decrement_10,
  increment_10_async,
  decrement_10_async
} from "../actions";
import Button from "../components/Buttons";

const ButtonContainer = ({
  increment,
  increment_10,
  decrement,
  decrement_10,
  increment_10_async,
  decrement_10_async
}) => (
  <>
    <Button title="비동기 -10 감소" actionFunc={decrement_10_async} /> |
    <Button title="-10 감소" actionFunc={decrement_10} /> |
    <Button title="-1 감소" actionFunc={decrement} /> |
    <Button title="1 증가" actionFunc={increment} /> |
    <Button title="10 증가" actionFunc={increment_10} /> |
    <Button title="비동기 10 증가" actionFunc={increment_10_async} />
  </>
);

const mapDispatchToProps = {
  increment: increment,
  increment_10: increment_10,
  decrement: decrement,
  decrement_10: decrement_10,
  increment_10_async,
  decrement_10_async
};

export default connect(null, mapDispatchToProps)(ButtonContainer);
