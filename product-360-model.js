import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const mountedStages = new WeakSet();

function tubeBetween(parent, start, end, radius, material, radialSegments = 14) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(radius, radius, length, radialSegments, 1, false);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function createWheel(x, materials) {
  const wheel = new THREE.Group();
  wheel.position.set(x, 1.34, 0);

  const tire = new THREE.Mesh(
    new THREE.TorusGeometry(1.28, 0.125, 18, 80),
    materials.tire
  );
  tire.castShadow = true;
  tire.receiveShadow = true;
  wheel.add(tire);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(1.08, 0.035, 10, 72),
    materials.rim
  );
  rim.castShadow = true;
  wheel.add(rim);

  const spokePositions = [];
  for (let index = 0; index < 24; index += 1) {
    const angle = index / 24 * Math.PI * 2;
    const rimX = Math.cos(angle) * 1.045;
    const rimY = Math.sin(angle) * 1.045;
    const hubZ = index % 2 ? 0.09 : -0.09;
    spokePositions.push(0, 0, hubZ, rimX, rimY, 0);
  }
  const spokeGeometry = new THREE.BufferGeometry();
  spokeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(spokePositions, 3));
  wheel.add(new THREE.LineSegments(spokeGeometry, materials.spoke));

  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.34, 18),
    materials.metal
  );
  hub.rotation.x = Math.PI / 2;
  hub.castShadow = true;
  wheel.add(hub);

  const brakeDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.27, 0.27, 0.018, 28),
    materials.disc
  );
  brakeDisc.rotation.x = Math.PI / 2;
  brakeDisc.position.z = 0.14;
  wheel.add(brakeDisc);

  return wheel;
}

