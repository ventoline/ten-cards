import * as THREE from "three";
import { DragControls } from "dragcontrols";
import Cards from "/card.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const cardsAmount = 10;
let cardHighlighted = null;
let dragging = false;
let mousedowning = false;
let intersects, controls;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//CARDS
const cards = new Cards();
const cardContainer = cards.makeCards(cardsAmount);
scene.add(cardContainer);

camera.position.z = 5;
camera.position.x = -0.65;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

controls = new DragControls(
  cardContainer.children,
  camera,
  renderer.domElement,
  { recursive: false }
);

controls.recursive = false;

controls.addEventListener("drag", controlDragging);
controls.addEventListener("dragend", onMouseDrop);
controls.addEventListener("click", onMouseDown);

function animate() {
  //Mouse Interaction
  raycaster.setFromCamera(pointer, camera);
  intersects = raycaster.intersectObjects(cardContainer.children);
  if (!!intersects.length > 0) {
    document.body.style.cursor = "pointer";

    if (intersects[0].object.material.userData != cardHighlighted) {
      cardHighlighted = intersects[0].object.material.userData;

      // hover effect
      cards.hoverCards(cardHighlighted);
    }
  } else {
    cards.unhoverCards();
    document.body.style.cursor = "default";
  }
  renderer.render(scene, camera);
}

window.onresize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
};

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseDown(event) {
  cards.returnCard(cardHighlighted);
}

function controlDragging(e) {}

function onMouseGrab() {
  document.body.style.cursor = "grab";
  intersects[0].object.position.x -= intersects[0].point.x + intersects[0].uv.x;
  cards.grab(cardHighlighted);
}

function onMouseDrop(event) {
  cards.drop(event.object);
}

window.addEventListener("pointermove", onPointerMove);
window.addEventListener("click", onMouseDown);
//window.addEventListener("mousedown", onMouseGrab);
