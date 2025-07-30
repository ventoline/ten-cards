import * as THREE from "three";
//import  {gsap} from 'gsap';

const cardsHolder = new THREE.Object3D();

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
    return plane;
  };

  //container

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

      //INTERACTION
      //newCard.addEventListener('hovered')
      //clicked
      //dragged
      //dropped >  change position
    }

    //CENTER CARDS
    maxWidth =
      (cardsHolder.children[0].geometry.parameters.width + 0.1) * 5 - 0.1;
    maxHeight =
      cardsHolder.children[0].geometry.parameters.height * Math.floor(no / 5) +
      0.1;
    cardsHolder.position.x -= maxWidth / 2;
    cardsHolder.position.y += maxHeight / 2;

    console.log(cardsHolder);

    return cardsHolder;
  };

  hoverCards = (no) => {
    console.log("hovering", no);
    cardsHolder.children.forEach((card) => {
      if (card.material.userData == no) {
        // tween forward
        gsap.to(card.position, { duration: 0.5, z: 1 });
        gsap.to(card.scale, { duration: 0.5, z: 1.15 });
      } else {
        if (card.position.z != 0) {
          //tween back
          gsap.to(card.position, { duration: 0.5, z: 0 });
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
    console.log("drop card", card);
    // get position
    let dropSpot = card.position;

    console.log("card.position", card.position);
    // console.log("card.height", card.geometry.parameters.height);

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

    console.log("on the grid ", col, "x", raw);

    // swap
    if (raw * 5 + col != card.material.userData.no) {
      console.log("swap");
    }

    console.log(raw * 5 + col, card.material.userData.no);

    //replace cards
    //TODO add tweens
    card.position.y = -raw * card.geometry.parameters.height - raw * 0.1;
    card.position.x = col * card.geometry.parameters.width + col * 0.1;

    // tween both cards to new position
  };
}

export { Cards };
