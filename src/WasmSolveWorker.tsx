import SolveWorker from "./SolveWorker";

export default async function WasmSolveWorker(): Promise<SolveWorker> {
  // The { type: "module" } parameter is not yet widely supported as of this
  // writing.  Once it's supported, we can remove the '--target no-modules' flag
  // from the wasm-pack command used to build our WebAssembly, and can use an
  // ordinary import (rather than importScripts) in the worker source file
  // (WasmSolveWorkerImp.js).
  const worker = new Worker("WasmSolveWorkerImp.js", { type: "module" });

  worker.addEventListener("message", ({ data }) => {
    switch (data.kind) {
      case "Add":
        console.log(`answer: ${data.answer}`);
        break;
      default:
        console.warn(`{data.kind}: bad response kind`);
        break;
    }
  });

  return {
    postAdd() {
      worker.postMessage({ kind: "Add", left: 4, right: 2 });
    },
  };
}
