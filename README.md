# sgp4.gl

sgp4.gl, developed by Kayhan Space Corp., is a GPU-accelerated variant of the SGP4 propagator designed to speed up satellite visualizations. By harnessing WebGPU with a WebGL fallback, it enables efficient batch propagation that makes rendering large constellations and dynamic orbital scenes smooth and responsive. The library supports both JavaScript objects and optimized typed arrays for flexible integration, while built-in benchmarks provide insight into performance gains across different methods. Its register-once architecture further optimizes repeated propagations, making it especially useful for interactive visualization tools and real-time orbital displays.

## Accuracy notice

sgp4.gl is currently in beta and has not yet undergone the same level of accuracy testing as the CPU-based SGP4 variant. While it delivers substantial performance improvements for rendering and exploration, it should be used strictly for visualization purposes. Regardless of any discrepancies introduced by sgp4.gl, SGP4 and TLEs themselves in general are not suitable for high-precision analysis or operational decision-making. For those cases, we strongly recommend relying on Owner/Operator or Special Perturbations (SP) ephemerides instead.

## Useful links

[npm | https://www.npmjs.com/package/sgp4.gl](https://www.npmjs.com/package/sgp4.gl)

[Repo | https://github.com/Kayhan-Space/sgp4gl](https://github.com/Kayhan-Space/sgp4gl)

[Lightweight Demo | https://sgp4gl-demo.vercel.app/lightweight](https://sgp4gl-demo.vercel.app/lightweight)

[Cesium 3D visualization | https://sgp4gl-demo.vercel.app](https://sgp4gl-demo.vercel.app)

[Cesium 3D visualization repo | https://github.com/Kayhan-Space/sgp4gl-demo](https://github.com/Kayhan-Space/sgp4gl-demo)

[TLEs | https://www.satcat.com](https://www.satcat.com)

[Kayhan Space | https://www.kayhan.space](https://www.kayhan.space)

## Building the module

To install, build, and run the demo...

```bash



npm  install



npm  run  build



```

## Running the demo locally

```bash



npx  serve  .



```

## What is SGP4?

SGP4 stands for Simplified General Perturbations 4 and is arguably the most widely used propagator for simulating earth satellite orbits. This module is my personal project to produce implementations in multiple languages. There is an official government document released decades ago that describes the theory and the software. That document is known as Spacetrack Report #3. In 2006 researchers at the Center for Space Standards and Innovation ([CSSI](http://www.centerforspace.com/)) published a detailed study of the algorithm and more modern software implementations. In addition to the paper they also released the [software](http://www.centerforspace.com/downloads/). Most importantly they produced an extensive set of test cases that cover multiple orbit regimes, potential singularities, and other tricky orbits.

## Available Methods

### Traditional Object-based API

```javascript
const results = await propagator.propagate_batch(gpuConsts, times);

// Returns: Array<{position: [x, y, z], velocity: [vx, vy, vz]}>
```

### Optimized Float32Array API

```javascript
const resultArray = await propagator.propagate_batch_f32(gpuConsts, times);

// Returns: Float32Array with layout [x1, y1, z1, vx1, vy1, vz1, x2, y2, z2, ...]

// Each satellite uses 6 consecutive values: [x, y, z, vx, vy, vz]
```

### Register-Once Pattern (Useful for globe views)

```javascript
// Register constellation once (this consumes the gpuConsts array)

const constSetId = propagator.register_const_set(gpuConsts);

// Propagate many times with different time arrays

const times1 = new Float64Array([0, 10, 20]); // minutes since epoch

const results1 = await propagator.propagate_registered_f32(constSetId, times1);

const times2 = new Float64Array([30, 40, 50]);

const results2 = await propagator.propagate_registered_f32(constSetId, times2);

// Cleanup when done

propagator.unregister_const_set(constSetId);
```

## Performance Benefits

The optimized methods provide significant performance improvements:

| Method            | Memory Usage         | Performance      | Best For                          |
| ----------------- | -------------------- | ---------------- | --------------------------------- |
| Object-based      | ~48 bytes/satellite  | Baseline         | Simple single-shot propagations   |
| Float32Array      | ~24 bytes/satellite  | 2–5× faster      | Batch processing                  |
| **Register-Once** | **Minimal overhead** | **5–10× faster** | **Real-time tracking, animation** |

### Register-Once Pattern Benefits

- **Zero Serialization**: Constants stored in WASM, no boundary crossing

- **Minimal Memory**: Constants registered once, reused many times

- **Ultra-Fast**: Perfect for real-time tracking (50+ updates/second)

- **Flexible**: Same constellation, different times per propagation

- **Optimal Performance**: Takes ownership for zero-copy efficiency

### Important Notes

- `register_const_set()` **consumes** the constants array for optimal performance

- If you need the constants elsewhere, create them separately before registration

- Use `unregister_const_set()` to free memory when done with a constellation

## Usage Example

```javascript
import wasmInit, {
  WasmElements,
  WasmConstants,
  WasmGpuConsts,
  GpuPropagator,
} from "./pkg/sgp4.js";

// Initialize WASM

await wasmInit();

// Parse TLE data for constellation

const satellites = [
  {
    name: "ISS",

    line1: "1 25544U 98067A 25253.41957898 .00007229 00000-0 13349-3 0 9991",

    line2:
      "2 25544 51.6328 244.6218 0004204 323.0394 37.0305 15.50221013528382",
  },

  // ... more satellites
];

// Create GPU constants

const elements = satellites.map((sat) =>
  WasmElements.from_tle(
    new TextEncoder().encode(sat.name),

    new TextEncoder().encode(sat.line1),

    new TextEncoder().encode(sat.line2)
  )
);

const constants = elements.map((el) => WasmConstants.from_elements(el));

const gpuConsts = constants.map((c) => WasmGpuConsts.from_constants(c));

// Create GPU propagator

const propagator = await GpuPropagator.new_for_web();

// Register constellation for repeated use

const constSetId = propagator.register_const_set(gpuConsts);

console.log(`Registered ${gpuConsts.length} satellites with ID: ${constSetId}`);

// Real-time tracking loop

for (let t = 0; t < 3600; t += 60) {
  // Every minute for 1 hour

  const times = new Float64Array(gpuConsts.length);

  times.fill(t); // All satellites at time t

  const results = await propagator.propagate_registered_f32(constSetId, times);

  // Process results - results is Float32Array with [x,y,z,vx,vy,vz,...]

  for (let i = 0; i < gpuConsts.length; i++) {
    const offset = i * 6;

    const position = [
      results[offset],

      results[offset + 1],

      results[offset + 2],
    ];

    const velocity = [
      results[offset + 3],

      results[offset + 4],

      results[offset + 5],
    ];

    console.log(`${satellites[i].name}: ${position} km, ${velocity} km/s`);
  }
}

// Cleanup when done

propagator.unregister_const_set(constSetId);
```

## Data Layout

For N satellites, the typed arrays contain N × 6 values:

```



[sat0_x, sat0_y, sat0_z, sat0_vx, sat0_vy, sat0_vz,



sat1_x, sat1_y, sat1_z, sat1_vx, sat1_vy, sat1_vz,



...



satN_x, satN_y, satN_z, satN_vx, satN_vy, satN_vz]



```

Access pattern for satellite `i`:

```javascript
const offset = i * 6;

const position = [results[offset], results[offset + 1], results[offset + 2]];

const velocity = [
  results[offset + 3],

  results[offset + 4],

  results[offset + 5],
];
```

## Use Cases by Method

### Register-Once Pattern - Best For:

- **Real-time satellite tracking** (same constellation, frequent updates)

- **Animation/visualization** (same satellites, many time steps)

- **Monte Carlo simulations** (varying only time parameters)

- **Interactive applications** (responsive user interfaces)

### Float32Array/Float64Array - Best For:

- **Batch processing** (many satellites, occasional computation)

- **Scientific analysis** (high precision requirements)

- **Data export/import** (efficient serialization)

### Traditional Objects - Best For:

- **Simple scripts** (ease of use, readability)

- **Prototyping** (quick development)

- **Single propagations** (minimal overhead scenarios)

## Browser Compatibility

- **WebGPU**: Chrome, Edge, Firefox (only on https), Safari

- **WebGL**: All modern browsers (fallback)