function createBikeModel() {
  const bike = new THREE.Group();
  bike.name = "ARMOR 3D bicycle prototype";

  const materials = {
    frame: new THREE.MeshStandardMaterial({ color: 0x15191e, metalness: 0.72, roughness: 0.28 }),
    frameSoft: new THREE.MeshStandardMaterial({ color: 0x252b31, metalness: 0.5, roughness: 0.4 }),
    tire: new THREE.MeshStandardMaterial({ color: 0x090a0c, metalness: 0.05, roughness: 0.88 }),
    rim: new THREE.MeshStandardMaterial({ color: 0x343b43, metalness: 0.84, roughness: 0.2 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x88929c, metalness: 0.92, roughness: 0.18 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: 0x22282e, metalness: 0.86, roughness: 0.25 }),
    seat: new THREE.MeshStandardMaterial({ color: 0x101215, metalness: 0.08, roughness: 0.72 }),
    accent: new THREE.MeshStandardMaterial({ color: 0x009ce0, metalness: 0.55, roughness: 0.28 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xc7a54a, metalness: 0.72, roughness: 0.3 }),
    disc: new THREE.MeshStandardMaterial({ color: 0xaeb7c0, metalness: 0.95, roughness: 0.18, transparent: true, opacity: 0.72 }),
    spoke: new THREE.LineBasicMaterial({ color: 0x7b858e, transparent: true, opacity: 0.72 })
  };

  const rearAxle = new THREE.Vector3(-2.35, 1.34, 0);
  const frontAxle = new THREE.Vector3(2.35, 1.34, 0);
  const bottomBracket = new THREE.Vector3(-0.18, 1.28, 0);
  const seatTop = new THREE.Vector3(-0.82, 3.1, 0);
  const headLower = new THREE.Vector3(1.35, 2.04, 0);
  const headUpper = new THREE.Vector3(1.14, 3.02, 0);

  bike.add(createWheel(rearAxle.x, materials));
  bike.add(createWheel(frontAxle.x, materials));

  tubeBetween(bike, bottomBracket, seatTop, 0.105, materials.frame);
  tubeBetween(bike, seatTop, headUpper, 0.095, materials.frame);
  tubeBetween(bike, bottomBracket, headLower, 0.13, materials.frame);
  tubeBetween(bike, headLower, headUpper, 0.125, materials.frameSoft);

  [-0.13, 0.13].forEach((z) => {
    tubeBetween(
      bike,
      new THREE.Vector3(rearAxle.x, rearAxle.y, z),
      new THREE.Vector3(bottomBracket.x, bottomBracket.y, z * 0.5),
      0.055,
      materials.frameSoft
    );
    tubeBetween(
      bike,
      new THREE.Vector3(rearAxle.x, rearAxle.y, z),
      new THREE.Vector3(seatTop.x, seatTop.y, z * 0.35),
      0.065,
      materials.frame
    );
    tubeBetween(
      bike,
      new THREE.Vector3(headLower.x, headLower.y, z * 0.55),
      new THREE.Vector3(frontAxle.x, frontAxle.y, z),
      0.075,
      materials.darkMetal
    );
  });

  tubeBetween(
    bike,
    new THREE.Vector3(-0.84, 3.08, 0),
    new THREE.Vector3(-0.98, 3.52, 0),
    0.057,
    materials.metal
  );
  const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.14, 0.36), materials.seat);
  saddle.position.set(-1.08, 3.58, 0);
  saddle.rotation.z = -0.08;
  saddle.castShadow = true;
  bike.add(saddle);

  const stemTop = new THREE.Vector3(1.28, 3.35, 0);
  tubeBetween(bike, headUpper, stemTop, 0.065, materials.darkMetal);
  tubeBetween(
    bike,
    new THREE.Vector3(1.34, 3.42, -0.55),
    new THREE.Vector3(1.34, 3.42, 0.55),
    0.055,
    materials.darkMetal
  );
  [-0.63, 0.63].forEach((z) => {
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 0.2, 16), materials.seat);
    grip.rotation.x = Math.PI / 2;
    grip.position.set(1.34, 3.42, z);
    grip.castShadow = true;
    bike.add(grip);
  });

  const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.11, 28), materials.darkMetal);
  crank.rotation.x = Math.PI / 2;
  crank.position.copy(bottomBracket);
  crank.castShadow = true;
  bike.add(crank);
  const chainRing = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.028, 10, 42), materials.metal);
  chainRing.position.set(bottomBracket.x, bottomBracket.y, 0.075);
  bike.add(chainRing);

  tubeBetween(
    bike,
    new THREE.Vector3(bottomBracket.x, bottomBracket.y, 0.17),
    new THREE.Vector3(0.24, 1.08, 0.34),
    0.035,
    materials.metal,
    10
  );
  tubeBetween(
    bike,
    new THREE.Vector3(bottomBracket.x, bottomBracket.y, -0.17),
    new THREE.Vector3(-0.6, 1.48, -0.34),
    0.035,
    materials.metal,
    10
  );
  [[0.3, 1.05, 0.42], [-0.66, 1.5, -0.42]].forEach((position) => {
    const pedal = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.16), materials.darkMetal);
    pedal.position.set(position[0], position[1], position[2]);
    pedal.castShadow = true;
    bike.add(pedal);
  });

  tubeBetween(
    bike,
    new THREE.Vector3(rearAxle.x, rearAxle.y + 0.13, 0.18),
    new THREE.Vector3(bottomBracket.x, bottomBracket.y + 0.24, 0.18),
    0.018,
    materials.gold,
    8
  );
  tubeBetween(
    bike,
    new THREE.Vector3(rearAxle.x, rearAxle.y - 0.1, 0.18),
    new THREE.Vector3(bottomBracket.x, bottomBracket.y - 0.24, 0.18),
    0.018,
    materials.gold,
    8
  );

  const accent = tubeBetween(
    bike,
    new THREE.Vector3(-0.08, 1.46, 0.135),
    new THREE.Vector3(1.13, 2.1, 0.135),
    0.022,
    materials.accent,
    8
  );
  accent.castShadow = false;

  bike.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  return bike;
}

function iconMarkup(name) {
  if (name === "pause") return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"></path></svg>';
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>';
}

function isBikeStage(stage) {
  const hero = stage.closest(".hero");
  const category = hero && hero.querySelector(".details .eyebrow");
  return Boolean(category && category.textContent.trim().toLowerCase() === "bikes");
}

