/* tslint:disable */
/* eslint-disable */
export function main(): void;
/**
 * WASM wrapper for GpuPropagator with registered constant sets for optimal performance
 */
export class GpuPropagator {
  private constructor();
  free(): void;
  /**
   * Create a new GPU propagator (auto-detect backend)
   */
  static new(): Promise<GpuPropagator>;
  /**
   * Create a GPU propagator with WebGL backend
   */
  static new_for_web_gl(): Promise<GpuPropagator>;
  /**
   * Create a GPU propagator for web (WebGPU preferred)
   */
  static new_for_web(): Promise<GpuPropagator>;
  /**
   * Register a set of constants for repeated propagation
   *
   * Returns a unique ID that can be used with propagate_registered_* methods.
   * This is optimal for scenarios where you propagate the same satellites
   * repeatedly with different times (e.g., real-time tracking, animation).
   *
   * Note: This method takes ownership of the constants array for optimal performance.
   * If you need to use the constants elsewhere, create them separately.
   */
  register_const_set(consts: WasmGpuConsts[]): number;
  /**
   * Unregister a constant set to free memory
   */
  unregister_const_set(id: number): boolean;
  /**
   * Get the number of satellites in a registered constant set
   */
  get_registered_count(id: number): number | undefined;
  /**
   * List all registered constant set IDs
   */
  list_registered_ids(): Uint32Array;
  /**
   * Propagate a registered constant set with Float32Array output (🚀 Optimal Performance)
   *
   * Uses a pre-registered constant set (from register_const_set) and propagates
   * all satellites to the given times. This is the fastest method for repeated
   * propagations of the same satellite constellation.
   *
   * # Arguments
   * * `id` - ID returned from register_const_set
   * * `times` - Float64Array of propagation times in minutes since epoch
   *
   * # Returns
   * Float32Array with layout [x1, y1, z1, vx1, vy1, vz1, x2, y2, z2, ...]
   */
  propagate_registered_f32(
    id: number,
    times: Float64Array
  ): Promise<Float32Array>;
  /**
   * Propagate a registered constant set with Float64Array output (High Precision)
   *
   * Uses a pre-registered constant set and propagates with double precision.
   * Best for high-accuracy long-term predictions.
   */
  propagate_registered_f64(
    id: number,
    times: Float64Array
  ): Promise<Float64Array>;
  /**
   * Check if f64 precision is supported
   */
  supports_f64(): boolean;
  /**
   * Propagate a batch of satellites
   */
  propagate_batch(
    consts: WasmGpuConsts[],
    times: Float64Array
  ): Promise<
    { position: [number, number, number]; velocity: [number, number, number] }[]
  >;
  /**
   * Propagate a batch of satellites and return a pre-allocated Float32Array for optimal performance
   *
   * Returns a Float32Array with length = n_satellites * 6
   * Data layout: [x1, y1, z1, vx1, vy1, vz1, x2, y2, z2, vx2, vy2, vz2, ...]
   * Where positions are in km and velocities are in km/s
   */
  propagate_batch_f32(
    consts: WasmGpuConsts[],
    times: Float64Array
  ): Promise<Float32Array>;
  /**
   * Propagate a batch of satellites and return a pre-allocated Float64Array for high precision
   *
   * Returns a Float64Array with length = n_satellites * 6
   * Data layout: [x1, y1, z1, vx1, vy1, vz1, x2, y2, z2, vx2, vy2, vz2, ...]
   * Where positions are in km and velocities are in km/s
   */
  propagate_batch_f64(
    consts: WasmGpuConsts[],
    times: Float64Array
  ): Promise<Float64Array>;
  /**
   * Get optimal batch size for performance
   */
  optimal_batch_size(): number;
  /**
   * Get minimum effective batch size
   */
  min_effective_batch_size(): number;
  /**
   * Get performance information
   */
  get_performance_info(): string;
}
/**
 * WASM wrapper for SGP4 Constants
 */
export class WasmConstants {
  private constructor();
  free(): void;
  /**
   * Create Constants from Elements
   */
  static from_elements(elements: WasmElements): WasmConstants;
  /**
   * Propagate to a specific time
   */
  propagate(t: number): WasmPrediction;
}
/**
 * WASM wrapper for SGP4 Elements
 */
