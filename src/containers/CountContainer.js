import React from "react";
import { connect } from "react-redux";

const Count = ({ num }) => <span>Counted Value is {num}.</span>;

function mapStateToProps(state) {
  return { num: state.counter.num };
}

export default connect(mapStateToProps, null)(Count);
