//
// Copyright Kayhan Space Corp. 2025
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
//

import init, {
  main,
  GpuPropagator,
  WasmConstants,
  WasmElements,
  WasmGpuConsts,
  WasmMinutesSinceEpoch,
  WasmPrediction,
} from "./index";

// Expose a single global for <script> users
declare global {
  interface Window {
    SGP4: {
      init: typeof init;
      main: typeof main;
      GpuPropagator: typeof GpuPropagator;
      WasmConstants: typeof WasmConstants;
      WasmElements: typeof WasmElements;
      WasmGpuConsts: typeof WasmGpuConsts;
      WasmMinutesSinceEpoch: typeof WasmMinutesSinceEpoch;
      WasmPrediction: typeof WasmPrediction;
    };
  }
}

window.SGP4 = {
  init,
  main,
  GpuPropagator,
  WasmConstants,
  WasmElements,
  WasmGpuConsts,
  WasmMinutesSinceEpoch,
  WasmPrediction,
};
