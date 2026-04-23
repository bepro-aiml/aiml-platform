// ============================================================
// APP.JS — Router and view renderers
// Reads COURSE_DATA (from courseData.js) and injects HTML into #app-container
// ============================================================

// ============================================================
// ASSET PATHS
// Central reference for all static files. Use asset(kind, filename)
// anywhere you build an <img>, <a href=...>, or URL string so there
// is one place to change paths if the folder layout moves.
//
// Layout:
//   assets/
//     img/    - photos, screenshots, diagrams
//     docs/   - PDFs, slide decks, handouts
//     icons/  - SVG/PNG icons referenced inline or in CSS
//
// Examples:
//   asset('img', 'module1-hero.png')        -> "assets/img/module1-hero.png"
//   asset('docs', 'module1-slides.pdf')     -> "assets/docs/module1-slides.pdf"
//   asset('icons', 'bot.svg')               -> "assets/icons/bot.svg"
// ============================================================
const ASSETS = {
  img:   'assets/img/',
  docs:  'assets/docs/',
  icons: 'assets/icons/'
};

function asset(kind, filename) {
  const base = ASSETS[kind];
  if (!base) {
    console.warn(`asset(): unknown kind "${kind}" — use one of: ${Object.keys(ASSETS).join(', ')}`);
    return filename;
  }
  return base + filename;
}

// ------------------------------------------------------------
// ROUTE PARSING
// ------------------------------------------------------------
function parseRoute() {
  const hash = window.location.hash || '#/';
  const parts = hash.replace('#', '').split('/').filter(Boolean);
  if (parts.length === 0) return { page: 'home' };
  if (parts[0] === 'lab') return { page: 'lab' };
  if (parts[0] === 'module' && parts.length === 2) {
    return { page: 'module', moduleId: parseInt(parts[1], 10) };
  }
  if (parts[0] === 'module' && parts[2] === 'class' && parts.length === 4) {
    return {
      page: 'class',
      moduleId: parseInt(parts[1], 10),
      classId: parseInt(parts[3], 10)
    };
  }
  return { page: 'home' };
}

function navigate(path) {
  window.location.hash = path;
}

// ============================================================
// LAB — WORKFLOW STATE MACHINE
// The Lab cycles through four states in response to user input:
//   IDLE       → default, awaiting input
//   VALIDATING → running validatePipeline() before a Train attempt
//   TRAINING   → particle stream flowing (valid pipeline)
//   FAILED     → validation failed or a pulse hit a gap; auto-recovers to IDLE
// ============================================================
const LabState = Object.freeze({
  IDLE:       'IDLE',
  VALIDATING: 'VALIDATING',
  TRAINING:   'TRAINING',
  TEST:       'TEST',        // post-training: accepts image drops for inference
  FAILED:     'FAILED'
});

// Three curated datasets. Each has 20 "items" we pretend to label.
const LabDatasets = Object.freeze({
  AGRICULTURE: {
    id: 'AGRICULTURE', name: 'Agriculture', icon: '🌾',
    items: ['Wheat','Rice','Corn','Tomato','Apple','Soybean','Cotton','Barley',
            'Potato','Carrot','Grape','Orange','Lemon','Banana','Pepper',
            'Onion','Garlic','Lettuce','Cucumber','Strawberry']
  },
  TRAFFIC: {
    id: 'TRAFFIC', name: 'Traffic', icon: '🚦',
    items: ['Car','Truck','Bus','Motorcycle','Bicycle','Pedestrian','Stop Sign',
            'Traffic Light','Yield Sign','Speed Limit','Crosswalk','Lane Marker',
            'Highway','Intersection','Roundabout','Tunnel','Bridge','Sidewalk',
            'Parking Spot','Taxi']
  },
  FINANCE: {
    id: 'FINANCE', name: 'Finance', icon: '💰',
    items: ['Salary','Purchase','Investment','Loan','Savings','Stock Trade',
            'Bond','Dividend','Interest','Tax','Insurance','Mortgage',
            'Credit Card','Wire Transfer','Refund','Fee','Bonus','Withdrawal',
            'Deposit','Transfer']
  }
});

