import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ==========================================================
   0. DATA PENERANGAN BAHAGIAN GITAR
   ========================================================== */
const PARTS_INFO = {
  body: {
    name: 'Badan Gitar', emoji: '🎸', subtitle: 'Bahagian terbesar gitar',
    desc: 'Badan gitar ialah bahagian terbesar yang berbentuk seperti "angka 8". Ia berongga di dalam dan berfungsi sebagai <strong>kotak bunyi</strong> yang menguatkan getaran tali.',
    fact: 'Kayu biasa: <strong>spruce, mahogany, rosewood</strong> — menghasilkan bunyi hangat.'
  },
  soundhole: {
    name: 'Lubang Bunyi', emoji: '🕳️', subtitle: 'Sound Hole',
    desc: 'Lubang bulat di tengah badan gitar. Getaran bunyi dari dalam badan gitar keluar melalui lubang ini.',
    fact: 'Lubang bunyi biasanya berdiameter <strong>3-4 inci</strong>.'
  },
  rosette: {
    name: 'Rosette', emoji: '🌸', subtitle: 'Corak sekeliling lubang',
    desc: 'Corak bulat berwarna-warni mengelilingi lubang bunyi. Bukan sahaja cantik, ia juga menguatkan tepi lubang.',
    fact: 'Rosette tradisional dibuat daripada <strong>kayu berwarna atau ibu mutiara</strong>.'
  },
  bridge: {
    name: 'Jambatan', emoji: '🌉', subtitle: 'Bridge',
    desc: 'Bahagian kayu di bawah badan gitar. Ia <strong>memegang hujung tali</strong> dan memindahkan getaran ke badan.',
    fact: 'Terdapat <strong>"pin bridge"</strong> yang mudah ditukar jika tali putus.'
  },
  neck: {
    name: 'Leher Gitar', emoji: '📏', subtitle: 'Neck',
    desc: 'Bahagian panjang menghubungkan badan dengan kepala gitar. Diperbuat daripada kayu keras.',
    fact: 'Leher biasanya ada <strong>batang besi (truss rod)</strong> supaya tidak bengkok.'
  },
  fretboard: {
    name: 'Papan Jari', emoji: '🎹', subtitle: 'Fretboard',
    desc: 'Permukaan hitam di hadapan leher. Kita <strong>menekan tali</strong> di sini untuk tukar nada.',
    fact: 'Kayu popular: <strong>rosewood dan ebony</strong> — keras dan licin.'
  },
  frets: {
    name: 'Fret', emoji: '➖', subtitle: 'Garis logam',
    desc: 'Garis logam nipis di sepanjang papan jari. Bila tali ditekan antara fret, ia hasilkan <strong>not berbeza</strong>.',
    fact: 'Gitar akustik ada <strong>19-20 fret</strong>. Setiap fret = 1 seminada.'
  },
  headstock: {
    name: 'Kepala Gitar', emoji: '👑', subtitle: 'Headstock',
    desc: 'Bahagian paling atas. <strong>Memegang tuning pegs</strong> dan menahan tali supaya tegang.',
    fact: 'Bentuk headstock berbeza antara jenama — sesetengah senget.'
  },
  pegs: {
    name: 'Pemutar Tali', emoji: '🎛️', subtitle: 'Tuning Pegs',
    desc: 'Pemutar logam di kepala gitar. Kita <strong>pusing untuk laras tali</strong> supaya gitar berbunyi tepat.',
    fact: 'Standard tuning: <strong>E-A-D-G-B-E</strong>.'
  },
  strings: {
    name: 'Tali Gitar', emoji: '🎼', subtitle: '6 Tali',
    desc: 'Enam tali bergetar menghasilkan bunyi. Tali tebal = <strong>nada rendah</strong>, tali nipis = <strong>nada tinggi</strong>.',
    fact: 'Bahan: <strong>nylon (klasik) atau keluli (akustik)</strong>.'
  },
  nut: {
    name: 'Nut', emoji: '⚪', subtitle: 'Penyangga tali',
    desc: 'Bahagian kecil putih antara leher dan kepala. <strong>Menyusun tali</strong> sebelum masuk ke tuning pegs.',
    fact: 'Nut dibuat daripada <strong>tulang, plastik keras, atau grafit</strong>.'
  },
  pickguard: {
    name: 'Pelindung', emoji: '🛡️', subtitle: 'Pickguard',
    desc: 'Plat nipis melindungi kayu daripada <strong>calar akibat pick</strong> semasa bermain.',
    fact: 'Selalunya hitam atau tortoise shell, ada juga lutsinar.'
  }
};

