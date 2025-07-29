import * as THREE from 'three';
//import  {gsap} from 'gsap';

const cardsHolder  = new THREE.Object3D();

export default class Cards{
  

 // 3D object
  makeCard  = (nb) => {
    const geometry = new THREE.PlaneGeometry( 1.35, 1 );
    geometry.computeBoundingBox();
    let colorRand =  new THREE.Color( Math.random(), Math.random(), Math.random() );
    let material = new THREE.MeshBasicMaterial( { color: /*0xffff00*/  colorRand, side: THREE.DoubleSide} );
    material.userData.no = nb;
    const plane = new THREE.Mesh( geometry, material );
    return plane;
}


//container

  makeCards =(no) => {
   // const cardsHolder  = new THREE.Object3D();
    let maxWidth = 0;
    let maxHeight = 0;
    
    for(let i = 0; i<no; i++){
        let newCard = this.makeCard(i);
        //position the cards
        cardsHolder.add(newCard);
        newCard.position.x += (newCard.geometry.parameters.width +.1) *( i%5);
        newCard.position.y -= (newCard.geometry.parameters.height +.1) *( Math.floor(i/5));

        //INTERACTION
//newCard.addEventListener('hovered')
//clicked
//dragged
//dropped >  change position
    }

//CENTER CARDS
    maxWidth = (cardsHolder.children[0].geometry.parameters.width +.1) * 5 -.1;
    maxHeight = (cardsHolder.children[0].geometry.parameters.height ) * Math.floor(no/5) +.1;
    cardsHolder.position.x -= maxWidth/2;
    cardsHolder.position.y += maxHeight/2;
    
    console.log(cardsHolder)

return cardsHolder; 
 }


 hoverCards = (no) =>{
    console.log('hovering',no)
    cardsHolder.children.forEach(card =>{
if( card.material.userData == no) {
   // tween forward
   gsap.to(card.position, {duration:.5, z:1} )
}
else{
    if(card.position.z != 0){
        //tween back
        gsap.to(card.position, {duration:.5, z:0} )
    }
}

    })

 }

 unhoverCards = () => {
    cardsHolder.children.forEach(card =>{
            if(card.position.z != 0){
                //tween back
                gsap.to(card.position, {duration:.5, z:0} )
            }
            })
        
 
}

returnCard = (no)=>{
    cardsHolder.children.forEach(card =>{
        if( card.material.userData == no) {
       //  let angflip = card.rotation.y>0? Math.PI*2: Math.PI;
                //flip
                gsap.to(card.rotation, {duration:.5, y: card.rotation.y > Math.PI ? 0 : Math.PI,
                    overwrite:false
                },
             )
            }
        
        
            })
        
}
}

export {Cards}