// ============================================================
// CYBER-SURGICAL LAB
// Houses the Three.js scene behind #lab-container.
// - enter() is called when route is '#/lab'.
// - exit() is called on any other route and disposes the scene
//   so laptops don't leak GPU memory across navigations.
// Three.js itself is NOT loaded yet — this is the scaffold.
// To integrate: load Three.js (e.g. via CDN) and replace the body
// of _buildScene() with real mesh/camera/renderer setup.
// ============================================================
const Lab = {
  _active: false,
  _scene: null,
  _renderer: null,
  _camera: null,
  _animationId: null,
  _resizeHandler: null,
  _mouseHandler: null,          // mousemove (light + drag tracking)
  _mouseDownHandler: null,      // mousedown (pick up a block)
  _mouseUpHandler: null,        // mouseup (drop + snap)
  _dblClickHandler: null,       // dblclick (amputate)
  _keydownHandler: null,        // keydown (S to trigger pulse)
  _blocks: [],                  // every Block in the scene
  _draggedBlock: null,          // the Block being dragged, or null
  _dragOffset: null,            // offset from cursor hit-point to block center
  _grid: null,                  // GridHelper reference (for flash on failure)
  _plane: null,                 // ground plane reference (for emissive flash)
  _pulseActive: false,          // is a pulse currently traveling?
  _pulseSphere: null,           // the glowing sphere Mesh, or null
  _flatlined: false,            // HUD in failure state?
  _hudCanvas: null,             // EKG <canvas> 2D reference
  _hudCtx: null,                // canvas context
  _hudHistory: null,            // array of recent Y values for the EKG
  _hudTick: 0,                  // frame counter for waveform generation
  _audioCtx: null,              // Web Audio context (lazily created)
  _labPresenting: false,        // lab presentation mode (P key)
  _orbitAngle: 0,               // current auto-orbit angle in radians
  _orbitRadius: 0,              // radius cached from initial camera distance
  _xrayEl: null,                // X-Ray hover label DOM reference
  _hoveredBlock: null,          // block currently under the cursor (for xray)
  _accuracy: 0,                 // current evaluated accuracy (0-100)
  _latency: 0,                  // chain traversal latency in ms
  _integrity: 100,              // signal integrity (100 - noise%) 0-100
  _computePower: 0,             // current compute-power usage %
  _trainingStream: null,        // active training particle stream, or null
  _missionEl: null,             // Mission overlay DOM reference
  _missionComplete: false,      // has the 90% accuracy goal been reached this session?
  _state: LabState.IDLE,        // current workflow state
  _errorTooltipEl: null,        // reusable error tooltip DOM reference
  _errorTooltipTimer: null,     // setTimeout handle for tooltip auto-hide
  _trainingTimer: null,         // 5s countdown setTimeout handle
  _reportTimer: null,           // auto-hide-report setTimeout handle
  _trainingProgressTween: null, // GSAP tween driving the progress bar width
  _explosions: [],              // active particle explosion instances
  _crashLocked: false,          // hard lockout while the "server is rebooting"
  _crashRecoveryTimer: null,    // 3s reboot setTimeout handle
  _rebootIntervalId: null,      // 1s countdown interval handle
  _connectors: [],              // active connection-point glow meshes
  _connectorGeometry: null,     // shared SphereGeometry (built on first use)
  _connectorGreenMat: null,     // valid state material
  _connectorRedMat: null,       // invalid state material
  _cameraShakeStart: 0,         // ms — 0 when not shaking
  _cameraShakeDuration: 0,      // ms
  _trainingStartedAt: 0,        // performance.now() when training started
  // Data Lake / Labeler
  _activeDataset: null,         // 'AGRICULTURE' | 'TRAFFIC' | 'FINANCE' | null
  _rawData: [],                 // [{item, label: 'A'|'B'|null}]
  _labeledCount: 0,             // cumulative labels (across datasets)
  _currentLabelIdx: 0,          // index into _rawData while labeling
  _dataLakeEl: null,
  _labelerEl: null,
  // Live Inference
  _hasTrained: false,           // true after first successful _completeTraining()
  _predictionLabelEl: null,
  _hologramEl: null,            // floating Qwen response panel
  _hologramTimer: null,
  _inferenceInFlight: false,    // guards concurrent remote calls
  _dropHandlers: null,          // captured handlers for cleanup
  // Templates + Nested view
  _templatesEl: null,
  _nestedPanelEl: null,
  _nestedBlock: null,           // the block currently being inspected
  _cameraRestPos: null,         // original camera position (restored on close)
  // Deep Surgery (expanded 3D sub-nodes)
  _isExpanded: false,
  _expandedParent: null,
  _subNodes: [],                // [{ mesh, name, geometry, material, originalOpacity? }]
  _subNodeGeometry: null,       // shared small-sphere geometry
  _subNodeMaterial: null,       // shared emissive material (recolored per block type)
  _draggedSubNode: null,        // currently dragged sub-node
  _closeExpansionEl: null,      // HTML close button shown while expanded
  _parentOriginalOpacity: 1,    // restore on close

  // Preset pipeline scaffolds — spawns the correct block skeleton
  // but leaves them UNCONNECTED. Students must drag and snap them.
  TEMPLATES: {
    'Text Sentiment':  { icon: '💬', blocks: ['DATA', 'TOKENIZE', 'EMBED', 'ATTENTION', 'CLASSIFIER', 'OUTPUT'] },
    'Image Classifier':{ icon: '🖼️', blocks: ['DATA', 'SCALER', 'CNN', 'POOLING', 'LAYER', 'CLASSIFIER', 'OUTPUT'] },
    'Stock Predictor': { icon: '📈', blocks: ['DATA', 'SCALER', 'LAYER', 'LAYER', 'LAYER', 'OUTPUT'] }
  },

  // Public read-only getter so `Lab.state === LabState.TRAINING` works externally.
  get state() { return this._state; },

  // Live telemetry export. Updated by _updateStats() on every block
  // snap, spawn, or amputate. Other code (HUD, tests, external consumers)
  // can read Lab.currentModelStats without recomputing the simulation.
  currentModelStats: {
    accuracy: 0,                // 0..99
    latency: 0,                 // ms
    signalIntegrity: 0.2,       // 0.2 (dirty) or 1.0 (clean)
    totalBlocks: 0,             // blocks connected to DATA
    layerCount: 0,              // LAYER blocks in the chain
    computePower: 0,            // 0..100
    hasPrep: false,
    reachesOutput: false,
    valid: false                // set by validatePipeline()
  },

  // ----------------------------------------------------------
  // Block class — typed-port modular unit. Each of 12 types
  // declares its I/O port types and a unique 3D shape, so
  // the validator can check edge compatibility like a real
  // computation graph.
  // ----------------------------------------------------------
  Block: class Block {
    // SINGLE SOURCE OF TRUTH for every block type:
    //   color    — neon hex for material tint
    //   in/out   — accepted input and produced output port types
    //   shape    — geometry family (see _geometryFor)
    //   icon     — emoji for tray button
    //   title    — human name (also used in X-Ray role label)
    //   subtitle — one-line role description
    static TYPES = {
      DATA:       { color: 0x00d2ff, in: [],                                out: ['RAW','IMAGE','TEXT','TENSOR'],
                    shape: 'box',         icon: '📥', title: 'DATA INGEST',      subtitle: 'Raw input stream' },
      PREP:       { color: 0xff9d00, in: ['RAW'],                           out: ['TENSOR'],
                    shape: 'box',         icon: '🧼', title: 'PREPROCESS',       subtitle: 'Clean & normalize' },
      SCALER:     { color: 0x06b6d4, in: ['RAW','TENSOR'],                  out: ['TENSOR'],
                    shape: 'cylinder',    icon: '📐', title: 'SCALER',           subtitle: 'Normalize feature ranges' },
      TOKENIZE:   { color: 0xec4899, in: ['TEXT'],                          out: ['TOKENS'],
                    shape: 'torus',       icon: '🔤', title: 'TOKENIZE',         subtitle: 'Split text into tokens' },
      EMBED:      { color: 0x8b5cf6, in: ['TOKENS'],                        out: ['VECTOR'],
                    shape: 'icosahedron', icon: '🌐', title: 'EMBED',            subtitle: 'Tokens → dense vectors' },
      LAYER:      { color: 0xbd00ff, in: ['TENSOR','VECTOR','FEATURES'],    out: ['FEATURES'],
                    shape: 'box',         icon: '🧠', title: 'DENSE LAYER',      subtitle: 'Fully connected layer' },
      CNN:        { color: 0x7c3aed, in: ['IMAGE','TENSOR'],                out: ['FEATURES'],
                    shape: 'stackedBox',  icon: '🎞️', title: 'CNN',              subtitle: 'Convolutional features' },
      RNN:        { color: 0x6366f1, in: ['VECTOR','TOKENS'],               out: ['VECTOR','FEATURES'],
                    shape: 'torusKnot',   icon: '🔄', title: 'RNN',              subtitle: 'Sequence modeling' },
      ATTENTION:  { color: 0xfbbf24, in: ['VECTOR'],                        out: ['VECTOR','FEATURES'],
                    shape: 'octahedron',  icon: '💎', title: 'ATTENTION',        subtitle: 'Self-attention heads' },
      POOLING:    { color: 0x14b8a6, in: ['FEATURES'],                      out: ['TENSOR','FEATURES'],
                    shape: 'flatBox',     icon: '📦', title: 'POOLING',          subtitle: 'Downsample features' },
      CLASSIFIER: { color: 0x22c55e, in: ['FEATURES','VECTOR'],             out: ['LABEL'],
                    shape: 'cone',        icon: '🎯', title: 'CLASSIFIER',       subtitle: 'Features → class label' },
      OUTPUT:     { color: 0x33ff00, in: ['LABEL','FEATURES','TENSOR','VECTOR'], out: [],
                    shape: 'box',         icon: '📤', title: 'MODEL OUTPUT',     subtitle: 'Final prediction' }
    };

    // Back-compat maps (used by older code paths + xray label lookup)
    static get COLORS() {
      const m = {}; for (const k in Block.TYPES) m[k] = Block.TYPES[k].color; return m;
    }
    static get ROLES() {
      const m = {};
      for (const k in Block.TYPES) {
        m[k] = { title: Block.TYPES[k].title, subtitle: Block.TYPES[k].subtitle };
      }
      return m;
    }

    // Internal Micro-Workflow — sub-nodes revealed when a block is
    // "opened" via Deep Surgery (dblclick). Spawned as small spheres
    // inside the expanded block's volume.
    static SUB_WORKFLOWS = {
      DATA:       ['Source',      'Buffer'],
      PREP:       ['Imputer',     'Deduper',   'Clipper'],
      SCALER:     ['μ (mean)',    'σ (stddev)', 'Normalize'],
      TOKENIZE:   ['Split',       'BPE',       'Max 512'],
      EMBED:      ['Lookup',      'Dim 256',   'Norm'],
      LAYER:      ['Weights',     'Bias',      'ReLU'],
      CNN:        ['Filters',     'Kernel 3x3','Stride 1',  'ReLU'],
      RNN:        ['HiddenState', 'LSTM Cell', 'Timestep'],
      ATTENTION:  ['Query',       'Key',       'Value',     'Softmax'],
      POOLING:    ['Pool 2x2',    'Stride 2'],
      CLASSIFIER: ['Logits',      'Softmax',   'Argmax'],
      OUTPUT:     ['Formatter',   'Sink']
    };

    static SIZE = { w: 1.5, h: 0.5, d: 1.5 };
    static CORNER_RADIUS = 0.12;
    static _geometryCache = {};

    constructor(type) {
      if (!(type in Block.TYPES)) {
        throw new Error(`Unknown block type: ${type}`);
      }
      this.type = type;
      const spec = Block.TYPES[type];
      this.inputTypes  = spec.in.slice();
      this.outputTypes = spec.out.slice();

      const geometry = Block._geometryFor(type);
      // PBR with iridescence + clearcoat + sheen. Colors / shapes are
      // unchanged — those are the pedagogical anchors students learn
      // ("pink torus = TOKENIZE"). Only the rendering upgrades.
      const sheenCol = new THREE.Color(spec.color).multiplyScalar(0.6);
      const material = new THREE.MeshPhysicalMaterial({
        color: spec.color,
        emissive: spec.color,
        emissiveIntensity: 0.22,            // dialed down — aurora lights carry the scene
        roughness: 0.18,
        metalness: 0.35,
        clearcoat: 0.8,
        clearcoatRoughness: 0.12,
        iridescence: 1.0,
        iridescenceIOR: 1.35,
        iridescenceThicknessRange: [120, 820],
        sheen: 0.4,
        sheenColor: sheenCol,
        // Keep a touch of transmission so the blocks read as glassy crystals
        transmission: 0.25,
        thickness: 1.4,
        ior: 1.45
      });
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.userData.block = this;
    }

    // Per-type geometry factory. Cached per type so all instances of
    // a given block share one BufferGeometry.
    static _geometryFor(type) {
      if (Block._geometryCache[type]) return Block._geometryCache[type];
      const { w, h, d } = Block.SIZE;
      const shape = (Block.TYPES[type] && Block.TYPES[type].shape) || 'box';
      let geom;
      switch (shape) {
        case 'cylinder':
          geom = new THREE.CylinderGeometry(w * 0.42, w * 0.42, h * 1.2, 24);
          break;
        case 'torus':
          geom = new THREE.TorusGeometry(w * 0.4, h * 0.32, 14, 28);
          geom.rotateX(Math.PI / 2);                  // lay flat
          break;
        case 'icosahedron':
          geom = new THREE.IcosahedronGeometry(w * 0.55, 1);
          break;
        case 'stackedBox':
          // Tall stepped box — visually reads as stacked layers
          geom = new THREE.BoxGeometry(w * 0.85, h * 1.7, d * 0.85, 1, 4, 1);
          break;
        case 'torusKnot':
          geom = new THREE.TorusKnotGeometry(w * 0.34, h * 0.22, 80, 10, 2, 3);
          break;
        case 'octahedron':
          geom = new THREE.OctahedronGeometry(w * 0.6, 0);
          break;
        case 'flatBox':
          geom = Block._roundedBoxGeometry(w, h * 0.55, d);
          break;
        case 'cone':
          geom = new THREE.ConeGeometry(w * 0.55, h * 1.6, 4);   // pyramid
          break;
        case 'box':
        default:
          geom = Block._roundedBoxGeometry(w, h, d);
      }
      geom.center();
      Block._geometryCache[type] = geom;
      return geom;
    }

    // The original rounded-box extrusion, used by box + flatBox shapes
    static _roundedBoxGeometry(w, h, d) {
      const r = Block.CORNER_RADIUS;
      const eps = 0.00001;
      const ra = r - eps;
      const shape = new THREE.Shape();
      shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
      shape.absarc(eps, h - ra * 2, eps, Math.PI, Math.PI / 2, true);
      shape.absarc(w - ra * 2, h - ra * 2, eps, Math.PI / 2, 0, true);
      shape.absarc(w - ra * 2, eps, eps, 0, -Math.PI / 2, true);
      const geom = new THREE.ExtrudeGeometry(shape, {
        depth: d - r * 2,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: r,
        bevelThickness: r,
        curveSegments: 4
      });
      geom.rotateX(-Math.PI / 2);
      return geom;
    }

    // Place the block on the grid at (x, z). Y locked to resting height.
    placeAt(x, z) {
      this.mesh.position.set(x, Block.SIZE.h / 2, z);
    }

    // The four attachment points where another block could snap.
    // Positions are "this block's center shifted by its full size on one axis",
    // so another block parked there sits edge-to-edge without overlap.
    attachmentPoints() {
      const { w, d } = Block.SIZE;
      const p = this.mesh.position;
      return [
        { x: p.x + w, z: p.z     },  // east
        { x: p.x - w, z: p.z     },  // west
        { x: p.x,     z: p.z - d },  // north
        { x: p.x,     z: p.z + d }   // south
      ];
    }
  },

  // ----------------------------------------------------------
  // DataStream — THREE.Points river of N particles flowing along
  // a polyline path. Jitter scales with (1 - signalIntegrity),
  // so clean pipelines render as a tight line and dirty ones
  // look chaotic.
  // ----------------------------------------------------------
  DataStream: class DataStream {
    constructor(scene, pathPoints, options = {}) {
      this.scene       = scene;
      this.pathPoints  = pathPoints;
      this.count       = options.count       || 200;
      this.integrity   = options.integrity  == null ? 1.0 : options.integrity;
      this.baseJitter  = options.baseJitter  || 0.04;
      this.chaosJitter = options.chaosJitter || 1.5;

      const positions = new Float32Array(this.count * 3);
      const progress  = new Float32Array(this.count);
      const speed     = new Float32Array(this.count);
      for (let i = 0; i < this.count; i++) {
        progress[i] = Math.random();
        speed[i]    = 0.003 + Math.random() * 0.003;
      }
      this.positions = positions;
      this.progress  = progress;
      this.speed     = speed;

      this.geometry = new THREE.BufferGeometry();
      this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      this.material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.18,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      });

      this.points = new THREE.Points(this.geometry, this.material);
      scene.add(this.points);
      this.tick(true);
    }

    setIntegrity(si) { this.integrity = si; }

    tick(seed = false) {
      const pts = this.pathPoints;
      if (!pts || pts.length < 2) return;
      const segments = pts.length - 1;
      const pathY = Lab.Block.SIZE.h + 0.2;
      const jitterAmp = this.baseJitter + (1 - this.integrity) * this.chaosJitter;
      const arr = this.geometry.attributes.position.array;
      for (let i = 0; i < this.count; i++) {
        if (!seed) {
          this.progress[i] += this.speed[i];
          if (this.progress[i] > 1) this.progress[i] -= 1;
        }
        const t = this.progress[i] * segments;
        const segIdx = Math.min(Math.floor(t), segments - 1);
        const localT = t - segIdx;
        const a = pts[segIdx];
        const b = pts[segIdx + 1];
        arr[i * 3]     = a.x + (b.x - a.x) * localT + (Math.random() - 0.5) * jitterAmp;
        arr[i * 3 + 1] = pathY                    + (Math.random() - 0.5) * jitterAmp * 0.4;
        arr[i * 3 + 2] = a.z + (b.z - a.z) * localT + (Math.random() - 0.5) * jitterAmp;
      }
      this.geometry.attributes.position.needsUpdate = true;
    }

    dispose() {
      if (this.scene && this.points) this.scene.remove(this.points);
      if (this.geometry) this.geometry.dispose();
      if (this.material) this.material.dispose();
      this.scene = null; this.points = null;
      this.geometry = null; this.material = null;
    }
  },

  enter() {
    if (this._active) return;
    const container = document.getElementById('lab-container');
    const appContainer = document.getElementById('app-container');
    if (!container) return;
    this._active = true;
    if (appContainer) appContainer.style.display = 'none';
    container.style.display = 'block';

    if (typeof THREE !== 'undefined') {
      this._buildScene(container);
      // Consume any code handed off from a class page's Try-in-Lab button.
      // Display it in the hologram as seed context so the student sees the
      // connection between the class slide and the lab.
      try {
        const seed = sessionStorage.getItem('lab-playground-code');
        if (seed && this._showHologram) {
          this._showHologram({
            title: 'Seed · from class slide',
            body: seed,
            meta: 'paste: sessionStorage · lab-playground-code',
            error: false
          });
          sessionStorage.removeItem('lab-playground-code');
        }
      } catch {}
      // Consume any broken-state scenario from the originating class.
      try {
        const raw = sessionStorage.getItem('lab-scenario');
        if (raw) {
          this.loadScenario(JSON.parse(raw));
          sessionStorage.removeItem('lab-scenario');
        }
      } catch {}
    } else {
      this._showPlaceholder(container);
    }
  },

  // ----------------------------------------------------------
  // SCENARIO LOADER — applies a "broken state" to the scene so
  // the student has a visible problem to fix via the class's
  // lesson. Driven by COURSE_DATA[classKey].brokenState.
  // ----------------------------------------------------------
  loadScenario(state) {
    if (!state || !this._scene) return;
    this._scenarioState = state;

    // Show the scenario banner via hologram so the student sees the story.
    if (state.description && this._showHologram) {
      this._showHologram({
        title: `Scenario · ${(state.type || 'broken').toUpperCase()}`,
        body: state.description,
        meta: 'Lab diagnostics · apply this class\'s lesson to recover',
        error: true
      });
    }

    // physicsDisabled → drift all blocks (no physics engine, so use GSAP
    // to animate small random translations until clearScenario() resets).
    if (state.physicsDisabled) {
      this._startScenarioDrift();
    }

    // grayscale → CSS filter on the canvas (zero post-processing cost).
    if (state.grayscale && this._renderer && this._renderer.domElement) {
      this._renderer.domElement.style.transition = 'filter 0.8s ease';
      this._renderer.domElement.style.filter = 'grayscale(1) contrast(1.05)';
    }

    // Viewport vignette: darken edges so all eyes go to the central
    // problem. Toggled via body class — CSS handles the overlay.
    const labRoot = document.getElementById('lab-container');
    if (labRoot) labRoot.classList.add('is-scenario-active');
  },

  // Clears any active scenario: stops drift, restores color, removes vignette.
  clearScenario() {
    this._scenarioState = null;
    if (this._scenarioDriftTweens) {
      this._scenarioDriftTweens.forEach(t => t.kill && t.kill());
      this._scenarioDriftTweens = [];
    }
    if (this._renderer && this._renderer.domElement) {
      this._renderer.domElement.style.filter = '';
    }
    const labRoot = document.getElementById('lab-container');
    if (labRoot) labRoot.classList.remove('is-scenario-active');
  },

  _startScenarioDrift() {
    if (typeof gsap === 'undefined' || !this._blocks) return;
    this._scenarioDriftTweens = (this._scenarioDriftTweens || []);
    this._blocks.forEach(b => {
      if (!b || !b.mesh) return;
      const ox = b.mesh.position.x, oy = b.mesh.position.y, oz = b.mesh.position.z;
      const tween = gsap.to(b.mesh.position, {
        x: ox + (Math.random() - 0.5) * 1.2,
        y: oy + 0.3 + Math.random() * 0.6,
        z: oz + (Math.random() - 0.5) * 1.2,
        duration: 2.4 + Math.random() * 1.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
      this._scenarioDriftTweens.push(tween);
    });
  },

  exit() {
    if (!this._active) return;
    this._active = false;

    // Stop the render loop first so no frames reference freed objects
    if (this._animationId) {
      cancelAnimationFrame(this._animationId);
      this._animationId = null;
    }
    // Detach resize handler
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
      this._resizeHandler = null;
    }
    // Detach all mouse / drag handlers
    const container = document.getElementById('lab-container');
    if (this._mouseHandler && container) {
      container.removeEventListener('mousemove', this._mouseHandler);
      this._mouseHandler = null;
    }
    if (this._mouseDownHandler && container) {
      container.removeEventListener('mousedown', this._mouseDownHandler);
      this._mouseDownHandler = null;
    }
    if (this._mouseUpHandler) {
      window.removeEventListener('mouseup', this._mouseUpHandler);
      if (container) container.removeEventListener('mouseleave', this._mouseUpHandler);
      this._mouseUpHandler = null;
    }
    if (this._dblClickHandler && container) {
      container.removeEventListener('dblclick', this._dblClickHandler);
      this._dblClickHandler = null;
    }
    if (this._keydownHandler) {
      window.removeEventListener('keydown', this._keydownHandler);
      this._keydownHandler = null;
    }
    // Kill any in-flight GSAP tweens touching blocks, grid, plane, pulse
    if (window.gsap) {
      this._blocks.forEach(b => {
        gsap.killTweensOf(b.mesh.position);
        gsap.killTweensOf(b.mesh.scale);
      });
      if (this._pulseSphere) gsap.killTweensOf(this._pulseSphere.position);
      if (this._grid) gsap.killTweensOf(this._grid.material.color);
      if (this._plane) {
        gsap.killTweensOf(this._plane.material.color);
        gsap.killTweensOf(this._plane.material.emissive);
      }
    }
    // Dispose the pulse sphere if one is in flight
    if (this._pulseSphere) {
      if (this._pulseSphere.geometry) this._pulseSphere.geometry.dispose();
      if (this._pulseSphere.material) this._pulseSphere.material.dispose();
      this._pulseSphere = null;
    }
    // Close audio context (suspend OK; closing is cleaner)
    if (this._audioCtx && typeof this._audioCtx.close === 'function') {
      try { this._audioCtx.close(); } catch (e) {}
      this._audioCtx = null;
    }

    // Drop the lab-presenting class from body if it was on
    document.body.classList.remove('lab-presenting');
    if (window.gsap && this._camera) gsap.killTweensOf(this._camera.position);

    // Stop the training stream and free its GPU buffers
    if (this._trainingStream) {
      if (this._scene) this._scene.remove(this._trainingStream.points);
      if (this._trainingStream.geometry) this._trainingStream.geometry.dispose();
      if (this._trainingStream.material) this._trainingStream.material.dispose();
      this._trainingStream = null;
    }

    // Clear any outstanding validation error tooltip
    if (this._errorTooltipTimer) {
      clearTimeout(this._errorTooltipTimer);
      this._errorTooltipTimer = null;
    }
    this._errorTooltipEl = null;

    // Clear training sequence timers + tween
    if (this._trainingTimer) { clearTimeout(this._trainingTimer); this._trainingTimer = null; }
    if (this._reportTimer)   { clearTimeout(this._reportTimer); this._reportTimer = null; }
    if (this._trainingProgressTween) { this._trainingProgressTween.kill(); this._trainingProgressTween = null; }
    // Clear crash timers
    if (this._crashRecoveryTimer) { clearTimeout(this._crashRecoveryTimer); this._crashRecoveryTimer = null; }
    if (this._rebootIntervalId)   { clearInterval(this._rebootIntervalId); this._rebootIntervalId = null; }
    this._crashLocked = false;
    // Dispose any active explosion instances
    if (this._explosions && this._explosions.length > 0) {
      this._explosions.forEach(exp => {
        if (this._scene) this._scene.remove(exp.mesh);
        if (exp.geometry) exp.geometry.dispose();
        if (exp.material) exp.material.dispose();
      });
      this._explosions = [];
    }
    // Dispose connector visuals (shared geometry + materials reset for next enter)
    if (this._connectors && this._connectors.length > 0) {
      this._connectors.forEach(m => { if (this._scene) this._scene.remove(m); });
      this._connectors = [];
    }
    if (this._connectorGeometry) { this._connectorGeometry.dispose(); this._connectorGeometry = null; }
    if (this._connectorGreenMat) { this._connectorGreenMat.dispose(); this._connectorGreenMat = null; }
    if (this._connectorRedMat)   { this._connectorRedMat.dispose();   this._connectorRedMat   = null; }
    this._cameraShakeStart = 0;
    this._cameraShakeDuration = 0;
    this._trainingStartedAt = 0;
    // Data Lake / Labeler / Inference cleanup
    clearTimeout(this._predictionTimer);
    this._predictionTimer = null;
    this._activeDataset = null;
    this._rawData = [];
    this._labeledCount = 0;
    this._currentLabelIdx = 0;
    this._dataLakeEl = null;
    this._labelerEl = null;
    this._predictionLabelEl = null;
    this._hologramEl = null;
    clearTimeout(this._hologramTimer); this._hologramTimer = null;
    this._inferenceInFlight = false;
    this._hasTrained = false;
    this._dropHandlers = null;   // DOM is torn down with container.innerHTML reset
    this._templatesEl = null;
    this._nestedPanelEl = null;
    this._nestedBlock = null;
    this._cameraRestPos = null;
    // Deep Surgery cleanup
    this._isExpanded = false;
    document.body.classList.remove('lab-expanded');
    this._expandedParent = null;
    this._draggedSubNode = null;
    this._closeExpansionEl = null;
    this._parentOriginalOpacity = 1;
    if (this._subNodes && this._subNodes.length > 0) {
      this._subNodes.forEach(sn => { if (sn.mesh.parent) sn.mesh.parent.remove(sn.mesh); });
      this._subNodes = [];
    }
    if (this._subNodeGeometry) { this._subNodeGeometry.dispose(); this._subNodeGeometry = null; }
    if (this._subNodeMaterial) { this._subNodeMaterial.dispose(); this._subNodeMaterial = null; }
    // Dispose cached per-type geometries so next enter() rebuilds fresh
    if (Lab.Block._geometryCache) {
      Object.values(Lab.Block._geometryCache).forEach(g => g && g.dispose && g.dispose());
      Lab.Block._geometryCache = {};
    }
    // Restore any excited LAYER blocks to their neutral state before we nuke the scene
    this._calmLayers();

    this._blocks = [];
    this._draggedBlock = null;
    this._dragOffset = null;
    this._pulseActive = false;
    this._flatlined = false;
    this._grid = null;
    this._plane = null;
    this._hudCanvas = null;
    this._hudCtx = null;
    this._hudHistory = null;
    this._hudTick = 0;
    this._labPresenting = false;
    this._orbitAngle = 0;
    this._orbitRadius = 0;
    this._xrayEl = null;
    this._hoveredBlock = null;
    this._accuracy = 0;
    this._latency = 0;
    this._integrity = 100;
    this._computePower = 0;
    this._missionEl = null;
    this._missionComplete = false;
    this._state = LabState.IDLE;
    // Walk the scene graph and dispose every GPU resource
    if (this._scene) {
      this._disposeSceneGraph(this._scene);
      this._scene = null;
    }
    // Tear down the renderer and its WebGL context
    if (this._renderer) {
      if (typeof this._renderer.dispose === 'function') this._renderer.dispose();
      if (typeof this._renderer.forceContextLoss === 'function') this._renderer.forceContextLoss();
      const dom = this._renderer.domElement;
      if (dom && dom.parentNode) dom.parentNode.removeChild(dom);
      this._renderer = null;
    }
    this._camera = null;

    // Hide + clear the lab container, show the app back
    const appContainer = document.getElementById('app-container');
    if (container) {
      container.innerHTML = '';
      container.style.display = 'none';
    }
    if (appContainer) appContainer.style.display = '';
  },

  _showPlaceholder(container) {
    container.innerHTML = `
      <div class="lab-placeholder">
        <h2>Cyber-Surgical Lab</h2>
        <p>This is where the Three.js scene will load. Scaffolding is in place — add the Three.js library and fill in <code>Lab._buildScene()</code> in <code>app.js</code>.</p>
        <p class="lab-hint">Navigate anywhere else to exit and dispose the scene.</p>
      </div>
    `;
  },

  _buildScene(container) {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    this._scene = new THREE.Scene();

    // Camera — 40° FOV (tight cinematic lens), eye-level cockpit view.
    // Target lifted to y=3.5 so the scene fills the central void.
    this._camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    this._camera.position.set(0, 5, 14);
    this._cameraTarget = new THREE.Vector3(0, 3.5, 0);
    this._camera.lookAt(this._cameraTarget);

    // Renderer — antialias, deep-violet clear, ACES Filmic tone mapping
    // for cinematic highlight roll-off (same curve Apple Vision / Runway use).
    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setSize(width, height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this._renderer.setClearColor(0x07041a, 1);
    this._renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this._renderer.toneMappingExposure = 1.15;
    this._renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this._renderer.domElement);

    // Atmospheric fog — same violet as the clear color so distant geometry
    // dissolves into the background instead of hitting a hard edge.
    this._scene.fog = new THREE.Fog(0x07041a, 10, 32);

    // Reflective floor — MeshPhysicalMaterial with clearcoat gives the
    // aurora lights a soft glossy bounce (replaces the flat 1995 plane).
    const planeGeo = new THREE.PlaneGeometry(20, 20);
    const planeMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a051c,
      roughness: 0.55,
      metalness: 0.2,
      clearcoat: 0.35,
      clearcoatRoughness: 0.4
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.001;
    this._scene.add(plane);
    this._plane = plane;

    // Violet grid at 35% opacity — softer, less CRT, more architectural plan.
    const grid = new THREE.GridHelper(20, 20, 0x3a2a5a, 0x3a2a5a);
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    this._scene.add(grid);
    this._grid = grid;

    // Back-wall grid — rotated 90° on X so it stands vertical, placed
    // at z = -5 to create a depth plane behind the blocks. Very low
    // opacity so it reads as atmosphere, not foreground geometry.
    const wallGrid = new THREE.GridHelper(20, 20, 0x3a2a5a, 0x3a2a5a);
    wallGrid.rotation.x = Math.PI / 2;
    wallGrid.position.z = -5;
    wallGrid.position.y = 5;                    // lift so it spans the vertical field
    wallGrid.material.transparent = true;
    wallGrid.material.opacity = 0.05;
    this._scene.add(wallGrid);
    this._wallGrid = wallGrid;

    // Brighter ambient with a violet tint so shadow areas aren't pitch black.
    this._scene.add(new THREE.AmbientLight(0x1a1030, 0.45));

    // 4-light aurora rig — violet key (mouse-tracked flashlight) + cyan,
    // pink, gold drifters slowly orbiting at head height. Each gets a
    // seed phase so they never line up.
    const pointLight = new THREE.PointLight(0xa78bfa, 22, 14, 2);   // violet key (was cyan @ 30)
    pointLight.position.set(0, 3.2, 0);
    this._scene.add(pointLight);

    this._auroraLights = [
      { light: new THREE.PointLight(0x5eead4, 10, 10, 2), r: 5.5, h: 2.8, speed: 0.00035, phase: 0.0 },          // cyan
      { light: new THREE.PointLight(0xf472b6, 10, 10, 2), r: 6.0, h: 3.4, speed: 0.00028, phase: Math.PI * 0.66 }, // pink
      { light: new THREE.PointLight(0xfbbf24,  8,  9, 2), r: 4.8, h: 4.2, speed: 0.00041, phase: Math.PI * 1.33 }  // gold
    ];
    this._auroraLights.forEach(spec => this._scene.add(spec.light));

    // 400-point aurora dust cloud — additive-blended so it brightens edges,
    // gives volumetric depth without post-processing.
    const DUST = 400;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(DUST * 3);
    const dustCol = new Float32Array(DUST * 3);
    const dustPal = [
      [0.37, 0.92, 0.83],  // aurora-1 mint
      [0.65, 0.55, 0.98],  // aurora-3 violet
      [0.96, 0.45, 0.71],  // aurora-4 pink
      [0.99, 0.75, 0.14]   // aurora-6 gold
    ];
    for (let i = 0; i < DUST; i++) {
      // Scatter in a ring cloud — avoid spawning right on the grid.
      const r = 2 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      dustPos[i * 3 + 0] = Math.cos(theta) * r;
      dustPos[i * 3 + 1] = 0.4 + Math.random() * 5.5;
      dustPos[i * 3 + 2] = Math.sin(theta) * r;
      const [cr, cg, cb] = dustPal[i % dustPal.length];
      dustCol[i * 3 + 0] = cr;
      dustCol[i * 3 + 1] = cg;
      dustCol[i * 3 + 2] = cb;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color',    new THREE.BufferAttribute(dustCol, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    this._auroraDust = new THREE.Points(dustGeo, dustMat);
    this._scene.add(this._auroraDust);

    // Start with an empty grid — blocks spawn from the HTML tray below.
    this._blocks = [];

    // Remember the initial camera distance for auto-orbit later
    this._orbitRadius = this._camera.position.length();
    this._orbitAngle = Math.atan2(this._camera.position.z, this._camera.position.x);

    // Shared raycast state used by both the flashlight and drag handlers
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hitPoint = new THREE.Vector3();
    this._dragOffset = new THREE.Vector3();

    const updateMouseNDC = (e) => {
      const rect = container.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    // ---- mousedown: pick up the block under the cursor ----
    this._mouseDownHandler = (e) => {
      if (this._state === LabState.TRAINING || this._crashLocked) return;
      updateMouseNDC(e);
      raycaster.setFromCamera(mouseNDC, this._camera);

      // When expanded, prefer sub-node picking (internal drag)
      if (this._isExpanded && this._subNodes.length > 0) {
        const subMeshes = this._subNodes.map(s => s.mesh);
        const subHits = raycaster.intersectObjects(subMeshes, false);
        if (subHits.length > 0) {
          const subMesh = subHits[0].object;
          this._draggedSubNode = subMesh;
          if (raycaster.ray.intersectPlane(groundPlane, hitPoint)) {
            this._dragOffset.set(
              subMesh.position.x - hitPoint.x, 0,
              subMesh.position.z - hitPoint.z
            );
          } else {
            this._dragOffset.set(0, 0, 0);
          }
          container.style.cursor = 'grabbing';
          return;
        }
        // Click in empty space while expanded → ignore (don't grab main block)
        return;
      }

      const meshes = this._blocks.map(b => b.mesh);
      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length === 0) return;
      const hitBlock = hits[0].object.userData.block;
      this._draggedBlock = hitBlock;
      // Offset from current block center to the ground-plane hit point,
      // so drag doesn't "teleport" the block to the cursor instantly.
      if (raycaster.ray.intersectPlane(groundPlane, hitPoint)) {
        this._dragOffset.set(
          hitBlock.mesh.position.x - hitPoint.x,
          0,
          hitBlock.mesh.position.z - hitPoint.z
        );
      } else {
        this._dragOffset.set(0, 0, 0);
      }
      // Cancel any in-flight snap tween on this block
      if (window.gsap) gsap.killTweensOf(hitBlock.mesh.position);
      container.style.cursor = 'grabbing';
    };
    container.addEventListener('mousedown', this._mouseDownHandler);

    // ---- mousemove: update flashlight + drag the block if any ----
    this._mouseHandler = (e) => {
      updateMouseNDC(e);
      raycaster.setFromCamera(mouseNDC, this._camera);
      if (!raycaster.ray.intersectPlane(groundPlane, hitPoint)) return;

      // Flashlight follows cursor
      pointLight.position.set(hitPoint.x, 3, hitPoint.z);

      if (this._draggedSubNode) {
        // Internal drag: slide the sub-node (y stays locked — hover height)
        this._draggedSubNode.position.x = hitPoint.x + this._dragOffset.x;
        this._draggedSubNode.position.z = hitPoint.z + this._dragOffset.z;
      } else if (this._draggedBlock) {
        // Slide the block along the grid, preserving original click offset
        this._draggedBlock.mesh.position.x = hitPoint.x + this._dragOffset.x;
        this._draggedBlock.mesh.position.z = hitPoint.z + this._dragOffset.z;
        this._hideXrayLabel();
      } else {
        // Hover: show grab cursor + xray label if pointing at a block
        const meshes = this._blocks.map(b => b.mesh);
        const hoverHits = raycaster.intersectObjects(meshes, false);
        if (hoverHits.length > 0) {
          container.style.cursor = 'grab';
          const block = hoverHits[0].object.userData.block;
          if (this._hoveredBlock !== block) this._showXrayLabel(block);
        } else {
          container.style.cursor = '';
          if (this._hoveredBlock) this._hideXrayLabel();
        }
      }
    };
    container.addEventListener('mousemove', this._mouseHandler);

    // ---- mouseup: drop, and snap to nearest connector if close enough ----
    this._mouseUpHandler = () => {
      // Sub-node drop (internal snap inside expanded block)
      if (this._draggedSubNode) {
        const dropped = this._draggedSubNode;
        this._draggedSubNode = null;
        container.style.cursor = '';
        // Snap to nearest sub-node within 0.55 units (smaller than block snap)
        const threshold = 0.55;
        let bestDx = 0, bestDz = 0, bestDist = threshold;
        this._subNodes.forEach(other => {
          if (other.mesh === dropped) return;
          const dx = other.mesh.position.x - dropped.position.x;
          const dz = other.mesh.position.z - dropped.position.z;
          const d = Math.sqrt(dx * dx + dz * dz);
          if (d < bestDist && d > 0.05) {
            // Offer a snap that parks dropped right next to `other`
            const offsetDir = (dropped.position.x < other.mesh.position.x) ? -1 : 1;
            bestDx = other.mesh.position.x + offsetDir * 0.42;
            bestDz = other.mesh.position.z;
            bestDist = d;
          }
        });
        if (bestDist < threshold && window.gsap) {
          gsap.to(dropped.position, { x: bestDx, z: bestDz, duration: 0.28, ease: 'back.out(2.4)' });
        }
        return;
      }

      if (!this._draggedBlock) return;
      const dropped = this._draggedBlock;
      this._draggedBlock = null;
      container.style.cursor = '';

      const snapHit = this._findSnapTarget(dropped);
      // If snapping would create a type-mismatched edge, reject and warn.
      if (snapHit && snapHit.neighbor) {
        const a = dropped, b = snapHit.neighbor;
        const aOutMatchesBIn = (a.outputTypes || []).some(t => (b.inputTypes || []).includes(t));
        const bOutMatchesAIn = (b.outputTypes || []).some(t => (a.inputTypes || []).includes(t));
        if (!aOutMatchesBIn && !bOutMatchesAIn) {
          const toTitle = Lab.Block.TYPES[b.type]?.title || b.type;
          const needs = (b.inputTypes || []).join(' / ') || 'no input';
          const gave  = (a.outputTypes || []).join(' / ') || 'nothing';
          this._showErrorTooltip(
            `⚠ Type Mismatch: ${toTitle} requires ${needs}, received ${gave}`,
            b
          );
          this._shakeBlock(b);
          this._updateStats();
          return;   // don't snap
        }
      }

      if (snapHit && window.gsap) {
        gsap.to(dropped.mesh.position, {
          x: snapHit.x, z: snapHit.z,
          duration: 0.32,
          ease: 'back.out(2.4)',
          onComplete: () => this._updateStats()
        });
      } else if (snapHit) {
        dropped.mesh.position.x = snapHit.x;
        dropped.mesh.position.z = snapHit.z;
        this._updateStats();
      } else {
        this._updateStats();
      }
    };
    window.addEventListener('mouseup', this._mouseUpHandler);
    // Safety: if the user drags off-canvas then releases, mouseleave also drops
    container.addEventListener('mouseleave', this._mouseUpHandler);

    // ---- dblclick: Deep Surgery (open the block) ----
    // Amputation has moved to the Delete / Backspace key.
    this._dblClickHandler = (e) => {
      if (this._crashLocked) return;
      if (this._isExpanded) return;                       // already inside a block
      if (this._state === LabState.TRAINING) return;      // no inspection during training
      updateMouseNDC(e);
      raycaster.setFromCamera(mouseNDC, this._camera);
      const meshes = this._blocks.map(b => b.mesh);
      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length === 0) return;
      this.expandBlock(hits[0].object.userData.block);
    };
    container.addEventListener('dblclick', this._dblClickHandler);

    // ---- keydown: S triggers the pulse, P toggles lab presentation ----
    this._keydownHandler = (e) => {
      if (!this._active) return;
      if (this._crashLocked) return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.key === 'Escape' && this._isExpanded) {
        e.preventDefault();
        this.closeExpansion();
        return;
      }
      if (e.key === 'Escape' && this._nestedPanelEl && this._nestedPanelEl.classList.contains('is-open')) {
        e.preventDefault();
        this._closeNestedView();
        return;
      }
      // Delete/Backspace: amputate the hovered block (or trigger crash if training)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        const target = this._hoveredBlock;
        if (!target) return;
        if (this._isExpanded) return;   // don't allow parent deletion while expanded
        if (this._state === LabState.TRAINING) {
          this._triggerHardwareCrash(target);
        } else {
          this._amputateBlock(target);
        }
        return;
      }
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        // Validate strictly before the pulse runs. Invalid → warning label.
        const result = this.validatePipeline();
        if (!result.valid) {
          this._showValidationError(result);
          return;
        }
        this.triggerPulse();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        this.togglePresentation();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        this._toggleTrainingStream();
      }
    };
    window.addEventListener('keydown', this._keydownHandler);

    // ---- UI Cockpit: single framed wrapper for all chrome overlays.
    // Existing builders keep appending to `container`; we then re-parent
    // their results into the cockpit so they respect the 1600px frame
    // + consistent 32×48px padding, without refactoring each builder.
    this._buildHUD(container);

    // ---- Surgical Tray + X-Ray label + Mission overlay ----
    this._buildTray(container);
    this._buildXrayLabel(container);
    this._buildMission(container);
    // ---- Data Lake + Labeler + Prediction label + drag-drop ----
    this._buildDataLake(container);
    this._buildLabeler(container);
    this._buildPredictionLabel(container);
    this._buildHologram(container);

    // Wrap the overlays in #ui-cockpit after creation.
    const cockpit = document.createElement('div');
    cockpit.id = 'ui-cockpit';
    container.appendChild(cockpit);
    ['.lab-hud', '.lab-mission', '.surgical-tray', '.lab-hologram', '.lab-prediction-label', '.xray-label', '.lab-data-lake', '.lab-labeler']
      .forEach(sel => {
        const el = container.querySelector(sel);
        if (el && el.parentElement === container) cockpit.appendChild(el);
      });

    // Telemetry stream — scrolling system log at 10% opacity, bridges
    // the vertical gap between HUD and tray with "live data" aesthetic.
    this._buildTelemetryStream(container);
    this._attachInferenceDropZone(container);
    // ---- Templates panel + Nested (Deep Surgery) view ----
    this._buildTemplatesPanel(container);
    this._buildNestedPanel(container);
    this._attachRightClickHandler(container);

    // Initial HUD render so bars show defaults
    this._updateStats();

    // Probe OpenRouter once on init; if reachable, advertise it in the HUD.
    this._pingRemote();

    // Resize: keep aspect ratio correct if the window changes
    this._resizeHandler = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      this._camera.aspect = w / h;
      this._camera.updateProjectionMatrix();
      this._renderer.setSize(w, h);
    };
    window.addEventListener('resize', this._resizeHandler);

    // Render loop — stored handle so exit() can cancel cleanly
    const animate = () => {
      this._animationId = requestAnimationFrame(animate);
      const t = performance.now();

      // Slow auto-orbit in lab presentation mode
      if (this._labPresenting) {
        this._orbitAngle += 0.0018;  // ~one revolution per 58s @ 60fps
        const r = this._orbitRadius;
        this._camera.position.x = Math.cos(this._orbitAngle) * r;
        this._camera.position.z = Math.sin(this._orbitAngle) * r;
        this._camera.position.y = 5;
        this._camera.lookAt(this._cameraTarget || new THREE.Vector3(0, 3.5, 0));
      }

      // Drift the 3 aurora lights in independent orbits — gives the scene
      // subtle colour movement even when the student is idle.
      if (this._auroraLights) {
        for (const spec of this._auroraLights) {
          const a = t * spec.speed + spec.phase;
          spec.light.position.set(Math.cos(a) * spec.r, spec.h, Math.sin(a) * spec.r);
        }
      }

      // Aurora dust: gentle rotation + vertical bob so the cloud breathes.
      if (this._auroraDust) {
        this._auroraDust.rotation.y = t * 0.00004;
        this._auroraDust.position.y = Math.sin(t * 0.00025) * 0.08;
      }

      // Keep the X-Ray label glued to the hovered block as camera moves
      if (this._hoveredBlock && this._xrayEl) this._updateXrayPosition();

      // Flow particles along the pipeline if training is running
      if (this._trainingStream) this._updateTrainingStream();

      // Layer excitation (vibration + emissive pulse) during training
      if (this._state === LabState.TRAINING) this._animateLayerExcitation();

      // Update any active particle explosions (crash events)
      if (this._explosions && this._explosions.length > 0) this._updateExplosions();

      // Apply transient camera shake (e.g., during crash) as the last
      // camera modification before render, so it composes with orbit
      if (this._cameraShakeStart) this._applyCameraShake();

      this._renderer.render(this._scene, this._camera);
    };
    animate();
  },

  // Dispose every geometry, material, and texture attached to a scene graph.
  // Called from exit() so the GPU doesn't leak across navigations.
  _disposeSceneGraph(scene) {
    scene.traverse(obj => {
      if (obj.geometry && typeof obj.geometry.dispose === 'function') {
        obj.geometry.dispose();
      }
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(mat => this._disposeMaterial(mat));
      }
    });
  },

  _disposeMaterial(material) {
    // Textures live on material properties (map, normalMap, envMap, etc.)
    Object.keys(material).forEach(key => {
      const val = material[key];
      if (val && typeof val === 'object' && 'minFilter' in val && typeof val.dispose === 'function') {
        val.dispose();
      }
    });
    if (typeof material.dispose === 'function') material.dispose();
  },

  // ----------------------------------------------------------
  // HUD — Vital Signs overlay with canvas-drawn EKG
  // ----------------------------------------------------------
  _buildHUD(container) {
    const hud = document.createElement('div');
    hud.className = 'lab-hud';
    hud.innerHTML = `
      <div class="hud-label">Telemetry · Live Model Metrics</div>
      <div class="hud-row">
        <span class="hud-row-label">Accuracy</span>
        <div class="hud-row-bar"><div class="hud-row-fill hud-accuracy-fill"></div></div>
        <span class="hud-row-value hud-accuracy-value">0%</span>
      </div>
      <div class="hud-row">
        <span class="hud-row-label">Latency</span>
        <div class="hud-row-bar"><div class="hud-row-fill hud-latency-fill"></div></div>
        <span class="hud-row-value hud-latency-value">0ms</span>
      </div>
      <div class="hud-row">
        <span class="hud-row-label">Integrity</span>
        <div class="hud-row-bar"><div class="hud-row-fill hud-integrity-fill"></div></div>
        <span class="hud-row-value hud-integrity-value">100%</span>
      </div>
      <div class="hud-stats">
        <span class="hud-value">0.0%</span>
        <span class="hud-status">NO CHAIN</span>
      </div>
      <div class="hud-compute">
        <div class="hud-compute-label">
          <span>COMPUTE POWER</span>
          <span class="hud-compute-pct">0%</span>
        </div>
        <div class="hud-compute-bar"><div class="hud-compute-fill"></div></div>
      </div>
      <div class="hud-training">
        <div class="hud-training-label">Training in Progress...</div>
        <div class="hud-training-bar"><div class="hud-training-fill"></div></div>
        <div class="hud-training-report"></div>
      </div>
    `;
    container.appendChild(hud);

    const hint = document.createElement('div');
    hint.className = 'lab-hint-bar';
    hint.innerHTML = `<kbd>S</kbd> pulse &middot; <kbd>T</kbd> train &middot; <kbd>P</kbd> present &middot; <kbd>dbl-click</kbd> open &middot; <kbd>Del</kbd> remove`;
    container.appendChild(hint);
  },

  _buildMission(container) {
    const el = document.createElement('div');
    el.className = 'lab-mission';
    el.innerHTML = `<span class="lab-mission-text">Mission &middot; Reach 90% Accuracy</span>`;
    container.appendChild(el);
    this._missionEl = el;
    this._missionComplete = false;
  },

  // ==========================================================
  // DATA LAKE — dataset selector + label counter
  // ==========================================================
  _buildDataLake(container) {
    const lake = document.createElement('div');
    lake.className = 'lab-data-lake';
    const dsButtons = Object.values(LabDatasets).map(ds => `
      <button class="lab-dataset-btn" data-dataset="${ds.id}">
        <span class="lab-dataset-icon">${ds.icon}</span>
        <span>${ds.name}</span>
      </button>
    `).join('');
    lake.innerHTML = `
      <div class="lab-data-lake-label">Data Lake</div>
      ${dsButtons}
      <div class="lab-data-lake-stats">
        <div class="stat-row"><span>Raw Items</span><strong class="lake-raw">0</strong></div>
        <div class="stat-row"><span>Labeled</span><strong class="lake-labeled">0</strong> / 50</div>
      </div>
      <button class="lab-open-labeler" disabled>Open Labeler</button>
    `;
    container.appendChild(lake);
    this._dataLakeEl = lake;

    lake.addEventListener('click', (e) => {
      if (this._crashLocked) return;
      const btn = e.target.closest('.lab-dataset-btn');
      if (btn) { this._selectDataset(btn.dataset.dataset); return; }
      if (e.target.closest('.lab-open-labeler')) this._openLabeler();
    });
  },

  _selectDataset(id) {
    const ds = LabDatasets[id];
    if (!ds) return;
    // Picking a new dataset wipes any prior labeling progress — fresh start.
    this._activeDataset = id;
    this._rawData = ds.items.map(item => ({ item, label: null }));
    this._currentLabelIdx = 0;
    this._labeledCount = 0;

    // Toggle button active state
    if (this._dataLakeEl) {
      this._dataLakeEl.querySelectorAll('.lab-dataset-btn').forEach(b => {
        b.classList.toggle('is-active', b.dataset.dataset === id);
      });
      const rawEl = this._dataLakeEl.querySelector('.lake-raw');
      if (rawEl) rawEl.textContent = this._rawData.length;
      const labeledEl = this._dataLakeEl.querySelector('.lake-labeled');
      if (labeledEl) labeledEl.textContent = this._labeledCount;
      const openBtn = this._dataLakeEl.querySelector('.lab-open-labeler');
      if (openBtn) openBtn.disabled = false;
    }

    // Accuracy depends on labeledCount → refresh stats immediately
    this._updateStats();
  },

  _refreshDataLakeCounts() {
    if (!this._dataLakeEl) return;
    const rawEl     = this._dataLakeEl.querySelector('.lake-raw');
    const labeledEl = this._dataLakeEl.querySelector('.lake-labeled');
    if (rawEl)     rawEl.textContent     = this._rawData.length;
    if (labeledEl) labeledEl.textContent = this._labeledCount;
  },

  // ==========================================================
  // LABELING STATION — walks the student through raw items
  // ==========================================================
  _buildLabeler(container) {
    const el = document.createElement('div');
    el.className = 'lab-labeler';
    el.innerHTML = `
      <div class="lab-labeler-header">
        <span class="lab-labeler-title">Annotation Mode</span>
        <button class="lab-labeler-close" aria-label="Close">✕</button>
      </div>
      <div class="lab-labeler-item">
        <div class="lab-labeler-icon">🖼️</div>
        <div class="lab-labeler-name">—</div>
      </div>
      <div class="lab-labeler-actions">
        <button class="lab-labeler-btn class-a" data-label="A">Class A</button>
        <button class="lab-labeler-btn class-b" data-label="B">Class B</button>
      </div>
      <div class="lab-labeler-progress">Item <strong class="labeler-idx">0</strong> / <strong class="labeler-total">0</strong> &middot; Total labeled <strong class="labeler-total-count">0</strong></div>
    `;
    container.appendChild(el);
    this._labelerEl = el;

    el.addEventListener('click', (e) => {
      if (e.target.closest('.lab-labeler-close')) { this._closeLabeler(); return; }
      const btn = e.target.closest('.lab-labeler-btn');
      if (btn) this._labelCurrentItem(btn.dataset.label);
    });
  },

  _openLabeler() {
    if (!this._labelerEl || !this._activeDataset) return;
    if (this._rawData.length === 0) return;
    // If all items labeled, start over so user can add more labels
    if (this._rawData.every(r => r.label !== null)) {
      this._rawData.forEach(r => r.label = null);
      this._currentLabelIdx = 0;
    }
    this._labelerEl.classList.add('is-open');
    this._renderLabelerItem();
  },

  _closeLabeler() {
    if (this._labelerEl) this._labelerEl.classList.remove('is-open');
  },

  _renderLabelerItem() {
    if (!this._labelerEl) return;
    // Skip past any items already labeled
    while (this._currentLabelIdx < this._rawData.length
        && this._rawData[this._currentLabelIdx].label !== null) {
      this._currentLabelIdx++;
    }
    if (this._currentLabelIdx >= this._rawData.length) {
      // Batch complete
      this._closeLabeler();
      return;
    }
    const current = this._rawData[this._currentLabelIdx];
    const ds = LabDatasets[this._activeDataset];
    const nameEl  = this._labelerEl.querySelector('.lab-labeler-name');
    const iconEl  = this._labelerEl.querySelector('.lab-labeler-icon');
    const idxEl   = this._labelerEl.querySelector('.labeler-idx');
    const totalEl = this._labelerEl.querySelector('.labeler-total');
    const cntEl   = this._labelerEl.querySelector('.labeler-total-count');
    if (nameEl)  nameEl.textContent  = current.item;
    if (iconEl)  iconEl.textContent  = ds ? ds.icon : '🖼️';
    if (idxEl)   idxEl.textContent   = this._currentLabelIdx + 1;
    if (totalEl) totalEl.textContent = this._rawData.length;
    if (cntEl)   cntEl.textContent   = this._labeledCount;
  },

  _labelCurrentItem(classLabel) {
    if (!this._rawData[this._currentLabelIdx]) return;
    this._rawData[this._currentLabelIdx].label = classLabel;
    this._labeledCount = Math.min(50, this._labeledCount + 1);
    this._currentLabelIdx++;
    this._refreshDataLakeCounts();
    this._updateStats();     // accuracy recomputes immediately
    this._renderLabelerItem();
  },

  // ==========================================================
  // LIVE INFERENCE — drag an image onto the scene, run a fast
  // pulse, show a floating prediction label over OUTPUT.
  // ==========================================================
  _buildPredictionLabel(container) {
    const el = document.createElement('div');
    el.className = 'lab-prediction-label';
    el.innerHTML = `
      <div class="lab-prediction-title">Prediction</div>
      <div class="lab-prediction-class">—</div>
      <div class="lab-prediction-confidence">—</div>
    `;
    container.appendChild(el);
    this._predictionLabelEl = el;
  },

  // ==========================================================
  // TEMPLATES — spawn a preset skeleton (unconnected) for the
  // student to arrange. Scatters blocks so they don't auto-snap.
  // ==========================================================
  _buildTemplatesPanel(container) {
    const el = document.createElement('div');
    el.className = 'lab-templates';
    const btns = Object.entries(this.TEMPLATES).map(([name, spec]) => `
      <button class="lab-template-btn" data-template="${name}">
        <span>${spec.icon}</span><span>${name}</span>
      </button>
    `).join('');
    el.innerHTML = `<div class="lab-templates-label">Templates</div>${btns}`;
    container.appendChild(el);
    this._templatesEl = el;

    el.addEventListener('click', (e) => {
      if (this._crashLocked) return;
      const btn = e.target.closest('.lab-template-btn');
      if (!btn) return;
      this._loadTemplate(btn.dataset.template);
    });
  },

  _loadTemplate(name) {
    const spec = this.TEMPLATES[name];
    if (!spec || !this._scene) return;
    // Scatter positions in a rough 3-wide grid around origin, spread out
    // enough that nothing snaps automatically (> 1.5 units apart).
    const positions = [];
    const ROWS = Math.ceil(spec.blocks.length / 3);
    spec.blocks.forEach((type, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      // Spacing of 3 units — well outside snap range (1.5)
      const x = (col - 1) * 3 + (Math.random() - 0.5) * 0.6;
      const z = (row - (ROWS - 1) / 2) * 3 + (Math.random() - 0.5) * 0.6;
      positions.push({ type, x, z });
    });
    // Spawn each with a pop animation, matching _spawnBlock's behavior
    positions.forEach((p, idx) => {
      setTimeout(() => {
        const block = new this.Block(p.type);
        block.placeAt(p.x, p.z);
        block.mesh.scale.set(0.01, 0.01, 0.01);
        this._scene.add(block.mesh);
        this._blocks.push(block);
        if (window.gsap) {
          gsap.to(block.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.55, ease: 'back.out(2.2)' });
          const restY = block.mesh.position.y;
          block.mesh.position.y = restY + 0.8;
          gsap.to(block.mesh.position, { y: restY, duration: 0.55, ease: 'bounce.out' });
        }
        this._updateStats();
      }, idx * 80);   // staggered spawn — satisfying cascade
    });
  },

  // ==========================================================
  // NESTED / DEEP-SURGERY view — right-click a block, camera
  // zooms to it, panel opens showing its ports + sub-nodes.
  // ==========================================================
  _buildNestedPanel(container) {
    const el = document.createElement('div');
    el.className = 'lab-nested-panel';
    el.innerHTML = `
      <div class="lab-nested-header">
        <div class="lab-nested-title-group">
          <div class="nested-type">—</div>
          <div class="nested-name">—</div>
        </div>
        <button class="lab-nested-close" aria-label="Close">✕</button>
      </div>
      <div class="nested-ports">
        <div class="nested-port-col"><h5>Input Ports</h5><div class="ports-in"></div></div>
        <div class="nested-port-col"><h5>Output Ports</h5><div class="ports-out"></div></div>
      </div>
      <div class="nested-section">
        <h5>Micro-Workflow</h5>
        <div class="nested-subnodes"></div>
      </div>
      <div class="lab-nested-hint"><kbd>Esc</kbd> or <kbd>✕</kbd> to close</div>
    `;
    container.appendChild(el);
    this._nestedPanelEl = el;
    el.addEventListener('click', (e) => {
      if (e.target.closest('.lab-nested-close')) this._closeNestedView();
    });
  },

  // Internal sub-node definitions per block type
  _microWorkflow(type) {
    const MW = {
      DATA:       [{ n: 'Source Reader',    v: 'stream' }, { n: 'Buffer',   v: '2 KB'   }],
      PREP:       [{ n: 'Missing Value Fill', v: 'median' }, { n: 'Deduper',  v: 'on'    }],
      SCALER:     [{ n: 'Method',           v: 'StandardScaler' }, { n: 'Mean/Var', v: '0 / 1' }],
      TOKENIZE:   [{ n: 'Algorithm',        v: 'BPE' }, { n: 'Max Length', v: '512' }],
      EMBED:      [{ n: 'Dimension',        v: '256' }, { n: 'Vocab',       v: '32k' }],
      LAYER:      [{ n: 'Weights',          v: '[w × h]' }, { n: 'Activation', v: 'ReLU' }, { n: 'Bias', v: 'on' }],
      CNN:        [{ n: 'Filters',          v: '64' }, { n: 'Kernel', v: '3×3' }, { n: 'Stride', v: '1' }, { n: 'Activation', v: 'ReLU' }],
      RNN:        [{ n: 'Hidden Units',     v: '128' }, { n: 'Cell', v: 'LSTM' }, { n: 'Timesteps', v: 'variable' }],
      ATTENTION:  [{ n: 'Heads',            v: '8' }, { n: 'Q·K·V',    v: 'split' }, { n: 'Mask',       v: 'causal' }],
      POOLING:    [{ n: 'Operation',        v: 'MaxPool 2×2' }, { n: 'Stride',   v: '2' }],
      CLASSIFIER: [{ n: 'Softmax',          v: 'on' }, { n: 'Classes',    v: '2' }, { n: 'Threshold',   v: '0.5' }],
      OUTPUT:     [{ n: 'Sink',             v: 'display' }, { n: 'Format',     v: 'JSON' }]
    };
    return MW[type] || [];
  },

  _attachRightClickHandler(container) {
    // Right-click = alternate shortcut for Deep Surgery (same as dblclick)
    container.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (this._crashLocked || this._state === LabState.TRAINING) return;
      if (this._isExpanded) return;
      const rect = container.getBoundingClientRect();
      const mouseNDC = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouseNDC, this._camera);
      const hits = raycaster.intersectObjects(this._blocks.map(b => b.mesh), false);
      if (hits.length > 0) this.expandBlock(hits[0].object.userData.block);
    });

    // Close button: floating pill, top-right
    const close = document.createElement('button');
    close.className = 'lab-close-expansion';
    close.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg><span>Zoom Out</span>`;
    container.appendChild(close);
    this._closeExpansionEl = close;
    close.addEventListener('click', () => this.closeExpansion());
  },

  // ==========================================================
  // DEEP SURGERY — expand a block in place: fade parent to
  // transparent, spawn 3D sub-nodes inside, enable internal
  // drag/snap, re-route S-pulse to walk the sub-nodes.
  // ==========================================================
  expandBlock(block) {
    if (!block || this._isExpanded) return;
    this._isExpanded = true;
    this._expandedParent = block;
    document.body.classList.add('lab-expanded');

    // Remember parent's original opacity so we can restore it
    this._parentOriginalOpacity = block.mesh.material.opacity != null
      ? block.mesh.material.opacity : 1;
    // Fade the parent so we can see inside
    const mat = block.mesh.material;
    mat.transparent = true;
    if (window.gsap) {
      gsap.to(mat, { opacity: 0.18, duration: 0.5, ease: 'power2.out' });
    } else {
      mat.opacity = 0.18;
    }

    // Spawn 3D sub-nodes in a line inside the parent's footprint
    this._spawnSubNodes(block);

    // Camera zoom close-up
    if (!this._cameraRestPos) this._cameraRestPos = this._camera.position.clone();
    if (this._camera && window.gsap) {
      const target = block.mesh.position;
      const offset = new THREE.Vector3(2.4, 2.2, 2.4);
      gsap.killTweensOf(this._camera.position);
      gsap.to(this._camera.position, {
        x: target.x + offset.x, y: target.y + offset.y, z: target.z + offset.z,
        duration: 0.9, ease: 'power2.inOut',
        onUpdate: () => this._camera.lookAt(target)
      });
    }

    // Show the HTML info panel too (same visual layer as before)
    this._openNestedView(block);
  },

  closeExpansion() {
    if (!this._isExpanded) return;
    const parent = this._expandedParent;
    this._isExpanded = false;
    document.body.classList.remove('lab-expanded');
    this._draggedSubNode = null;

    // Restore parent opacity
    if (parent && parent.mesh && parent.mesh.material) {
      const mat = parent.mesh.material;
      if (window.gsap) {
        gsap.to(mat, {
          opacity: this._parentOriginalOpacity,
          duration: 0.4, ease: 'power2.in',
          onComplete: () => { mat.transparent = true; /* physical material keeps transparent for transmission */ }
        });
      } else {
        mat.opacity = this._parentOriginalOpacity;
      }
    }

    // Remove 3D sub-nodes
    this._disposeSubNodes();

    // Camera back
    if (this._camera && this._cameraRestPos && window.gsap) {
      const rest = this._cameraRestPos;
      gsap.killTweensOf(this._camera.position);
      gsap.to(this._camera.position, {
        x: rest.x, y: rest.y, z: rest.z,
        duration: 0.9, ease: 'power2.inOut',
        onUpdate: () => this._camera.lookAt(0, 0, 0),
        onComplete: () => this._cameraRestPos = null
      });
    }

    this._closeNestedView();
    this._expandedParent = null;
  },

  _spawnSubNodes(parent) {
    const names = Lab.Block.SUB_WORKFLOWS[parent.type] || [];
    if (names.length === 0) return;
    const parentColor = Lab.Block.TYPES[parent.type].color;

    // Shared geometry + material across this expansion session
    if (!this._subNodeGeometry) this._subNodeGeometry = new THREE.SphereGeometry(0.18, 20, 20);
    this._subNodeMaterial = new THREE.MeshPhysicalMaterial({
      color: parentColor,
      emissive: parentColor,
      emissiveIntensity: 1.1,
      roughness: 0.25,
      metalness: 0.2,
      clearcoat: 0.6
    });

    const spacing = 0.55;
    const startX = parent.mesh.position.x - ((names.length - 1) * spacing) / 2;
    const y = parent.mesh.position.y + 0.5;    // hover inside the faded parent
    const z = parent.mesh.position.z;
    names.forEach((name, i) => {
      const mesh = new THREE.Mesh(this._subNodeGeometry, this._subNodeMaterial);
      mesh.position.set(startX + i * spacing, y, z);
      mesh.userData.subNode = { name, parent, index: i };
      this._scene.add(mesh);
      this._subNodes.push({ mesh, name, parent });
    });
  },

  _disposeSubNodes() {
    this._subNodes.forEach(sn => {
      if (sn.mesh.parent) sn.mesh.parent.remove(sn.mesh);
    });
    this._subNodes = [];
    if (this._subNodeMaterial) {
      this._subNodeMaterial.dispose();
      this._subNodeMaterial = null;
    }
    // Keep _subNodeGeometry cached for next expansion
  },

  // Pulse inside an expanded block — a glowing sphere hops from
  // the first sub-node to each subsequent one in current x-order.
  _pulseSubNodes() {
    if (this._subNodes.length === 0) return;
    this._pulseActive = true;

    // Walk sub-nodes left-to-right by current x position (reflects user rearrangement)
    const sorted = this._subNodes.slice().sort((a, b) => a.mesh.position.x - b.mesh.position.x);

    const geom = new THREE.SphereGeometry(0.09, 16, 16);
    const mat  = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 1, blending: THREE.AdditiveBlending
    });
    const sphere = new THREE.Mesh(geom, mat);
    sphere.position.copy(sorted[0].mesh.position);
    const pulseLight = new THREE.PointLight(0xffffff, 3, 1.8, 2);
    sphere.add(pulseLight);
    this._scene.add(sphere);

    const dispose = () => {
      if (sphere.parent) sphere.parent.remove(sphere);
      geom.dispose(); mat.dispose();
      this._pulseActive = false;
    };

    const runStep = (i) => {
      if (i >= sorted.length) {
        gsap.to(mat, { opacity: 0, duration: 0.35, onComplete: dispose });
        return;
      }
      const target = sorted[i].mesh.position;
      gsap.to(sphere.position, {
        x: target.x, y: target.y, z: target.z,
        duration: 0.22, ease: 'power2.inOut',
        onComplete: () => runStep(i + 1)
      });
    };
    runStep(1);
  },

  _openNestedView(block) {
    if (!this._nestedPanelEl || !block) return;
    this._nestedBlock = block;
    const spec = Lab.Block.TYPES[block.type] || {};
    const panel = this._nestedPanelEl;
    const chipify = arr => (arr && arr.length)
      ? arr.map(t => `<span class="nested-port-chip">${t}</span>`).join('')
      : `<span style="opacity:0.5;font-size:10px">—</span>`;
    panel.querySelector('.nested-type').textContent = 'Deep Surgery';
    panel.querySelector('.nested-name').textContent = spec.title || block.type;
    panel.querySelector('.ports-in').innerHTML  = chipify(block.inputTypes);
    panel.querySelector('.ports-out').innerHTML = chipify(block.outputTypes);
    const sub = this._microWorkflow(block.type).map(n => `
      <div class="nested-subnode">
        <span class="subnode-name">${n.n}</span>
        <span class="subnode-val">${n.v}</span>
      </div>
    `).join('');
    panel.querySelector('.nested-subnodes').innerHTML = sub || '<div style="opacity:0.5;font-size:10px">No sub-nodes</div>';

    panel.classList.add('is-open');

    // "Open" the block — scale up briefly, then settle
    if (window.gsap) {
      gsap.killTweensOf(block.mesh.scale);
      gsap.timeline()
        .to(block.mesh.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.35, ease: 'power2.out' })
        .to(block.mesh.scale, { x: 1.0,  y: 1.0,  z: 1.0,  duration: 0.35, ease: 'power2.inOut' });
    }

    // Camera GSAP tween: dolly in toward the block
    if (this._camera && window.gsap) {
      if (!this._cameraRestPos) this._cameraRestPos = this._camera.position.clone();
      const target = block.mesh.position;
      const offset = new THREE.Vector3(3.2, 2.6, 3.2);          // close-up angle
      const dest = new THREE.Vector3(target.x + offset.x, target.y + offset.y, target.z + offset.z);
      gsap.killTweensOf(this._camera.position);
      gsap.to(this._camera.position, {
        x: dest.x, y: dest.y, z: dest.z,
        duration: 0.9,
        ease: 'power2.inOut',
        onUpdate: () => this._camera.lookAt(target)
      });
    }
  },

  _closeNestedView() {
    if (!this._nestedPanelEl) return;
    this._nestedPanelEl.classList.remove('is-open');
    this._nestedBlock = null;
    // Restore camera
    if (this._camera && this._cameraRestPos && window.gsap) {
      const rest = this._cameraRestPos;
      gsap.killTweensOf(this._camera.position);
      gsap.to(this._camera.position, {
        x: rest.x, y: rest.y, z: rest.z,
        duration: 0.9,
        ease: 'power2.inOut',
        onUpdate: () => this._camera.lookAt(0, 0, 0),
        onComplete: () => this._cameraRestPos = null
      });
    }
  },

  _attachInferenceDropZone(container) {
    const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
    const onDragOver  = (e) => { prevent(e); container.classList.add('is-drop-target'); };
    const onDragLeave = (e) => { prevent(e); container.classList.remove('is-drop-target'); };
    const onDrop      = (e) => {
      prevent(e);
      container.classList.remove('is-drop-target');
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      // Reject if nothing dropped, or the dropped file is not an image
      if (!file) return;
      if (!file.type || !file.type.startsWith('image/')) {
        this._showErrorTooltip(
          '⚠ Drop an image file (jpg, png, webp)',
          this._blocks.find(b => b.type === 'OUTPUT') || this._blocks[0]
        );
        return;
      }
      this._runInference(file.name);
    };
    container.addEventListener('dragenter', onDragOver);
    container.addEventListener('dragover',  onDragOver);
    container.addEventListener('dragleave', onDragLeave);
    container.addEventListener('drop',      onDrop);
    this._dropHandlers = { onDragOver, onDragLeave, onDrop };
  },

  _runInference(sampleName) {
    if (this._crashLocked) return;
    if (this._inferenceInFlight) return;
    // Require a trained model + a valid pipeline
    if (!this._hasTrained || !this.currentModelStats.valid) {
      this._showErrorTooltip(
        '⚠ Train the model first',
        this._blocks.find(b => b.type === 'OUTPUT') || this._blocks[0]
      );
      return;
    }

    const chain = this._buildChain(this._blocks.find(b => b.type === 'DATA'));
    const output = this._blocks.find(b => b.type === 'OUTPUT');
    const dataBlock = this._blocks.find(b => b.type === 'DATA');
    if (!dataBlock || !output) return;

    // Fast pulse through the chain; yellow processing glow on OUTPUT while remote thinks
    this.triggerPulse && this.triggerPulse();
    this._setOutputProcessing(output, true);
    this._inferenceInFlight = true;

    const chainStr = chain.map(b => b.type).join(' → ');
    const acc = this.currentModelStats.accuracy;
    const dataset = (this._activeDataset && this._activeDataset.name) || 'unknown dataset';
    const prompt = [
      `Pipeline: ${chainStr}`,
      `Accuracy: ${acc.toFixed(1)}%`,
      `Dataset: ${dataset}`,
      `Sample: ${sampleName}`,
      ``,
      `Given this model architecture and a new input sample, predict the class (A or B), a confidence percentage, and one short reason grounded in the architecture.`
    ].join('\n');
    const meta = { chain: chainStr, accuracy: acc };

    // Align pulse timing with the fetch; we show the hologram as soon as
    // BOTH the pulse has reached OUTPUT and the response is back.
    const pulseDelay = Math.max(250, (chain.length - 1) * 420 + 200);
    const pulseDone = new Promise((resolve) => setTimeout(resolve, pulseDelay));

    const remote = (window.RemoteCompute && typeof window.RemoteCompute.infer === 'function')
      ? window.RemoteCompute.infer(prompt, meta)
      : Promise.resolve({ ok: false, code: 'DISABLED', error: 'RemoteCompute not loaded', text: '[Local Mock]\nPredicted class: A\nConfidence: 70%' });

    Promise.all([pulseDone, remote]).then(([, result]) => {
      this._setOutputProcessing(output, false);
      this._inferenceInFlight = false;

      if (result && result.ok) {
        this._setHudValue(acc.toFixed(1) + '%', 'INFERENCE OK');
        this._showHologram({
          title: `Qwen · Remote Inference  (${result.ms || 0}ms)`,
          body: result.text,
          meta: `sample: ${sampleName}  ·  tokens: ${result.tokens || '—'}  ·  arch: ${chainStr}`,
          error: false
        });
      } else {
        const code = (result && result.code) || 'NETWORK';
        this._setHudValue(acc.toFixed(1) + '%', 'REMOTE GPU OFFLINE: SWITCHING TO LOCAL MOCK MODE');
        this._showHologram({
          title: `Local Mock  ·  Remote Offline (${code})`,
          body: (result && result.text) || '[No response]',
          meta: (result && result.error)
            ? `error: ${String(result.error).slice(0, 120)}  ·  sample: ${sampleName}`
            : `sample: ${sampleName}  ·  arch: ${chainStr}`,
          error: true
        });
      }
    });
  },

  _showPredictionLabel(anchor, className, confidence, sampleName) {
    if (!this._predictionLabelEl) return;
    const classEl = this._predictionLabelEl.querySelector('.lab-prediction-class');
    const confEl  = this._predictionLabelEl.querySelector('.lab-prediction-confidence');
    if (classEl) classEl.textContent = className;
    if (confEl)  confEl.textContent  = `${confidence.toFixed(1)}% · ${sampleName}`;
    this._positionPredictionLabel(anchor);
    this._predictionLabelEl.classList.remove('is-visible');
    void this._predictionLabelEl.offsetWidth;
    this._predictionLabelEl.classList.add('is-visible');

    clearTimeout(this._predictionTimer);
    this._predictionTimer = setTimeout(() => {
      if (this._predictionLabelEl) this._predictionLabelEl.classList.remove('is-visible');
    }, 4000);
  },

  _positionPredictionLabel(anchorBlock) {
    if (!this._predictionLabelEl || !anchorBlock || !this._camera) return;
    const container = document.getElementById('lab-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const world = new THREE.Vector3(
      anchorBlock.mesh.position.x,
      anchorBlock.mesh.position.y + Lab.Block.SIZE.h / 2 + 0.6,
      anchorBlock.mesh.position.z
    );
    world.project(this._camera);
    const x = (world.x + 1) / 2 * rect.width;
    const y = (1 - world.y) / 2 * rect.height;
    this._predictionLabelEl.style.left = x + 'px';
    this._predictionLabelEl.style.top = y + 'px';
  },

  // ----------------------------------------------------------
  // Qwen response hologram — floating holographic panel above
  // the grid showing the remote inference engine's reply.
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  // Telemetry stream — faint scrolling "system log" in the
  // middle-right background. Fills the vertical dead zone with
  // a live-data aesthetic. Opacity 0.1, pointer-events off.
  // ----------------------------------------------------------
  _buildTelemetryStream(container) {
    const el = document.createElement('div');
    el.className = 'lab-telemetry';
    el.setAttribute('aria-hidden', 'true');
    const LINES = [
      '[0x01] aurora-drift · phase-lock engaged',
      '[0x02] pipeline → DATA.in queue=0',
      '[0x03] embed.dim=256 · norm=L2',
      '[0x04] gpu.kernel=qwen-2.5-7b · temp=0.4',
      '[0x05] hud.connect → openrouter.serverless',
      '[0x06] block.render=MeshPhysicalMaterial · iridescence=1.0',
      '[0x07] orbit.angle Δ=0.0018rad/frame',
      '[0x08] mission.target accuracy > 0.90',
      '[0x09] dust.cloud n=400 · blend=additive',
      '[0x0A] bloom=off · ACES tone mapping',
      '[0x0B] labeler.queue empty',
      '[0x0C] inference.latency ~1.2s',
      '[0x0D] chain: DATA → PREP → LAYER → OUTPUT',
      '[0x0E] ping.ok · qwen/qwen-2.5-7b-instruct',
      '[0x0F] scenario.active=false · allClear'
    ];
    // Two copies for seamless loop
    el.innerHTML = LINES.concat(LINES).map(l => `<div class="lab-telemetry-row">${l}</div>`).join('');
    container.appendChild(el);
    this._telemetryEl = el;
  },

  _buildHologram(container) {
    const el = document.createElement('div');
    el.className = 'lab-hologram';
    el.innerHTML = `
      <div class="lab-hologram-title">Remote Inference · Qwen</div>
      <div class="lab-hologram-body">—</div>
      <div class="lab-hologram-meta"></div>
    `;
    container.appendChild(el);
    this._hologramEl = el;
  },

  _showHologram({ title, body, meta, error }) {
    if (!this._hologramEl) return;
    const titleEl = this._hologramEl.querySelector('.lab-hologram-title');
    const bodyEl  = this._hologramEl.querySelector('.lab-hologram-body');
    const metaEl  = this._hologramEl.querySelector('.lab-hologram-meta');
    if (titleEl) titleEl.textContent = title || 'Remote Inference · Qwen';
    if (bodyEl)  bodyEl.textContent  = body  || '';
    if (metaEl)  metaEl.textContent  = meta  || '';
    this._hologramEl.classList.toggle('is-error', !!error);
    // Force re-animation on consecutive calls
    this._hologramEl.classList.remove('is-visible');
    void this._hologramEl.offsetWidth;
    this._hologramEl.classList.add('is-visible');

    clearTimeout(this._hologramTimer);
    this._hologramTimer = setTimeout(() => this._hideHologram(), 9000);
  },

  _hideHologram() {
    if (this._hologramEl) this._hologramEl.classList.remove('is-visible');
  },

  // ----------------------------------------------------------
  // Yellow "Processing" glow on OUTPUT block while the remote
  // GPU is thinking. Uses GSAP to tween emissive color & power.
  // ----------------------------------------------------------
  _setOutputProcessing(block, on) {
    if (!block || !block.mesh || !block.mesh.material) return;
    const mat = block.mesh.material;
    if (on) {
      if (!block.__origEmissive) {
        block.__origEmissive = {
          color: mat.emissive.getHex(),
          intensity: mat.emissiveIntensity
        };
      }
      block.__procTween && block.__procTween.kill();
      if (typeof gsap !== 'undefined') {
        mat.emissive.setHex(0xffc400);
        mat.emissiveIntensity = 0.6;
        block.__procTween = gsap.to(mat, {
          emissiveIntensity: 1.4,
          duration: 0.55,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      } else {
        mat.emissive.setHex(0xffc400);
        mat.emissiveIntensity = 1.0;
      }
    } else {
      block.__procTween && block.__procTween.kill();
      block.__procTween = null;
      if (block.__origEmissive) {
        mat.emissive.setHex(block.__origEmissive.color);
        mat.emissiveIntensity = block.__origEmissive.intensity;
        block.__origEmissive = null;
      }
    }
  },

  _pingRemote() {
    if (!window.RemoteCompute || typeof window.RemoteCompute.ping !== 'function') return;
    window.RemoteCompute.ping().then((status) => {
      const valueEl  = document.querySelector('.lab-hud .hud-value');
      const statusEl = document.querySelector('.lab-hud .hud-status');
      const currentValue = (valueEl && valueEl.textContent) || '0.0%';
      if (status && status.ok) {
        this._setHudValue(currentValue, 'CONNECTED: OPENROUTER (QWEN)');
        if (statusEl) statusEl.classList.add('is-connected');
      } else {
        const reason = (window.RemoteCompute && status && status.code === window.RemoteCompute.config.codes.NOKEY)
          ? 'NO API KEY — CHECK .env'
          : 'OPENROUTER UNREACHABLE';
        this._setHudValue(currentValue, reason);
      }
    });
  },

  _setHudValue(valuePct, status) {
    const valueEl = document.querySelector('.lab-hud .hud-value');
    const statusEl = document.querySelector('.lab-hud .hud-status');
    if (valueEl) valueEl.textContent = valuePct;
    if (statusEl) {
      statusEl.textContent = status;
      statusEl.classList.remove('is-connected');
    }
  },

  // ----------------------------------------------------------
  // Surgical Tray — HTML dock at the bottom that spawns blocks
  // ----------------------------------------------------------
  _buildTray(container) {
    const colorFor = (type) => '#' + Lab.Block.COLORS[type].toString(16).padStart(6, '0');
    const tray = document.createElement('div');
    tray.className = 'surgical-tray';
    // Iterate every declared block type (12 total)
    tray.innerHTML = Object.keys(Lab.Block.TYPES).map(type => {
      const spec = Lab.Block.TYPES[type];
      const c = colorFor(type);
      return `
        <button class="tray-slot" data-type="${type}" title="${spec.title}" style="--tray-color: ${c}; --tray-glow: ${c}66">
          <span class="tray-icon" aria-hidden="true">${spec.icon}</span>
          <span class="tray-label">${type}</span>
        </button>
      `;
    }).join('');
    container.appendChild(tray);
    tray.addEventListener('click', (e) => {
      if (this._crashLocked) return;
      const btn = e.target.closest('.tray-slot');
      if (!btn) return;
      this._spawnBlock(btn.dataset.type);
    });
  },

  // ----------------------------------------------------------
  // X-Ray hover label — HTML div positioned via camera projection
  // ----------------------------------------------------------
  _buildXrayLabel(container) {
    const el = document.createElement('div');
    el.className = 'xray-label';
    el.innerHTML = `<div class="xray-title"></div><div class="xray-subtitle"></div>`;
    container.appendChild(el);
    this._xrayEl = el;
  },

  _showXrayLabel(block) {
    this._hoveredBlock = block;
    if (!this._xrayEl) return;
    const role = Lab.Block.ROLES[block.type] || { title: block.type, subtitle: '' };
    this._xrayEl.querySelector('.xray-title').textContent = role.title;
    this._xrayEl.querySelector('.xray-subtitle').textContent = role.subtitle;
    const c = '#' + Lab.Block.COLORS[block.type].toString(16).padStart(6, '0');
    this._xrayEl.style.borderColor = c + 'b0';
    this._xrayEl.style.boxShadow = `0 0 24px ${c}4d`;
    this._xrayEl.querySelector('.xray-title').style.color = c;
    this._xrayEl.classList.add('is-visible');
    this._updateXrayPosition();
  },

  _hideXrayLabel() {
    this._hoveredBlock = null;
    if (this._xrayEl) this._xrayEl.classList.remove('is-visible');
  },

  _updateXrayPosition() {
    if (!this._hoveredBlock || !this._xrayEl || !this._camera) return;
    const container = document.getElementById('lab-container');
    if (!container) return;
    const worldPos = new THREE.Vector3(
      this._hoveredBlock.mesh.position.x,
      this._hoveredBlock.mesh.position.y + Lab.Block.SIZE.h / 2 + 0.4,
      this._hoveredBlock.mesh.position.z
    );
    const projected = worldPos.clone().project(this._camera);
    const rect = container.getBoundingClientRect();
    const x = (projected.x + 1) / 2 * rect.width;
    const y = (1 - projected.y) / 2 * rect.height;
    // Hide if behind camera
    if (projected.z > 1) {
      this._xrayEl.classList.remove('is-visible');
      return;
    }
    this._xrayEl.style.left = x + 'px';
    this._xrayEl.style.top = y + 'px';
  },

  // ----------------------------------------------------------
  // Spawn a new block from the tray, with a pop animation
  // ----------------------------------------------------------
  _spawnBlock(type) {
    if (!this._scene || !this.Block.COLORS[type]) return;
    const block = new this.Block(type);

    // Stagger spawn positions in a rough 3-wide grid so multiple spawns don't stack
    const n = this._blocks.length;
    const offsetX = ((n % 3) - 1) * 2;
    const offsetZ = (Math.floor(n / 3) % 3 - 1) * 2;
    block.placeAt(offsetX, offsetZ);

    // Start small, scale up with a bouncy 'pop'
    block.mesh.scale.set(0.01, 0.01, 0.01);
    this._scene.add(block.mesh);
    this._blocks.push(block);
    this._updateStats();

    if (window.gsap) {
      gsap.to(block.mesh.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.55,
        ease: 'back.out(2.2)'
      });
      // Subtle vertical drop for extra polish
      const restY = block.mesh.position.y;
      block.mesh.position.y = restY + 0.8;
      gsap.to(block.mesh.position, {
        y: restY,
        duration: 0.55,
        ease: 'bounce.out'
      });
    } else {
      block.mesh.scale.set(1, 1, 1);
    }
  },

  // ----------------------------------------------------------
  // Lab Presentation Mode — hide UI, auto-orbit camera
  // ----------------------------------------------------------
  togglePresentation(force) {
    if (!this._active) return;
    const want = typeof force === 'boolean' ? force : !this._labPresenting;
    this._labPresenting = want;
    document.body.classList.toggle('lab-presenting', want);

    if (want) {
      // Snapshot the current orbit angle from wherever the camera is
      if (this._camera) {
        this._orbitAngle = Math.atan2(this._camera.position.z, this._camera.position.x);
      }
    } else {
      // Exiting: restore camera to (5, 5, 5) smoothly
      if (this._camera && window.gsap) {
        gsap.to(this._camera.position, {
          x: 5, y: 5, z: 5,
          duration: 1.1,
          ease: 'power2.inOut',
          onUpdate: () => this._camera.lookAt(0, 0, 0)
        });
      } else if (this._camera) {
        this._camera.position.set(5, 5, 5);
        this._camera.lookAt(0, 0, 0);
      }
    }
  },

  // ----------------------------------------------------------
  // Simulator — the Logic Core
  // Deterministic formulas over the DATA-connected chain:
  //
  //   SI (Signal Integrity) = 1.0 when a PREP is present,
  //                           0.2 otherwise  (dirty data)
  //
  //   Accuracy  = min(99, LayerCount * 20 * SI)    — requires OUTPUT
  //   Latency   = TotalBlocks * 50 + Layers * 150  ms
  //
  // Only blocks reachable from DATA count. Orphan components don't
  // contribute (they should have been flagged by validatePipeline).
  // ----------------------------------------------------------
  _simulateChain() {
    const data = this._blocks.find(b => b.type === 'DATA');
    if (!data) {
      return {
        chain: [], accuracy: 0, latencyMs: 0,
        signalIntegrity: 0.2, totalBlocks: 0, layerCount: 0,
        hasPrep: false, reachesOutput: false
      };
    }
    const chain = this._buildChain(data);
    const totalBlocks = chain.length;
    // Treat every compute-capable block as a "layer" for accuracy math
    const COMPUTE = new Set(['LAYER', 'CNN', 'RNN', 'ATTENTION', 'CLASSIFIER']);
    const PREP    = new Set(['PREP', 'SCALER', 'TOKENIZE']);
    const layerCount    = chain.filter(b => COMPUTE.has(b.type)).length;
    const hasPrep       = chain.some(b => PREP.has(b.type));
    const reachesOutput = chain.some(b => b.type === 'OUTPUT');

    const SI = hasPrep ? 1.0 : 0.2;

    // NEW accuracy formula: driven by LAYER count and labeled-data ratio.
    //   Acc = min(99, Layers * 15 * (labeledCount / 50))
    // Plus structural gates: need OUTPUT, need PREP (reflected as SI).
    // Plus a hard cap at 50% when labeledCount < 10 (underfit/cold-start).
    const labelRatio = Math.min(1, this._labeledCount / 50);
    let accuracy = 0;
    if (reachesOutput && hasPrep) {
      accuracy = Math.min(99, layerCount * 15 * labelRatio);
      if (this._labeledCount < 10) accuracy = Math.min(50, accuracy);
    }

    const latencyMs = totalBlocks * 50 + layerCount * 150;

    return {
      chain, accuracy, latencyMs,
      signalIntegrity: SI, totalBlocks, layerCount,
      hasPrep, reachesOutput,
      labeledCount: this._labeledCount
    };
  },

  evaluateChain()   { return this._simulateChain().accuracy; },
  latency()         { return this._simulateChain().latencyMs; },
  signalIntegrity() { return Math.round(this._simulateChain().signalIntegrity * 100); },

  // Compute Usage: linear in LAYER count, capped at 100%.
  computePower() {
    const data = this._blocks.find(b => b.type === 'DATA');
    if (!data) return 0;
    const chain = this._buildChain(data);
    const COMPUTE = new Set(['LAYER', 'CNN', 'RNN', 'ATTENTION', 'CLASSIFIER']);
    const layers = chain.filter(b => COMPUTE.has(b.type)).length;
    return Math.min(100, layers * 15);
  },

  // ----------------------------------------------------------
  // Public API — calculateModelStats()
  // Single call point for external consumers (tests, debug console,
  // HUD). Runs the simulation and returns a snapshot. Read-only —
  // does not mutate Lab state. The live `Lab.currentModelStats`
  // object is updated separately by `_updateStats()` on every
  // block mutation.
  // ----------------------------------------------------------
  calculateModelStats() {
    const sim = this._simulateChain();
    return {
      accuracy:        sim.accuracy,                  // 0..99
      latency:         sim.latencyMs,                 // ms
      signalIntegrity: sim.signalIntegrity,           // 0.2 or 1.0
      totalBlocks:     sim.totalBlocks,
      layerCount:      sim.layerCount,
      computePower:    this.computePower(),           // 0..100
      hasPrep:         sim.hasPrep,
      reachesOutput:   sim.reachesOutput
    };
  },

  _updateStats() {
    const sim = this._simulateChain();
    this._accuracy     = sim.accuracy;
    this._latency      = sim.latencyMs;
    this._integrity    = Math.round(sim.signalIntegrity * 100);
    this._computePower = this.computePower();

    const stats = this.currentModelStats;
    stats.accuracy        = sim.accuracy;
    stats.latency         = sim.latencyMs;
    stats.signalIntegrity = sim.signalIntegrity;
    stats.totalBlocks     = sim.totalBlocks;
    stats.layerCount      = sim.layerCount;
    stats.computePower    = this._computePower;
    stats.hasPrep         = sim.hasPrep;
    stats.reachesOutput   = sim.reachesOutput;
    // Strict validation (runs the full DFS path check) is authoritative.
    // Populates stats.valid as a side-effect.
    this.validatePipeline();

    // Refresh connector glow meshes to match the new graph + validity
    this._updateConnectorVisuals();

    // DATA blocks glow in proportion to labeledCount (the bound dataset size)
    this._updateDataBlockGlow();

    this._renderHudStats();
    this._updateMission();
  },

  _updateDataBlockGlow() {
    const ratio = Math.min(1, this._labeledCount / 50);
    this._blocks.forEach(b => {
      if (b.type !== 'DATA') return;
      if (b.mesh && b.mesh.material && !b._excitedOrig) {
        b.mesh.material.emissiveIntensity = 0.3 + ratio * 1.7;
      }
    });
  },

  _renderHudStats() {
    const hud = document.querySelector('.lab-hud');
    if (!hud) return;

    const valueEl  = hud.querySelector('.hud-value');
    const statusEl = hud.querySelector('.hud-status');
    const pctEl    = hud.querySelector('.hud-compute-pct');
    const fillEl   = hud.querySelector('.hud-compute-fill');

    const accBar   = hud.querySelector('.hud-accuracy-fill');
    const accVal   = hud.querySelector('.hud-accuracy-value');
    const latBar   = hud.querySelector('.hud-latency-fill');
    const latVal   = hud.querySelector('.hud-latency-value');
    const intBar   = hud.querySelector('.hud-integrity-fill');
    const intVal   = hud.querySelector('.hud-integrity-value');

    if (accBar) {
      accBar.style.width = this._accuracy + '%';
      accBar.classList.toggle('poor', this._accuracy > 0 && this._accuracy < 40);
    }
    if (accVal) accVal.textContent = this._accuracy.toFixed(1) + '%';

    // Latency bar fills 0-2000ms range (realistic pipeline ceiling)
    if (latBar) {
      const latPct = Math.min(100, (this._latency / 2000) * 100);
      latBar.style.width = latPct + '%';
      latBar.classList.toggle('slow', this._latency >= 1200);
    }
    if (latVal) latVal.textContent = this._latency + 'ms';

    if (intBar) {
      intBar.style.width = this._integrity + '%';
      intBar.classList.toggle('degraded', this._integrity < 50);
    }
    if (intVal) intVal.textContent = this._integrity + '%';

    // Headline summary.
    // Status tiers (in priority order):
    //   No blocks                                → NO CHAIN
    //   Invalid pipeline, < 10 labels            → INVALID
    //   Invalid pipeline, ≥ 10 labels            → DATA READY   (enough data, finish the chain)
    //   Valid pipeline, any label count          → READY TO TRAIN
    //   Valid + accuracy ≥ 90                    → MISSION READY
    //   Valid + accuracy ≥ 95                    → OPTIMAL
    if (valueEl) valueEl.textContent = this._accuracy.toFixed(1) + '%';
    if (statusEl) {
      const isValid = this.currentModelStats.valid;
      const labeled = this._labeledCount;
      let status;
      if (this._blocks.length === 0)            status = 'NO CHAIN';
      else if (!isValid && labeled < 10)        status = 'INVALID';
      else if (!isValid && labeled >= 10)       status = 'DATA READY';
      else if (this._accuracy >= 95)            status = 'OPTIMAL';
      else if (this._accuracy >= 90)            status = 'MISSION READY';
      else                                       status = 'READY TO TRAIN';
      statusEl.textContent = status;
    }

    // Compute power
    if (pctEl) pctEl.textContent = Math.round(this._computePower) + '%';
    if (fillEl) {
      fillEl.style.width = this._computePower + '%';
      fillEl.classList.toggle('warning', this._computePower >= 50 && this._computePower < 80);
      fillEl.classList.toggle('danger',  this._computePower >= 80);
    }
  },

  _updateMission() {
    if (!this._missionEl) return;
    const textEl = this._missionEl.querySelector('.lab-mission-text');
    const wasComplete = this._missionComplete;
    const isComplete = this._accuracy >= 90;
    this._missionComplete = isComplete;

    if (isComplete && !wasComplete) {
      // Just crossed the threshold — green flash
      this._missionEl.classList.add('is-complete');
      if (textEl) textEl.textContent = '✓ System Optimized · Mission Complete';
      this._missionEl.classList.remove('is-flash');
      void this._missionEl.offsetWidth;   // restart animation
      this._missionEl.classList.add('is-flash');
    } else if (!isComplete && wasComplete) {
      this._missionEl.classList.remove('is-complete', 'is-flash');
      if (textEl) textEl.textContent = 'Mission · Reach 90% Accuracy';
    }
  },

  // ----------------------------------------------------------
  // Training Stream — 100 particles flowing along the pipeline
  // ----------------------------------------------------------
  _toggleTrainingStream() {
    // T mid-training cancels and returns to idle
    if (this._state === LabState.TRAINING) {
      this._cancelTraining();
      return;
    }

    // Validate → train
    this._state = LabState.VALIDATING;
    const result = this.validatePipeline();
    if (!result.valid) {
      this._state = LabState.FAILED;
      this._showValidationError(result);
      setTimeout(() => {
        if (this._state === LabState.FAILED) this._state = LabState.IDLE;
      }, 2600);
      return;
    }

    this._startTraining();
  },

  // ----------------------------------------------------------
  // 5-second Training Sequence
  // ----------------------------------------------------------
  _startTraining() {
    this._state = LabState.TRAINING;
    this._trainingStartedAt = performance.now();   // seed for the emissive ramp

    // River of data
    this._startTrainingStream();

    // Emissive + vibration on LAYER blocks is driven by _animateLayerExcitation()
    // inside the render loop (time-based sines for smooth 20Hz).

    // HUD progress bar
    this._showTrainingProgress();
    const fillEl = document.querySelector('.lab-hud .hud-training-fill');
    if (fillEl && window.gsap) {
      this._trainingProgressTween = gsap.fromTo(
        fillEl,
        { width: '0%' },
        { width: '100%', duration: 5, ease: 'power1.inOut' }
      );
    } else if (fillEl) {
      fillEl.style.width = '100%';
    }

    // 5-second end timer
    this._trainingTimer = setTimeout(() => this._completeTraining(), 5000);
  },

  _completeTraining() {
    this._trainingTimer = null;
    this._stopTrainingStream();
    this._calmLayers();
    this._showTrainingReport();
    this._playSuccessChime();

    // Flash HUD green
    const hud = document.querySelector('.lab-hud');
    if (hud) {
      hud.classList.add('is-success');
      setTimeout(() => hud.classList.remove('is-success'), 1600);
    }

    this._hasTrained = true;
    this._state = LabState.TEST;   // model is trained — drag an image to test

    // Auto-hide the report after 5s; also drop TEST → IDLE at the same time
    this._reportTimer = setTimeout(() => {
      this._hideTrainingProgress();
      if (this._state === LabState.TEST) this._state = LabState.IDLE;
    }, 5000);
  },

  _cancelTraining() {
    if (this._trainingTimer) { clearTimeout(this._trainingTimer); this._trainingTimer = null; }
    if (this._reportTimer)   { clearTimeout(this._reportTimer); this._reportTimer = null; }
    if (this._trainingProgressTween) { this._trainingProgressTween.kill(); this._trainingProgressTween = null; }
    this._stopTrainingStream();
    this._calmLayers();
    this._hideTrainingProgress();
    this._state = LabState.IDLE;
  },

  _showTrainingProgress() {
    const tp = document.querySelector('.lab-hud .hud-training');
    if (!tp) return;
    tp.classList.remove('is-complete');
    tp.classList.add('is-active', 'is-training');
    const label = tp.querySelector('.hud-training-label');
    if (label) label.textContent = 'Training in Progress...';
    const report = tp.querySelector('.hud-training-report');
    if (report) report.innerHTML = '';
  },

  _showTrainingReport() {
    const tp = document.querySelector('.lab-hud .hud-training');
    if (!tp) return;
    tp.classList.remove('is-training');
    tp.classList.add('is-complete');
    const label = tp.querySelector('.hud-training-label');
    if (label) label.textContent = '✓ Performance Report';

    const fillEl = tp.querySelector('.hud-training-fill');
    if (fillEl) fillEl.style.width = '100%';

    const stats = this.currentModelStats;
    const report = tp.querySelector('.hud-training-report');
    if (report) {
      report.innerHTML = `
        <div class="hud-training-report-row"><span>Final Accuracy</span><strong>${stats.accuracy.toFixed(1)}%</strong></div>
        <div class="hud-training-report-row"><span>Latency</span><strong>${stats.latency}ms</strong></div>
        <div class="hud-training-report-row"><span>Signal Integrity</span><strong>${Math.round(stats.signalIntegrity * 100)}%</strong></div>
        <div class="hud-training-report-row"><span>Compute Usage</span><strong>${Math.round(stats.computePower)}%</strong></div>
      `;
    }
  },

  _hideTrainingProgress() {
    const tp = document.querySelector('.lab-hud .hud-training');
    if (!tp) return;
    tp.classList.remove('is-active', 'is-training', 'is-complete');
    const fill = tp.querySelector('.hud-training-fill');
    if (fill) fill.style.width = '0%';
    const report = tp.querySelector('.hud-training-report');
    if (report) report.innerHTML = '';
    this._reportTimer = null;
  },

  // ----------------------------------------------------------
  // LAYER block excitation — sine-driven vibration + emissive pulse
  // Runs every animation frame while _state === TRAINING.
  // Captures original positions lazily so newly-spawned LAYERs
  // also animate; _calmLayers() restores everything.
  // ----------------------------------------------------------
  _animateLayerExcitation() {
    const nowMs = performance.now();
    const t = nowMs / 1000;
    const TWO_PI = Math.PI * 2;

    // 20 Hz vibration (constant amplitude — the compute shakes throughout)
    const vibX = Math.sin(t * TWO_PI * 20) * 0.03;
    const vibZ = Math.cos(t * TWO_PI * 20) * 0.025;

    // Emissive INCREASES over the 5-second run: 0.3 (cold) → 3.0 (red-hot)
    // plus a small 4Hz flutter on top for "heavy compute" feel.
    const elapsed = nowMs - (this._trainingStartedAt || nowMs);
    const progress = Math.min(1, elapsed / 5000);     // 0..1 across the 5s window
    const ramp = 0.3 + progress * 2.7;                // 0.3 .. 3.0
    const flutter = Math.sin(t * TWO_PI * 4) * 0.18 * progress;
    const emi = ramp + flutter;

    this._blocks.forEach(block => {
      if (block.type !== 'LAYER') return;
      if (!block._excitedOrig) {
        block._excitedOrig = {
          x: block.mesh.position.x,
          z: block.mesh.position.z,
          intensity: block.mesh.material.emissiveIntensity
        };
      }
      block.mesh.position.x = block._excitedOrig.x + vibX;
      block.mesh.position.z = block._excitedOrig.z + vibZ;
      block.mesh.material.emissiveIntensity = emi;
    });
  },

  _calmLayers() {
    this._blocks.forEach(block => {
      if (block.type !== 'LAYER' || !block._excitedOrig) return;
      const orig = block._excitedOrig;
      if (window.gsap) {
        gsap.to(block.mesh.position, {
          x: orig.x, z: orig.z, duration: 0.3, ease: 'power2.out'
        });
        gsap.to(block.mesh.material, {
          emissiveIntensity: orig.intensity, duration: 0.35, ease: 'power2.out'
        });
      } else {
        block.mesh.position.set(orig.x, block.mesh.position.y, orig.z);
        block.mesh.material.emissiveIntensity = orig.intensity;
      }
      delete block._excitedOrig;
    });
  },

  // ----------------------------------------------------------
  // Success chime — ascending major triad (C5 → E5 → G5)
  // ----------------------------------------------------------
  // ============================================================
  // HARDWARE CRASH — amputation mid-training path
  // Orchestrates: explosion → instant block destroy → screen
  // glitch → distorted static → HUD flatline → 3s reboot lockout.
  // ============================================================
  _triggerHardwareCrash(victim) {
    const origin = victim.mesh.position.clone();
    origin.y += Lab.Block.SIZE.h / 2;

    this._cancelTraining();              // kills timers, stream, calms layers
    this.createExplosion(origin);        // particle burst at the victim's position
    this._destroyBlock(victim);          // remove from scene + stats (no shrink anim)
    this._triggerScreenGlitch();
    this._shakeCamera(500);              // 0.5s violent camera wobble
    this._playCrashSound();
    this._triggerSystemCrash();
  },

  // Instant removal — no GSAP shrink. The explosion replaces the block visually.
  _destroyBlock(block) {
    const idx = this._blocks.indexOf(block);
    if (idx < 0) return;
    this._blocks.splice(idx, 1);
    if (this._draggedBlock === block) this._draggedBlock = null;
    if (window.gsap) {
      gsap.killTweensOf(block.mesh.position);
      gsap.killTweensOf(block.mesh.scale);
      if (block.mesh.material) gsap.killTweensOf(block.mesh.material);
      if (block.mesh.material && block.mesh.material.emissive) {
        gsap.killTweensOf(block.mesh.material.emissive);
      }
    }
    delete block._excitedOrig;
    if (this._scene) this._scene.remove(block.mesh);
    if (block.mesh.material && typeof block.mesh.material.dispose === 'function') {
      block.mesh.material.dispose();
    }
  },

  // ----------------------------------------------------------
  // createExplosion(origin) — 200 red glowing cubes bursting outward.
  // Uses InstancedMesh for cheap rendering of all 200 particles.
  // Physics: spherical initial velocity + gravity + drag.
  // Life: 90 frames (~1.5s). Scale + opacity fade over lifetime.
  // ----------------------------------------------------------
  createExplosion(origin) {
    if (!this._scene) return;
    const COUNT = 200;
    const SIZE = 0.1;

    const geometry = new THREE.BoxGeometry(SIZE, SIZE, SIZE);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff3060,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
    mesh.position.copy(origin);
    this._scene.add(mesh);

    // Per-instance state (local to the parent mesh positioned at origin)
    const velocities  = new Array(COUNT);
    const angularVels = new Array(COUNT);
    const positions   = new Array(COUNT);
    const rotations   = new Array(COUNT);

    const matrix = new THREE.Matrix4();
    for (let i = 0; i < COUNT; i++) {
      // Spherical random direction
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 0.06 + Math.random() * 0.14;
      velocities[i] = {
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.cos(phi) * speed + 0.04,       // slight upward bias
        z: Math.sin(phi) * Math.sin(theta) * speed
      };
      angularVels[i] = {
        x: (Math.random() - 0.5) * 0.25,
        y: (Math.random() - 0.5) * 0.25,
        z: (Math.random() - 0.5) * 0.25
      };
      positions[i] = { x: 0, y: 0, z: 0 };
      rotations[i] = new THREE.Euler(0, 0, 0);
      matrix.makeTranslation(0, 0, 0);
      mesh.setMatrixAt(i, matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    if (!this._explosions) this._explosions = [];
    this._explosions.push({
      mesh, geometry, material,
      velocities, angularVels, positions, rotations,
      age: 0,
      maxAge: 90   // ~1.5s at 60fps
    });
  },

  _updateExplosions() {
    if (!this._explosions || this._explosions.length === 0) return;
    const GRAVITY = 0.004;
    const DRAG = 0.98;
    const matrix = new THREE.Matrix4();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const pos = new THREE.Vector3();

    for (let e = this._explosions.length - 1; e >= 0; e--) {
      const exp = this._explosions[e];
      exp.age++;
      const lifeT = exp.age / exp.maxAge;

      for (let i = 0; i < exp.velocities.length; i++) {
        // Integrate
        exp.positions[i].x += exp.velocities[i].x;
        exp.positions[i].y += exp.velocities[i].y;
        exp.positions[i].z += exp.velocities[i].z;
        exp.velocities[i].y -= GRAVITY;
        exp.velocities[i].x *= DRAG;
        exp.velocities[i].z *= DRAG;
        exp.rotations[i].x += exp.angularVels[i].x;
        exp.rotations[i].y += exp.angularVels[i].y;
        exp.rotations[i].z += exp.angularVels[i].z;

        pos.set(exp.positions[i].x, exp.positions[i].y, exp.positions[i].z);
        quat.setFromEuler(exp.rotations[i]);
        const s = Math.max(0.15, 1 - lifeT * 0.75);
        scale.set(s, s, s);
        matrix.compose(pos, quat, scale);
        exp.mesh.setMatrixAt(i, matrix);
      }
      exp.mesh.instanceMatrix.needsUpdate = true;
      exp.material.opacity = Math.max(0, 1 - lifeT);

      if (exp.age >= exp.maxAge) {
        if (this._scene) this._scene.remove(exp.mesh);
        exp.geometry.dispose();
        exp.material.dispose();
        this._explosions.splice(e, 1);
      }
    }
  },

  // ----------------------------------------------------------
  // Screen glitch — CSS filter chain for 0.5s
  // ----------------------------------------------------------
  _triggerScreenGlitch() {
    const container = document.getElementById('lab-container');
    if (!container) return;
    container.classList.remove('is-glitching');
    void container.offsetWidth;     // restart animation
    container.classList.add('is-glitching');
    setTimeout(() => container.classList.remove('is-glitching'), 550);
  },

  // ----------------------------------------------------------
  // Crash sound — white noise through distortion + LP sweep
  // ----------------------------------------------------------
  _playCrashSound() {
    try {
      if (!this._audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        this._audioCtx = new Ctx();
      }
      const ctx = this._audioCtx;
      if (ctx.state === 'suspended' && typeof ctx.resume === 'function') ctx.resume();

      const dur = 0.7;
      const bufferSize = Math.floor(ctx.sampleRate * dur);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Distortion via waveshaper — gives the static a gritty edge
      const dist = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i / 255) * 2 - 1;
        curve[i] = Math.tanh(x * 6);
      }
      dist.curve = curve;

      // Low-pass sweep from 4kHz down to 160Hz — the "server dying" frequency drop
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + dur);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

      noise.connect(dist);
      dist.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + dur);
    } catch (e) { /* audio blocked — ignore */ }
  },

  // ----------------------------------------------------------
  // Camera shake — transient offset applied each frame, decays over 0.5s.
  // Works as an additive offset so it composes cleanly with the auto-orbit
  // that may be active during lab presentation.
  // ----------------------------------------------------------
  _shakeCamera(durationMs = 500) {
    this._cameraShakeStart = performance.now();
    this._cameraShakeDuration = durationMs;
  },

  _applyCameraShake() {
    if (!this._cameraShakeStart || !this._camera) return;
    const elapsed = performance.now() - this._cameraShakeStart;
    if (elapsed >= this._cameraShakeDuration) {
      this._cameraShakeStart = 0;
      return;
    }
    const falloff = 1 - elapsed / this._cameraShakeDuration;
    const mag = 0.35 * falloff;
    this._camera.position.x += (Math.random() - 0.5) * mag;
    this._camera.position.y += (Math.random() - 0.5) * mag * 0.7;
    this._camera.position.z += (Math.random() - 0.5) * mag;
  },

  // ----------------------------------------------------------
  // HUD flatline + 3s "reboot" lockout
  // ----------------------------------------------------------
  _triggerSystemCrash() {
    this._state = LabState.FAILED;
    this._crashLocked = true;

    // Flatline every metric
    this._accuracy = 0;
    this._latency = 0;
    this._integrity = 0;
    this._computePower = 0;
    const stats = this.currentModelStats;
    stats.accuracy = 0; stats.latency = 0; stats.signalIntegrity = 0;
    stats.totalBlocks = 0; stats.layerCount = 0; stats.computePower = 0;
    stats.hasPrep = false; stats.reachesOutput = false; stats.valid = false;

    this._renderHudStats();

    const hud = document.querySelector('.lab-hud');
    if (hud) hud.classList.add('is-failure');

    // Show the crash banner in the training section
    const tp = document.querySelector('.lab-hud .hud-training');
    if (tp) {
      tp.classList.remove('is-training', 'is-complete');
      tp.classList.add('is-active', 'is-crash');
      const label = tp.querySelector('.hud-training-label');
      if (label) label.textContent = 'CRITICAL FAILURE · SYSTEM INTERRUPTED';
      const report = tp.querySelector('.hud-training-report');
      if (report) {
        report.innerHTML = `
          <div class="hud-training-report-row"><span>Status</span><strong>OFFLINE</strong></div>
          <div class="hud-training-report-row"><span>Reboot in</span><strong id="lab-reboot-timer">3s</strong></div>
        `;
      }
    }

    // Live countdown so the user sees the reboot tick
    let remaining = 3;
    this._rebootIntervalId = setInterval(() => {
      remaining--;
      const timerEl = document.getElementById('lab-reboot-timer');
      if (timerEl) timerEl.textContent = Math.max(0, remaining) + 's';
      if (remaining <= 0) {
        clearInterval(this._rebootIntervalId);
        this._rebootIntervalId = null;
      }
    }, 1000);

    this._crashRecoveryTimer = setTimeout(() => this._rebootSystem(), 3000);
  },

  _rebootSystem() {
    this._crashRecoveryTimer = null;
    this._crashLocked = false;
    this._state = LabState.IDLE;

    const hud = document.querySelector('.lab-hud');
    if (hud) hud.classList.remove('is-failure');

    const tp = document.querySelector('.lab-hud .hud-training');
    if (tp) {
      tp.classList.remove('is-active', 'is-crash');
      const fill = tp.querySelector('.hud-training-fill');
      if (fill) fill.style.width = '0%';
      const report = tp.querySelector('.hud-training-report');
      if (report) report.innerHTML = '';
    }

    // Recompute stats from whatever pipeline remains
    this._updateStats();
  },

  _playSuccessChime() {
    try {
      if (!this._audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        this._audioCtx = new Ctx();
      }
      const ctx = this._audioCtx;
      if (ctx.state === 'suspended' && typeof ctx.resume === 'function') ctx.resume();

      const notes = [
        { freq: 523.25, delay: 0.00, dur: 0.22 }, // C5
        { freq: 659.25, delay: 0.11, dur: 0.22 }, // E5
        { freq: 783.99, delay: 0.22, dur: 0.42 }  // G5 (held longer)
      ];
      notes.forEach(n => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.delay);
        gain.gain.setValueAtTime(0, ctx.currentTime + n.delay);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + n.delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.delay + n.dur);
        osc.start(ctx.currentTime + n.delay);
        osc.stop(ctx.currentTime + n.delay + n.dur);
      });
    } catch (e) { /* audio blocked — ignore */ }
  },

  _startTrainingStream() {
    if (!this._scene) return;
    const data = this._blocks.find(b => b.type === 'DATA');
    if (!data) return;
    const chain = this._buildChain(data);
    if (chain.length < 2) return;

    // Snapshot path points at start of training. Positions stay fixed for the
    // full 5-second run even though LAYER blocks vibrate — the river should
    // be stable while the compute shakes.
    const pathPoints = chain.map(b => ({ x: b.mesh.position.x, z: b.mesh.position.z }));
    const integrity = this._integrity / 100;

    this._trainingStream = new this.DataStream(this._scene, pathPoints, {
      count: 200,
      integrity: integrity
    });
  },

  _updateTrainingStream() {
    if (!this._trainingStream) return;
    // Integrity can shift at runtime (future-proofing); keep it synced
    this._trainingStream.setIntegrity(this._integrity / 100);
    this._trainingStream.tick();
  },

  _stopTrainingStream() {
    if (!this._trainingStream) return;
    this._trainingStream.dispose();
    this._trainingStream = null;
  },

  // ----------------------------------------------------------
  // Connections + chain traversal (derived from block positions)
  // Two blocks are "connected" when they're snapped edge-to-edge:
  // centers ~1.5 apart on one axis, ~0 on the other.
  // ----------------------------------------------------------
  _areConnected(a, b) {
    if (a === b) return false;
    const ap = a.mesh.position;
    const bp = b.mesh.position;
    const dx = Math.abs(ap.x - bp.x);
    const dz = Math.abs(ap.z - bp.z);
    const size = Lab.Block.SIZE.w;
    const tol = 0.3;
    const xAdjacent = Math.abs(dx - size) < tol && dz < tol;
    const zAdjacent = Math.abs(dz - size) < tol && dx < tol;
    return xAdjacent || zAdjacent;
  },

  // DFS from `start`, returns blocks in visit order.
  _buildChain(start) {
    const chain = [];
    const visited = new Set();
    const visit = (block) => {
      if (visited.has(block)) return;
      visited.add(block);
      chain.push(block);
      // Sort neighbors so the pulse walks toward OUTPUT preferentially
      const neighbors = this._blocks
        .filter(b => this._areConnected(block, b))
        .sort((x, y) => {
          const order = { DATA: 0, PREP: 1, LAYER: 2, OUTPUT: 3 };
          return (order[y.type] || 0) - (order[x.type] || 0);
        });
      neighbors.forEach(visit);
    };
    visit(start);
    return chain;
  },

  // ----------------------------------------------------------
  // buildGraph() — adjacency list of all snapped blocks.
  // Returns Map<Block, Block[]>. Undirected (connection is
  // position-based snap, no inherent direction).
  // ----------------------------------------------------------
  buildGraph() {
    const adj = new Map();
    this._blocks.forEach(b => adj.set(b, []));
    for (let i = 0; i < this._blocks.length; i++) {
      for (let j = i + 1; j < this._blocks.length; j++) {
        if (this._areConnected(this._blocks[i], this._blocks[j])) {
          adj.get(this._blocks[i]).push(this._blocks[j]);
          adj.get(this._blocks[j]).push(this._blocks[i]);
        }
      }
    }
    return adj;
  },

  // ----------------------------------------------------------
  // Workflow Validator — DFS from DATA with path-order enforcement.
  // Rules (user-defined):
  //   1. Path starts at exactly one DATA block.
  //   2. Path must visit at least one PREP before any LAYER.
  //   3. Path must reach OUTPUT.
  // Plus sanity: exactly one DATA, no orphan components.
  //
  // Returns { valid, errors: [{code, message, block?}], reachable: Set<Block>,
  //           graph: Map, path: Block[]|null, gapBlock: Block|null }.
  // ----------------------------------------------------------
  validatePipeline() {
    const errors = [];
    const adj = this.buildGraph();

    // Rule 1: exactly one DATA
    const dataBlocks = this._blocks.filter(b => b.type === 'DATA');
    if (dataBlocks.length === 0) {
      errors.push({ code: 'NO_DATA', message: 'Invalid Pipeline: Missing Data Source' });
      this.currentModelStats.valid = false;
      return { valid: false, errors, reachable: new Set(), graph: adj, path: null, gapBlock: null };
    }
    if (dataBlocks.length > 1) {
      errors.push({ code: 'MULTIPLE_DATA', message: 'Invalid Pipeline: Only One Data Source Allowed', block: dataBlocks[1] });
    }
    const start = dataBlocks[0];

    // Typed-port DFS. Two blocks A→B are a valid edge iff
    // A.outputTypes ∩ B.inputTypes is non-empty. Traversal
    // from DATA respects this, and we remember the offending
    // block when a port mismatch blocks further progress so
    // the UI can anchor an error tooltip.
    let foundPath = null;
    let furthest = { node: start, depth: 1 };
    let mismatchDetail = null;

    const portsCompatible = (from, to) => {
      const out = from.outputTypes || [];
      const inp = to.inputTypes || [];
      return out.some(t => inp.includes(t));
    };

    const dfs = (node, visited, path) => {
      if (path.length > furthest.depth) furthest = { node, depth: path.length };
      if (node.type === 'OUTPUT') {
        // OUTPUT also needs port compat; walking into it succeeded, so the
        // incoming edge was already validated.
        foundPath = path.slice();
        return true;
      }
      visited.add(node);

      // Neighbor ordering hint: prefer types with matching input ports
      const neighbors = (adj.get(node) || []).slice();
      neighbors.sort((a, b) => {
        const ac = portsCompatible(node, a) ? 0 : 1;
        const bc = portsCompatible(node, b) ? 0 : 1;
        return ac - bc;
      });

      for (const next of neighbors) {
        if (visited.has(next)) continue;
        if (!portsCompatible(node, next)) {
          // Remember the first mismatch we hit for UI reporting
          if (!mismatchDetail) {
            mismatchDetail = {
              from: node, to: next,
              fromOut: (node.outputTypes || []).slice(),
              toIn: (next.inputTypes || []).slice()
            };
          }
          continue;
        }
        path.push(next);
        if (dfs(next, visited, path)) return true;
        path.pop();
      }
      visited.delete(node);
      return false;
    };

    const pathValid = dfs(start, new Set(), [start]);

    // Separately compute reachability for orphan detection (ignores path-order rule)
    const reachable = new Set();
    const stack = [start];
    while (stack.length > 0) {
      const cur = stack.pop();
      if (reachable.has(cur)) continue;
      reachable.add(cur);
      (adj.get(cur) || []).forEach(n => { if (!reachable.has(n)) stack.push(n); });
    }

    let gapBlock = null;
    if (!pathValid) {
      const hasOutput = this._blocks.some(b => b.type === 'OUTPUT');
      if (!hasOutput) {
        errors.push({ code: 'MISSING_OUTPUT', message: 'Invalid Pipeline: Missing Output Stage', block: furthest.node });
        gapBlock = furthest.node;
      } else if (mismatchDetail) {
        // Typed-port mismatch — craft the holographic message the UI will display.
        const toTitle = Lab.Block.TYPES[mismatchDetail.to.type]?.title || mismatchDetail.to.type;
        const needs = mismatchDetail.toIn.length > 0 ? mismatchDetail.toIn.join(' / ') : 'no input';
        const gave  = mismatchDetail.fromOut.length > 0 ? mismatchDetail.fromOut.join(' / ') : 'nothing';
        errors.push({
          code: 'TYPE_MISMATCH',
          message: `Type Mismatch: ${toTitle} requires ${needs} input, received ${gave}`,
          block: mismatchDetail.to
        });
        gapBlock = mismatchDetail.to;
      } else {
        errors.push({ code: 'PATH_BROKEN', message: 'Invalid Pipeline: Broken Path Between Blocks', block: furthest.node });
        gapBlock = furthest.node;
      }
    }

    // Orphan components (unreachable from DATA)
    const orphans = this._blocks.filter(b => !reachable.has(b));
    if (orphans.length > 0) {
      errors.push({ code: 'ORPHAN_COMPONENT', message: 'Disconnected Block Detected', block: orphans[0] });
      if (!gapBlock) gapBlock = orphans[0];
    }

    const valid = pathValid && orphans.length === 0 && dataBlocks.length === 1;
    this.currentModelStats.valid = valid;
    return { valid, errors, reachable, graph: adj, path: foundPath, gapBlock };
  },

  // ----------------------------------------------------------
  // Connection-point visuals — glowing spheres at the midpoint
  // of every snapped pair. Neon green when the pipeline is valid,
  // dim red when any rule is violated. Called from _updateStats()
  // so the glow reflects the current graph on every mutation.
  // ----------------------------------------------------------
  _updateConnectorVisuals() {
    if (!this._scene) return;

    // Initialize shared geometry + materials once
    if (!this._connectorGeometry) {
      this._connectorGeometry = new THREE.SphereGeometry(0.14, 12, 12);
    }
    if (!this._connectorGreenMat) {
      this._connectorGreenMat = new THREE.MeshBasicMaterial({
        color: 0x33ff00,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
    }
    if (!this._connectorRedMat) {
      this._connectorRedMat = new THREE.MeshBasicMaterial({
        color: 0xff3060,
        transparent: true,
        opacity: 0.45,
        depthWrite: false
      });
    }

    // Tear down previous connector meshes (materials + geometry are shared, reused)
    if (!this._connectors) this._connectors = [];
    this._connectors.forEach(m => this._scene.remove(m));
    this._connectors.length = 0;

    // Ask the validator once — picks the material accordingly
    const result = this.validatePipeline();
    const mat = result.valid ? this._connectorGreenMat : this._connectorRedMat;

    // Build connector meshes at each snap-pair midpoint
    const blockIdx = new Map(this._blocks.map((b, i) => [b, i]));
    const seen = new Set();
    const graph = result.graph;
    graph.forEach((neighbors, block) => {
      neighbors.forEach(other => {
        const a = blockIdx.get(block);
        const b = blockIdx.get(other);
        const key = a < b ? `${a}-${b}` : `${b}-${a}`;
        if (seen.has(key)) return;
        seen.add(key);
        const mesh = new THREE.Mesh(this._connectorGeometry, mat);
        mesh.position.set(
          (block.mesh.position.x + other.mesh.position.x) / 2,
          Lab.Block.SIZE.h / 2 + 0.06,
          (block.mesh.position.z + other.mesh.position.z) / 2
        );
        this._scene.add(mesh);
        this._connectors.push(mesh);
      });
    });
  },

  // ----------------------------------------------------------
  // Error feedback — shake the offending block, show holographic tag
  // ----------------------------------------------------------
  _showValidationError(result) {
    if (!result || result.valid || result.errors.length === 0) return;
    const err = result.errors[0];
    // Prefer the gap block from DFS (where the path broke), then the
    // error's own block, then OUTPUT, then first block.
    const anchor = result.gapBlock
      || err.block
      || this._blocks.find(b => b.type === 'OUTPUT')
      || this._blocks[0]
      || null;
    this._shakeBlock(anchor);
    this._showErrorTooltip('⚠ ' + err.message, anchor);
  },

  _shakeBlock(block) {
    if (!block || !window.gsap) return;
    const mesh = block.mesh;
    gsap.killTweensOf(mesh.position);
    const origX = mesh.position.x;
    const origZ = mesh.position.z;
    // Small back-and-forth shake, 6 oscillations in ~0.4s
    const tl = gsap.timeline({
      onComplete: () => { mesh.position.x = origX; mesh.position.z = origZ; }
    });
    for (let i = 0; i < 6; i++) {
      tl.to(mesh.position, { x: origX + (i % 2 ? 0.12 : -0.12), duration: 0.05, ease: 'power1.inOut' });
    }
    tl.to(mesh.position, { x: origX, duration: 0.05, ease: 'power2.out' });

    // Flash emissive red
    if (mesh.material && mesh.material.emissive) {
      const origEmi = mesh.material.emissive.getHex();
      gsap.killTweensOf(mesh.material.emissive);
      gsap.to(mesh.material.emissive, {
        r: 1, g: 0.15, b: 0.25,
        duration: 0.08,
        repeat: 5,
        yoyo: true,
        onComplete: () => mesh.material.emissive.setHex(origEmi)
      });
    }
  },

  _showErrorTooltip(message, block) {
    const container = document.getElementById('lab-container');
    if (!container) return;
    if (!this._errorTooltipEl) {
      const el = document.createElement('div');
      el.className = 'lab-error-tooltip';
      container.appendChild(el);
      this._errorTooltipEl = el;
    }
    const el = this._errorTooltipEl;
    el.textContent = message;

    // Position: above the anchoring block (projected), else top-center
    if (block && this._camera) {
      const rect = container.getBoundingClientRect();
      const world = new THREE.Vector3(
        block.mesh.position.x,
        block.mesh.position.y + Lab.Block.SIZE.h / 2 + 0.5,
        block.mesh.position.z
      );
      world.project(this._camera);
      const x = (world.x + 1) / 2 * rect.width;
      const y = (1 - world.y) / 2 * rect.height;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    } else {
      el.style.left = '50%';
      el.style.top = '100px';
    }

    // Retrigger the entrance animation each call
    el.classList.remove('is-visible');
    void el.offsetWidth;                // force reflow so the animation restarts
    el.classList.add('is-visible');

    clearTimeout(this._errorTooltipTimer);
    this._errorTooltipTimer = setTimeout(() => this._hideErrorTooltip(), 2600);
  },

  _hideErrorTooltip() {
    if (this._errorTooltipEl) this._errorTooltipEl.classList.remove('is-visible');
    if (this._errorTooltipTimer) {
      clearTimeout(this._errorTooltipTimer);
      this._errorTooltipTimer = null;
    }
  },

  // ----------------------------------------------------------
  // The Pulse — a glowing sphere travels from DATA across the chain
  // ----------------------------------------------------------
  triggerPulse() {
    if (this._pulseActive) return;
    if (!this._scene) return;
    // When a block is expanded, redirect the pulse to walk its sub-nodes.
    if (this._isExpanded && this._subNodes.length > 0) {
      return this._pulseSubNodes();
    }
    const dataBlock = this._blocks.find(b => b.type === 'DATA');
    if (!dataBlock) return;

    this._pulseActive = true;

    // Create the pulse sphere
    const sphereGeo = new THREE.SphereGeometry(0.18, 20, 20);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    const startPos = dataBlock.mesh.position.clone();
    sphere.position.set(startPos.x, Lab.Block.SIZE.h + 0.25, startPos.z);
    this._scene.add(sphere);
    this._pulseSphere = sphere;

    // Glow: attach a short-range PointLight to the sphere
    const pulseLight = new THREE.PointLight(0xffffff, 4, 2.4, 2);
    sphere.add(pulseLight);

    // Build chain from DATA and check if the pipeline reaches OUTPUT
    const chain = this._buildChain(dataBlock);
    const reachesOutput = chain.some(b => b.type === 'OUTPUT');

    // Walk the chain
    const steps = [];
    for (let i = 1; i < chain.length; i++) {
      const target = chain[i].mesh.position;
      steps.push({
        x: target.x,
        z: target.z,
        duration: 0.42,
        ease: 'power2.inOut'
      });
    }

    const disposeSphere = () => {
      if (sphere.parent) sphere.parent.remove(sphere);
      sphereGeo.dispose();
      sphereMat.dispose();
      if (this._pulseSphere === sphere) this._pulseSphere = null;
      this._pulseActive = false;
    };

    const runStep = (i) => {
      if (i >= steps.length) {
        // Reached end of chain
        if (reachesOutput) {
          // Success: briefly flash "PULSE OK", then restore live accuracy reading
          this._setHudValue(this._accuracy.toFixed(1) + '%', 'PULSE OK');
          setTimeout(() => this._renderHudStats(), 1200);
          gsap.to(sphereMat, { opacity: 0, duration: 0.5, onComplete: disposeSphere });
        } else {
          // Failure: chain doesn't reach OUTPUT → a gap
          this._triggerSystemFailure(sphere, sphereMat, disposeSphere);
        }
        return;
      }
      gsap.to(sphere.position, {
        ...steps[i],
        onComplete: () => runStep(i + 1)
      });
    };
    runStep(0);
  },

  // ----------------------------------------------------------
  // System failure: red pulse, red grid flash, flatline, alert
  // ----------------------------------------------------------
  _triggerSystemFailure(sphere, sphereMat, disposeSphere) {
    // Pulse turns neon red
    if (sphereMat && sphereMat.color) {
      gsap.to(sphereMat.color, { r: 1, g: 0.19, b: 0.38, duration: 0.25 });
    }
    // Grid line tint (GridHelper uses LineBasicMaterial + vertex colors,
    // so material.color multiplies the teal toward red)
    if (this._grid && this._grid.material) {
      const c = this._grid.material.color;
      const orig = c.clone();
      gsap.to(c, {
        r: 1, g: 0.12, b: 0.24,
        duration: 0.15,
        repeat: 5,
        yoyo: true,
        onComplete: () => c.copy(orig)
      });
    }
    // Ground plane emissive flash — adds the bloody floor glow
    if (this._plane && this._plane.material) {
      const em = this._plane.material.emissive;
      const origHex = em.getHex();
      gsap.to(em, {
        r: 0.55, g: 0, b: 0.08,
        duration: 0.15,
        repeat: 5,
        yoyo: true,
        onComplete: () => em.setHex(origHex)
      });
    }
    // Flatline HUD
    this._flatlined = true;
    const hud = document.querySelector('.lab-hud');
    if (hud) hud.classList.add('is-failure');
    this._setHudValue('0.0%', 'FLATLINE');

    // Alert sound
    this._playAlertSound();

    // Clear sphere after the effect lands
    setTimeout(disposeSphere, 1600);

    // Auto-reset HUD after 4s so the student can try again
    setTimeout(() => {
      this._flatlined = false;
      if (hud) hud.classList.remove('is-failure');
      this._renderHudStats();
    }, 4000);
  },

  // ----------------------------------------------------------
  // Amputation (double-click a block to remove it)
  // ----------------------------------------------------------
  _amputateBlock(block) {
    const idx = this._blocks.indexOf(block);
    if (idx < 0) return;
    this._blocks.splice(idx, 1);
    if (this._draggedBlock === block) {
      this._draggedBlock = null;
      const container = document.getElementById('lab-container');
      if (container) container.style.cursor = '';
    }

    // Drop accuracy to 0 immediately — the visual "the patient just lost an organ"
    this._accuracy = 0;
    this._renderHudStats();

    const finalizeRemove = () => {
      this._scene && this._scene.remove(block.mesh);
      if (block.mesh.material && typeof block.mesh.material.dispose === 'function') {
        block.mesh.material.dispose();
      }
      // After the animation finishes, re-evaluate the chain that remains
      this._updateStats();
    };

    if (window.gsap) {
      gsap.killTweensOf(block.mesh.position);
      gsap.to(block.mesh.scale, {
        x: 0.01, y: 0.01, z: 0.01,
        duration: 0.32,
        ease: 'power2.in',
        onComplete: finalizeRemove
      });
    } else {
      finalizeRemove();
    }
  },

  // ----------------------------------------------------------
  // Alert sound — low-frequency sine tone via Web Audio API
  // ----------------------------------------------------------
  _playAlertSound() {
    try {
      if (!this._audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        this._audioCtx = new Ctx();
      }
      const ctx = this._audioCtx;
      // Some browsers start contexts suspended until user gesture
      if (ctx.state === 'suspended' && typeof ctx.resume === 'function') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 1.6);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch (err) {
      // Audio may be blocked until user gesture; fail silently
    }
  },

  // Find the closest attachment point from any *other* block to `dragged`.
  // Returns { x, z } if within 1.5 units, otherwise null.
  _findSnapTarget(dragged) {
    const THRESHOLD = 1.5;
    const dp = dragged.mesh.position;
    let best = null;
    let bestDist = THRESHOLD;
    this._blocks.forEach(other => {
      if (other === dragged) return;
      other.attachmentPoints().forEach(pt => {
        const dx = dp.x - pt.x;
        const dz = dp.z - pt.z;
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d < bestDist) {
          bestDist = d;
          best = { x: pt.x, z: pt.z, neighbor: other };
        }
      });
    });
    return best;
  }
};

// ============================================================
// DYNAMIC MODULE LOADING
// Per-module content lives in /data/moduleN.js and is fetched
// only when the student opens that module.
// ============================================================
const _moduleLoadPromises = {};

function isModuleLoaded(moduleId) {
  return !!(COURSE_DATA._loadedModules && COURSE_DATA._loadedModules[moduleId]);
}

function loadModule(moduleId) {
  if (isModuleLoaded(moduleId)) return Promise.resolve();
  if (_moduleLoadPromises[moduleId]) return _moduleLoadPromises[moduleId];

  _moduleLoadPromises[moduleId] = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `data/module${moduleId}.js`;
    script.async = true;
    script.onload = () => {
      if (isModuleLoaded(moduleId)) {
        resolve();
      } else {
        reject(new Error(`module${moduleId}.js loaded but did not register content`));
      }
    };
    script.onerror = () => {
      delete _moduleLoadPromises[moduleId];
      reject(new Error(`Failed to fetch data/module${moduleId}.js`));
    };
    document.head.appendChild(script);
  });

  return _moduleLoadPromises[moduleId];
}

function renderLoading(msg) {
  return `
    <div class="loading-wrap">
      <div class="spinner" role="status" aria-label="Loading"></div>
      <p class="loading-msg">${msg || 'Loading module content...'}</p>
    </div>
  `;
}

function renderLoadError(moduleId) {
  return `
    <div class="page-header">
      <a class="back" href="#/">&#8592; All Modules</a>
      <h1>Could not load Module ${moduleId}</h1>
      <p>There was a problem loading the class content. Check your connection and try again.</p>
    </div>
    ${renderFooter()}
  `;
}

// ------------------------------------------------------------
// MAIN RENDER FUNCTION
// Reads window.location.hash, finds matching COURSE_DATA,
// loads the module file if needed, injects HTML into #app-container
// ------------------------------------------------------------
async function renderContent() {
  const route = parseRoute();
  const container = document.getElementById('app-container');
  const bc = document.getElementById('breadcrumb');

  if (!container) {
    console.error('#app-container not found in DOM');
    return;
  }

  // Lab route: hand off the viewport to the 3D scene and stop here.
  if (route.page === 'lab') {
    if (bc) bc.innerHTML = `<a href="#/">Home</a><span class="sep">/</span><span>Lab</span>`;
    Lab.enter();
    return;
  }
  // Any other route: ensure the lab is torn down before rendering course content.
  if (Lab._active) Lab.exit();

  window.scrollTo(0, 0);

  if (route.page === 'home') {
    if (bc) bc.innerHTML = '';
    container.innerHTML = renderHome();
    attachModuleSpotlight(container);
    return;
  }

  if (route.page === 'module') {
    const mod = COURSE_DATA.modules.find(m => m.id === route.moduleId);
    if (!mod) { navigate('/'); return; }
    if (bc) {
      bc.innerHTML =
        `<a href="#/">Home</a><span class="sep">/</span><span>Module ${mod.id}</span>`;
    }
    // Module overview doesn't strictly need class content, but we load it so
    // class cards can reflect accurate quiz counts and completion state.
    if (!isModuleLoaded(mod.id)) {
      container.innerHTML = renderLoading(`Loading Module ${mod.id}...`);
      try {
        await loadModule(mod.id);
      } catch (e) {
        container.innerHTML = renderLoadError(mod.id);
        return;
      }
      // If the user navigated away while loading, bail.
      if (parseRoute().page !== 'module' || parseRoute().moduleId !== mod.id) return;
    }
    container.innerHTML = renderModule(mod);
    return;
  }

  if (route.page === 'class') {
    const mod = COURSE_DATA.modules.find(m => m.id === route.moduleId);
    const cls = mod ? mod.classList.find(c => c.id === route.classId) : null;
    if (!mod || !cls) { navigate('/'); return; }
    if (bc) {
      bc.innerHTML =
        `<a href="#/">Home</a><span class="sep">/</span>` +
        `<a href="#/module/${mod.id}">Module ${mod.id}</a>` +
        `<span class="sep">/</span><span>Class ${cls.id}</span>`;
    }
    if (!isModuleLoaded(mod.id)) {
      container.innerHTML = renderLoading(`Loading: ${cls.title}...`);
      try {
        await loadModule(mod.id);
      } catch (e) {
        container.innerHTML = renderLoadError(mod.id);
        return;
      }
      const now = parseRoute();
      if (now.page !== 'class' || now.moduleId !== mod.id || now.classId !== cls.id) return;
    }
    container.innerHTML = renderClass(mod, cls);
    document.querySelectorAll('.section').forEach(s => s.classList.add('open'));
    enhanceClassContent(container);
    // If this class declares a brokenState, stash it so Lab.enter() can
    // load the scenario the moment the student clicks into the lab.
    try {
      const content = COURSE_DATA.classContent && COURSE_DATA.classContent[`${mod.id}-${cls.id}`];
      if (content && content.brokenState) {
        sessionStorage.setItem('lab-scenario', JSON.stringify(content.brokenState));
      }
    } catch {}
    return;
  }

  // Fallback
  navigate('/');
}

// ------------------------------------------------------------
// VIEW: HOME
// ------------------------------------------------------------
// ------------------------------------------------------------
// Class-content post-processing:
//   1. Python syntax highlight every <pre> block (idempotent).
//   2. Wrap each line in <span class="code-line"> for click-to-focus.
//   3. Clicking a line dims the rest of the block (toggle off on same line).
// Regex-based; safe for mixed text. Does not alter the authored HTML —
// only walks <pre> elements after they're in the DOM.
// ------------------------------------------------------------
const PY_KEYWORDS = /\b(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g;
const PY_BUILTINS = /\b(print|len|range|int|float|str|bool|list|dict|tuple|set|type|isinstance|input|open|map|filter|sum|min|max|abs|round|sorted|enumerate|zip|any|all)\b/g;
function pyHighlight(line) {
  // Escape HTML first so we don't collide with the spans we'll inject.
  let s = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const placeholders = [];
  const ph = (cls, text) => {
    placeholders.push(`<span class="tok ${cls}">${text}</span>`);
    return `\u0000${placeholders.length - 1}\u0000`;
  };
  // Order matters: comments > strings > numbers > keywords > builtins
  s = s.replace(/#.*$/g, (m) => ph('cmt', m));
  s = s.replace(/(&#39;|&quot;|'|")([\s\S]*?)\1/g, (m) => ph('str', m));
  s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, (m) => ph('num', m));
  s = s.replace(PY_KEYWORDS, (m) => ph('kw', m));
  s = s.replace(PY_BUILTINS, (m) => ph('bi', m));
  // Restore placeholders.
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[Number(i)]);
}

function enhanceClassContent(root) {
  const blocks = root.querySelectorAll('.section-body pre, .example-box pre');
  blocks.forEach((pre) => {
    if (pre.dataset.hl === '1') return;
    const raw = pre.textContent;
    const lines = raw.replace(/\s+$/, '').split('\n');
    pre.innerHTML = lines.map((ln, i) =>
      `<span class="code-line" data-line="${i + 1}">${pyHighlight(ln) || '&nbsp;'}</span>`
    ).join('\n');
    pre.dataset.hl = '1';
    pre.classList.add('code-block');

    // Try-in-Lab handoff: stash the code in sessionStorage, navigate to the lab.
    // The Lab can later read `lab-playground-code` to pre-populate its own
    // inference prompt. For now the pipe exists even if the Lab ignores it.
    const wrap = document.createElement('div');
    wrap.className = 'code-actions';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'try-in-lab';
    btn.innerHTML = 'Try in Lab <span aria-hidden="true">→</span>';
    btn.addEventListener('click', () => {
      try { sessionStorage.setItem('lab-playground-code', raw); } catch {}
      window.location.hash = '#/lab';
    });
    wrap.appendChild(btn);
    pre.insertAdjacentElement('afterend', wrap);
  });

  // CV Labeler task (Module 2 Class 2 scenario recovery): student labels
  // 5 samples; on completion we clear the Lab's grayscale scenario and
  // surface a success note.
  root.querySelectorAll('.cv-labeler:not([data-wired])').forEach((wrap) => {
    wrap.dataset.wired = '1';
    const doneEl = wrap.querySelector('.cv-done');
    const statusEl = wrap.querySelector('.cv-labeler-status');
    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.cv-choices button');
      if (!btn) return;
      const sample = btn.closest('.cv-sample');
      if (!sample || sample.classList.contains('is-done')) return;
      const pick = btn.dataset.pick;
      const truth = sample.dataset.truth;
      sample.classList.add('is-done', pick === truth ? 'is-right' : 'is-wrong');
      sample.querySelectorAll('button').forEach(b => b.disabled = true);
      const done = wrap.querySelectorAll('.cv-sample.is-done').length;
      if (doneEl) doneEl.textContent = String(done);
      if (done === wrap.querySelectorAll('.cv-sample').length) {
        if (statusEl) statusEl.textContent = '✓ Sensors recalibrated — colour will return when you re-enter the Lab.';
        wrap.classList.add('is-complete');
        // Clear any active grayscale scenario right now if the lab is open,
        // and wipe the pending-scenario key so future Lab.enter() starts clean.
        try {
          if (window.Lab && window.Lab.clearScenario) window.Lab.clearScenario();
          sessionStorage.removeItem('lab-scenario');
        } catch {}
      }
    });
  });

  // Click-to-focus line (delegated once per container).
  if (!root.dataset.codeFocusBound) {
    root.addEventListener('click', (e) => {
      const line = e.target.closest('.code-line');
      if (!line) return;
      const block = line.closest('.code-block');
      if (!block) return;
      const already = line.classList.contains('is-active');
      block.querySelectorAll('.code-line.is-active').forEach(l => l.classList.remove('is-active'));
      if (already) {
        block.classList.remove('has-active');
      } else {
        line.classList.add('is-active');
        block.classList.add('has-active');
      }
    });
    root.dataset.codeFocusBound = '1';
  }
}

// Cursor-following violet spotlight on module cards. Event-delegated on the
// grid so we add one listener, not one per card. Updates CSS custom props
// --mx / --my that the card's radial-gradient reads.
function attachModuleSpotlight(root) {
  const grid = root.querySelector('.module-grid');
  if (!grid) return;
  grid.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.module-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}

function renderHome() {
  const moduleCards = COURSE_DATA.modules.map(m => {
    const isAvailable = m.status === 'available';
    const badgeClass = isAvailable ? 'badge-available' : 'badge-soon';
    const badgeText = isAvailable ? 'Available' : 'Coming Soon';
    const cardClass = isAvailable ? '' : 'locked';
    const onclick = isAvailable ? `onclick="navigate('/module/${m.id}')"` : '';
    const completedCount = m.classList.filter(c => getClassProgress(m.id, c.id).completed).length;
    const pct = m.classes ? Math.round((completedCount / m.classes) * 100) : 0;
    return `
      <div class="module-card ${cardClass}" ${onclick} data-module="${m.id}">
        <div class="module-card-ring" aria-hidden="true"></div>
        <div class="module-card-spot" aria-hidden="true"></div>
        <div class="module-card-inner">
          <div class="module-num kicker">Module ${String(m.id).padStart(2, '0')}</div>
          <h3>${m.title}</h3>
          <p class="module-desc">${m.description}</p>
          ${isAvailable ? `
            <div class="module-progress">
              <div class="module-progress-track"><div class="module-progress-fill" style="--w:${pct}%"></div></div>
              <div class="module-progress-text"><b>${completedCount}</b>/${m.classes} classes <span class="dot">·</span> ${pct}%</div>
            </div>
          ` : `<div class="module-progress module-progress-locked"></div>`}
          <div class="meta">
            <span>Weeks ${m.weeks}</span>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Build the team dossier from the canonical team array (falls back to legacy mentors).
  const team = COURSE_DATA.team || (COURSE_DATA.mentors || []).map(name => ({
    name,
    role: 'Mentor',
    initials: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }));
  const teamHtml = team.map(p => {
    const cls = (p.role || '').toLowerCase() === 'assistant' ? 'asst' : 'lead';
    return `
      <div class="team-row">
        <div class="team-avatar ${cls}">${p.initials}</div>
        <div class="team-info">
          <div class="team-name">${p.name}</div>
          <div class="team-role">${p.role}</div>
        </div>
      </div>
    `;
  }).join('');

  // Live stats derived from the data model — no hardcoded numbers.
  const totalClasses = COURSE_DATA.modules.reduce((n, m) => n + (m.classes || 0), 0);
  const totalWeeks   = COURSE_DATA.modules.reduce((n, m) => {
    const [a, b] = String(m.weeks || '').split('-').map(Number);
    return n + (Number.isFinite(b) ? (b - a + 1) : 0);
  }, 0);
  const cohortSize   = COURSE_DATA.cohortSize || team.length;

  // Iridescent shine on the emphasis word in the subtitle.
  const subtitleWithShine = (COURSE_DATA.courseSubtitle || '')
    .replace(/\breal\b/, '<em class="shine">real</em>');

  return `
    <section class="hero hero-aurora">
      <div class="hero-dossier glass">
        <div class="hero-kicker kicker">UN AI/ML Mentorship Program · Cohort ${new Date().getFullYear()}</div>
        <h1 class="hero-title">${COURSE_DATA.courseTitle}</h1>
        <p class="hero-subtitle">${subtitleWithShine}</p>

        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-num">${cohortSize}</div>
            <div class="hero-stat-lbl kicker">Students</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">${COURSE_DATA.modules.length}</div>
            <div class="hero-stat-lbl kicker">Modules</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">${totalClasses}</div>
            <div class="hero-stat-lbl kicker">Classes</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">${totalWeeks}</div>
            <div class="hero-stat-lbl kicker">Weeks</div>
          </div>
        </div>

        <div class="hero-divider"></div>

        <div class="team-grid">
          ${teamHtml}
        </div>
      </div>
    </section>
    <div class="module-grid">
      ${moduleCards}
    </div>
    ${renderFooter()}
  `;
}