const QUIZ_KEYS = Object.keys(PARTS_INFO);

/* ==========================================================
   1. SCENE, CAMERA, RENDERER
   ========================================================== */
const canvas = document.querySelector('#scene3d');
const scene = new THREE.Scene();
scene.background = null;
scene.fog = new THREE.Fog(0x0a0a1a, 18, 45);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 2, 9);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

/* ==========================================================
   2. ORBITCONTROLS
   ========================================================== */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.9;
controls.zoomSpeed = 1.0;
controls.panSpeed = 0.9;
controls.minDistance = 3;
controls.maxDistance = 22;
controls.minPolarAngle = 0.15;
controls.maxPolarAngle = Math.PI / 2.05;
controls.target.set(0, 1.3, 0);

/* ==========================================================
   3. CAHAYA
   ========================================================== */
scene.add(new THREE.AmbientLight(0xffffff, 0.55));

const keyLight = new THREE.DirectionalLight(0xfff5e0, 2.5);
keyLight.position.set(6, 12, 8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 40;
keyLight.shadow.camera.left = -10;
keyLight.shadow.camera.right = 10;
keyLight.shadow.camera.top = 12;
keyLight.shadow.camera.bottom = -8;
keyLight.shadow.bias = -0.0005;
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x88aaff, 1.5);
rimLight.position.set(-8, 4, -6);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0xffaa66, 1.2, 25);
fillLight.position.set(3, 3, 5);
scene.add(fillLight);

/* ==========================================================
   4. LANTAI
   ========================================================== */
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(15, 64),
  new THREE.MeshStandardMaterial({ color: 0x14142e, roughness: 0.9, metalness: 0.1 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(30, 60, 0x4466aa, 0x223355);
grid.position.y = -1.99;
grid.material.transparent = true;
grid.material.opacity = 0.3;
scene.add(grid);

/* ==========================================================
   5. BINA GITAR 3D
   ========================================================== */
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.35, metalness: 0.25 });
const neckMat = new THREE.MeshStandardMaterial({ color: 0x5a3018, roughness: 0.55, metalness: 0.1 });
const fretboardMat = new THREE.MeshStandardMaterial({ color: 0x1a0f08, roughness: 0.9 });
const metalMat = new THREE.MeshStandardMaterial({ color: 0xffcc44, roughness: 0.15, metalness: 1 });
const stringMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.25, metalness: 1 });

const guitar = new THREE.Group();
guitar.position.y = 0.3;
scene.add(guitar);

const partMeshes = {};

/* BADAN */
const lowerBody = new THREE.Mesh(new THREE.SphereGeometry(1.2, 64, 64), bodyMat);
lowerBody.scale.set(1, 1.18, 0.42);
const upperBody = new THREE.Mesh(new THREE.SphereGeometry(0.85, 64, 64), bodyMat);
upperBody.scale.set(1, 1, 0.42);
upperBody.position.y = 1.15;
const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.55, 48), bodyMat);
waist.scale.set(1, 1, 0.72);
waist.position.y = 0.6;
[lowerBody, upperBody, waist].forEach(p => {
  p.castShadow = true;
  p.receiveShadow = true;
  p.userData.part = 'body';
  guitar.add(p);
});
partMeshes.body = { mesh: lowerBody, labelPos: new THREE.Vector3(0, -0.3, 0) };

/* SOUND HOLE */
const hole = new THREE.Mesh(
  new THREE.CylinderGeometry(0.28, 0.28, 0.6, 48),
  new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 1 })
);
hole.rotation.x = Math.PI / 2;
hole.position.set(0, 0.65, 0);
hole.userData.part = 'soundhole';
guitar.add(hole);
partMeshes.soundhole = { mesh: hole, labelPos: new THREE.Vector3(0, 0.65, 0.3) };

