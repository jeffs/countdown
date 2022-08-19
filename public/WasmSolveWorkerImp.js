importScripts("wasm_lib.js");

async function main() {
  await wasm_bindgen();

  addEventListener("message", ({ data }) => {
    switch (data.kind) {
      case 'Add':
        const answer = wasm_bindgen.add(data.left, data.right);
        postMessage({ ...data, answer });
        break;
      default:
        console.warn(`{data.kind}: bad request kind`);
        break;
    }
  });
}

main();