// ------------------------------------------------------------
// VIEW: MODULE
// ------------------------------------------------------------
function renderModule(mod) {
  const classCards = mod.classList.map(c => {
    const isAvailable = c.status === 'available';
    const cardClass = isAvailable ? '' : 'locked';
    const onclick = isAvailable ? `onclick="navigate('/module/${mod.id}/class/${c.id}')"` : '';
    const prog = getClassProgress(mod.id, c.id);
    const completed = prog.completed;
    const badgeClass = completed ? 'badge-completed' : (isAvailable ? 'badge-available' : 'badge-soon');
    const badgeText = completed ? 'Completed' : (isAvailable ? 'Available' : 'Coming Soon');
    return `
      <div class="class-card ${cardClass}" ${onclick}>
        <div class="class-card-left">
          <div class="class-number">${c.id}</div>
          <div>
            <h4>${c.title}</h4>
            <div class="class-desc">${c.desc}</div>
          </div>
        </div>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="page-header">
      <a class="back" href="#/">&#8592; All Modules</a>
      <h1>Module ${mod.id}: ${mod.title}</h1>
      <p>${mod.description}</p>
      <div class="page-meta">
        <div class="page-meta-item"><span>Classes:</span> ${mod.classes}</div>
        <div class="page-meta-item"><span>Weeks:</span> ${mod.weeks}</div>
        <div class="page-meta-item"><span>Status:</span> <span class="badge ${mod.status === 'available' ? 'badge-available' : 'badge-soon'}">${mod.status === 'available' ? 'Available' : 'Coming Soon'}</span></div>
      </div>
    </div>
    <h2 style="font-size:1.3rem;color:var(--heading);margin-bottom:16px;">Classes</h2>
    <div class="class-list">
      ${classCards}
    </div>
    <div class="resources-section">
      <h2>Resources</h2>
      <a href="#" class="resource-link" onclick="event.preventDefault()">
        <span class="resource-icon">&#128196;</span>
        <span class="resource-text">Module ${mod.id} Content Document (PDF)</span>
      </a>
      <a href="#" class="resource-link" onclick="event.preventDefault()">
        <span class="resource-icon">&#128218;</span>
        <span class="resource-text">Module ${mod.id} Resource Guide and Reading List</span>
      </a>
    </div>
    ${renderFooter()}
  `;
}

// ------------------------------------------------------------
// VIEW: CLASS
// ------------------------------------------------------------
function renderClass(mod, cls) {
  const key = `${mod.id}-${cls.id}`;
  const content = COURSE_DATA.classContent[key];

  if (!content) {
    return `
      <div class="page-header">
        <a class="back" href="#/module/${mod.id}">&#8592; Module ${mod.id}</a>
        <h1>Class ${cls.id}: ${cls.title}</h1>
        <p>Content coming soon.</p>
      </div>
      ${renderClassNav(mod, cls)}
      ${renderFooter()}
    `;
  }

  const sections = content.sections.map(s => {
    const videoUrl = s.video
      ? (s.video.length > 15 ? s.video : `https://www.youtube.com/watch?v=${s.video}`)
      : '';
    const videoHtml = s.video ? `
      <div style="margin:20px 0;">
        <a href="${videoUrl}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:14px;padding:16px 20px;background:var(--card);border:1px solid var(--card-border);border-radius:12px;text-decoration:none;transition:background 0.2s;" onmouseover="this.style.background='var(--card-hover)'" onmouseout="this.style.background='var(--card)'">
          <span style="font-size:2rem;">&#9654;&#65039;</span>
          <div>
            <div style="color:var(--heading);font-weight:600;font-size:1rem;">Watch Video</div>
            <div style="color:var(--muted);font-size:0.9rem;">${s.videoTitle || 'YouTube'}</div>
          </div>
          <span style="margin-left:auto;color:var(--link);font-size:0.85rem;">Open on YouTube &#8599;</span>
        </a>
      </div>
    ` : '';
    // Strip inline onclick from quiz buttons — event delegation handles clicks now
    const cleanContent = s.content.replace(/\s*onclick="toggleAnswer\(this\)"/g, '');
    return `
      <div class="section open">
        <div class="section-header">
          <div class="section-title">
            <span class="section-icon">${s.icon}</span>
            ${s.title}
          </div>
          <span class="section-toggle">&#9662;</span>
        </div>
        <div class="section-body">
          ${cleanContent}
          ${videoHtml}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="class-header">
      <a class="back" href="#/module/${mod.id}">&#8592; Module ${mod.id}: ${mod.title}</a>
      <h1>Class ${cls.id}: ${content.title}</h1>
      <p class="class-subtitle">${content.subtitle}</p>
      ${renderProgressBar(mod.id, cls.id)}
    </div>
    ${sections}
    ${renderClassNav(mod, cls)}
    ${renderFooter()}
  `;
}

// ------------------------------------------------------------
// CLASS NAVIGATION (prev/next) — spans modules so students can
// walk the whole course linearly without dead-ends at module boundaries.
// ------------------------------------------------------------
function renderClassNav(mod, cls) {
  // Previous: try same module, then fall back to last class of previous module.
  const prevCls = mod.classList.find(c => c.id === cls.id - 1 && c.status === 'available');
  let prevLink;
  if (prevCls) {
    prevLink = `<a href="#/module/${mod.id}/class/${prevCls.id}">&#8592; Class ${prevCls.id}: ${prevCls.title}</a>`;
  } else {
    const prevMod = COURSE_DATA.modules.find(m => m.id === mod.id - 1 && m.status === 'available');
    const prevModLast = prevMod && [...prevMod.classList].reverse().find(c => c.status === 'available');
    prevLink = prevModLast
      ? `<a href="#/module/${prevMod.id}/class/${prevModLast.id}">&#8592; Module ${prevMod.id} &middot; Class ${prevModLast.id}: ${prevModLast.title}</a>`
      : `<a href="#/module/${mod.id}">&#8592; Module Overview</a>`;
  }

  // Next: try same module, then fall back to first class of next module.
  const nextCls = mod.classList.find(c => c.id === cls.id + 1 && c.status === 'available');
  let nextLink;
  if (nextCls) {
    nextLink = `<a href="#/module/${mod.id}/class/${nextCls.id}">Class ${nextCls.id}: ${nextCls.title} &#8594;</a>`;
  } else {
    const nextMod = COURSE_DATA.modules.find(m => m.id === mod.id + 1 && m.status === 'available');
    const nextModFirst = nextMod && nextMod.classList.find(c => c.status === 'available');
    nextLink = nextModFirst
      ? `<a href="#/module/${nextMod.id}/class/${nextModFirst.id}">Module ${nextMod.id} &middot; Class ${nextModFirst.id}: ${nextModFirst.title} &#8594;</a>`
      : `<a href="#/module/${mod.id}">Module Overview &#8594;</a>`;
  }

  return `
    <div class="class-nav">
      ${prevLink}
      ${nextLink}
    </div>
  `;
}

// ------------------------------------------------------------
// FOOTER
// ------------------------------------------------------------
function renderFooter() {
  const botLink = COURSE_DATA.botLink || 'https://t.me/lossfunction_bot';
  const botHandle = botLink.split('/').pop();
  return `
    <div class="footer">
      <p>${COURSE_DATA.courseTitle} &mdash; UN AI/ML Mentorship Program</p>
      <p>Questions? Reach out via <a href="${botLink}" target="_blank">@${botHandle}</a> on Telegram</p>
    </div>
  `;
}

// ============================================================
// PROGRESS TRACKER (localStorage)
// Persists which quiz questions each student has revealed.
// Shape: { "M-C": { quizzes: { "0": true, "1": true, ... }, completed: bool } }
// ============================================================
const PROGRESS_KEY = 'aiml-progress-v1';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveProgress(p) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch (e) {
    // localStorage full or disabled — silently ignore
  }
}

function getClassProgress(moduleId, classId) {
  const p = loadProgress();
  return p[`${moduleId}-${classId}`] || { quizzes: {}, completed: false };
}

function countQuizzesInClass(moduleId, classId) {
  const content = COURSE_DATA.classContent[`${moduleId}-${classId}`];
  if (!content) return 0;
  let count = 0;
  content.sections.forEach(s => {
    const matches = s.content.match(/class="quiz-item"/g);
    if (matches) count += matches.length;
  });
  return count;
}

function markQuizRevealed(moduleId, classId, quizIndex) {
  const p = loadProgress();
  const key = `${moduleId}-${classId}`;
  if (!p[key]) p[key] = { quizzes: {}, completed: false };
  p[key].quizzes[quizIndex] = true;

  const total = countQuizzesInClass(moduleId, classId);
  const revealed = Object.keys(p[key].quizzes).length;
  if (total > 0 && revealed >= total) {
    p[key].completed = true;
  }
  saveProgress(p);
  return p[key];
}

// Render a progress bar for a class based on quizzes revealed
function renderProgressBar(moduleId, classId) {
  const total = countQuizzesInClass(moduleId, classId);
  if (total === 0) return '';
  const prog = getClassProgress(moduleId, classId);
  const revealed = Object.keys(prog.quizzes).length;
  const pct = Math.min(100, Math.round((revealed / total) * 100));
  const label = prog.completed
    ? `Completed &#10003; (${revealed} / ${total} quizzes)`
    : `Progress: ${revealed} / ${total} quizzes`;
  return `
    <div class="progress-wrap" data-module="${moduleId}" data-class="${classId}">
      <div class="progress-label">${label}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>
  `;
}

// Refresh the progress bar in-place (without re-rendering the whole class page)
function updateProgressBar() {
  const route = parseRoute();
  if (route.page !== 'class') return;
  const wrap = document.querySelector('.progress-wrap');
  if (!wrap) return;
  wrap.outerHTML = renderProgressBar(route.moduleId, route.classId);
}

// Re-apply stored progress to the currently rendered class page
function restoreQuizProgress() {
  const route = parseRoute();
  if (route.page !== 'class') return;
  const prog = getClassProgress(route.moduleId, route.classId);
  const items = document.querySelectorAll('#app-container .quiz-item');
  items.forEach((item, idx) => {
    if (prog.quizzes[idx]) {
      const btn = item.querySelector('.quiz-reveal');
      const ans = item.querySelector('.quiz-answer');
      if (btn && ans) {
        ans.classList.add('visible');
        btn.textContent = 'Hide Answer';
      }
    }
  });
}

// ============================================================
// EVENT DELEGATION
// One listener on #app-container handles all clicks for:
//   - collapsible section headers (.section-header)
//   - quiz answer reveals (.quiz-reveal)
// ============================================================
function attachDelegatedListener() {
  const container = document.getElementById('app-container');
  if (!container || container._delegated) return;
  container._delegated = true;

  container.addEventListener('click', (e) => {
    // Collapsible section toggle
    const header = e.target.closest('.section-header');
    if (header && container.contains(header)) {
      const section = header.parentElement;
      if (section && section.classList.contains('section')) {
        section.classList.toggle('open');
      }
      return;
    }

    // Quiz answer reveal
    const btn = e.target.closest('.quiz-reveal');
    if (btn && container.contains(btn)) {
      const answer = btn.nextElementSibling;
      if (!answer || !answer.classList.contains('quiz-answer')) return;
      answer.classList.toggle('visible');
      const isVisible = answer.classList.contains('visible');
      btn.textContent = isVisible ? 'Hide Answer' : 'Show Answer';

      if (isVisible) {
        const quizItem = btn.closest('.quiz-item');
        const allItems = Array.from(container.querySelectorAll('.quiz-item'));
        const idx = allItems.indexOf(quizItem);
        const route = parseRoute();
        if (route.page === 'class' && idx >= 0) {
          markQuizRevealed(route.moduleId, route.classId, idx);
          updateProgressBar();
        }
      }
      return;
    }
  });
}

// ============================================================
// SEARCH
// Filters titles, class summaries (desc), and keywords across
// all modules. Searches metadata only so it stays fast and
// doesn't force loading every module file.
// ============================================================
const SEARCH_MAX_RESULTS = 12;

function searchClasses(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const results = [];
  COURSE_DATA.modules.forEach(mod => {
    const modHaystack = `${mod.title} ${mod.description || ''}`.toLowerCase();
    mod.classList.forEach(cls => {
      const keywordsStr = (cls.keywords || []).join(' ').toLowerCase();
      // Lowercase every piece so case-mixed titles like "MLOps" or "Demo Day" match queries.
      const haystack = `${cls.title} ${cls.desc || ''}`.toLowerCase() + ` ${keywordsStr} ${modHaystack}`;
      // All terms must appear somewhere (AND match).
      const allMatch = terms.every(t => haystack.includes(t));
      if (!allMatch) return;

      // Score: title hits weigh most, then keywords, then desc, then module.
      let score = 0;
      terms.forEach(t => {
        if (cls.title.toLowerCase().includes(t)) score += 10;
        if (keywordsStr.includes(t)) score += 5;
        if ((cls.desc || '').toLowerCase().includes(t)) score += 3;
        if (modHaystack.includes(t)) score += 1;
      });

      results.push({
        moduleId: mod.id,
        classId: cls.id,
        moduleTitle: mod.title,
        title: cls.title,
        desc: cls.desc || '',
        status: cls.status,
        score
      });
    });
  });

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, SEARCH_MAX_RESULTS);
}

function highlight(text, query) {
  const q = (query || '').trim();
  if (!q) return escapeHtml(text);
  const terms = q.split(/\s+/).filter(Boolean).map(escapeRegex);
  if (terms.length === 0) return escapeHtml(text);
  const re = new RegExp(`(${terms.join('|')})`, 'gi');
  return escapeHtml(text).replace(re, '<mark>$1</mark>');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderSearchResults(query) {
  const panel = document.getElementById('search-results');
  if (!panel) return;
  const q = (query || '').trim();
  if (!q) {
    panel.hidden = true;
    panel.innerHTML = '';
    return;
  }
  const results = searchClasses(q);
  if (results.length === 0) {
    panel.hidden = false;
    panel.innerHTML = `<div class="search-empty">No classes match "${escapeHtml(q)}"</div>`;
    return;
  }
  panel.hidden = false;
  panel.innerHTML = results.map((r, i) => {
    const locked = r.status !== 'available';
    const lockNote = locked ? ' &middot; Coming Soon' : '';
    return `
      <div class="search-result${i === 0 ? ' active' : ''}"
           data-module="${r.moduleId}" data-class="${r.classId}" data-locked="${locked ? '1' : '0'}">
        <div class="search-result-title">${highlight(r.title, q)}</div>
        <div class="search-result-meta">Module ${r.moduleId}: ${escapeHtml(r.moduleTitle)} &middot; Class ${r.classId}${lockNote}</div>
        <div class="search-result-desc">${highlight(r.desc, q)}</div>
      </div>
    `;
  }).join('');
}

function attachSearchHandlers() {
  const input = document.getElementById('search-input');
  const panel = document.getElementById('search-results');
  if (!input || !panel || input._wired) return;
  input._wired = true;

  let debounceTimer = null;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => renderSearchResults(input.value), 80);
  });

  input.addEventListener('focus', () => {
    if (input.value.trim()) renderSearchResults(input.value);
  });

  input.addEventListener('keydown', (e) => {
    const items = Array.from(panel.querySelectorAll('.search-result'));
    const activeIdx = items.findIndex(el => el.classList.contains('active'));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (items.length === 0) return;
      const next = (activeIdx + 1) % items.length;
      items.forEach(el => el.classList.remove('active'));
      items[next].classList.add('active');
      items[next].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (items.length === 0) return;
      const prev = (activeIdx - 1 + items.length) % items.length;
      items.forEach(el => el.classList.remove('active'));
      items[prev].classList.add('active');
      items[prev].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = items[Math.max(0, activeIdx)];
      if (target) openSearchResult(target);
    } else if (e.key === 'Escape') {
      input.value = '';
      panel.hidden = true;
      panel.innerHTML = '';
      input.blur();
    }
  });

  // Delegate clicks on result rows
  panel.addEventListener('click', (e) => {
    const row = e.target.closest('.search-result');
    if (row) openSearchResult(row);
  });

  // Close when clicking anywhere else
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !panel.contains(e.target)) {
      panel.hidden = true;
    }
  });
}

