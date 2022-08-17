import React from "react";

import Solver from "./Solver";
import Wasm from "./Wasm";

import "./App.css";

function App(props: { wasm?: Wasm }) {
  return (
    <main className="app">
      <Solver wasm={props.wasm} />
    </main>
  );
}

export default App;