/* ROSETTE */
const rosette = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.025, 16, 64), metalMat.clone());
rosette.position.set(0, 0.65, 0.42);
rosette.userData.part = 'rosette';
guitar.add(rosette);
partMeshes.rosette = { mesh: rosette, labelPos: new THREE.Vector3(0.4, 0.65, 0.42) };

/* BRIDGE */
const bridge = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 0.14, 0.15),
  new THREE.MeshStandardMaterial({ color: 0x2b1810, roughness: 0.6 })
);
bridge.position.set(0, -0.5, 0.32);
bridge.castShadow = true;
bridge.userData.part = 'bridge';
guitar.add(bridge);
partMeshes.bridge = { mesh: bridge, labelPos: new THREE.Vector3(0, -0.5, 0.5) };

/* NECK */
const neck = new THREE.Mesh(new THREE.BoxGeometry(0.38, 3.0, 0.22), neckMat);
neck.position.set(0, 2.75, 0.05);
neck.castShadow = true;
neck.receiveShadow = true;
neck.userData.part = 'neck';
guitar.add(neck);
partMeshes.neck = { mesh: neck, labelPos: new THREE.Vector3(-0.4, 2.75, 0.05) };

/* FRETBOARD */
const fretboard = new THREE.Mesh(new THREE.BoxGeometry(0.34, 2.95, 0.04), fretboardMat);
fretboard.position.set(0, 2.75, 0.17);
fretboard.castShadow = true;
fretboard.userData.part = 'fretboard';
guitar.add(fretboard);
partMeshes.fretboard = { mesh: fretboard, labelPos: new THREE.Vector3(-0.4, 3.4, 0.17) };

/* FRETS */
const fretGroup = new THREE.Group();
for (let i = 0; i < 10; i++) {
  const fret = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.02), metalMat.clone());
  fret.position.set(0, 1.55 + i * 0.32, 0.19);
  fret.userData.part = 'frets';
  fretGroup.add(fret);
}
[3, 5, 7, 9].forEach(pos => {
  const dot = new THREE.Mesh(
    new THREE.CircleGeometry(0.035, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
  );
  dot.position.set(0, 1.55 + pos * 0.32, 0.20);
  fretGroup.add(dot);
});
guitar.add(fretGroup);
partMeshes.frets = { mesh: fretGroup.children[4], labelPos: new THREE.Vector3(0.4, 2.4, 0.2) };

/* HEADSTOCK */
const headstock = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.75, 0.2), neckMat);
headstock.position.set(0, 4.6, 0.05);
headstock.castShadow = true;
headstock.userData.part = 'headstock';
guitar.add(headstock);
partMeshes.headstock = { mesh: headstock, labelPos: new THREE.Vector3(0.45, 4.6, 0.05) };

/* TUNING PEGS */
const pegGroup = new THREE.Group();
[
  [-0.32, 4.75, 0.05], [-0.32, 4.45, 0.05], [-0.32, 4.35, 0.05],
  [ 0.32, 4.75, 0.05], [ 0.32, 4.45, 0.05], [ 0.32, 4.35, 0.05]
].forEach(([x, y, z]) => {
  const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.22, 16), metalMat.clone());
  peg.rotation.z = Math.PI / 2;
  peg.position.set(x, y, z);
  peg.castShadow = true;
  peg.userData.part = 'pegs';
  pegGroup.add(peg);
});
guitar.add(pegGroup);
partMeshes.pegs = { mesh: pegGroup.children[0], labelPos: new THREE.Vector3(0.6, 4.55, 0.05) };

/* STRINGS */
const stringGroup = new THREE.Group();
[-0.14, -0.084, -0.028, 0.028, 0.084, 0.14].forEach(x => {
  const string = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 6.2, 8), stringMat);
  string.position.set(x, 2.55, 0.21);
  string.userData.part = 'strings';
  stringGroup.add(string);
});
guitar.add(stringGroup);
partMeshes.strings = { mesh: stringGroup.children[2], labelPos: new THREE.Vector3(0.35, 1.2, 0.25) };