function openSearchResult(row) {
  const input = document.getElementById('search-input');
  const panel = document.getElementById('search-results');
  const moduleId = row.dataset.module;
  const classId = row.dataset.class;
  const locked = row.dataset.locked === '1';
  if (locked) {
    // Still navigate to the module page so the student can see what's coming
    navigate(`/module/${moduleId}`);
  } else {
    navigate(`/module/${moduleId}/class/${classId}`);
  }
  if (input) input.value = '';
  if (panel) { panel.hidden = true; panel.innerHTML = ''; }
}

// ------------------------------------------------------------
// EVENT LISTENERS
// On every render: re-attach delegated listener (idempotent) and
// restore any saved quiz progress.
// ------------------------------------------------------------
async function onRender() {
  await renderContent();
  attachDelegatedListener();
  restoreQuizProgress();
  updateSidebarActive();
  if (isPresenting()) {
    requestAnimationFrame(() => updateSectionFocus(true));
  }
}

// ============================================================
// THEME TOGGLE
// Initial theme is applied by the inline script in index.html's
// <head> to avoid flash. Here we just wire the toggle button.
// ============================================================
const THEME_KEY = 'aiml-theme';

function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}

function attachThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn || btn._wired) return;
  btn._wired = true;
  btn.addEventListener('click', () => {
    const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}

// ============================================================
// PRESENTATION MODE
// Class `.presentation-mode` on <body> scales UI for classroom
// display. ArrowLeft/Right steps through sections (and across
// classes at boundaries). Esc exits.
// Session-scoped: not persisted in localStorage on purpose so
// next visit starts in normal mode.
// ============================================================
function isPresenting() {
  return document.body.classList.contains('presentation-mode');
}

function togglePresentationMode(force) {
  const want = typeof force === 'boolean' ? force : !isPresenting();
  document.body.classList.toggle('presentation-mode', want);
  const btn = document.getElementById('present-toggle');
  if (btn) btn.classList.toggle('is-active', want);

  if (want) {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => updateSectionFocus(true));
  } else {
    document.querySelectorAll('.is-focus').forEach(el => el.classList.remove('is-focus'));
  }
}