function mountModel(stage) {
  if (mountedStages.has(stage) || !isBikeStage(stage)) return;
  const toolbar = stage.querySelector(".armor-360-toolbar");
  const autoButton = stage.querySelector(".armor-360-auto");
  const resetButton = stage.querySelector(".armor-360-reset");
  const slider = stage.querySelector(".armor-360-scrubber");
  const angleLabel = stage.querySelector(".armor-360-frame-count");
  if (!toolbar || !autoButton || !resetButton || !slider || !angleLabel) return;

  mountedStages.add(stage);
  stage.classList.add("armor-360-has-model");
  stage.setAttribute("aria-label", "Interactive 3D bicycle model");

  const canvas = document.createElement("canvas");
  canvas.className = "armor-360-canvas";
  canvas.setAttribute("aria-label", "Rotatable 3D bicycle model");
  canvas.setAttribute("role", "img");
  stage.insertBefore(canvas, stage.querySelector(".armor-360-experience"));

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
  const target = new THREE.Vector3(0, 1.72, 0);
  camera.position.set(7.3, 4.55, 9.2);

  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.enablePan = false;
  controls.minDistance = 7.4;
  controls.maxDistance = 15.5;
  controls.minPolarAngle = 0.82;
  controls.maxPolarAngle = 1.72;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 2.4;
  controls.update();
  controls.saveState();

  scene.add(new THREE.HemisphereLight(0xffffff, 0xcbd4dc, 2.25));
  const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
  keyLight.position.set(4.5, 8, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -7;
  keyLight.shadow.camera.right = 7;
  keyLight.shadow.camera.top = 7;
  keyLight.shadow.camera.bottom = -3;
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x9edcff, 1.35);
  fillLight.position.set(-5, 4, -5);
  scene.add(fillLight);

  const bike = createBikeModel();
  bike.rotation.y = -0.08;
  scene.add(bike);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 14),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.13 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);

  let initialResize = true;
  function resize() {
    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);
    const aspect = width / height;
    renderer.setSize(width, height, false);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    if (initialResize) {
      if (aspect < 1.12) camera.position.set(8.9, 5.1, 12.2);
      controls.update();
      controls.saveState();
      initialResize = false;
    }
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  resize();

  function cameraAngle() {
    const offset = camera.position.clone().sub(controls.target);
    return (THREE.MathUtils.radToDeg(Math.atan2(offset.x, offset.z)) + 360) % 360;
  }

  let updatingLabel = false;
  function updateAngleUI() {
    const angle = Math.round(cameraAngle()) % 360;
    updatingLabel = true;
    slider.value = String(angle);
    angleLabel.textContent = String(angle).padStart(3, "0") + "°";
    updatingLabel = false;
  }

  function setCameraAngle(degrees) {
    const offset = camera.position.clone().sub(controls.target);
    const radius = Math.hypot(offset.x, offset.z);
    const radians = THREE.MathUtils.degToRad(degrees);
    camera.position.x = controls.target.x + Math.sin(radians) * radius;
    camera.position.z = controls.target.z + Math.cos(radians) * radius;
    controls.update();
    updateAngleUI();
  }

  function setAutoRotate(active) {
    controls.autoRotate = Boolean(active);
    autoButton.disabled = false;
    autoButton.setAttribute("aria-pressed", String(controls.autoRotate));
    autoButton.setAttribute("aria-label", controls.autoRotate ? "Pause 3D rotation" : "Play 3D rotation");
    autoButton.title = controls.autoRotate ? "Pause 3D rotation" : "Play 3D rotation";
    autoButton.innerHTML = iconMarkup(controls.autoRotate ? "pause" : "play");
    stage.classList.toggle("is-auto-spinning", controls.autoRotate);
  }

  slider.min = "0";
  slider.max = "359";
  slider.step = "1";
  slider.disabled = false;
  resetButton.disabled = false;
  setAutoRotate(false);
  updateAngleUI();

  autoButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    setAutoRotate(!controls.autoRotate);
  }, true);
  resetButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    setAutoRotate(false);
    controls.reset();
    updateAngleUI();
  }, true);
  slider.addEventListener("input", (event) => {
    event.stopImmediatePropagation();
    setAutoRotate(false);
    setCameraAngle(Number(slider.value));
  }, true);
  slider.addEventListener("change", (event) => event.stopImmediatePropagation(), true);

  controls.addEventListener("start", () => setAutoRotate(false));
  controls.addEventListener("change", updateAngleUI);

  ["pointerdown", "pointermove", "pointerup", "pointercancel", "wheel"].forEach((eventName) => {
    canvas.addEventListener(eventName, (event) => event.stopPropagation(), { passive: eventName === "wheel" });
  });

  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      setAutoRotate(false);
      setCameraAngle(cameraAngle() - 12);
    } else if (event.key === "ArrowRight") {
      setAutoRotate(false);
      setCameraAngle(cameraAngle() + 12);
    } else if (event.key === " " || event.key === "Spacebar") {
      setAutoRotate(!controls.autoRotate);
    } else if (event.key === "Home") {
      setAutoRotate(false);
      controls.reset();
      updateAngleUI();
    } else {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  const labelObserver = new MutationObserver(() => {
    if (!updatingLabel && !angleLabel.textContent.endsWith("°")) updateAngleUI();
  });
  labelObserver.observe(angleLabel, { childList: true, characterData: true, subtree: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) setAutoRotate(false);
  });

  let lastTime = performance.now();
  function render(time) {
    if (!stage.isConnected) {
      resizeObserver.disconnect();
      labelObserver.disconnect();
      renderer.dispose();
      return;
    }
    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    controls.update(delta);
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  }
  window.requestAnimationFrame(render);
}

function scan() {
  document.querySelectorAll(".main-image.armor-360-stage").forEach(mountModel);
}

const observer = new MutationObserver(scan);
observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
scan();