export class WasmElements {
  private constructor();
  free(): void;
  /**
   * Parse TLE from bytes
   */
  static from_tle(
    name: Uint8Array | null | undefined,
    line1: Uint8Array,
    line2: Uint8Array
  ): WasmElements;
  /**
   * Get satellite name
   */
  readonly name: string | undefined;
  /**
   * Get inclination in degrees
   */
  readonly inclination: number;
  /**
   * Get eccentricity
   */
  readonly eccentricity: number;
  /**
   * Get right ascension in degrees
   */
  readonly right_ascension: number;
  /**
   * Get argument of perigee in degrees
   */
  readonly argument_of_perigee: number;
  /**
   * Get mean anomaly in degrees
   */
  readonly mean_anomaly: number;
  /**
   * Get mean motion in revolutions per day
   */
  readonly mean_motion: number;
}
/**
 * WASM wrapper for GpuConsts
 */
export class WasmGpuConsts {
  private constructor();
  free(): void;
  /**
   * Create GpuConsts from Constants
   */
  static from_constants(constants: WasmConstants): WasmGpuConsts;
}
/**
 * WASM wrapper for MinutesSinceEpoch
 */
export class WasmMinutesSinceEpoch {
  free(): void;
  /**
   * Create a new MinutesSinceEpoch
   */
  constructor(minutes: number);
  /**
   * Get the value in minutes
   */
  readonly value: number;
}
/**
 * WASM wrapper for Prediction
 */
export class WasmPrediction {
  private constructor();
  free(): void;
  /**
   * Get position as array
   */
  readonly position: Float64Array;
  /**
   * Get velocity as array
   */
  readonly velocity: Float64Array;
}

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wasmelements_free: (a: number, b: number) => void;
  readonly wasmelements_from_tle: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number
  ) => void;
  readonly wasmelements_name: (a: number, b: number) => void;
  readonly wasmelements_inclination: (a: number) => number;
  readonly wasmelements_eccentricity: (a: number) => number;
  readonly wasmelements_right_ascension: (a: number) => number;
  readonly wasmelements_argument_of_perigee: (a: number) => number;
  readonly wasmelements_mean_anomaly: (a: number) => number;
  readonly wasmelements_mean_motion: (a: number) => number;
  readonly __wbg_wasmconstants_free: (a: number, b: number) => void;
  readonly wasmconstants_from_elements: (a: number, b: number) => void;
  readonly wasmconstants_propagate: (a: number, b: number, c: number) => void;
  readonly __wbg_wasmminutessinceepoch_free: (a: number, b: number) => void;
  readonly wasmminutessinceepoch_new: (a: number) => number;
  readonly wasmminutessinceepoch_value: (a: number) => number;
  readonly __wbg_wasmprediction_free: (a: number, b: number) => void;
  readonly wasmprediction_position: (a: number, b: number) => void;
  readonly wasmprediction_velocity: (a: number, b: number) => void;
  readonly __wbg_wasmgpuconsts_free: (a: number, b: number) => void;
  readonly wasmgpuconsts_from_constants: (a: number) => number;
  readonly __wbg_gpupropagator_free: (a: number, b: number) => void;
  readonly gpupropagator_new: () => number;
  readonly gpupropagator_new_for_web_gl: () => number;
  readonly gpupropagator_new_for_web: () => number;
  readonly gpupropagator_register_const_set: (
    a: number,
    b: number,
    c: number
  ) => number;
  readonly gpupropagator_unregister_const_set: (a: number, b: number) => number;
  readonly gpupropagator_get_registered_count: (a: number, b: number) => number;
  readonly gpupropagator_list_registered_ids: (a: number, b: number) => void;
  readonly gpupropagator_propagate_registered_f32: (
    a: number,
    b: number,
    c: number
  ) => number;
  readonly gpupropagator_propagate_registered_f64: (
    a: number,
    b: number,
    c: number
  ) => number;
  readonly gpupropagator_supports_f64: (a: number) => number;
  readonly gpupropagator_propagate_batch: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number
  ) => number;
  readonly gpupropagator_propagate_batch_f32: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number
  ) => number;
  readonly gpupropagator_propagate_batch_f64: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number
  ) => number;
  readonly gpupropagator_optimal_batch_size: (a: number) => number;
  readonly gpupropagator_min_effective_batch_size: (a: number) => number;
  readonly gpupropagator_get_performance_info: (a: number, b: number) => void;
  readonly main: () => void;
  readonly __wbindgen_export_0: (a: number) => void;
  readonly __wbindgen_export_1: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_2: (a: number, b: number) => number;
  readonly __wbindgen_export_3: (
    a: number,
    b: number,
    c: number,
    d: number
  ) => number;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_export_5: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_6: (
    a: number,
    b: number,
    c: number,
    d: number
  ) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(
  module: { module: SyncInitInput } | SyncInitInput
): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>
): Promise<InitOutput>;