/* NUT */
const nut = new THREE.Mesh(
  new THREE.BoxGeometry(0.36, 0.05, 0.06),
  new THREE.MeshStandardMaterial({ color: 0xeeeae0, roughness: 0.5 })
);
nut.position.set(0, 4.22, 0.17);
nut.userData.part = 'nut';
guitar.add(nut);
partMeshes.nut = { mesh: nut, labelPos: new THREE.Vector3(-0.4, 4.22, 0.17) };

/* PICKGUARD */
const pgShape = new THREE.Shape();
pgShape.moveTo(0, 0);
pgShape.bezierCurveTo(0.5, 0.1, 0.6, 0.7, 0.35, 1.1);
pgShape.bezierCurveTo(0.15, 1.3, -0.2, 1.2, -0.28, 0.8);
pgShape.bezierCurveTo(-0.35, 0.35, -0.25, 0.1, 0, 0);
const pickguard = new THREE.Mesh(
  new THREE.ShapeGeometry(pgShape),
  new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.35, metalness: 0.4, side: THREE.DoubleSide })
);
pickguard.position.set(0.3, 0.6, 0.43);
pickguard.userData.part = 'pickguard';
guitar.add(pickguard);
partMeshes.pickguard = { mesh: pickguard, labelPos: new THREE.Vector3(0.55, 1.0, 0.43) };

/* ==========================================================
   6. LABEL HTML TERAPUNG
   ========================================================== */
const labelsContainer = document.getElementById('labels-container');
const labelElements = {};
let labelsVisible = true;

Object.entries(partMeshes).forEach(([key]) => {
  const el = document.createElement('div');
  el.className = 'label-3d';
  el.textContent = PARTS_INFO[key].name;
  labelsContainer.appendChild(el);
  labelElements[key] = el;
});

const labelWorldPos = {};
Object.entries(partMeshes).forEach(([key, data]) => {
  labelWorldPos[key] = data.labelPos.clone();
});

function updateLabels() {
  if (!labelsVisible) {
    Object.values(labelElements).forEach(el => el.classList.add('hidden'));
    return;
  }
  Object.values(labelElements).forEach(el => el.classList.remove('hidden'));

  Object.entries(labelWorldPos).forEach(([key, localPos]) => {
    const worldPos = localPos.clone();
    guitar.localToWorld(worldPos);
    const projected = worldPos.clone().project(camera);
    const x = (projected.x * 0.5 + 0.5) * innerWidth;
    const y = (-projected.y * 0.5 + 0.5) * innerHeight;
    const el = labelElements[key];
    if (projected.z > 1) {
      el.classList.add('hidden');
      return;
    }
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  });
}

/* ==========================================================
   7. INTERAKSI KLIK
   ========================================================== */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

renderer.domElement.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(guitar, true);
  renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
});

let selectedPart = null;
let mouseDownPos = { x: 0, y: 0 };

