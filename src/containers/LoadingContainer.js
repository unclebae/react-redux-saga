import React from "react";
import { connect } from "react-redux";
import spinner from "../imgs/Loading_spinner.gif";

const Loading = ({ loading }) =>
  loading ? (
    <div>
      <img src={spinner} alt="loading spinner" />
      <span>Loading....</span>
    </div>
  ) : null;

const mapStateToProps = state => ({
  loading: state.counter.loading
});

export default connect(mapStateToProps, null)(Loading);
