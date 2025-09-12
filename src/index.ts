//
// Copyright Kayhan Space Corp. 2025
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
//

// IMPORTANT: src and pkg are siblings; use ../pkg/...
import wasmInitDefault, * as runtime from "../pkg/sgp4.js";

// Re-export wasm-bindgen surface so consumers get proper typings
export const {
  main,
  GpuPropagator,
  WasmConstants,
  WasmElements,
  WasmGpuConsts,
  WasmMinutesSinceEpoch,
  WasmPrediction,
  initSync,
  default: _ignored,
} = runtime as unknown as typeof import("../pkg/sgp4.js");

// Tiny helper that forwards to the wasm-bindgen default init,
// allowing users to optionally pass a custom wasm URL/module.
export async function init(
  moduleOrPath?: Parameters<typeof wasmInitDefault>[0]
) {
  // If the user passes nothing, wasm-bindgen will auto-resolve
  // new URL('sgp4_bg.wasm', import.meta.url)
  return wasmInitDefault(moduleOrPath as any);
}

export default init;