function attachPresentationToggle() {
  const btn = document.getElementById('present-toggle');
  if (btn && !btn._wired) {
    btn._wired = true;
    btn.addEventListener('click', () => togglePresentationMode());
  }
  const exitBtn = document.getElementById('present-exit');
  if (exitBtn && !exitBtn._wired) {
    exitBtn._wired = true;
    exitBtn.addEventListener('click', () => togglePresentationMode(false));
  }
}

// Slides = class-header (title slide) + every .section, in document order.
function getPresentationSlides() {
  return Array.from(document.querySelectorAll(
    '#app-container .class-header, #app-container .section'
  ));
}

// Which slide is currently closest to the top of the viewport?
function currentSectionIndex() {
  const slides = getPresentationSlides();
  if (slides.length === 0) return -1;
  const anchor = window.innerHeight * 0.3;
  let bestIdx = 0;
  let bestDist = Infinity;
  slides.forEach((s, i) => {
    const rect = s.getBoundingClientRect();
    const dist = Math.abs(rect.top - anchor);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  });
  return bestIdx;
}

function scrollToSectionIndex(idx) {
  const slides = getPresentationSlides();
  if (idx < 0 || idx >= slides.length) return false;
  slides[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

// Update .is-focus on the current slide so CSS fades the others to 22%.
let _focusRaf = null;
function updateSectionFocus(force) {
  if (!force && !isPresenting()) return;
  if (_focusRaf) return;
  _focusRaf = requestAnimationFrame(() => {
    _focusRaf = null;
    const slides = getPresentationSlides();
    const idx = currentSectionIndex();
    slides.forEach((s, i) => s.classList.toggle('is-focus', i === idx));
  });
}

// Track focus on scroll, rAF-throttled.
window.addEventListener('scroll', () => {
  if (isPresenting()) updateSectionFocus();
}, { passive: true });

// Navigate to the next class (within module, or next module's first).
function goToNextClass() {
  const route = parseRoute();
  if (route.page !== 'class') return false;
  const mod = COURSE_DATA.modules.find(m => m.id === route.moduleId);
  if (!mod) return false;
  const nextCls = mod.classList.find(c => c.id === route.classId + 1 && c.status === 'available');
  if (nextCls) {
    navigate(`/module/${mod.id}/class/${nextCls.id}`);
    return true;
  }
  const nextMod = COURSE_DATA.modules.find(m => m.id === mod.id + 1 && m.status === 'available');
  const nextModFirst = nextMod && nextMod.classList.find(c => c.status === 'available');
  if (nextModFirst) {
    navigate(`/module/${nextMod.id}/class/${nextModFirst.id}`);
    return true;
  }
  return false;
}

function goToPrevClass() {
  const route = parseRoute();
  if (route.page !== 'class') return false;
  const mod = COURSE_DATA.modules.find(m => m.id === route.moduleId);
  if (!mod) return false;
  const prevCls = mod.classList.find(c => c.id === route.classId - 1 && c.status === 'available');
  if (prevCls) {
    navigate(`/module/${mod.id}/class/${prevCls.id}`);
    return true;
  }
  const prevMod = COURSE_DATA.modules.find(m => m.id === mod.id - 1 && m.status === 'available');
  const prevModLast = prevMod && [...prevMod.classList].reverse().find(c => c.status === 'available');
  if (prevModLast) {
    navigate(`/module/${prevMod.id}/class/${prevModLast.id}`);
    return true;
  }
  return false;
}

function presentationNext() {
  const slides = getPresentationSlides();
  if (slides.length > 0) {
    const idx = currentSectionIndex();
    if (idx + 1 < slides.length) {
      scrollToSectionIndex(idx + 1);
      return;
    }
  }
  goToNextClass();
}

function presentationPrev() {
  const slides = getPresentationSlides();
  if (slides.length > 0) {
    const idx = currentSectionIndex();
    if (idx - 1 >= 0) {
      scrollToSectionIndex(idx - 1);
      return;
    }
  }
  goToPrevClass();
}

function attachPresentationKeyboard() {
  if (attachPresentationKeyboard._wired) return;
  attachPresentationKeyboard._wired = true;
  document.addEventListener('keydown', (e) => {
    // Esc exits from anywhere (only if presenting)
    if (e.key === 'Escape' && isPresenting()) {
      togglePresentationMode(false);
      return;
    }
    if (!isPresenting()) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

    // Next: Right arrow, PageDown, Spacebar
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      presentationNext();
      return;
    }
    // Previous: Left arrow, PageUp, Backspace
    if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
      e.preventDefault();
      presentationPrev();
      return;
    }
  });
}

