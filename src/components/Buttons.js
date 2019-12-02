import React from "react";

const Button = ({ title, actionFunc }) => (
  <button onClick={actionFunc}>{title}</button>
);

export default Button;
