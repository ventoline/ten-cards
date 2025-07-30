import * as THREE from "three";
//import { TextGeometry } from "addons";
//import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { TextGeometry } from "textGeometry";
import { FontLoader } from "fontLoader";
/* import {
  OrbitControls,
  FontLoader,
  TextGeometry,
} from "three/examples/jsm/Addons.js"; */

const cardsHolder = new THREE.Object3D();
const cardNames = [
  "Hi",
  "Ola",
  "Hej",
  "Ohaio",
  "Ciao",
  "Hello",
  "Hey",
  "Salut",
  "NiHao",
  "Salam",
  "Kalimera",
];

export default class Cards {
  // 3D object
  makeCard = (nb) => {
    const geometry = new THREE.PlaneGeometry(1.35, 1);
    geometry.computeBoundingBox();
    let colorRand = new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random()
    );
    let material = new THREE.MeshBasicMaterial({
      color: /*0xffff00*/ colorRand,
      side: THREE.DoubleSide,
    });
    material.userData.no = nb;
    const plane = new THREE.Mesh(geometry, material);

    // add text and texture
    const texture = new THREE.TextureLoader().load("/texture_card.png");
    const materialImg = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
      // transparent: true,
      //opacity: 0.85,
      side: THREE.BackSide,
    });
    texture.repeat.set(1.25, 1);

    const backPlane = new THREE.Mesh(geometry, materialImg);

    // backPlane.position.z = -0.01;
    plane.add(backPlane);

    let title = new TextGeometry("hi", { size: 2 });
    let textMesh = new THREE.Mesh(
      title,
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
      })
    );
    // plane.add(textMesh);

    const loader = new FontLoader();

    loader.load("/fonts/helvetiker_bold.typeface.json", function (font) {
      const shapes = font.generateShapes(cardNames[nb], 0.15);
      const matLite = new THREE.MeshBasicMaterial({
        color: 0x111111,
        transparent: true,
        opacity: 0.8,
        side: THREE.FrontSide,
      });
      const tgeo = new THREE.ShapeGeometry(shapes);
      const ttext = new THREE.Mesh(tgeo, matLite);

      plane.add(ttext);
      ttext.rotation.y = Math.PI;
      ttext.position.x = 0.55;
      ttext.position.y = -0.25;
      ttext.position.z = -0.1;
    });

    return plane;
  };

  //Container

  makeCards = (no) => {
    // const cardsHolder  = new THREE.Object3D();
    let maxWidth = 0;
    let maxHeight = 0;

    for (let i = 0; i < no; i++) {
      let newCard = this.makeCard(i);
      //position the cards
      cardsHolder.add(newCard);
      newCard.position.x += (newCard.geometry.parameters.width + 0.1) * (i % 5);
      newCard.position.y -=
        (newCard.geometry.parameters.height + 0.1) * Math.floor(i / 5);
    }

    //CENTER CARDS
    maxWidth =
      (cardsHolder.children[0].geometry.parameters.width + 0.1) * 5 - 0.1;
    maxHeight =
      cardsHolder.children[0].geometry.parameters.height * Math.floor(no / 5) +
      0.1;
    cardsHolder.position.x -= maxWidth / 2;
    cardsHolder.position.y += maxHeight / 2;

    return cardsHolder;
  };

  hoverCards = (no) => {
    cardsHolder.children.forEach((card) => {
      if (card.material.userData == no) {
        // tween forward
        gsap.to(card.position, { duration: 0.5, ease: "back.inOut", z: 1 });
        gsap.to(card.scale, { duration: 0.5, z: 1.15 });
      } else {
        if (card.position.z != 0) {
          //tween back
          gsap.to(card.position, {
            duration: 0.5,
            ease: "back.inOut",
            z: 0,
          });
          gsap.to(card.scale, { duration: 0.5, z: 1 });
        }
      }
    });
  };

  unhoverCards = () => {
    cardsHolder.children.forEach((card) => {
      if (card.position.z != 0) {
        //tween back
        gsap.to(card.position, { duration: 0.5, z: 0 });
        gsap.to(card.scale, { duration: 0.5, z: 1 });
      }
    });
  };

  returnCard = (no) => {
    cardsHolder.children.forEach((card) => {
      if (card.material.userData == no) {
        //flip
        gsap.to(card.rotation, {
          duration: 0.5,
          y: card.rotation.y > Math.PI ? 0 : Math.PI,
          overwrite: false,
        });
      }
    });
  };

  grab = (no) => {
    //move card
    cardsHolder.children.forEach((card) => {
      if (card.material.userData == no) {
        //get  offset
        //  card.position =  mouse - offset
      }
    });
  };

  drop = (card) => {
    // get position

    //consider a 5 x 2 grid
    //  get closest spot on the grid

    let col = Math.min(
      4,
      Math.floor(card.position.x / card.geometry.parameters.width)
    );
    col = Math.max(col, 0);

    let raw = Math.max(
      0,
      Math.round(-card.position.y / card.geometry.parameters.height)
    );

    raw = raw > 1 ? 1 : raw;

    // swap
    if (raw * 5 + col != card.material.userData.no) {
      // find overlaid card
      cardsHolder.children.forEach((o) => {
        if (o.material.userData.no == raw * 5 + col) {
          o.position.x =
            (card.material.userData.no % 5) * card.geometry.parameters.width +
            (card.material.userData.no % 5) * 0.1;

          o.position.y =
            -Math.floor(card.material.userData.no / 5) *
            (card.geometry.parameters.height + 0.1);

          o.material.userData.no = card.material.userData.no;
        }
      });
    }

    //replace cards

    card.position.y = -raw * card.geometry.parameters.height - raw * 0.1;
    card.position.x = col * card.geometry.parameters.width + col * 0.1;

    card.material.userData.no = raw * 5 + col;
  };
}

export { Cards };