// ============================================================
// SIDEBAR
// Fixed left drawer listing every module. Click a module header
// to expand its classes. Click a class to navigate. Auto-expands
// the module that contains the currently viewed class.
// Open state persisted in localStorage; default open on desktop.
// ============================================================
const SIDEBAR_KEY = 'aiml-sidebar';
const DESKTOP_BREAKPOINT = 1024;

function isDesktop() {
  return window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`).matches;
}

function loadSidebarPref() {
  try {
    const v = localStorage.getItem(SIDEBAR_KEY);
    if (v === 'open') return true;
    if (v === 'closed') return false;
  } catch (e) {}
  return isDesktop(); // default: open on desktop, closed on mobile
}

function saveSidebarPref(open) {
  try { localStorage.setItem(SIDEBAR_KEY, open ? 'open' : 'closed'); } catch (e) {}
}

function toggleSidebar(force) {
  const want = typeof force === 'boolean' ? force : !document.body.classList.contains('has-sidebar');
  document.body.classList.toggle('has-sidebar', want);
  const btn = document.getElementById('sidebar-toggle');
  if (btn) btn.classList.toggle('is-active', want);
  saveSidebarPref(want);
}

function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  nav.innerHTML = COURSE_DATA.modules.map(m => {
    const available = m.status === 'available';
    const lockedCls = available ? '' : 'locked';
    const classItems = m.classList.map(c => {
      const clsLocked = c.status !== 'available' ? 'locked' : '';
      const done = c.status === 'available' && getClassProgress(m.id, c.id).completed;
      const doneCls = done ? 'completed' : '';
      const href = c.status === 'available'
        ? `#/module/${m.id}/class/${c.id}`
        : `#/module/${m.id}`;
      return `
        <a class="sidebar-class ${clsLocked} ${doneCls}" href="${href}" data-module="${m.id}" data-class="${c.id}">
          <span class="sidebar-class-dot" aria-hidden="true"></span>
          <span class="sidebar-class-text">Class ${c.id}: ${c.title}</span>
        </a>
      `;
    }).join('');
    return `
      <div class="sidebar-module" data-module="${m.id}">
        <button class="sidebar-module-header ${lockedCls}" data-module="${m.id}">
          <span class="sidebar-module-num">${m.id}</span>
          <span class="sidebar-module-title">${m.title}</span>
          <svg class="sidebar-module-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <div class="sidebar-module-classes">${classItems}</div>
      </div>
    `;
  }).join('');
}

