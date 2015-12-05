var clickInfo = {
  x: 0,
  y: 0,
  userHasClicked: false
};

var boardInfo = {
  width: 8,
  height: 8,
  pinOffset: 0.3
}

var beadColors = {
  red: 0xff0000,
  green: 0x00ff00,
  blue: 0x0000ff,
  yellow: 0xffff00
};

var currentBeadColor = beadColors.red;

var mouseX = 0, mouseY = 0,

windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2,

camera, scene, renderer,
projector, raycaster, directionVector;

var beads = [];

init();
animate();

function init() {

  // Setup
  var container;
  container = document.createElement('div');
  document.body.appendChild(container);

  // Camera, Scene and Controls
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.x = 0;
  camera.position.y = 12;
  camera.position.z = 5;

  controls = new THREE.OrbitControls(camera);
  controls.addEventListener('change', render);

  scene = new THREE.Scene();
  raycaster = new THREE.Raycaster();
  projector = new THREE.Projector();
  directionVector = new THREE.Vector3();
  window.addEventListener( 'mousedown', onLeftClick, false );
  window.addEventListener('keypress', keyPressed, false);
  
  // Browser compatibility check
  renderer = Detector.webgl? new THREE.WebGLRenderer(): document.getElementById("message").textContent = "Your browser does not support WebGL.";
  renderer.setClearColor(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Lights
  var lights = [];
  lights[0] = new THREE.DirectionalLight( 0xffffff, 0.5);
  lights[1] = new THREE.DirectionalLight( 0xffffff, 0.5);
  lights[2] = new THREE.DirectionalLight( 0xffffff, 0.5);
  
  lights[1].position.set( 100, 200, 100 );
  lights[2].position.set( -100, -200, -100 );

  scene.add( lights[0] );
  scene.add( lights[1] );
  scene.add( lights[2] );

  // Board
  var boardGeometry = new THREE.BoxGeometry(boardInfo.width * boardInfo.pinOffset * 2, 0.1, boardInfo.height * boardInfo.pinOffset * 2);
  var boardMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0x111111, shininess: 1});
  var board = new THREE.Mesh(boardGeometry, boardMaterial);
  board.position.y = -0.2;
  board.name = "board";
  scene.add(board);

  // Board pins
  var horizontalPins = boardInfo.width;
  var verticalPins = boardInfo.height;
  var pinMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff} );
  
  for (var i = 0; i < horizontalPins; i++) {
    for (var j = 0; j < verticalPins; j++) {

      var pinGeometry = new THREE.CylinderGeometry(boardInfo.pinOffset / 2.0, boardInfo.pinOffset / 2.0, 0.3, 8);
      var pin = new THREE.Mesh( pinGeometry, pinMaterial );
      
      pin.position.set(-boardInfo.width * boardInfo.pinOffset + i * boardInfo.pinOffset * 2 + boardInfo.pinOffset,
                       -0.1,
                       -boardInfo.height * boardInfo.pinOffset + j * boardInfo.pinOffset * 2 + boardInfo.pinOffset);
      
      pin.name = "pin " + i + ", " + j;
      scene.add(pin);
    }
  }

  // Resize listener
  window.addEventListener('resize', onWindowResize, false);

  /**
   * Controls
   */
  function onLeftClick(e) {

    // Place
    if (e.button == 0) {
      clickInfo.userHasClicked = true;
      clickInfo.x = e.clientX;
      clickInfo.y = e.clientY;
    }
  }
}

function keyPressed(e) {

  console.log(e.keyCode);
  // Color switch
  switch(e.keyCode) {
    case 114:

      // Clear the board
      var numBeads = beads.length;
      for (var i = 0; i < numBeads; i++) {
        var bead = beads.pop();
        bead.removeFromScene(scene);
      }
      break;

    case 122:
      // Remove the last bead placed
      var beadToRemove = beads.pop();
      beadToRemove.removeFromScene(scene);
      
      break;

    case 99:
      // Reset camera position
      camera.position.x = 0;
      camera.position.y = 12;
      camera.position.z = 5;
      break;

    case 119:
      // Top view
      camera.position.x = 0;
      camera.position.y = 11;
      camera.position.z = 0;
      break;

    // Change colors
    case 49:
      currentBeadColor = beadColors.red; break;
    case 50:
      currentBeadColor = beadColors.green; break;
    case 51:
      currentBeadColor = beadColors.blue; break;
    case 52:
      currentBeadColor = beadColors.yellow; break;
  }
}

function placePinAt(x, z) {

  // Center on pin
  if (x >= 0.0) {
    x -= x % (boardInfo.pinOffset * 2.0) - boardInfo.pinOffset;
  } else {
    x -= x % (boardInfo.pinOffset * 2.0) + boardInfo.pinOffset;
  }

  if (z >= 0.0) {
    z -= z % (boardInfo.pinOffset * 2.0) - boardInfo.pinOffset;
  } else {
    z -= z % (boardInfo.pinOffset * 2.0) + boardInfo.pinOffset;
  }

  // Placement
  var beadMaterial = new THREE.MeshPhongMaterial( {color: currentBeadColor} );
  var tubeGeometry = generateTubeGeometry(currentBeadColor);
  
  var bead = new Bead(
    tubeGeometry.inner,
    tubeGeometry.outer,
    tubeGeometry.first,
    tubeGeometry.second);

  bead.setPosition(x, -0.1, z);
  
  beads.push(bead);
  scene.add(bead.inner);
  scene.add(bead.outer);
  scene.add(bead.first);
  scene.add(bead.second);
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
  controls.update();

  if (clickInfo.userHasClicked) {
    clickInfo.userHasClicked = false;
    // The following will translate the mouse coordinates into a number
    // ranging from -1 to 1, where
    //      x == -1 && y == -1 means top-left, and
    //      x ==  1 && y ==  1 means bottom right
    var x = ( clickInfo.x / innerWidth ) * 2 - 1;
    var y = -( clickInfo.y / innerHeight ) * 2 + 1;
    // Now we set our direction vector to those initial values
    directionVector.set(x, y, 1);
    // Unproject the vector
    projector.unprojectVector(directionVector, camera);
    // Substract the vector representing the camera position
    directionVector.sub(camera.position);
    // Normalize the vector, to avoid large numbers from the
    // projection and substraction
    directionVector.normalize();
    // Now our direction vector holds the right numbers!
    raycaster.set(camera.position, directionVector);
    // Ask the raycaster for intersects with all objects in the scene:
    // (The second arguments means "recursive")
    var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length) {
      // intersections are, by default, ordered by distance,
      // so we only care for the first one. The intersection
      // object holds the intersection point, the face that's
      // been "hit" by the ray, and the object to which that
      // face belongs. We only care for the object itself.
      var target = intersects[0];
      if (target.object.name == 'board' || target.object.name.startsWith('pin')) {
        placePinAt(target.point.x, target.point.z);
      }
    }
  }

  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}