renderer.domElement.addEventListener('pointerdown', (e) => {
  mouseDownPos = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('pointerup', (e) => {
  const dx = e.clientX - mouseDownPos.x;
  const dy = e.clientY - mouseDownPos.y;
  if (Math.sqrt(dx * dx + dy * dy) > 6) return;

  pointer.x = (e.clientX / innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(guitar, true);
  if (hits.length === 0) return;

  let obj = hits[0].object;
  while (obj && !obj.userData.part) obj = obj.parent;
  if (!obj) return;

  const partKey = obj.userData.part;
  if (!PARTS_INFO[partKey]) return;

  if (quizState.active) {
    handleQuizAnswer(partKey, e.clientX, e.clientY);
    return;
  }
  selectPart(partKey);
});

/* ==========================================================
   8. MOD BELAJAR
   ========================================================== */
const infoPanel = document.getElementById('infoPanel');
const panelIcon = document.getElementById('panelIcon');
const panelTitle = document.getElementById('panelTitle');
const panelSub = document.getElementById('panelSub');
const panelContent = document.getElementById('panelContent');
const partsUl = document.getElementById('partsUl');

function selectPart(key) {
  if (quizState.active) return;
  selectedPart = key;
  const info = PARTS_INFO[key];

  panelIcon.textContent = info.emoji;
  panelTitle.textContent = info.name;
  panelSub.textContent = info.subtitle;
  panelContent.innerHTML = `
    <p>${info.desc}</p>
    <div class="fun-fact">
      <strong>💡 Tahukah anda?</strong><br>${info.fact}
    </div>
  `;

  document.querySelectorAll('.part-item').forEach(li => {
    li.classList.toggle('active', li.dataset.key === key);
  });

  highlightPart(key);
  playNote(523 + Math.random() * 200, 0.2);
  speak(info.name);
}

function highlightPart(key) {
  Object.entries(partMeshes).forEach(([k, data]) => {
    data.mesh.traverse(o => {
      if (o.isMesh && o.material && o.material.emissive) {
        o.material.emissive.setHex(0x000000);
        o.material.emissiveIntensity = 0;
      }
    });
  });
  partMeshes[key].mesh.traverse(o => {
    if (o.isMesh && o.material && o.material.emissive) {
      o.material.emissive.setHex(0xffcc44);
      o.material.emissiveIntensity = 0.4;
    }
  });
}

function clearHighlight() {
  Object.values(partMeshes).forEach(data => {
    data.mesh.traverse(o => {
      if (o.isMesh && o.material && o.material.emissive) {
        o.material.emissive.setHex(0x000000);
        o.material.emissiveIntensity = 0;
      }
    });
  });
}

/* Senarai bahagian (kiri) */
Object.entries(PARTS_INFO).forEach(([key, info]) => {
  const li = document.createElement('li');
  li.className = 'part-item';
  li.dataset.key = key;
  li.innerHTML = `<span class="emoji">${info.emoji}</span><span>${info.name}</span>`;
  li.addEventListener('click', () => {
    if (quizState.active) return;
    selectPart(key);
  });
  partsUl.appendChild(li);
});

/* ==========================================================
   9. MOD KUIS
   ========================================================== */
const quizState = {
  active: false,
  currentQ: 0,
  totalQ: 10,
  score: 0,
  questions: [],
  wrongAnswers: [],
  answered: false
};

const learnMode = document.getElementById('learnMode');
const quizMode = document.getElementById('quizMode');
const resultMode = document.getElementById('resultMode');
const scoreNum = document.getElementById('scoreNum');
const questionNum = document.getElementById('questionNum');
const totalQ = document.getElementById('totalQ');
const progressFill = document.getElementById('progressFill');
const questionText = document.getElementById('questionText');
const questionEmoji = document.getElementById('questionEmoji');
const feedback = document.getElementById('feedback');
const finalScore = document.getElementById('finalScore');
const resultIcon = document.getElementById('resultIcon');
const resultTitle = document.getElementById('resultTitle');
const resultSub = document.getElementById('resultSub');
const resultRank = document.getElementById('resultRank');
const resultMessage = document.getElementById('resultMessage');
const resultWrong = document.getElementById('resultWrong');
const wrongList = document.getElementById('wrongList');
const subtitle = document.getElementById('subtitle');

document.getElementById('btnQuiz').addEventListener('click', startQuiz);
document.getElementById('btnPlayAgain').addEventListener('click', startQuiz);

function startQuiz() {
  quizState.active = true;
  quizState.currentQ = 0;
  quizState.score = 0;
  quizState.wrongAnswers = [];
  quizState.answered = false;
  quizState.questions = shuffle([...QUIZ_KEYS]).slice(0, quizState.totalQ);

  learnMode.style.display = 'none';
  quizMode.style.display = 'block';
  resultMode.style.display = 'none';

  scoreNum.textContent = '0';
  totalQ.textContent = quizState.totalQ;
  subtitle.textContent = '🎮 Kuiz bermula! Klik bahagian gitar yang betul.';

  clearHighlight();
  document.querySelectorAll('.part-item').forEach(li => li.classList.remove('active'));

  showQuestion();
}

function showQuestion() {
  if (quizState.currentQ >= quizState.questions.length) {
    endQuiz();
    return;
  }

  quizState.answered = false;
  const key = quizState.questions[quizState.currentQ];
  const info = PARTS_INFO[key];

  questionNum.textContent = quizState.currentQ + 1;
  questionText.textContent = info.name;
  questionEmoji.textContent = info.emoji;
  feedback.className = 'feedback';
  feedback.textContent = '';
  progressFill.style.width = (quizState.currentQ / quizState.totalQ) * 100 + '%';

  speak('Cari ' + info.name);
}

function handleQuizAnswer(key, clickX, clickY) {
  if (quizState.answered) return;
  quizState.answered = true;

  const correctKey = quizState.questions[quizState.currentQ];

  if (key === correctKey) {
    quizState.score++;
    scoreNum.textContent = quizState.score;

    feedback.className = 'feedback correct';
    feedback.textContent = '✅ Betul! Hebat! 🎉';

    highlightPart(key);
    playCorrectSound();
    spawnConfetti(clickX, clickY);
    spawnFloatScore(clickX, clickY, '+1 ⭐');
    speak('Betul! Hebat!');

    setTimeout(() => {
      clearHighlight();
      quizState.currentQ++;
      showQuestion();
    }, 1500);
  } else {
    feedback.className = 'feedback wrong';
    feedback.textContent = `❌ Salah! Cuba cari: ${PARTS_INFO[correctKey].name}`;

    quizState.wrongAnswers.push(correctKey);
    playWrongSound();
    highlightPart(correctKey);
    speak('Salah. Yang betul ialah ' + PARTS_INFO[correctKey].name);

    setTimeout(() => {
      clearHighlight();
      quizState.currentQ++;
      showQuestion();
    }, 2500);
  }
}

function endQuiz() {
  quizState.active = false;
  quizMode.style.display = 'none';
  resultMode.style.display = 'block';
  subtitle.textContent = '🏆 Kuiz selesai! Tekan "Main Lagi" untuk cuba sekali lagi.';

  finalScore.textContent = quizState.score;
  progressFill.style.width = '100%';

  const pct = quizState.score / quizState.totalQ;

  if (pct === 1) {
    resultIcon.textContent = '🏆';
    resultTitle.textContent = 'SEMPURNA!';
    resultSub.textContent = 'Kamu memang pakar gitar!';
    resultRank.textContent = '⭐⭐⭐⭐⭐';
    resultMessage.textContent = 'Markah penuh! Luar biasa! 🎉';
    playVictorySound();
  } else if (pct >= 0.8) {
    resultIcon.textContent = '🥇';
    resultTitle.textContent = 'Cemerlang!';
    resultSub.textContent = 'Kamu sangat hebat!';
    resultRank.textContent = '⭐⭐⭐⭐';
    resultMessage.textContent = 'Hampir sempurna! Teruskan usaha! 💪';
    playVictorySound();
  } else if (pct >= 0.6) {
    resultIcon.textContent = '🥈';
    resultTitle.textContent = 'Bagus!';
    resultSub.textContent = 'Kamu hampir mahir!';
    resultRank.textContent = '⭐⭐⭐';
    resultMessage.textContent = 'Cuba lagi untuk skor lebih tinggi! 🎯';
  } else if (pct >= 0.4) {
    resultIcon.textContent = '🥉';
    resultTitle.textContent = 'Boleh Tahan!';
    resultSub.textContent = 'Teruskan belajar!';
    resultRank.textContent = '⭐⭐';
    resultMessage.textContent = 'Belajar lagi, kamu boleh buat! 📚';
  } else {
    resultIcon.textContent = '📚';
    resultTitle.textContent = 'Jangan Putus Asa!';
    resultSub.textContent = 'Cuba lagi ya!';
    resultRank.textContent = '⭐';
    resultMessage.textContent = 'Klik bahagian gitar untuk belajar dahulu! 💡';
  }

  if (quizState.wrongAnswers.length > 0) {
    resultWrong.style.display = 'block';
    wrongList.innerHTML = '';
    const unique = [...new Set(quizState.wrongAnswers)];
    unique.forEach(k => {
      const info = PARTS_INFO[k];
      const li = document.createElement('li');
      li.innerHTML = `${info.emoji} <strong>${info.name}</strong>`;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        resultMode.style.display = 'none';
        learnMode.style.display = 'block';
        selectPart(k);
      });
      wrongList.appendChild(li);
    });
  } else {
    resultWrong.style.display = 'none';
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ==========================================================
   10. KESAN VISUAL
   ========================================================== */
const fxContainer = document.getElementById('fx-container');

function spawnConfetti(x, y) {
  const emojis = ['🎉', '⭐', '✨', '🎊', '💫', '🌟'];
  for (let i = 0; i < 12; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    c.style.left = (x + (Math.random() - 0.5) * 100) + 'px';
    c.style.top = y + 'px';
    c.style.fontSize = (16 + Math.random() * 20) + 'px';
    c.style.animationDelay = (Math.random() * 0.3) + 's';
    fxContainer.appendChild(c);
    setTimeout(() => c.remove(), 2000);
  }
}

function spawnFloatScore(x, y, text) {
  const el = document.createElement('div');
  el.className = 'float-score';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  fxContainer.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

/* ==========================================================
   11. BUNYI (Web Audio API)
   ========================================================== */
let audioCtx = null;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playTone(freq, duration = 0.2, type = 'sine', volume = 0.2, delay = 0) {
  initAudio();
  const now = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

function playNote(freq, duration = 0.25) {
  playTone(freq, duration, 'triangle', 0.15);
}

function playCorrectSound() {
  playTone(523.25, 0.15, 'triangle', 0.25, 0);
  playTone(659.25, 0.15, 'triangle', 0.25, 0.1);
  playTone(783.99, 0.3, 'triangle', 0.25, 0.2);
}

function playWrongSound() {
  playTone(220, 0.2, 'sawtooth', 0.15, 0);
  playTone(180, 0.3, 'sawtooth', 0.15, 0.15);
}

function playVictorySound() {
  [523, 659, 784, 1046, 1318].forEach((f, i) => {
    playTone(f, 0.4, 'triangle', 0.25, i * 0.12);
  });
}

/* ==========================================================
   12. WEB SPEECH
   ========================================================== */
let voiceOn = false;
function speak(text) {
  if (!voiceOn || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ms-MY';
  u.rate = 1;
  u.pitch = 1.15;
  window.speechSynthesis.speak(u);
}

/* ==========================================================
   13. BUTANG KAWALAN
   ========================================================== */
let autoRotate = true;
const btnAuto = document.getElementById('btnAutoRotate');
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;

btnAuto.addEventListener('click', () => {
  autoRotate = !autoRotate;
  controls.autoRotate = autoRotate;
  btnAuto.textContent = autoRotate ? '🔄 Auto: ON' : '⏸ Auto: OFF';
  btnAuto.classList.toggle('active', !autoRotate);
});

document.getElementById('btnReset').addEventListener('click', () => {
  camera.position.set(0, 2, 9);
  controls.target.set(0, 1.3, 0);
  controls.update();
  clearHighlight();
  document.querySelectorAll('.part-item').forEach(li => li.classList.remove('active'));
});

const btnLabels = document.getElementById('btnLabels');
btnLabels.classList.add('active');
btnLabels.addEventListener('click', () => {
  labelsVisible = !labelsVisible;
  btnLabels.textContent = labelsVisible ? '🏷️ Label: ON' : '🏷️ Label: OFF';
  btnLabels.classList.toggle('active', labelsVisible);
});

const btnSpeak = document.getElementById('btnSpeak');
btnSpeak.addEventListener('click', () => {
  voiceOn = !voiceOn;
  btnSpeak.textContent = voiceOn ? '🔊 Suara: ON' : '🔇 Suara: OFF';
  btnSpeak.classList.toggle('active', voiceOn);
  if (voiceOn) speak('Suara dihidupkan');
});

document.getElementById('closePanel').addEventListener('click', () => {
  infoPanel.style.transform = 'translateX(120%)';
  infoPanel.style.opacity = '0';
  setTimeout(() => {
    infoPanel.style.transform = '';
    infoPanel.style.opacity = '';
  }, 400);
});

/* ==========================================================
   14. ANIMASI UTAMA
   ========================================================== */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  rosette.scale.setScalar(1 + Math.sin(t * 2.5) * 0.05);

  fillLight.position.x = Math.sin(t * 0.6) * 5;
  fillLight.position.z = Math.cos(t * 0.6) * 5;

  updateLabels();
  controls.update();
  renderer.render(scene, camera);
}
animate();

/* ==========================================================
   15. RESPONSIF
   ========================================================== */
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
});

/* ==========================================================
   16. HALANG MENU KLIK KANAN
   ========================================================== */
renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());
