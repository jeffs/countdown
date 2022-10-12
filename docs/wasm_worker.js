importScripts("wasm_lib.js");

async function main() {
  await wasm_bindgen();

  addEventListener("message", ({ data }) => {
    switch (data.kind) {
      case "Challenge": {
        const { target, values }  = data;
        const answer = wasm_bindgen.solve(target, values);
        postMessage({ kind: "Answer", target, answer });
        break;
      }
      default:
        console.warn(`${data.kind}: bad request kind`);
        break;
    }
  });
}

main();