function attachSidebarHandlers() {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  const nav = document.getElementById('sidebar-nav');
  if (!nav || nav._wired) return;
  nav._wired = true;

  if (toggleBtn && !toggleBtn._wired) {
    toggleBtn._wired = true;
    toggleBtn.addEventListener('click', () => toggleSidebar());
  }
  if (overlay && !overlay._wired) {
    overlay._wired = true;
    overlay.addEventListener('click', () => toggleSidebar(false));
  }

  // Delegated clicks inside the sidebar nav
  nav.addEventListener('click', (e) => {
    const header = e.target.closest('.sidebar-module-header');
    if (header) {
      e.preventDefault();
      if (header.classList.contains('locked')) return;
      const wrapper = header.parentElement;
      wrapper.classList.toggle('expanded');
      return;
    }
    const classLink = e.target.closest('.sidebar-class');
    if (classLink) {
      // Native hash navigation will fire; just close the drawer on mobile.
      if (!isDesktop()) {
        setTimeout(() => toggleSidebar(false), 80);
      }
    }
  });

  // Close sidebar on Esc (mobile-friendly)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('has-sidebar') && !isDesktop()) {
      toggleSidebar(false);
    }
  });

  // Re-evaluate on resize: crossing the breakpoint applies the default behavior
  // without clobbering an explicit user choice
  let lastDesktop = isDesktop();
  window.addEventListener('resize', () => {
    const nowDesktop = isDesktop();
    if (nowDesktop !== lastDesktop) {
      lastDesktop = nowDesktop;
    }
  });
}

