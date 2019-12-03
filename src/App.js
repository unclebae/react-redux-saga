import React from "react";
import ButtonContainer from "./containers/ButtonContainer";
import CountContainer from "./containers/CountContainer";
import LoadingContainer from "./containers/LoadingContainer";

function App() {
  return (
    <div>
      <ButtonContainer />
      <hr />
      <LoadingContainer />
      <CountContainer />
    </div>
  );
}

export default App;
