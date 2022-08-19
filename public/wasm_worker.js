importScripts("wasm_lib.js");

async function main() {
  await wasm_bindgen();

  addEventListener("message", ({ data }) => {
    switch (data.kind) {
      case 'Challenge': {
        const answer = wasm_bindgen.solve(data.target, data.values);
        postMessage({ ...data, answer });
        break;
      }
      default:
        console.warn(`{data.kind}: bad request kind`);
        break;
    }
  });
}

main();
