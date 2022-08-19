import React from "react";

import SolveWorker from "./SolveWorker";
import Solver from "./Solver";

import "./App.css";

function App(props: { solveWorker?: SolveWorker }) {
  return (
    <main className="app">
      <Solver worker={props.solveWorker} />
    </main>
  );
}

export default App;
