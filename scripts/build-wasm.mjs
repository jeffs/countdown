// "build:wasm": "cd wasm-lib && wasm-pack build --target no-modules",

import util from "node:util";
import child_process from "node:child_process";
import { copyFile } from "node:fs/promises";

const exec = util.promisify(child_process.exec);

async function build() {
  const { child } = exec("wasm-pack build --target no-modules", {
    cwd: "wasm-lib",
  });
  child.stdout.on("data", (data) => {
    process.stdout.write(data);
  });
  child.stderr.on("data", (data) => {
    process.stderr.write(data);
  });
  child.on("close", (status) => {
    if (status !== 0) {
      console.error(`error: child exited with status ${status}`);
      process.exit(status);
    }
  });
  await child;
}

async function main() {
  try {
    await build();
    await Promise.all([
      copyFile("wasm-lib/pkg/wasm_lib.js", "public/wasm_lib.js"),
      copyFile("wasm-lib/pkg/wasm_lib_bg.wasm", "public/wasm_worker_bg.wasm"),
    ]);
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

main();