// Keep sidebar state synced with the current route: expand the parent
// module and highlight the active class link.
function updateSidebarActive() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  const route = parseRoute();

  nav.querySelectorAll('.sidebar-class.active').forEach(el => el.classList.remove('active'));

  if (route.page === 'class' || route.page === 'module') {
    const moduleWrap = nav.querySelector(`.sidebar-module[data-module="${route.moduleId}"]`);
    if (moduleWrap) moduleWrap.classList.add('expanded');
  }
  if (route.page === 'class') {
    const link = nav.querySelector(`.sidebar-class[data-module="${route.moduleId}"][data-class="${route.classId}"]`);
    if (link) link.classList.add('active');
  }
}

function initSidebar() {
  renderSidebar();
  attachSidebarHandlers();
  // Apply saved preference
  const open = loadSidebarPref();
  document.body.classList.toggle('has-sidebar', open);
  const btn = document.getElementById('sidebar-toggle');
  if (btn) btn.classList.toggle('is-active', open);
  updateSidebarActive();
}

function onReady() {
  attachThemeToggle();
  attachPresentationToggle();
  attachPresentationKeyboard();
  attachSearchHandlers();
  initSidebar();
  onRender();
}

window.addEventListener('hashchange', onRender);
window.addEventListener('DOMContentLoaded', onReady);
