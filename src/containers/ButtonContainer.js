import React from "react";
import { connect } from "react-redux";
import { increment, increment_10, decrement, decrement_10 } from "../actions";
import Button from "../components/Buttons";

const ButtonContainer = ({
  increment,
  increment_10,
  decrement,
  decrement_10
}) => (
  <>
    <Button title="-10 감소" actionFunc={decrement_10} /> |
    <Button title="-1 감소" actionFunc={decrement} /> |
    <Button title="1 증가" actionFunc={increment} /> |
    <Button title="10 증가" actionFunc={increment_10} />
  </>
);

const mapDispatchToProps = {
  increment: increment,
  increment_10: increment_10,
  decrement: decrement,
  decrement_10: decrement_10
};

export default connect(null, mapDispatchToProps)(ButtonContainer);
